import express from "express"
import path from "path";
import fs from "fs"
import initSockets from "./services/Sockets.js"
import multer from "multer";
import cors from "cors"
import http from "http"
import database from "./database/database.js";
import Auth from "./services/Auth.js";
import Registration from "./services/Registration.js";


const __dirname = path.resolve() + '/server';
const app = express()
const server = http.createServer(app);
const upload = multer({ dest: path.resolve(__dirname,'uploads') })
const sockets = initSockets(server)

app.use(cors())
app.use(express.json())


const PORT = 3001

app.get('/user_friends:id',async (req,res)=>{
    let id = req.params.id.slice(1)
    const user = await database.models.User.getFriends(id)
    res.json(user)
})

app.get("/user:id",async (req,res)=>{
    let id = req.params.id.slice(1)
    const user = await database.models.User.getUser(id)
    res.json(user)
})

app.get(/\.jpg|\.png$/,(req,res)=>{
    res.setHeader("Content-Type",'image/jpg')
    res.sendFile(path.join(__dirname,'uploads',req.url))
})

app.post("/messages",async (req,res)=>{
    const {room,offset} = req.body
    const messages = await database.models.Message.getDialog(room,offset)
    res.json(messages)
})

app.post("/editUser",async (req,res)=>{
    try {
        let id = req.body.id
        let n = await database.models.User.editUser(id,req.body.payload)
        res.json(n) 
    } catch(e) {
        console.log(e)
    }
})

app.get("/test",(req,res)=>{
    res.send('test')
})

app.post("/test",(req,res)=>{
    console.log(req.body)
    res.send('test')
})

app.post("/addMember",async (req,res)=>{
    const {chat_id, user_id} = req.body
    let member = await database.models.Chat.addMember(chat_id,user_id)
    res.json(member)
})


app.post("/createConv",async (req,res)=>{
    let ownerId = req.body.id
    let n = await database.models.Chat.createNew(ownerId,req.body.payload)
    res.json(n)
})

app.post('/upload',upload.single('photo'),(req,res)=>{
    let oldpath = path.join(__dirname,'uploads',req.file.filename)
    fs.renameSync(oldpath,oldpath + '.jpg')
    res.end(req.file.filename + '.jpg')
})

app.post('/searchUser',async (req,res)=>{
    let nickname = req.body.nickname
    let users = await database.models.User.searchUser(nickname)
    res.json(users)
})

app.post('/addFriend',async (req,res)=>{
    let {from_id, peer_id} = req.body
    let n = await database.models.Friends.add(from_id,peer_id)
    res.json(n)
})

app.post('/getChats',async (req,res)=>{
    const chats = await database.models.Chat.getChats(req.body.id)
    res.json(chats)
})

app.post('/getChat',async (req,res)=>{
    let id = req.body.id
    let chat = await database.models.Chat.getChat(id)
    res.json(chat)
})

app.post('/getMembers',async (req,res)=>{
    let chat_id = req.body.chat_id
    let members = await database.models.Chat.getMembers(chat_id)
    res.json(members)
})

app.post('/getRequests',async (req,res)=>{
    const {id, out} = req.body;
    
    let users = null
    if(out){
        users = await database.models.Friends.outcoming(id)
    } else {
        users = await database.models.Friends.incoming(id)
    }
    res.json(users)
})

app.post("/editChat",async (req,res)=>{
    let {id, payload} = req.body
    let values = {
        name : payload.name,
        description : payload.description,
        photo : payload.photo
    }
    let chat_id = payload.chat_id

    let data = await database.models.Chat.edit(id,chat_id,values)
    res.json(data)
})

app.post('/leaveChat',async (req,res)=>{
    let {chat_id,user_id} = req.body
    let n = await database.models.Chat.leave(chat_id,user_id)
    res.json(n)
})

app.post('/auth',async (req,res)=>{
    const {nickname,password} = req.body
    let log = await Auth(nickname, password)
    res.json(log)
})

app.post('/reg',async (req,res)=>{
    const {nickname,password} = req.body
    let log = await Registration(nickname, password)
    res.json(log)
})

server.listen(PORT,()=>{
    console.log(`Сервер запущен на порту ${PORT}`)
})

async function test (callback) {
    try {
        let res = await callback
        if(Array.isArray(res)){
            console.log(res.map(item => item.toJSON()))
        } else {
            console.log(res.toJSON())
        }
    } catch (error) {
        console.log(error)
    }
}