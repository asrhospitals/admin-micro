const { DataTypes } = require('sequelize');
const sequelize=require('../../../db/connectDB');

const ReportDoctor=sequelize.define('reportdoctor',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    doctorname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dob:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    phoneno:{
        type:DataTypes.STRING,
        allowNull:false
    },
    addressline1:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    state:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pin:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    aptno:{
        type:DataTypes.STRING,
        allowNull:false
    },
    department:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,

    },
    medicalregno:{
        type:DataTypes.STRING,
        allowNull:false
    },
    digitalsignature:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }

},{timestamps:false});

module.exports=ReportDoctor;