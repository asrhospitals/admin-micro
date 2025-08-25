const Hospital = require("../../../model/adminModel/masterModel/hospitalMaster");
const sequelize = require("../../../db/connectDB");
const HospipatlType = require("../../../model/adminModel/masterModel/hospitalTypeMaster");


// 1. Add Hospital
const addhospital = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const add_hospital = req.body;
    const create_hospital = await Hospital.create(add_hospital, {
      transaction,
    });
    await transaction.commit();
    res.status(201).json(create_hospital);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Hospital
const gethospital = async (req, res) => {
  try {
    //Add pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Hospital.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["hospitalname", "ASC"]],
      include:[
        {model:HospipatlType,as:'hospitalType' ,attributes:['hsptltype'] }
      ]
    });

    // count total pages
    const totalPages = Math.ceil(count / limit);

    // Check if there are no rows
    if (!rows) {
      return res.status(200).json({ message: "No hospital found" });
    }

    // Return Response
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
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Hospital By Id

const getHospitalById = async (req, res) => {
  try {
    const get_hospital = await Hospital.findByPk(req.params.id);
    if (!get_hospital) {
      return res
        .status(200)
        .json({ message: `Not found any hospital for this id ${req.params.id}` });
    }
    res.status(200).json(get_hospital);
  } catch (error) {
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Hospital
const updatehospital = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const update_hospital = await Hospital.findByPk(req.params.id);
    if (!update_hospital) {
      return res
        .status(200)
        .json({
          message: `Not found any hospital for this id ${req.params.id}`,
        });
    }
    await update_hospital.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Hospital update successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addhospital, gethospital, getHospitalById, updatehospital };
