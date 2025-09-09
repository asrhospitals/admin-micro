const Investigation = require("../../../model/adminModel/masterModel/investigation");
const ProfileEntry = require("../../../model/adminModel/masterModel/profileentrymaster");
const Profile = require("../../../model/adminModel/masterModel/profileMaster");
const sequelize = require("../../../db/connectDB");

// 1. Add Profile
const createProfile = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { profileid, investigationid } = req.body;

    // A. Check Profile Exists
    const profile = await ProfileEntry.findByPk(profileid);
    if (!profile) {
      await transaction.rollback();
      return res.status(404).json({ message: "Profile not found." });
    }

    // B. Check Investigation IDs Provided as Array
    if (!Array.isArray(investigationid) || investigationid.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid investigation IDs." });
    }

    // C. Check Investigations Exist
    const investigations = await Investigation.findAll({
      where: {
        id: investigationid,
      },
    });

    if (investigations.length !== investigationid.length) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Some investigation IDs are invalid." });
    }

    // C. Create Profile-Investigation mapping
    const profileInvestigations = investigationid.map((investigationid) => ({
      profileid: profileid,
      investigationid: investigationid,
      isactive: true,
    }));

    await Profile.bulkCreate(profileInvestigations, { transaction });
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
      include:[
          {
          model: ProfileEntry,
       
          attributes: ["profilename"],
        },
        {
          model: Investigation,
        
          attributes: ["testname"],
        },
      ],

      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No profile found" });
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
