require('dotenv').config();
const { Sequelize } = require("sequelize");



// const sequelize = new Sequelize('lims_database', 'postgres', 'Postgres123', {
//    host: 'localhost',
//    dialect: 'postgres',
//    port: 5432,
//  });



     const sequelize= new Sequelize(process.env.DATABASE_URL,{ dialect: 'postgres',port:5432});

module.exports = sequelize;
