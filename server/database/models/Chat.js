import { Sequelize, DataTypes, Op, Model } from "sequelize"
import sequelize from "../config.js"
import Message from "./Message.js"
import User from "./User.js"

class Chats_Members extends Model {}
Chats_Members.init({
    member_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    chat_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        references : {
            key : "chat_id"
        }
    },
    permission_key : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
},{
    sequelize,
    tableName : 'chats_members',
    timestamps : false
})

class Chat extends Model {
    static async getChats(user_id){
        try {

            Chats_Members.belongsTo(Chat,{
                foreignKey : "chat_id",
            })

            let chats = await Chats_Members.findAll(
                {
                    where : {
                        member_id : user_id
                    },
                    include : {
                        model : Chat,
                        required : true
                    },
                }
            )

            return chats.map(item => item.Chat)

        } catch (e) {
            console.log(e)
        }
    }

    static async getChat(id){
        try {
            let chat = await Chat.findByPk(id)
            return chat.toJSON()
        } catch (error) {
            
        }
    }

    static async createNew(owner_id,payload){
        try {
            let chat = await Chat.create({
                name : payload.name,
                description : payload.description,
                avatarUrl : payload.photo || 'default.jpg',
                ownerId : owner_id
            })

            chat = chat.toJSON()
            
            await Chats_Members.create({
                chat_id : chat.id,
                member_id : chat.ownerId,
                permission_key : 10
            })

            return chat
        } catch (error) {
            console.log(error)
        }
    }

    static async getMembers(chat_id) {
        Chats_Members.belongsTo(User,{
            foreignKey : "member_id"
        })

        let members = await Chats_Members.findAll({
            attributes : [],
            where : {
                chat_id : chat_id
            },
            include : {
                model : User,
                foreignKey : 'member_id',
                attributes : ['id','nickname','status','avatarUrl']
            }
        })
        return members.map(item => item.User)
    }

    static async addMember(chat_id,user_id){
       try {
        await Chats_Members.create({
            chat_id: chat_id,
            member_id : user_id
        })

        let member = await User.getUser(user_id)
        return member
       } catch (error) {
        
       }
    }

    static async edit(user_id,chat_id,values) {
        try {
            let res = await Chat.update({
            name : values.name,
            description : values.description,
            avatarUrl : values.photo
        },{
            where : {
                id : chat_id
            }
        })

        if(res){
            return {
                chat_id,
                name : values.name,
                description : values.description,
                avatarUrl : values.photo
            }
        }
        } catch (error) {
            console.log(error)
        }
    }

    static async leave(chat_id, user_id) {
        try {
            let res = await Chats_Members.destroy({
                where : {
                    chat_id : chat_id,
                    member_id : user_id
                }
            })

            let hasMembers = await Chats_Members.findOne({
                where : {
                    chat_id : chat_id
                }
            })

            if(!hasMembers) {
                await Message.destroy({
                    where : {
                        room : chat_id
                    }
                })
                await Chat.destroy({
                    where : {
                        id : chat_id
                    }
                })
            }
            return res
        } catch (error) {
            console.log(error)
        }
    }
}

Chat.init({
    name : DataTypes.STRING,
    description : DataTypes.STRING,
    avatarUrl : {
        type : DataTypes.STRING,
        defaultValue : 'default.jpg'
    },
    ownerId : DataTypes.INTEGER
},{
    sequelize,
    timestamps : false,
    tableName : "chats"
})

export default Chat