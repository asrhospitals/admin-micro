const Investigation = require("../../../model/adminModel/masterModel/investigation");
const InvestigationResult=require('../../../model/adminModel/masterModel/investigationResult');
const NormalValue=require('../../../model/adminModel/masterModel/normalValue');

/// Add Test

const addTest=async (req,res) => {
    const t = await Investigation.sequelize.transaction();
  try {
    const { results, ...investigationData } = req.body;

    const investigation = await Investigation.create(investigationData, { transaction: t });

    for (const result of results) {
      const { normalValues, ...resultData } = result;
      const resultRecord = await InvestigationResult.create(
        { ...resultData, investigationId: investigation.id },
        { transaction: t }
      );

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
    const newTest = await PatientTest.findOne({
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

/// Update Test

const updateTest = async (req, res) => {
  try {
    const id = req.params.id;
    const newTest = await PatientTest.findByPk(id);
    newTest.update(req.body);
    res.json(newTest);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${error}` });
  }
};

module.exports = { addTest, getTest, updateTest, getTestByCode };
