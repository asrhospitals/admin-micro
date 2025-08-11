const Investigation = require("../../../model/adminModel/masterModel/investigation");
const InvestigationResult=require('../../../model/adminModel/masterModel/investigationResult');
const NormalValue=require('../../../model/adminModel/masterModel/normalValue');

/// Add Test

const addTest=async (req,res) => {
    const t = await Investigation.sequelize.transaction();
  try {
    const { results, ...investigationData } = req.body;


    // 1. Create The Investigation
    const investigation = await Investigation.create(investigationData, { transaction: t });

    // Step 2: Add Investigation Results
    for (const result of results) {
      const { normalValues, ...resultData } = result;

      const resultRecord = await InvestigationResult.create(
        { ...resultData, investigationId: investigation.id },
        { transaction: t }
      );


      // Step 3: Add Normal Values
      if (normalValues?.length) {
        const enriched = normalValues.map(nv => ({ ...nv, resultId: resultRecord.id }));
        await NormalValue.bulkCreate(enriched, { transaction: t });
      }
    }

    await t.commit();
    res.status(201).json({ message: "Investigation created successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: `Error creating investigation ${err}` });
  }
  
}


//Get Test

const getTest = async (req, res) => {
  try {
    const newTest = await Investigation.findAll({
      include:[
        {
          model:InvestigationResult,
          as:"results",
          include:[
            {
                model: NormalValue, as: "normalValues" ,
            }
          ]

        }
      ]
    });
    res.status(200).json(newTest);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

//Get Test By Test Code

const getTestByCode = async (req, res) => {
  try {
    const testCode = req.params.testcode;
    if (!testCode) {
      return res.status(400).json({ message: "Test code is required" });
    }
    const newTest = await Investigation.findOne({
      where: { testcode: testCode },
    });
    if (!newTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(newTest);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

/// Update Investigation
const updateInvestigation = async (req, res) => {
  const t = await Investigation.sequelize.transaction();
  try {
    const { id } = req.params;
  

    // Validate investigation ID
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
      investigationId: id
    });

  } catch (err) {
    await t.rollback();
    res.status(500).json({ 
      message: `Error updating investigation: ${err}`
    });
  }
};

// Update Results
const updateResults = async (req, res) => {
  const t = await InvestigationResult.sequelize.transaction();
  try {
    const { id: investigationId } = req.params; // Get investigation ID from URL
    const { results = [] } = req.body;

    // Validate investigation ID
    if (!investigationId) {
      await t.rollback();
      return res.status(400).json({ message: "Investigation ID is required" });
    }

    if (!Array.isArray(results) || results.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Results array is required" });
    }

    // Verify investigation exists
    const investigation = await Investigation.findByPk(investigationId, { transaction: t });
    if (!investigation) {
      await t.rollback();
      return res.status(404).json({ message: "Investigation not found" });
    }

  

    // Process each result
    for (const result of results) {
      const { id: resultId, ...resultData } = result;
      
      if (resultId) {
        console.log(`Updating Result ID: ${resultId} for Investigation: ${investigationId}`);
        
        // Update result only if it belongs to this investigation
         await InvestigationResult.update(resultData, {
          where: { 
            id: resultId,
            investigationId: investigationId // Ensure result belongs to this investigation
          },
          transaction: t,
        });
        
       
      } 
    }

    await t.commit();
    res.status(200).json({ 
      message: "Results updated successfully",
     
    });

  } catch (err) {
    await t.rollback();
    console.error('Error updating results:', err);
    res.status(500).json({ 
      message: `Error updating results: ${err.message}`
    });
  }
};
















// Update NormalValues of the Result

const updateNormalValues = async (req, res) => {
  const t = await NormalValue.sequelize.transaction();
  try {
    const { id: resultId } = req.params;
    const { normalValues } = req.body;

    for (const normal of normalValues) {
      if (normal.id) {
        // 1. Update existing
        await NormalValue.update(normal, {
          where: { id: normal.id },
          transaction: t,
        });
      } else {
        // 2. Add new
        await NormalValue.create({ ...normal, resultId }, { transaction: t });
      }
    }

    await t.commit();
    res.status(200).json({ message: "Normal values update successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: `Error saving normal values ${err}` });
  }
};



module.exports = { addTest, getTest, updateInvestigation, updateNormalValues,getTestByCode,updateResults };
