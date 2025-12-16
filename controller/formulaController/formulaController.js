const FormulaMaster=require("../../model/formulaModel/formula");
const sequelize=require("../../db/connectDB");

/* 1. Add Formula */
const createFormula = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Add a duplicate check
    const { formula_key, formula_name } = req.body;
    // Call the Model to check
    const checkFormulaKey = await FormulaMaster.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("formula_key")),
        formula_key.toLowerCase()
      ),
      t,
    });
    if (checkFormulaKey) {
      await t.rollback();
      return res.status(409).json({
        message: "Formula Key with this key already exists",
        error: "DUPLICATE_FORMULA_KEY",
      });
    }
    const checkFormulaName = await FormulaMaster.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("formula_name")),
        formula_name.toLowerCase()
      ),
      t,
    });
    if (checkFormulaName) {
      await t.rollback();
      return res.status(409).json({
        message: "Formula Name with this formula name already exists",
        error: "DUPLICATE_FORMULA_NAME",
      });
    }

    await FormulaMaster.create({
      user: req.user.username,
      t,
    });
      await t.commit();
    res.status(201).json({
      message: "Formula added successfully",
    });
  } catch (e) {
    await t.rollback();
    res.status(400).send({ message: `Something went wrong ${e}` });

  }
};

module.exports={createFormula}


