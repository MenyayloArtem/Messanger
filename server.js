const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const bcrypt = require("bcrypt")
const pool = mysql.createPool({
    host : "localhost",
    database : "messanger",
    user : "mysql",
    password : "mysql"
}).promise()
const secret = 'secret'
app.use(cookieParser())
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'registration.html'))
})

app.get('/accountData',(req,res)=>{
    let token = req.cookies['token'].split(' ')[1]
    let data = jwt.verify(token,secret)
    res.send(data)
})

app.get(/.css$/,(req,res)=>{
    res.setHeader('Content-Type','text/css')
    res.sendFile(path.join(__dirname,req.url))
})

app.get(/.html$/,(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.sendFile(path.join(__dirname,req.url))
})

app.get(/.js$/,(req,res)=>{
    res.setHeader('Content-Type','text/javascript')
    res.sendFile(path.join(__dirname,req.url))
})

app.get(/./,(req,res)=>{
    res.sendFile(path.join(__dirname,req.url))
})



app.post('/auth',(req,res)=>{
    try {
        let {nickname,password} = req.body
        pool.execute("SELECT * FROM users WHERE nickname = ?",
        [nickname]).then(([rows])=>{
            let user = rows[0]
            if(user.nickname){
                let isCorrectPassword = bcrypt.compareSync(password,user.password)
                if(isCorrectPassword){
                    let token = jwt.sign({
                        name : req.body.nickname,
                        permission : user.permission,
                        id : user.id
                    },secret)
                    res.cookie('token',"Bearer " + token)
                    res.json({
                        message : 'Успешная авторизация',
                        authorizated : true
                    })
                } else {
                    res.json({
                        message : 'Пароли не совпадают',
                        authorizated : false
                    })
                }
            } else {
                res.json({
                    message : 'Имени не существует',
                    authorizated : false
                })
            }
        })
    } catch (err) {
        res.json({
            message : 'Ошибка сервера',
            authorizated : false
        })
        throw err
    }
    
})

app.post('/registration',(req,res)=>{
    try {
    let {nickname} = req.body
        pool.execute(`SELECT * FROM users WHERE nickname = '${nickname}'`)
        .then(([rows])=>{
            if (rows.length){
                res.json({
                    message : "Ник занят",
                    susses : false
                })
            } else {
                pool.execute('INSERT INTO users(nickname,password) VALUES (?,?)',
                [nickname,bcrypt.hashSync(req.body.password,17)
                ])
                .then(()=>{
                    res.json({
                        message : 'Успешная регистрация',
                        susses : true
                    })
                })
            }
        })
    } catch(err){
        console.log(`Error : ${err.message}`)
    }
    
})

io.sockets.on('connect',(socket)=>{
    socket.on('sendMessage',(message)=>{
pool.execute('INSERT INTO messages(`senderID`,`text`,`img`,`room`,`avatarUrl`) VALUES(?,?,?,?,?)',
    [message.senderId,
    message.text,
    message.imgSrc,
    message.room,
    message.avatarUrl]
    )
    io.sockets.to(message.room).emit('addMessage',message)
    })
    socket.on('changeRoom',(data)=>{
        if (data.previousRoom){
            socket.leave(data.previousRoom)
        }
        socket.join(data.currentRoom)
        pool.execute(`SELECT messages.text, messages.img, messages.avatarUrl,
        users.nickname AS sender
        FROM messages
        JOIN users
        ON messages.senderID = users.id
        WHERE messages.room = ${data.currentRoom}`)
        .then(([rows])=>{
           socket.emit('getMessages',rows)
        })
    })
})

server.listen(3000)