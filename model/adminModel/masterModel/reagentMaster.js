const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');

const Reagent=sequelize.define('reagent',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    reagentname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    capacity:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
});

module.exports=Reagent;