const sequelize = require("../../../db/connectDB");
const Investigation = require("../../../model/adminModel/masterModel/investigation");
const InvestigationResult = require("../../../model/adminModel/masterModel/investigationResult");
const NormalValue = require("../../../model/adminModel/masterModel/normalValue");
const Mandatory = require("../../../model/adminModel/masterModel/mandatory");
const ReflexTest = require("../../../model/adminModel/masterModel/reflexTest");
const Department = require("../../../model/adminModel/masterModel/departmentMaster");

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

    // 1. Create The Investigation
    const investigation = await Investigation.create(investigationData, {
      transaction,
    });

    // Step 2: Add Investigation Results
    for (const result of results) {
      const { normalValues, mandatories, reflexTests, ...resultData } = result;

      // Create investigation result
      const resultRecord = await InvestigationResult.create(
        { ...resultData, investigationId: investigation.id },
        { transaction }
      );

      // 3. Add Normal Values (moved inside the loop and fixed scope)
      if (normalValues?.length) {
        const enrichedNormalValues = normalValues.map((nv) => ({
          ...nv,
          resultId: resultRecord.id,
        }));
        await NormalValue.bulkCreate(enrichedNormalValues, { transaction });
      }

      // 4. Add Mandatories (moved inside the loop and fixed scope)
      if (mandatories?.length) {
        const enrichedMandatories = mandatories.map((m) => ({
          ...m,
          resultId: resultRecord.id,
        }));
        await Mandatory.bulkCreate(enrichedMandatories, { transaction });
      }

      // 5. Add Reflex Tests (moved inside the loop and fixed scope)
      if (reflexTests?.length) {
        const enrichedReflexTests = reflexTests.map((r) => ({
          ...r,
          resultId: resultRecord.id,
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
          attributes: ["dptname"],
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
      col: "id",
      order: [["id", "ASC"]],
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
        investigationId: investigationId,
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
        resultId: resultId,
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

module.exports = {
  addTest,
  getTest,
  getTestById,
  updateInvestigation,
  updateNormalValues,
  updateSingleResult,
};
