require('dotenv').config();
const { Sequelize } = require("sequelize");



// const sequelize = new Sequelize('railway', 'postgres', 'Postgres123', {
//    host: 'localhost',
//    dialect: 'postgres',
//    port: 5432,
//  });



// //  const sequelize= new Sequelize(process.env.DATABASE_URL,{ dialect: 'postgres',port:5432});
// const sequelize = new Sequelize('labdb', 'labuser', 'labpassword', {
//    host: '213.210.37.3',
//    dialect: 'postgres',
//    port: 5432,
//  });

// // Stagged Database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  port: 30988,
});

module.exports = sequelize;
