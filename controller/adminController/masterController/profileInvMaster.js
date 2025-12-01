const Investigation = require("../../../model/adminModel/masterModel/investigation");
const ProfileMaster = require("../../../model/adminModel/masterModel/profileMaster");
const ProfileInvMaster = require("../../../model/adminModel/masterModel/profileInvMaster");
const Department = require("../../../model/adminModel/masterModel/departmentMaster");
const sequelize = require("../../../db/connectDB");
const { Op } = require("sequelize");

// 1. Add Profile
const createProfile = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { profileid, investigationids } = req.body;

    // A. Check Profile Exists
    const profile = await ProfileMaster.findByPk(profileid);
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

    // console.log("inside createProfile investigations ===>>>", investigations);

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
    const existingMappings = await ProfileInvMaster.findAll({
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
    await ProfileInvMaster.create(
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

    const { count, rows } = await ProfileInvMaster.findAndCountAll({
      include: [
        {
          model: ProfileMaster,
          as: "profile",
          attributes: ["profilename", "profilecode"],
        },
      ],
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const data = await Promise.all(
      rows.map(async (profile) => {
        let investigations = [];

        if (profile.investigationids && profile.investigationids.length > 0) {
          investigations = await Investigation.findAll({
            where: {
              id: {
                [Op.in]: profile.investigationids,
              },
            },
            attributes: ["id", "testname", "normalprice"],
            include: [
              {
                model: Department,
                as: "department",
                attributes: ["dptname"],
              },
            ],
          });
        }

        return {
          id: profile.id,
          profilename: profile.profile?.profilename || null,
          profilecode: profile.profile?.profilecode || null,
          investigations: investigations,
          isactive: profile.isactive,
        };
      })
    );

    res.status(200).json({
      data: data,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

// 3. Get Profile by ID
const fetchProfileById = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id, {
      include: [
        {
          model: ProfileEntry,
          as: "profileentry",
          attributes: ["profilename"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    let investigations = [];

    if (profile.investigationids && profile.investigationids.length > 0) {
      investigations = await Investigation.findAll({
        where: {
          id: {
            [Op.in]: profile.investigationids,
          },
        },
        attributes: ["id", "testname"],
      });
    }

    const data = {
      id: profile.id,
      profilename: profile.profileentry?.profilename || null,
      investigations: investigations,
      isactive: profile.isactive,
    };

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
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

module.exports = {
  createProfile,
  fetchProfile,
  fetchProfileById,
  updateProfiles,
};
