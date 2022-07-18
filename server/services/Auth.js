import database from "../database/database.js";
import bcrypt from "bcrypt"

export default async function Auth(nickname, password) {
    let user = await database.models.User.findOne({
        where : {
            nickname : nickname
        }
    })
    
    if(user) {
        user = user.toJSON()
    } else {
        return ({
            success : false,
            log : "Имени не существует"
        })
    }

    let password_correct = bcrypt.compareSync(password,user.password)
    if(password_correct){
        return ({
            success : true,
            id : user.id
        })
    } else {
        return ({
            success : false,
            log : "Пароли не совпадают"
        }) 
    }
}