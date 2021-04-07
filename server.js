const app = require('express')()
const server = require('http').createServer(app)
const fs = require('fs')
const io = require('socket.io')(server)
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const bcrypt = require("bcrypt")
const multerAvatars = multer({dest: 'avatars'})
const multerUploads = multer({dest: 'uploads'})
const pool = mysql.createPool({
    host : "localhost",
    database : "messanger",
    user : "mysql",
    password : "mysql"
}).promise()
const secret = 'secret'
app.use(cookieParser())
app.use(bodyParser.json())

// Песочница кода

{


}

const mimeTypes = {
    'html' : 'text/html',
    'css' : 'text/css',
    'js' : 'text/javascript',
    'jpg' : 'image/jpg',
    'png' : 'image/png'
}

async function getUsersByID(sql1,sql2){
    let id = await pool.execute(sql1) // Получаем массив с айди пользователей
    id = JSON.parse(id[0][0][Object.keys(id[0][0])[0]])
    let users = await Promise.all(id.map(async(item)=>{
        let res = await pool.execute(sql2,[item]) // Запрос для каждого айди
        return res[0][0]
    }))
    return users
}

// GET запросы

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'auth.html'))
})

app.get('/accountData',async (req,res)=>{
    let token = req.cookies['token'].split(' ')[1]
    let data = jwt.verify(token,secret)
    let convs = await pool.execute(`SELECT * FROM conversations WHERE members REGEXP '(\\\\[|\\,)+(${data.id})(\\\\]|\\,)+'`)
    let user = await pool.execute(`SELECT avatarUrl, id, permission, nickname, status FROM users WHERE id = ${data.id}`)
    let friends = await getUsersByID(
        `SELECT friends FROM users WHERE id = ${data.id}`,
        `SELECT avatarUrl, id, nickname, status FROM users WHERE id = ?`
    )
    convs = convs[0]
    convs = await Promise.all(convs.map(async (item,i)=>{
        let conv = item
        let members = await Promise.all(JSON.parse(conv.members).map(async (item)=>{
            let res = await pool.execute(`SELECT avatarUrl,nickname,status,id FROM users WHERE id = ${item}`)
            return res[0][0]
        }))
        conv.members = members
        return conv
    }))
    res.json({
        convs,user : user[0][0], friends
    })
})

app.get(/./,(req,res)=>{
    let type = mimeTypes[(req.url).split('.')[1]]
    if(type){
        res.setHeader('Content-Type',`${type}`)
    }
    res.sendFile(path.join(__dirname,req.url))
})

// POST запросы

app.post('/auth',(req,res,next)=>{
        let {nickname,password} = req.body
        pool.execute("SELECT * FROM users WHERE nickname = ?",
        [nickname]).then(([rows])=>{
            let user = rows[0]
            if(user){
                let isCorrectPassword = bcrypt.compareSync(password,user.password)
                if(isCorrectPassword){
                    let token = jwt.sign({
                        name : req.body.nickname,
                        permission : user.permission,
                        id : user.id
                    },secret)
                    res.cookie('token',"Bearer " + token)
                    res.json({
                        authorizated : true
                    })
                    //next()
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
})

app.post('/registration',(req,res,next)=>{
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
    next()
})

app.post('/edit',multerAvatars.single('editImg'),(req,res)=>{
    let newname = req.body.editImg
    if(!(!req.file)){
    let oldname = req.file.filename
    newname = req.file.filename + '.' + req.file.originalname.split('.')[1]
    fs.rename(`avatars/${oldname}`,`avatars/${newname}`,(err)=>{
        if (err) throw err
    })
    }
    let id = jwt.verify(req.cookies['token'].split(' ')[1],secret).id
    
    pool.execute(`UPDATE users
    SET nickname = '${req.body.nickname}',
    status = '${req.body.userStatus}',
    avatarUrl = '${newname}'
    WHERE id = ${id}`)
})

app.post('/uploadImg',multerUploads.single('uploadImg'),(req,res,next)=>{
    let name = req.file.filename
        fs.rename(`uploads/${name}`,`uploads/${name}.jpg`,(err)=>{
        if (err) throw err
    })
        res.send(`uploads/${name}.jpg`)
        next()
})

app.post('/createContact',multerAvatars.single('convIco'),(req,res)=>{
    let id = jwt.verify(req.cookies['token'].split(' ')[1],secret).id
    let filename = req.file.filename
    if(!(!req.file)){
    fs.rename(`avatars/${filename}`,`avatars/${filename}.jpg`,(err)=>{
        if (err) throw err
    })
    }
    pool.execute(`INSERT INTO conversations(name,description,members,avatarUrl)
    VALUES(?,?,?,?)`,[
        req.body.convName,req.body.convSubname,
        JSON.stringify([id]),filename + '.jpg'
    ])
})

app.post('/find',async (req,res)=>{
    const user = await pool.execute(`SELECT nickname,id,status,avatarUrl 
    FROM users WHERE nickname = '${req.body.nickname}'`)
    if(user[0].length) {
    res.json({
        user : user[0][0],
        susses : true
    })
    } else {
        res.json({
            susses : false
        })
    }
    
})

// Сокеты

io.sockets.on('connect',(socket)=>{

    socket.on('sendMessage',(message)=>{
    pool.execute('INSERT INTO messages(`senderID`,`text`,`img`,`room`) VALUES(?,?,?,?)',
    [message.senderId,
    message.text,
    message.img,
    message.room]
    )
    io.sockets.to(message.room).emit('addMessage',message)
    })


    socket.on('changeRoom',(data)=>{
        if (data.previousRoom){
            socket.leave(data.previousRoom)
        }
        socket.join(data.currentRoom)
        pool.execute(`SELECT messages.text, messages.img,
        users.nickname AS sender, users.avatarUrl
        FROM messages
        JOIN users
        ON messages.senderID = users.id
        WHERE messages.room = ${data.currentRoom}`)
        .then(([rows])=>{
           socket.emit('getMessages',rows)
        })
    })


    socket.on('addContact',({userId,contactId})=>{
        pool.execute(`SELECT members FROM conversations WHERE id = ${contactId}`)
        .then(([rows])=>{
            let members = JSON.parse(rows[0].members)
            if(members.indexOf( userId ) != -1){
            } else {
                members.push(userId)
        pool.execute(`UPDATE conversations SET members = '${JSON.stringify(members)}' WHERE id = 1`)
        return pool.execute(`SELECT * FROM conversations WHERE id = ${contactId}`)
            }
        })
        .then(([rows])=>{
            socket.emit('newContact',rows[0])
        })
    })


    socket.on('invite',(data)=>{
        pool.execute(`SELECT members FROM conversations WHERE id = ${data.contactId}`)
        .then(([rows])=>{
            let members = JSON.parse(rows[0].members)
            if(!members.includes(data.user.id)){
                members.push(data.user.id)
            }
            pool.execute(`UPDATE conversations
            SET members = '${JSON.stringify(members)}'
            WHERE id = ${data.contactId}`)
            socket.emit('invited',data.user)
        })
    })

    socket.on('doFriend',async ({id1,id2})=>{
        let src = await pool.execute(`SELECT friends FROM users WHERE id = ${id1}`)
        var friends = JSON.parse(src[0][0].friends)
        if(!(friends.includes(id2))){
            friends.push(id2)
            friends = JSON.stringify(friends)
            pool.execute(`UPDATE users SET friends = '${friends}' WHERE id = ${id1}`)
            let src = await pool.execute(`SELECT friends FROM users WHERE id = ${id2}`)
            var friends = JSON.parse(src[0][0].friends)
            if(!(friends.includes(id1))){
                friends.push(id1)
            }
            friends = JSON.stringify(friends)
            pool.execute(`UPDATE users SET friends = '${friends}' WHERE id = ${id2}`)
        }
    })
})

server.listen(3000)