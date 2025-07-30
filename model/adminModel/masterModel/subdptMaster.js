const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');

const SubdepartmentMaster=sequelize.define('subdepartment',{
    dptname:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    subdptname:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
});

module.exports=SubdepartmentMaster;