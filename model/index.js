const fs = require("fs");
const path = require("path");
const sequelize = require("../db/connectDB");

// Recursively load all .js files in a directory
function loadModels(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadModels(fullPath);
    } else if (file.endsWith(".js")) {
      require(fullPath);
    }
  });
}

// Load admin models
loadModels(path.join(__dirname, "adminModel"));

// Load audit model  <-- REQUIRED
loadModels(path.join(__dirname, "auditModel"));

// Load authentication models
loadModels(path.join(__dirname, "authModel"));

// Load associations AFTER all models are defined
require("./associatemodels/associatemodel");

module.exports = sequelize;
