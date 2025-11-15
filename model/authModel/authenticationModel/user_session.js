// models/UserSession.js

const { DataTypes } = require('sequelize');
const db = require("../../../db/connectDB"); // Assuming you have your Sequelize instance configured
const User=require("../authenticationModel/userModel");

const UserSession = db.define('UserSession', {
    // Primary Key (Serial in Postgres)
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Foreign Key to your User table
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // The name of your existing user table
            key: 'user_id',      // The primary key column name in the user table
        }
    },
    loginTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    logoutTime: {
        type: DataTypes.DATE,
        allowNull: true, // It will be NULL until the user logs out
    },
    ipAddress: {
        type: DataTypes.STRING(45), // IPv4 needs 15, IPv6 needs 45 characters
        allowNull: false,
    },
    browserDetails: {
        type: DataTypes.STRING(255), // Stores the full User-Agent string
        allowNull: false,
    },
    // You might also want to store the session ID or JWT ID for reference
    sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'user_sessions', // Explicitly set the table name
    timestamps: false, // We use custom login/logout times
});

// Define the association (if you have a User model)
 User.hasMany(UserSession);
 UserSession.belongsTo(User);

module.exports = UserSession;