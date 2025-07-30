const { DataTypes } = require('sequelize');
const sequalize=require('../../../db/connectDB');

const SpecimenTypeMaster=sequalize.define('specimen',{
    specimenname:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    specimendes:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
}, {timestamps:false});

module.exports=SpecimenTypeMaster;