import { Op } from 'sequelize';
import { Server } from 'socket.io'
import database from '../database/database.js';
import Chat from '../database/models/Chat.js';
import Friends from '../database/models/Friends.js';
import User from '../database/models/User.js';


export default function initSockets(server) {
    const io = new Server(server,{
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
    });
    
    const callback = (socket) => {

        socket.on("setSeparateChannel",(channel)=>{
            socket.join(channel)
        })

        socket.on('setRoom',(join_room)=>{
            let rooms = Array.from(socket.rooms)
            for(let room of rooms){
                if(room === +room){
                   socket.leave(room) 
                }
            }
            socket.join(join_room)
        })

        socket.on('sendMessage',(message)=>{
            database.models.Message.saveMessage(message)
            .then((res)=>{
                io.sockets.to(res.room).emit('addMessage',res)
            })
            .catch(e => console.log(e))
        })

        socket.on('editMessage',(data)=>{
            database.models.Message.edit(data)
            .then(res => {
                if(res){
                    io.sockets.emit('updateMessage',{
                        id : data.id,
                        data : data.new_message
                    })
                }
            })
        })

        socket.on("deleteMessages",({user_id,messages})=>{
            database.models.Message.destroy({
                where : {
                    [Op.and] : {
                        user_id : user_id,
                        id : messages
                    }
                }
            }).then(()=>{
                io.sockets.emit('deleteMessagesBack',messages.sort((a,b)=>a - b))
            })
        })

        socket.on("addFriend",async ({from_id,peer_id})=>{
            let type = await Friends.add(from_id,peer_id)

            let from_user = await User.findByPk(from_id)
            let peer_user = await User.findByPk(peer_id)
            from_user = from_user.toJSON()
            peer_user = peer_user.toJSON()


            io.sockets.to(from_user.nickname).emit('updateFriends',{
                type : type,
                user : peer_user
            })

            io.sockets.to(peer_user.nickname).emit('updateFriends',{
                type : type == 'sent' ? 'incoming' : type,
                user : from_user
            })

        }),

        socket.on('addMember',async ({chat_id,user_id}) => {
            console.log(chat_id,user_id)
            let member = await Chat.addMember(chat_id,user_id)
            let peer_user = await User.findByPk(user_id)
            let chat = await Chat.findByPk(chat_id)

            io.sockets.to(chat.id).emit('addMemberBack',member)

            io.sockets.to(peer_user.nickname).emit('getInvation',chat)
        })
    }

    return io.on('connection',callback)
}