require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const MasterRoutes = require("./routes/adminRoutes/masterRoute");
const SignatureImageUploader = require("./controller/commonImageUploader/signatureImage");
const CertificateUploader = require("./controller/commonImageUploader/certificateImage");
const ProfilePicture = require("./controller/commonImageUploader/profileImage");
const InternshipCertificate = require("./controller/commonImageUploader/intershipCertificate");
// const sequelize = require("./db/connectDB");
const sequelize=require('./model');
const {
  authenticateToken,
  checkAdminRole,
} = require("./middlewares/authMiddileware");

const {
  checkAdmin,
} = require("./controller/authenticationController/authenticationController");

const applyAdminAuditHooks = require("./hooks/adminAuditHooks");



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
