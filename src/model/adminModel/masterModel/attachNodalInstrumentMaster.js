const { DataTypes } = require('sequelize');
const sequialize = require('../../../db/connectDB');
const Nodal = require('../masterModel/nodalMaster');
const Instrument = require('../masterModel/instrumentMaster');


const NodalInstrument=sequialize.define('nodal_instrument',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nodalid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Nodal,
        key: "id",
      },
    },
    instrumentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Instrument,
          key: "id",
        },
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
});

module.exports=NodalInstrument;