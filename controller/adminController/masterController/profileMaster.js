const sequelize = require("../../../db/connectDB");
const ProfileMaster = require("../../../model/adminModel/masterModel/profileMaster");
const { Op } = require("sequelize");

// 1.Add New Profile
const addProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { profilename, profilecode } = req.body;
    // Check the Profile Name already exist or not
    const check = await ProfileMaster.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("profilename")),
            profilename.toLowerCase()
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("profilecode")),
            profilecode.toLowerCase()
          ),
        ],
      },
      transaction,
    });
    if (check) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Profile with this name or code already exists",
        error: "DUPLICATE_PROFILE_ENTRY_OR_CODE",
      });
    }
    await ProfileMaster.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json({ message: "Profile entry created successfully" });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Profile

const getProfile = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await ProfileMaster.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res.status(404).json({ message: "No Profile Entry found" });
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

// 3. Get Profile By Id

const getProfileEntryById = async (req, res) => {
  try {
    const get_id = await ProfileMaster.findByPk(req.params.id);
    if (!get_id) {
      return res.status(404).json({
        message: `No profile entry found for this id ${req.params.id}`,
      });
    }
    res.status(200).json(get_id);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4.Update Profile

const updateProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const update_profile = await ProfileMaster.findByPk(req.params.id);
    if (!update_profile) {
      await transaction.rollback();
      return res.status(200).json({ message: "Profile entry not found" });
    }

    if (Object.keys(req.body).length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Updated data not provided" });
    }

    await update_profile.update(req.body, {
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      message: "Profile entry updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 5. Profile Entry
const getAllProfileEntry = async (req, res) => {
  try {
    const getAll = await ProfileMaster.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(getAll);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

module.exports = {
  addProfile,
  getProfile,
  getProfileEntryById,
  updateProfile,
  getAllProfileEntry,
};
