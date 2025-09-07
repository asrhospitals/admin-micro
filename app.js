require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const MasterRoutes = require("./routes/adminRoutes/masterRoute");
const AuthRoutes = require("./routes/authRoutes/authenticationRoute");
const SignatureImageUploader = require("./controller/commonImageUploader/signatureImage");
const CertificateUploader = require("./controller/commonImageUploader/certificateImage");
const ProfilePicture = require("./controller/commonImageUploader/profileImage");
const sequelize = require("./db/connectDB");
const verifyToken = require("./middlewares/authMiddileware");
const role = require("./middlewares/roleMiddleware");

app.use(cors());
// anand 
app.use(express.json());

/// User Authentication Routes
app.use("/lims/authentication", AuthRoutes);

/// All routes
app.use("/lims/master", verifyToken, role("admin"), MasterRoutes);

// Routes to upload image
app.use("/lims/signature", SignatureImageUploader);
app.use("/lims/certificate", CertificateUploader);
app.use("/lims/profile", ProfilePicture);

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
    //  await sequelize.sync();
    console.log("Database connection has been established successfully");
    app.listen(PORT, () => {
      console.log(`Admin Server is running on ${PORT}`);
    });
  } catch (e) {
    console.log("Database connection has been failed", e);
    process.exit(1);
  }
};

server();
