const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');

const Subdepartment=sequelize.define('subdepartment',{

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    subdptname:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    department_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'departments',
            key:'id'
        }
    },

},{timestamps:false});

module.exports=Subdepartment;