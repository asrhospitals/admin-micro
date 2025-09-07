const Joi = require("joi");

const reportTypeSchema = Joi.object({
  reporttype: Joi.string().required(),
  reportdescription: Joi.string().required(),
  entrytype: Joi.string().required(),
  entryvalues: Joi.array().items(Joi.string()).default([]),
  isactive: Joi.boolean().required(),
});

module.exports = { reportTypeSchema };
