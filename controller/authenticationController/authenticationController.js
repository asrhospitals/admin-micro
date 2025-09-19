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
const Technician = require("../../model/adminModel/masterModel/technicianMaster");
const Reception = require("../../model/adminModel/masterModel/receptionMaster");
const RoleType = require("../../model/adminModel/masterModel/roletypeMaster");

/////////////////------------------------------- Check Admin Exists----------------------////////////////

const checkAdmin = async () => {
 try {
   const userCount = await User.count();
  if (userCount === 0) {
    let adminRole = await RoleType.findOne({ where: { roletype: 'admin' } });
    if (!adminRole) {
       adminRole = await RoleType.create({ roletype: 'admin' ,isactive:true,roledescription:'Administrator with full access'});
      console.log("Admin role created in RoleType table");
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      email: 'admin@example.com',
      first_name: 'Asr',
      last_name: 'Admin',
      mobile_number: '0000000000',
      alternate_number: '0000000000',
      wattsapp_number: '0000000000',
      gender: 'Male',
      dob: '1990-01-01',
      address: 'Admin Address',
      city: 'Admin City',
      state: 'Admin State',
      pincode: '000000',
      module: ["admin"],
      created_by: 0,
      username: 'Admin',
      password: hashedPassword,
      role: adminRole.id
    });

    console.log("Default admin user created: Admin / Admin@123");
  }
 } catch (error) {
   console.error(`Error checking admin user: ${error}`);
 }
};



///////////////////------------------------------- Register user----------------------////////////////

const createUser = async (req, res) => {
  try {
    const {
      wattsapp_number,
      mobile_number,
      alternate_number,
      email,
      first_name,
      last_name,
      gender,
      dob,
      address,
      city,
      state,
      pincode,
      username,
      password,
      module,
      created_by,
      image,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      wattsapp_number,
      mobile_number,
      alternate_number,
      email,
      first_name,
      last_name,
      gender,
      dob,
      address,
      city,
      state,
      pincode,
      username,
      password: hashedPassword,
      module,
      created_by,
      image,
    });

    res.status(201).json({
      message: "User Created Successfully (Role not assigned yet)",
      user: newUser,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: `User Creation Failed: ${err.message}` });
  }
};

/////////////////------------------------------- Assign Role to User----------------------////////////////
const assignRole = async (req, res) => {
  try {
    const {
      user_id,
      role, // role_id
      hospital_id,
      nodal_id,
      doctor_id,
      technician_id,
      reception_id,
      phlebotomist_id,
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roleRecord = await RoleType.findOne({ where: { id: role } });
    if (!roleRecord) {
      return res.status(404).json({ message: "Invalid Role ID" });
    }

    const roleName = roleRecord.roletype.toLowerCase();

    // Hospital validation for roles that require it
    if (
      roleName !== "admin" &&
      roleName !== "reception" &&
      roleName !== "technician" &&
      roleName !== "doctor" &&
      roleName !== "hr"
    ) {
      const hospital = await Hospital.findByPk(hospital_id);
      if (!hospital) {
        return res
          .status(400)
          .json({ message: "Hospital ID is required for this role" });
      }
    }

    await user.update({
      role,
      hospital_id: roleName !== "admin" ? hospital_id : null,
      nodal_id: roleName !== "admin" ? nodal_id : null,
      doctor_id: roleName === "doctor" ? doctor_id : null,
      technician_id: roleName === "technician" ? technician_id : null,
      reception_id: roleName === "reception" ? reception_id : null,
      phlebotomist_id: roleName === "phlebotomist" ? phlebotomist_id : null,
    });

    res.status(200).json({
      message: "Role assigned successfully",
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: `Role Assignment Failed: ${err.message}` });
  }
};

// const registration = async (req, res) => {
//   try {
//     const {
//       // username,
//       password,
//       role, // role_id (FK to RoleType.id)
//       hospital_id,
//       nodal_id,
//       module,
//       firstName,
//       lastname,
//       doctor_id,
//       technician_id,
//       reception_id,
//       phlebotomist_id,
//       isactive,
//     } = req.body;

//     // 1. Get role info from RoleType table
//     const roleRecord = await RoleType.findOne({ where: { id: role } });
//     if (!roleRecord) {
//       return res.status(404).json({ message: "Invalid role ID" });
//     }

//     const roleName = roleRecord.roletype.toLowerCase();

//     // 2. Validate hospital requirement for some roles
//     if (
//       roleName !== "admin" &&
//       roleName !== "reception" &&
//       roleName !== "technician" &&
//       roleName !== "doctor" &&
//       roleName !== "hr"
//     ) {
//       const hospital = await Hospital.findOne({ where: { id: hospital_id } });
//       if (!hospital) {
//         return res
//           .status(404)
//           .json({ message: "Hospital ID is required for this role" });
//       }
//     }

//     // 3. Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Create user
//     const newUser = await User.create({
//       username,
//       password: hashedPassword,
//       role: role ? role : null, // store role_id, not string
//       hospital_id: roleName !== "admin" ? hospital_id : null,
//       nodal_id: roleName !== "admin" ? nodal_id : null,
//       module,
//       first_name: firstName,
//       last_name: lastname,
//       doctor_id: roleName === "doctor" ? doctor_id : null,
//       technician_id: roleName === "technician" ? technician_id : null,
//       reception_id: roleName === "reception" ? reception_id : null,
//       phlebotomist_id: roleName === "phlebotomist" ? phlebotomist_id : null,
//       isactive,
//     });

//     res.status(201).json({
//       message: "User Registered Successfully",
//       user: newUser,
//     });
//   } catch (e) {
//     console.log(e.message);
//     res.status(400).json({ message: `User Registration Failed: ${e.message}` });
//   }
// };

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
        {
          model: Technician,
          as: "technician",
          attributes: ["technicianname"],
        },
        {
          model: Reception,
          as: "reception",
          attributes: ["receptionistname"],
        },
      ],
    });
    if (!user) return res.status(404).json({ message: "No User found" });

    //3. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //4. Handle Login Admin Users
    if (user.role === 1) {
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
        hospitalname: user.hospital
          ? user.hospital.hospitalname
          : "Unknown Hospital",
        // Nodal Data
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        username: phlebotomistData.name,
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
        hospital_id: user.hospitalid,
        doctor: doctorData,
      });
    }

    // 7. Technician Not Belong to any Hospital
    if (user.role === "technician") {
      // Verify that the technician belongs to the nodal
      if (!user.nodal_id) {
        return res
          .status(403)
          .json({ message: "Access denied: User Belong to the Nodal" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
          nodal_id: user.nodal_id,
          module: user.module,
        },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      // Safely access included phleb object
      const technicianData = user.technician
        ? {
            name: user.technician.technicianname,
          }
        : {};

      // Send response with token and user details
      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        nodal_id: user.nodal_id,
        module: user.module,
        // Nodal Data
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        //Need to Get User Name as per User ID
        username: technicianData.name,
      });
    }

    // 8. Receptionist Not Belong to any Hospital
    if (user.role === "reception") {
      // Verify that the technician belongs to the nodal
      if (!user.nodal_id) {
        return res
          .status(403)
          .json({ message: "Access denied: User Belong to the Nodal" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
          nodal_id: user.nodal_id,
          module: user.module,
        },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      // Safely access included phleb object
      const receptionistData = user.reception
        ? {
            name: user.reception.receptionistname,
          }
        : {};

      // Send response with token and user details
      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        nodal_id: user.nodal_id,
        module: user.module,
        // Nodal Data
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        //Need to Get User Name as per User ID
        username: receptionistData.name,
      });
    }
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
    const roleType = await RoleType.findByPk(user.role);
    const token = jwt.sign(
      { id: user.id, role: user.role, roletype: roleType.roletype },
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

module.exports = {
  // registration,
  login,
  verifyOtp,
  resendOtp,
  createUser,
  assignRole,
  checkAdmin,
};
