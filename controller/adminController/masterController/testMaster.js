const sequelize = require("../../../db/connectDB");
const Investigation = require("../../../model/adminModel/masterModel/investigation");
const InvestigationResult = require("../../../model/adminModel/masterModel/investigationResult");
const NormalValue = require("../../../model/adminModel/masterModel/normalValue");
const Mandatory = require("../../../model/adminModel/masterModel/mandatory");
const ReflexTest = require("../../../model/adminModel/masterModel/reflexTest");
const Department = require("../../../model/adminModel/masterModel/departmentMaster");
const { Op, Sequelize } = require("sequelize");
const ReportType = require("../../../model/adminModel/masterModel/reportTypeMaster");

// 1. Add Test
const addTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { results, ...investigationData } = req.body;

    // Check if test with same name already exists
    const existingTest = await Investigation.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("testname")),
        investigationData.testname.toLowerCase()
      ),
      transaction,
    });

    if (existingTest) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Test with this name already exists",
        error: "DUPLICATE_TEST_NAME",
      });
    }

    // Check if shortcode already exists
    const existingShortCode = await Investigation.findOne({
      where: { shortcode: investigationData.shortcode },
      transaction,
    });

    if (existingShortCode) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Test with this shortcode already exists",
        error: "DUPLICATE_SHORT_CODE",
      });
    }

    // 1. Create The Investigation
    const investigation = await Investigation.create(investigationData, {
      transaction,
    });

    // Step 2: Add Investigation Results
    for (const result of results) {
      const { normalValues, mandatories, reflexTests, ...resultData } = result;

      // Create investigation result
      const resultRecord = await InvestigationResult.create(
        { ...resultData, investigationid: investigation.id },
        { transaction }
      );

      // 3. Add Normal Values (moved inside the loop and fixed scope)
      if (normalValues?.length) {
        const enrichedNormalValues = normalValues.map((nv) => ({
          ...nv,
          resultid: resultRecord.id,
        }));
        await NormalValue.bulkCreate(enrichedNormalValues, { transaction });
      }

      // 4. Add Mandatories (moved inside the loop and fixed scope)
      if (mandatories?.length) {
        const enrichedMandatories = mandatories.map((m) => ({
          ...m,
          resultid: resultRecord.id,
        }));
        await Mandatory.bulkCreate(enrichedMandatories, { transaction });
      }

      // 5. Add Reflex Tests (moved inside the loop and fixed scope)
      if (reflexTests?.length) {
        const enrichedReflexTests = reflexTests.map((r) => ({
          ...r,
          resultid: resultRecord.id,
        }));
        await ReflexTest.bulkCreate(enrichedReflexTests, { transaction });
      }
    }

    await transaction.commit();
    res.status(201).json({ message: "Investigation created successfully" });
  } catch (err) {
    await transaction.rollback();
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      // Extract detailed messages
      const validationErrors = err.errors.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    console.error("Error creating investigation:", err);
    res.status(500).json({
      message: "Internal server error",
      error: "SERVER_ERROR",
    });
  }
};

// 2. Get Test
const getTest = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Investigation.findAndCountAll({
      attributes: { exclude: ["departmentId"] },
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id","dptname"],
        },
        {
          model: ReportType,
          as: "reporttype",
          attributes: ["id","reporttype","reportdescription","entrytype","entryvalues"],
        },

        {
          model: InvestigationResult,
          as: "results",
          include: [
            {
              model: NormalValue,
              as: "normalValues",
            },
            {
              model: Mandatory,
              as: "mandatories",
            },
            {
              model: ReflexTest,
              as: "reflexTests",
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
      distinct: true,
      // col: "id",
      order: [["testname","ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    if (!rows) {
      return res
        .status(200)
        .json({ message: "No records found", data: [], meta: {} });
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
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 3. Get Test By Test by Id
const getTestById = async (req, res) => {
  try {
    const testId = req.params.id;
    if (!testId) {
      return res.status(400).json({ message: "Test ID is required" });
    }

    const test = await Investigation.findByPk(testId, {
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id","dptname"],
        },
        {
          model: ReportType,
          as: "reporttype",
          attributes: ["id","reporttype","reportdescription","entrytype","entryvalues"],
        },

        {
          model: InvestigationResult,
          as: "results",
          include: [
            {
              model: NormalValue,
              as: "normalValues",
            },
            {
              model: Mandatory,
              as: "mandatories",
            },
            {
              model: ReflexTest,
              as: "reflexTests",
            },
          ],
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

// 4. Update Investigation
const updateInvestigation = async (req, res) => {
  const t = await Investigation.sequelize.transaction();
  try {
    const { id } = req.params;

    if (!id) {
      await t.rollback();
      return res.status(400).json({ message: "Investigation ID is required" });
    }

    // Update investigation
    await Investigation.update(req.body, {
      where: { id },
      transaction: t,
    });
    await t.commit();
    res.status(200).json({
      message: "Investigation updated successfully",
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({
      message: `Error updating investigation: ${err}`,
    });
  }
};

// 5. Update Results
// Route: PUT /investigations/:investigationId/results/:resultId
const updateSingleResult = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { investigationId, resultId } = req.params;
    const updateData = req.body; // No ID needed in body

    const investigation = await Investigation.findByPk(investigationId, {
      transaction,
    });
    if (!investigation) {
      await transaction.rollback();
      return res.status(404).json({ message: "Investigation not found" });
    }

    const [updatedRowsCount] = await InvestigationResult.update(updateData, {
      where: {
        id: resultId,
        investigationid: investigationId,
      },
      transaction,
    });

    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Result not found" });
    }

    await transaction.commit();
    res.status(200).json({ message: "Result updated successfully" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Failed to update result" });
  }
};

// 7. Update NormalValues of the Result

const updateNormalValues = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { resultId, normalValueId } = req.params;
    const updateData = req.body;

    const result = await InvestigationResult.findByPk(resultId, {
      transaction,
    });
    if (!result) {
      await transaction.rollback();
      return res.status(404).json({ message: "Result not found" });
    }

    const [updatedRowsCount] = await NormalValue.update(updateData, {
      where: {
        id: normalValueId,
        resultid: resultId,
      },
      transaction,
    });

    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Normal value not found" });
    }
    await transaction.commit();
    res.status(200).json({ message: "Normal values update successfully" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: `Error saving normal values ${err}` });
  }
};

// 8. Update Reflex Test
const updateReflexTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { resultId, reflexId } = req.params;
    const updateData = req.body;

    const result = await InvestigationResult.findByPk(resultId, {
      transaction,
    });
    if (!result) {
      await transaction.rollback();
      return res.status(404).json({ message: "Result not found" });
    }

    const [updatedRowsCount] = await ReflexTest.update(updateData, {
      where: {
        id: reflexId,
        resultid: resultId,
      },
      transaction,
    });

    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Flex value not found" });
    }
    await transaction.commit();
    res.status(200).json({ message: "Flex values update successfully" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: `Error saving flex values ${err}` });
  }
};

// 9. Update Mandatory Flex Test

const updateMandatoryFlexTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { resultId, mandatoryFlexId } = req.params;
    const updateData = req.body;

    const result = await InvestigationResult.findByPk(resultId, {
      transaction,
    });
    if (!result) {
      await transaction.rollback();
      return res.status(404).json({ message: "Result not found" });
    }

    const [updatedRowsCount] = await Mandatory.update(updateData, {
      where: {
        id: mandatoryFlexId,
        resultid: resultId,
      },
      transaction,
    });

    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Mandatory Flex value not found" });
    }
    await transaction.commit();
    res
      .status(200)
      .json({ message: "Mandatory Flex values update successfully" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: `Error saving flex values ${err}` });
  }
};

// 10. Search Investigations

const searchInvestigations = async (req, res) => {
  try {
    const { q } = req.query;
    const filters = {};

    if (q) {
      const num = parseInt(q, 10);

      // short inputs (1–2 chars) → starts-with, longer → contains
      const short = q.length <= 2;
      const pattern = short ? `${q}%` : `%${q}%`;

      filters[Op.or] = [
        // case-insensitive match for text fields
        { testname: { [Op.iLike]: pattern } },
        // exact numeric matches only (no LIKE)
        ...(isNaN(num) ? [] : [{ shortcode: num }]),
      ];
    }

    const inv = await Investigation.findAll({
      where: filters,
       include: [
        {
          model: Department,
          as: "department",
          attributes: ["id","dptname"],
        },
        {
          model: ReportType,
          as: "reporttype",
          attributes: ["id","reporttype","reportdescription","entrytype","entryvalues"],
        },

        {
          model: InvestigationResult,
          as: "results",
          include: [
            {
              model: NormalValue,
              as: "normalValues",
            },
            {
              model: Mandatory,
              as: "mandatories",
            },
            {
              model: ReflexTest,
              as: "reflexTests",
            },
          ],
        },
      ],

      order: [["testname", "ASC"]],
    });

    if (inv.length === 0) {
      return res.status(404).json({ message: "No matching test found." });
    }

    res.status(200).json(inv);
  } catch (err) {
    res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

module.exports = {
  addTest,
  getTest,
  getTestById,
  updateInvestigation,
  updateNormalValues,
  updateSingleResult,
  updateReflexTest,
  updateMandatoryFlexTest,
  searchInvestigations,
};
