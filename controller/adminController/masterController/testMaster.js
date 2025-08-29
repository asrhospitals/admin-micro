const sequelize = require("../../../db/connectDB");
const Investigation = require("../../../model/adminModel/masterModel/investigation");
const InvestigationResult = require("../../../model/adminModel/masterModel/investigationResult");
const NormalValue = require("../../../model/adminModel/masterModel/normalValue");

// 1. Add Test

const addTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { results, ...investigationData } = req.body;

    // 1. Create The Investigation
    const investigation = await Investigation.create(investigationData, {
      transaction,
    });

    // Step 2: Add Investigation Results
    for (const result of results) {
      const { normalValues, ...resultData } = result;

      const resultRecord = await InvestigationResult.create(
        { ...resultData, investigationId: investigation.id },
        { transaction }
      );

      // Step 3: Add Normal Values
      if (normalValues?.length) {
        const enriched = normalValues.map((nv) => ({
          ...nv,
          resultId: resultRecord.id,
        }));
        await NormalValue.bulkCreate(enriched, { transaction });
      }
    }

    await transaction.commit();
    res.status(201).json({ message: "Investigation created successfully" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: `Error creating investigation ${err}` });
  }
};

// 2. Get Test

const getTest = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { count, rows } = await Investigation.findAndCountAll({
      include: [
        {
          model: InvestigationResult,
          as: "results",
          include: [
            {
              model: NormalValue,
              as: "normalValues",
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
      return res.status(200).json({ message: "No records found" });
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

    const investigation = await Investigation.findByPk(investigationId, { transaction });
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

      const result = await InvestigationResult.findByPk(resultId, { transaction });
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
