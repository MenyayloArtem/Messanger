import { Sequelize, DataTypes, Op, Model } from "sequelize"
import sequelize from "../config.js"
import Friends from "./Friends.js"

class User extends Model {
    static async getUser(id){
        try {
            let res = await User.findOne({
                attributes : ['id','nickname','status','avatarUrl'],
                where : {
                    id : id
                },
            })
            return res
        } catch (e) {
            console.log('error',e.original.sql, e.original.sqlMessage)
        }
    }

    static async searchUser(nickname){
        let res = await User.findAll({
            where : {
                nickname : {
                    [Op.like] : `%${nickname}%`
                }
            }
        })
        return res.map(item => item.dataValues)
    }

    static async editUser(id,{nickname,status,photo}){
        let res = await User.update({
            nickname : nickname,
            status : status,
            avatarUrl : photo
        },{
            where : {
                id : id
            }
        })

        return {
            nickname,
            status,
            avatarUrl : photo
        }
    }

    static async getUsers(list){
        try {
            let res = await User.findAll({
                where : {
                    id : list
                },
            })
            return res
        } catch (e) {
            console.log('error',e.original.sql, e.original.sqlMessage)
        }
    }

    static async getFriends(id){
        
        try {
            let friends = await Friends.getFriends(id)
            return friends
        } catch (e) {
            console.log('error',e)
        }
    }
}

User.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        // references : {
        //     model : "Message",
        //     key : "user_id",
        // }
    },
    nickname : DataTypes.STRING,
    password : DataTypes.STRING,
    status : DataTypes.STRING,
    avatarUrl : DataTypes.STRING,
},{
    sequelize,
    timestamps : false,
    tableName : "users"
})

export default User