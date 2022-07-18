import database from "../database/database.js";
import bcrypt from "bcrypt";

export default async function Registration (nickname,password) {
    try {
        let nicknameExists = await database.models.User.findOne({
            where : {
                nickname : nickname
            }
        })

        if (nicknameExists) {
            return {
                log : "Ник занят",
                success : false
            }
        } else {
            let hash = bcrypt.hashSync(password,1)
            let user = await database.models.User.create({
                nickname : nickname,
                password : hash
            })

            if(user){
                return {
                    log : "Успешная регистрация",
                    success : true
                }
            }
        }
    } catch (error) {
        console.log(error)
        return {
            log : "Произошла ошибка на сервере",
            success : false
        }
    }
}