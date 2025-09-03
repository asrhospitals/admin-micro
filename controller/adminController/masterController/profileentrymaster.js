const sequelize = require("../../../db/connectDB");
const ProfileEntryMaster = require("../../../model/adminModel/masterModel/profileentrymaster");

// 1.Add New Profile
const addProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Check the Profile Name already exist or not
    const check = await ProfileEntryMaster.findOne({
      where: { profilename },
      transaction,
    });
    if (check) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Profile with this name already exists",
        error: "DUPLICATE_PROFILE_ENTRY",
      });
    }

    // Check Profile Code
    const checkCode = await ProfileEntryMaster.findOne({
      where: { profilecode },
      transaction,
    });
    if (checkCode) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Profile code  already exists",
        error: "DUPLICATE_PROFILE_CODE",
      });
    }
    await ProfileEntryMaster.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json({ message: "Profile entry created successfully" });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}`});
  }
};

// 2. Get Profile

const getProfile = async (req, res) => {
  try {
    const getNewProfile = await ProfileEntryMaster.findAll();
    res.status(200).json(getNewProfile);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Something went wrong", error: error.message });
  }
};

/// Update Profile

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const updateNewProfile = await ProfileEntryMaster.findByPk(id);
    updateNewProfile.update(req.body);
    res.status(200).json(updateNewProfile);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { addProfile, getProfile, updateProfile };
