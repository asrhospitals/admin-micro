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
const RoleType = require("../../model/adminModel/masterModel/roletypeMaster");
const UserSession = require("../../model/authModel/authenticationModel/user_session");
const { Op } = require("sequelize");

// -----------------------------------------------------------------

/**
 * Utility function to extract IP and browser details from the request.
 * @param {object} req - Express request object
 * @returns {object} { ipAddress, browserDetails }
 */
const extractLogData = (req) => {
  // Safely get IP address (your existing correct logic)
  const ipAddress = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",")[0].trim()
    : req.ip || req.connection.remoteAddress;

  // Use the raw User-Agent string for maximum detail
  const rawBrowserDetails = req.get("User-Agent") || "Unknown";

  // --- New: Use the parsed details for a cleaner display ---
  // The library gives you properties like:
  // req.useragent.browser (e.g., 'Edge')
  // req.useragent.version (e.g., '142.0.0.0')
  // req.useragent.os (e.g., 'Windows 10')

  const readableBrowserName = req.useragent
    ? `${req.useragent.browser} ${req.useragent.version} on ${req.useragent.os}`
    : rawBrowserDetails;

  // You can choose which one to store:

  return {
    ipAddress,
    browserDetails: rawBrowserDetails, // Keep the raw string for forensics/accuracy
    readableBrowserName: readableBrowserName, // Store this in a separate column if you want a clean view
  };
};
// -----------------------------------------------------------------

/////////////////------------------------------- Check Admin Exists----------------------////////////////

const checkAdmin = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      let adminRole = await RoleType.findOne({ where: { roletype: "admin" } });
      if (!adminRole) {
        adminRole = await RoleType.create({
          roletype: "admin",
          isactive: true,
          roledescription: "Administrator with full access",
        });
        console.log("Admin role created in RoleType table");
      }

      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        email: "admin@example.com",
        first_name: "Asr",
        last_name: "Admin",
        mobile_number: "0000000000",
        alternate_number: "0000000000",
        wattsapp_number: "0000000000",
        gender: "Male",
        dob: "1990-01-01",
        address: "Admin Address",
        city: "Admin City",
        state: "Admin State",
        pincode: "000000",
        module: ["admin"],
        created_by: 0,
        username: "Admin",
        password: hashedPassword,
        role: adminRole.id,
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
      created_by,
      image,
      certificate,
      module,
      nominee_contact,
      nominee_name,
    } = req.body;

    const existingUser = await User.findOne({
            where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("username")),
        sequelize.fn("LOWER", sequelize.col("first_name")),
        username.toLowerCase(),
        first_name.toLowerCase()
      ),
      where: { mobile_number },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Username or Mobile or Name  already exists",
        error: "DUPLICATE_USERNAME_OR_MOBILE_NUMBER_OR_NAME",
      });
    }

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
      created_by,
      image,
      module,
      nominee_contact,
      nominee_name,
      certificate,
    });

    res.status(201).json({
      message: "User Created Successfully (Role not assigned yet)",
      user: newUser,
    });
  } catch (err) {
    res.status(400).json({ message: `User Creation Failed: ${err.message}` });
  }
};

/////////////////------------------------------- Assign Role to User----------------------////////////////
const assignRole = async (req, res) => {
  try {
    const {
      user_id,
      role,
      module,
      hospitalid,
      nodalid,
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
      const hospital = await Hospital.findByPk(hospitalid);
      if (!hospital) {
        return res
          .status(400)
          .json({ message: "Hospital ID is required for this role" });
      }
    }

    await user.update({
      role,
      module,
      hospitalid: roleName !== "admin" ? hospitalid : null,
      nodalid: roleName !== "admin" ? nodalid : null,
      doctor_id: roleName === "doctor" ? doctor_id : null,
      technician_id: roleName === "technician" ? technician_id : null,
      reception_id: roleName === "reception" ? reception_id : null,
      phlebotomist_id: roleName === "phlebotomist" ? phlebotomist_id : null,
    });

    res.status(200).json({
      message: "Role assigned successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: `Role Assignment Failed: ${err.message}` });
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
        // {
        //   model: Phlebotomist,
        //   as: "phlebotomist",
        //   attributes: ["phleboname"],
        // },
        // {
        //   model: Technician,
        //   as: "technician",
        //   attributes: ["technicianname"],
        // },
        // {
        //   model: Reception,
        //   as: "reception",
        //   attributes: ["receptionistname"],
        // },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "No User found" });
    }

    //3. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // --- START: USER SESSION LOGGING INTEGRATION ---

    const { ipAddress, browserDetails } = extractLogData(req);

    try {
      // Create the new log entry
      const sessionLog = await UserSession.create({
        userId: user.user_id, // Ensure this matches the column name in your UserSession model
        ipAddress: ipAddress,
        browserDetails: browserDetails,
        loginTime: new Date(), // This will be the default if not provided, but good to be explicit
      });

      // Store the ID to be embedded in the JWT later
      sessionLogId = sessionLog.id;
    } catch (logError) {
      console.error("Error recording login session:", logError);
      // It is usually best to log the error and continue the login process,
      // as logging failure shouldn't prevent a legitimate user from signing in.
    }

    // --- END: USER SESSION LOGGING INTEGRATION ---

    //4. Handle Login Admin Users
    if (user.role === 1) {
      const otp = generateOtp();
      await OTP.create({
        user_id: user.user_id,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      });
      // await sendOtp(process.env.PREDEFINED_EMAIL, otp);

      const roleType = await RoleType.findByPk(user.role);

      return res.status(200).json({
        message: "OTP sent to email",
        id: user.user_id,
        otp,
        role: user.role,
        roleType: roleType.roletype,
      });
    }

    //5. Handle Login plebotomist users
    const roleType = await RoleType.findByPk(user.role);
    if (!roleType) {
      return res.status(500).json({ message: "User role not found" });
    }
    if (roleType.roletype === "phlebotomist") {
      // Require hospital and Nodal verification for phlebotomists
      if (!user.hospitalid && !user.nodalid) {
        return res
          .status(403)
          .json({ message: "Access denied: No hospital or Nodal assigned" });
      }
      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
          hospitalid: user.hospitalid,
          nodalid: user.nodalid,
          roleType: roleType.roletype,
        },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      // Safely access included phleb object
      // const phlebotomistData = user.phlebotomist
      //   ? {
      //       name: user.phlebotomist.phleboname,
      //     }
      //   : {};

      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        hospitalid: user.hospitalid,
        nodalid: user.nodalid,
        roleType: roleType.roletype,
        //Need to Get Hospital Name as per Hospital ID
        hospitalname: user.hospital
          ? user.hospital.hospitalname
          : "Unknown Hospital",
        // Nodal Data
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        // username: phlebotomistData.name,
        // first_name: user.first_name,
      });
    }

    // 6. Receptionist Not Belong to any Hospital
    if (roleType.roletype === "reception") {
      // Verify that the reception belongs to the nodal
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
          roleType: roleType.roletype,
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
        nodalid: user.nodalid,
        roleType: roleType.roletype,
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        first_name: user.first_name,
      });
    }

    //7. Handle Login Doctor roles
    // Doctor Not Belong to any Hospital or Nodal
    if (user.role === "doctor") {
      const token = jwt.sign(
        { id: user.user_id, role: user.role, module: user.module },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      // // Safely access included doctor object
      // const doctorData = user.doctor
      //   ? {
      //       name: user.doctor.dname,
      //       signature: user.doctor.dditsig,
      //       profileImage: user.doctor.dphoto,
      //       email: user.doctor.demail,
      //     }
      //   : {};

      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        module: user.module,
        hospitalid: user.hospitalid,
        doctor: doctorData,
      });
    }

    // 8. Technician Not Belong to any Hospital
    if (roleType.roletype === "technician") {
      // Verify that the technician belongs to the nodal
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
          roleType: roleType.roletype,
        },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      // // Safely access included phleb object
      // const technicianData = user.technician
      //   ? {
      //       name: user.technician.technicianname,
      //     }
      //   : {};

      // Send response with token and user details
      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        nodalid: user.nodalid,
        module: user.module,
        roleType: roleType.roletype,
        // Nodal Data
        nodalname: user.nodal ? user.nodal.nodalname : "Unknown Nodal",
        //Need to Get User Name as per User ID
      });
    }
  } catch (e) {
    return res.status(403).json({
      success: false,
      message: "Access denied or unexpected error occurred.",
      errorType: e.name || "UnknownError",
      errorMessage: e.message,
      stack: e.stack,
      details: e.errors || null,
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
      {
        id: user.id,
        role: user.role,
        roleType: roleType ? roleType.roletype : "Unknown Role",
      },
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

const getUserSession = async (req, res) => {
  try {
    const getUserData = await UserSession.findAll();
    return res.status(200).json({ message: "Data Fetched", data: getUserData });
  } catch (error) {
    res.status(400).json({ message: "something went wrong", error });
  }
};

/////////////--------------------------------Get All Users ------------------/////////////////////
const getAllUsers = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["user_id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No User found" });
    }
    res.status(200).json({
      data: rows,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

//////////----------------------------Get all users with id----------------------/////////////////////

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: `Failed to retrieve user ${e}` });
  }
};

/////////---------------------------------Search All Users----------------------///////////////////

const searchUsers = async (req, res) => {
  try {
    /* 1. Query Parameters */
    const { username, first_name } = req.query;
    req.query;
    const filters = {};

    if (username) {
      filters["username"] = {
        [Op.iLike]: `%${username}%`,
      };
    }
    if (first_name) {
      filters["first_name"] = {
        [Op.iLike]: `%${first_name}%`,
      };
    }

    /* Find Users Matching the Query */
    const users = await User.findAll({
      where: filters,
      order: [["user_id", "ASC"]],
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: `Something went wrong while searching users ${error}`,
    });
  }
};

// update users

const updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      mobile_number,
      wattsapp_number,
      alternate_number,
      email,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      username,
      password,
      module,
      isactive,
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update allowed fields
    const updateData = {
      first_name,
      last_name,
      mobile_number,
      wattsapp_number,
      alternate_number,
      email,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      username,
      module,
      isactive,
    };

    // Hash password if it is provided
    if (password) {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    res.status(200).json({ message: "User updated successfully", user });
  } catch (e) {
    console.error("Error updating user:", e);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Update Users Role and Module
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    const { role, module, hospitalid, nodalid } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateFields = { role, module, hospitalid, nodalid };

    await user.update(updateFields);
    res
      .status(200)
      .json({ message: "User role and module updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", err: error.message });
  }
};

module.exports = {
  login,
  verifyOtp,
  resendOtp,
  createUser,
  assignRole,
  checkAdmin,
  getAllUsers,
  searchUsers,
  getUserById,
  updateUsers,
  updateRole,
  getUserSession,
};
