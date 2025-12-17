const OutLab = require("../../../model/adminModel/masterModel/outsourceMaster");
const Investigation = require("../../../model/adminModel/masterModel/investigation");
const sequelize = require("../../../db/connectDB");
const { Op } = require("sequelize");

// 1. Add OutLab
const addOutLab = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { labname } = req.body;

    // Check if lab with the same name already exists
    const existingLab = await OutLab.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("labname")),
        labname.toLowerCase()
      ),
    });
    if (existingLab) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Lab with this name already exists",
        error: "DUPLICATE_LAB_NAME",
      });
    }
    await OutLab.create(req.body, { transaction });

    await transaction.commit();
    res.status(201).json({ message: "Lab created successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 2. Get Lab to Lab
// Helper to normalize Postgres array fields into JS arrays
const normalizeArray = val => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val.replace(/[{}]/g, "").split(",").filter(Boolean);
  }
  return [val];
};

const getOutLab = async (req, res) => {
  try {
    // Pagination setup
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    // Fetch paginated OutLab records
    const { count, rows } = await OutLab.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // For each lab, fetch investigations that overlap with its own labname[]
    const finalData = await Promise.all(
      rows.map(async lab => {
        const labJson = lab.toJSON();
        const currentLabNames = normalizeArray(lab.labname);

        // Fetch investigations only for this lab's names
        const investigations = await Investigation.findAll({
          where: {
            labname: {
              [Op.overlap]: currentLabNames,
            },
          },
          attributes: ["id", "testname", "outsourceprice", "labname"],
        });

        labJson.Investigations = investigations.map(inv => ({
          id: inv.id,
          testname: inv.testname,
          outsourceprice: normalizeArray(inv.outsourceprice), // ensure array
          labnames: normalizeArray(inv.labname),              // ensure array
        }));

        return labJson;
      })
    );

    // Final response
    res.status(200).json({
      data: finalData,
      meta: {
        totalItems: count,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", details: error.message });
  }
};







// 3. Get Lab By Id
const getOutLabById = async (req, res) => {
  try {
    // Step 1: Fetch the lab by ID
    const lab = await OutLab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({ message: `No lab found for this id ${req.params.id}` });
    }

    // Step 2: Extract labname[] from the lab record
    const currentLabNames = lab.labname || [];

    // Step 3: Fetch investigations where labname[] overlaps with this lab's name
    const investigations = await Investigation.findAll({
      where: {
        labname: {
          [Op.overlap]: currentLabNames, // PostgreSQL array overlap
        },
      },
      attributes: ["id", "testname", "normalprice", "labname"],
    });

    // Step 4: Attach matching investigations to the lab
    const labJson = lab.toJSON();
    labJson.Investigations = investigations.map(inv => ({
      id: inv.id,
      testname: inv.testname,
      normalprice: inv.normalprice,
      labnames: inv.labname,
    }));

    // Final response
    res.status(200).json({ data: labJson });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", details: error.message });
  }
};


// 4. Update Lab
const updateOutLab = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const updatelab = await OutLab.findByPk(req.params.id);
    if (!updatelab) {
      await transaction.rollback();
      return res.status(404).json({ message: "Lab not found" });
    }

    if (Object.keys(req.body).length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Updated data not provided" });
    }
    await updatelab.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "Lab update successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addOutLab, getOutLab, getOutLabById, updateOutLab };
