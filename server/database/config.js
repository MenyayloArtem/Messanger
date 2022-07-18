import { Sequelize, DataTypes, Op } from "sequelize"
import mysql2 from 'mysql2';
let options = {
    host: 'localhost',
    dialect: 'mysql',
    logging : false
}

if (options.dialect === 'mysql') {
  options.dialectModule = mysql2;
}

const sequelize = new Sequelize('messanger', 'mysql', 'mysql', options)

export default sequelize