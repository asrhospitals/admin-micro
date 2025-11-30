const User = require("../../model/authModel/authenticationModel/userModel");
const RoleType = require("../../model/adminModel/masterModel/roletypeMaster");
const bcrypt = require("bcryptjs");

/**
 * @description Checks if a user exists and creates a default admin user and role if the database is empty.
 * @returns {Promise<void>}
 */
const checkAdmin = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      // 1. Ensure Admin Role Exists
      let adminRole = await RoleType.findOne({ where: { roletype: "admin" } });
      if (!adminRole) {
        adminRole = await RoleType.create({
          roletype: "admin",
          isactive: true,
          roledescription: "Administrator with full access",
        });
        console.log("Admin role created in RoleType table");
      }

      // 2. Create Default Admin User
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        email: process.env.PREDEFINED_EMAIL,
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
        department: ["admin"],
        created_by: "system default",
        username: "Admin",
        password: hashedPassword,
        role: ["admin"],
      });

      console.log("Default admin user created: Admin / Admin@123");
    }
  } catch (error) {
    console.error(`Error checking admin user: ${error.message}`);
    console.dir(error, { depth: null });
  }
};

module.exports = {
  checkAdmin,
};
