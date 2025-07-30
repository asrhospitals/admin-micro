const { DataTypes } = require('sequelize');
const sequalize=require('../../../db/connectDB');


const RoleType=sequalize.define('roletype',{
    roletype:{
        type:DataTypes.STRING,
        allowNull:false
    },
    roledescription:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
       
}, {timestamps:false});

module.exports=RoleType;