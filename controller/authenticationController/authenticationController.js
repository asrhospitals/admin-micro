const User = require("../../model/authModel/authenticationModel/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateOtp,
  sendOtp,
} = require("../authenticationController/otpController");
const OTP = require("../../model/authModel/authenticationModel/otpModel");
const Hospital = require("../../model/adminModel/masterModel/hospitalMaster");
const Nodal = require("../../model/adminModel/masterModel/nodalMaster");
const Doctor = require("../../model/adminModel/masterModel/doctorRegistration");
const Phlebotomist = require("../../model/adminModel/masterModel/phlebotomistMaster");

///////////////////------------------------------- Register user----------------------////////////////

const registration = async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      hospital_id,
      nodal_id,
      module,
      firstName,
      lastname,
      doctor_id,
      technician_id,
      reception_id,
      phlebotomist_id,
      isactive,
    } = req.body;

    // Ensure that the hospital exists for Phelobtomist users
    if (
      role !== "admin" &&
      role !== "reception" &&
      role !== "technician" &&
      role !== "doctor"
    ) {
      const hospital = await Hospital.findOne({ where: { id: hospital_id } });
      if (!hospital) {
        return res
          .status(404)
          .json({ message: "Hospital ID is required for this role" });
      }
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      hospital_id:
        role !== "admin" && "reception" && "technician" ? hospital_id : null,
      nodal_id: role !== "admin" ? nodal_id : null,
      module,
      firstName,
      lastname,
      doctor_id: role === "doctor" ? doctor_id : null,
      technician_id: role === "technician" ? technician_id : null,
      reception_id: role === "reception" ? reception_id : null,
      phlebotomist_id: role === "phlebotomist" ? phlebotomist_id : null,
      isactive,
    });

    res
      .status(201)
      .json({ message: "User Registered Successfully", user: newUser });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: `User Registration Failed ${e}` });
  }
};

///////////////////////////--------------------- Login User----------------------/////////////////
const login = async (req, res) => {
  try {
    //1. Request By User
    const { username, password } = req.body;

    //2. Find user
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Hospital,
          as: "hospital",
          attributes: ["id", "hospitalname"],
        },
        {
          model: Nodal,
          as: "nodal",
          attributes: ["id", "nodalname"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["dname", "dditsig", "dphoto"],
        },
        {
          model: Phlebotomist,
          as: "phlebotomist",
          attributes: ["phleboname"],
        },
      ],
    });
    if (!user) return res.status(404).json({ message: "No User found" });

    //3. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //4. Handle Login Admin Users
    if (user.role === "admin") {
      const otp = generateOtp();
      await OTP.create({
        user_id: user.user_id,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      });
      await sendOtp(process.env.PREDEFINED_EMAIL, otp);
      return res.status(200).json({
        message: "OTP sent to email",
        id: user.user_id,
        otp,
        role: user.role,
      });
    }

    //5. Handle Login plebotomist users
    if (user.role === "phlebotomist") {
      // Require hospital and Nodal verification for phlebotomists
      if (!user.hospital_id && !user.nodal_id) {
        return res
          .status(403)
          .json({ message: "Access denied: No hospital or Nodal assigned" });
      }
      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
          hospital_id: user.hospital_id,
          nodal_id: user.nodal_id,
        },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

       // Safely access included phleb object
       const phlebotomistData = user.phlebotomist
       ? {
           name: user.phlebotomist.phleboname,
         }
       : {};

      

      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        hospital_id: user.hospital_id,
        nodal_id: user.nodal_id,
        //Need to Get Hospital Name as per Hospital ID
        hospitalname: user.hospitalmaster
          ? user.hospitalmaster.hospitalname
          : "Unknown Hospital",
        // Nodal Data
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        username:phlebotomistData.name

      });
    }

    //6. Handle Login Doctor roles
    // Doctor Not Belong to any Hospital or Nodal
    if (user.role === "doctor") {
      const token = jwt.sign(
        { id: user.user_id, role: user.role, module: user.module },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      // Safely access included doctor object
      const doctorData = user.doctor
        ? {
            name: user.doctor.dname,
            signature: user.doctor.dditsig,
            profileImage: user.doctor.dphoto,
            email: user.doctor.demail,
          }
        : {};

      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        module: user.module,
        hospitalid: user.hospitalid,
        //Need to Get User Name as per User ID
        username: user.firstName + " " + user.lastname,
        doctor: doctorData,
      });
    }

    //7. Handle Login Receptionist roles,Technician roles
    // Receptionist , Technician Not Belong to any Hospital
    if (!user.nodalid) {
      return res
        .status(403)
        .json({ message: "Access denied: User Belong to the Nodal" });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        nodalid: user.nodalid,
        module: user.module,
      },
      process.env.JWT_SECRET
      // { expiresIn: '1h' }
    );
    // Send response with token and user details
    return res.status(200).json({
      success: true,
      token,
      id: user.user_id,
      role: user.role,
      nodal_id: user.nodalid,
      module: user.module,
      // Nodal Data
      nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
      //Need to Get User Name as per User ID
      username: user.firstName + " " + user.lastname,
    });
  } catch (e) {
    return res.status(403).json({
      success: false,
      error: e.message,
    });
  }
};

////////////////----------------------- Verify OTP-----------///////////////////////

const verifyOtp = async (req, res) => {
  try {
    const { userid, otp } = req.body;

    // Fetch the user based on userId
    const user = await User.findByPk(userid);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the OTP exists and matches
    const storedOtp = await OTP.findOne({ where: { otp } });
    if (!storedOtp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // OTP is valid; delete it after successful verification
    await OTP.destroy({ where: { id: storedOtp.id } });

    // Generate the JWT token with the user's ID and role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
      // { expiresIn: '1h' }
    );

    res.status(200).json({ message: "OTP verified, login successful", token });
  } catch (e) {
    res.status(500).json({ message: "OTP Verification Failed" });
  }
};

//////////////////------------------------------ Resend OTP------------------------///////////////////
const resendOtp = async (req, res) => {
  try {
    // Get userid from URL parameters
    const { userid } = req.params;

    // Find the user
    const user = await User.findByPk(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const otp = generateOtp();

    // Update OTP in the database (delete old, create new)
    await OTP.destroy({ where: { userid: userid } }); // Delete existing OTP
    await OTP.create({ userid: userid, otp });

    // Send OTP to predefined email
    await sendOtp(process.env.PREDEFINED_EMAIL, otp);

    // Success response
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

module.exports = { registration, login, verifyOtp, resendOtp };
