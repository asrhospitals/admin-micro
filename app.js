require('dotenv').config();
const express=require('express');
const app=express();
const cors=require("cors");
const PORT=process.env.PORT || 2000;
const MasterRoutes=require('./routes/adminRoutes/masterRoute');
const AuthRoutes=require('./routes/authRoutes/authenticationRoute');
const PatientImageUploader=require('./controller/commonImageUploader/patientImage');
const SignatureImageUploader=require('./controller/commonImageUploader/signatureImage');
const PatientTestImageUploader=require('./controller/commonImageUploader/testImage');
const CertificateUploader=require('./controller/commonImageUploader/certificateImage');
const ProfilePicture=require('./controller/commonImageUploader/profileImage');
const PatientTestRoute=require('./routes/patientTestRoutes/patientTestRoute');
const ReceptionistRoutes=require('./routes/receptionRoutes/handleReceptionRoutes');
const TechnicianRoutes=require('./routes/technicianRoutes/technicianRoutes');
const sequelize=require('./db/connectDB');
const verifyToken=require("./middlewares/authMiddileware");
const role=require("./middlewares/roleMiddleware");

app.use(cors());
app.use(express.json());

/// User Authentication Routes
app.use('/lims/authentication',AuthRoutes);

/// All routes
app.use('/lims/master',verifyToken,role("admin"),MasterRoutes);


// Routes to upload image
app.use('/lims/trf',PatientImageUploader);
app.use('/lims/signature',SignatureImageUploader);
app.use('/lims/certificate',CertificateUploader);
app.use('/lims/profile',ProfilePicture);
app.use('/lims/test',PatientTestImageUploader);




//Patient Test Control Paths handle by Phlebotomist
app.use('/lims/ppp/test',verifyToken,role('phlebotomist','reception'),PatientTestRoute);

// Routes for Receptionist
app.use('/lims/reception',verifyToken,role('reception'),ReceptionistRoutes);

// Routes for Technician
app.use('/lims/tech',verifyToken,role('technician'),TechnicianRoutes);





// Test Route
app.get('/',async (req,res) => {
    return res.json({message:"Lab Server is up"});
});

const server=async()=>{
    try {
        await sequelize.authenticate().then(()=>{console.log("Database Connected");}).catch(()=>{console.log("Database Connection Fail");});
        await sequelize.sync();
        app.listen(PORT,()=>{ console.log(`${PORT} port is Connected`);});
    } catch (error) {
        console.log(error)
    }
}

server();
