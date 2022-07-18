import { Sequelize, DataTypes, Model } from "sequelize"
import sequelize from "../config.js"
import User from "./User.js"

class Message extends Model {
    static async getDialog(room,offset = 0){
        try {

            Message.belongsTo(User,{
                foreignKey : "user_id"
            })
            let res = await Message.findAll({
                include : {
                    model : User,
                    required : true,
                    attributes : ['nickname','id','avatarUrl']
                },
                attributes : ['id','img','room','text',['dispathTime','time'],'user_id'],
                offset : offset,
                order : [['id','DESC']],
                limit : 10,
                where : {
                    room : room
                }
            })
            return res.reverse()
        } catch (error) {
            console.log(error)
        }
        
    }

    static async edit({id, user_id, new_message}){
        try {
            let message = await Message.findOne({
                attributes : ['user_id'],
                where : {
                    id : id
                }
            })
            if(message.user_id == user_id){
                let n = await Message.update({
                    text : new_message.text,
                    img : new_message.img
                },{
                    where : {
                        id : id
                    }
                })
                return n
            } else {
                return 0
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async saveMessage(message){
 
        let x = await Message.create({
            text : message.text,
            img : message.img,
            user_id : message.User.id,
            room : message.room
        },{
            attributes : ['id','img','room','text',['dispathTime','time'],'user_id'],
        })

        Message.belongsTo(User,{
            foreignKey : "user_id"
        })

        let res = await Message.findByPk(x.id,{
            attributes : ['id','img','room','text',['dispathTime','time'],'user_id'],
            include : {
                model : User,
                required : true,
                attributes : ['nickname','id','avatarUrl']
            },
        })
        res = res.toJSON()
        return {...res, User : message.User}
    }
}

Message.init({
    text : DataTypes.STRING,
    img : DataTypes.STRING,
    user_id : {
        type : DataTypes.INTEGER,
        references : {
            key : "user_id"
        }
    },
    room : {
        type : DataTypes.INTEGER,
        defaultValue : 1
    },
    dispathTime : {
        type : DataTypes.TIME,
    }
},{
    timestamps : false,
    tableName : 'messages',
    sequelize
})

export default Message