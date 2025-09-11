const Investigation = require("../../../model/adminModel/masterModel/investigation");
const ProfileEntry = require("../../../model/adminModel/masterModel/profileentrymaster");
const Profile = require("../../../model/adminModel/masterModel/profileMaster");
const sequelize = require("../../../db/connectDB");
const { Op } = require("sequelize");

// 1. Add Profile
const createProfile = async (req, res) => {
  console.log("inside createProfile");
  
  const transaction = await sequelize.transaction();

  try {
    const { profileid, investigationids } = req.body;

    // A. Check Profile Exists
    const profile = await ProfileEntry.findByPk(profileid);
    if (!profile) {
      await transaction.rollback();
      return res.status(404).json({ message: "Profile not found." });
    }

    // B. Check Investigation IDs Provided as Array
    if (!Array.isArray(investigationids)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Investigation IDs must be a non-empty" });
    }

    // C. Check Investigations Exist
    const investigations = await Investigation.findAll({
      where: {
        id: {
          [Op.in]: investigationids,
        },
        status: "Active",
      },
    });

    // if (!investigations) {
    //   await transaction.rollback();
    //   return res.status(400).json({ message: "Investigations not found." });
    // }

    // anand 
    if (investigations.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Investigations not found." });
    }

    

    // D. Avoid duplicate
    const existingMappings = await Profile.findAll({
      where: {
        profileid: profileid,
      },
      transaction,
    });

    if (existingMappings.length > 0) {
      await transaction.rollback();
      return res
        .status(409)
        .json({ message: "Profile-Investigation mapping already exists." });
    }

    // C. Create Profile-Investigation mapping
    await Profile.create(
      {
        profileid: profileid,
        investigationids: investigationids,
        isactive: true,
      },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json({ message: "Profile created successfully." });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Profile
const fetchProfile = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Profile.findAndCountAll({
      include: [
        {
          model: ProfileEntry,
          attributes: ["profilename"],
          include: [
            {
              model: Investigation,

              attributes: ["testname"],
            },
          ],
        },
      ],

      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const transformedData = rows.map((profile) => ({
      id: profile.id,
      profileid: profile.profileid,
      profilename: profile.ProfileEntry?.profilename,
      investigationids: profile.investigationids,
      isactive: profile.isactive,
    }));

    const totalPages = Math.ceil(count / limit);

    if (!transformedData) {
      return res.status(404).json({ message: "No profile found" });
    }
    res.status(200).json({
      data: transformedData,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

/// Update Profile
const updateProfiles = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updateBody = await Profile.findByPk(req.params.id);
    if (!updateBody) {
      await t.rollback();
      return res.status(404).json({ message: "Profile not found." });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await updateBody.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

module.exports = { createProfile, fetchProfile, updateProfiles };
