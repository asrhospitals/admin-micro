require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const MasterRoutes = require("./src/routes/masterRoute");
const SignatureImageUploader = require("./src/controller/commonImageUploader/signatureImage");
const CertificateUploader = require("./src/controller/commonImageUploader/certificateImage");
const ProfilePicture = require("./src/controller/commonImageUploader/profileImage");
const InternshipCertificate = require("./src/controller/commonImageUploader/intershipCertificate");
// const sequelize = require("./db/connectDB");
const sequelize=require('./src/model');
const {
  authenticateToken,
  checkAdminRole,
} = require("./src/middlewares/authMiddileware");

const {
  checkAdmin,
} = require("./src/controller/authenticationController/authenticationController");

const applyAdminAuditHooks = require("./src/hooks/adminAuditHooks");



applyAdminAuditHooks(sequelize);

app.use(cors());
app.use(express.json());

/// All routes
app.use("/lims/master", authenticateToken, checkAdminRole, MasterRoutes);

// Routes to upload image
app.use("/lims/signature", SignatureImageUploader);
app.use("/lims/certificate", CertificateUploader);
app.use("/lims/profile", ProfilePicture);
app.use("/lims/internship-certificate",InternshipCertificate);

// Test Route
app.get("/", async (req, res) => {
  return res.json({
    message: "Admin Service is up",
    timestamp: new Date().toISOString(),
  });
});

const server = async () => {
  try {
    await sequelize.authenticate();
      // await sequelize.sync({alter:true});
      // await sequelize.sync();
    console.log("Database connection has been established successfully");
    // check admin is exist or not
    await checkAdmin();

    app.listen(PORT, () => {
      console.log(`Admin Server is running on ${PORT}`);
    });
  } catch (e) {
    console.log("Database connection has been failed", e);
    process.exit(1);
  }
};

server();
