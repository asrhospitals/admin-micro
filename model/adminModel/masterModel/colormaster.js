const { DataTypes } = require('sequelize');
const sequalize=require('../../../db/connectDB');

const ColorMaster=sequalize.define('color',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    colorstatus:{
        type:DataTypes.STRING,
        allowNull:false
    },
    colorcode:{
        type:DataTypes.STRING,
        allowNull:false
    },
});

module.exports=ColorMaster;