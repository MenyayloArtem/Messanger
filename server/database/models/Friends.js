import { Sequelize, Model, DataTypes, Op } from "sequelize";
import sequelize from "../config.js";
import User from "./User.js";

class Friends extends Model {
    static async getFriends(id){
        try {
            let friends = await Friends.findAll({
                attributes : ['from_id','peer_id'],
                where : {
                    [Op.or] : [
                        {from_id : id},
                        {peer_id : id}
                    ],
                    accepted : true
                }
            })
            
            let friends_ids = friends.map(item => {
                if(item.peer_id == id){
                    return item.from_id
                }
                return item.peer_id
            })
            let parsed_friends = await User.getUsers(friends_ids)
            return parsed_friends.map(item => item.dataValues)
        } catch (error) {
            console.log(error)
        }
    }

    static async add(from_id,peer_id){
        try {
            let exists = await Friends.findOne({
                where : {
                    [Op.or] : [
                        {from_id,peer_id},
                        {from_id : peer_id, peer_id : from_id}
                    ]
                }
            })
            let type = null
            if(!exists) {
                await Friends.create({
                    from_id : from_id,
                    peer_id : peer_id
                })
                type = 'sent'
            } else {
                await Friends.accept(exists.from_id,exists.peer_id)
                type = 'accept'
            }

            return type
            
        } catch (error) {
            console.log(error)
        }
    }

    static async incoming(from_id){
        try {
            Friends.belongsTo(User,{
                foreignKey : "from_id",
            })
            let users = await Friends.findAll({
                include : {
                    model : User,
                    required : true
                },
                where : {
                    peer_id : from_id,
                    accepted : false
                },
                
            })
            return users.map(user => user.User)
        } catch (error) {
            console.log(error)
        }
    }

    static async outcoming(peer_id){
        try {
            Friends.belongsTo(User,{
                foreignKey : "peer_id"
            })
            let users = await Friends.findAll({
                attributes : [],
                where : {
                    from_id : peer_id,
                    accepted : false
                },
                include : {
                    model : User,
                    foreignKey : "peer_id",
                    required : true
                }
            })
            return users.map(user => user.User)
        } catch (error) {
            console.log(error)
        }
    }

    static async delete(from_id,peer_id){
        try {
            let res = await Friends.destroy({
                where : {
                    from_id : from_id,
                    peer_id : peer_id
                }
            })
            return res
        } catch (error) {
            console.log(error)
        }
    }

    static async accept(from_id,peer_id){
        try {
            let res = await Friends.update({
                accepted : true
            },{
                where : {
                    from_id : from_id,
                    peer_id : peer_id
                }
            })
           
            return res[0]
        } catch (error) {
            console.log(error)
        }
    }
}

Friends.init({
    from_id : {
        type : DataTypes.INTEGER,
        references : {
            key : "from_id"
        }
    },
    peer_id : {
        type : DataTypes.INTEGER,
        references : {
            key : 'peer_id'
        },
        primaryKey : true
    },
    accepted : DataTypes.BOOLEAN
},{
    sequelize,
    timestamps: false,
    tableName : "friends_requests"
})

export default Friends