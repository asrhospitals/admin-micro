const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/connectDB');

const HospipatlType=sequelize.define('hospitaltype',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    hsptltype:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    hsptldsc:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
});

module.exports=HospipatlType;