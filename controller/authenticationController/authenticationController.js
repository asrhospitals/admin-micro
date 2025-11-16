const User = require("../../model/authModel/authenticationModel/userModel");
const bcrypt = require("bcryptjs");

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

module.exports = {
  checkAdmin,
};
