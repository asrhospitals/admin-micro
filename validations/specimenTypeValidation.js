const Joi = require("joi");

const specimenTypeSchema = Joi.object({
  specimenname: Joi.string().required(),
  specimendes: Joi.string().required(),
  isactive: Joi.boolean().required(),
});

module.exports = { specimenTypeSchema };
