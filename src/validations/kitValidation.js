const Joi = require("joi");

const kitSchema = Joi.object({
  profilename: Joi.string().required(),
  manufacture: Joi.string().required(),
  kitname: Joi.string().required(),
  negetiveindex: Joi.string().required(),
  boderlineindex: Joi.string().required(),
  positiveindex: Joi.string().required(),
  method: Joi.string().required(),
  batchno: Joi.number().integer().required(),
  units: Joi.number().integer().required(),
  negetiveinterpret: Joi.string().required(),
  borderlineinterpret: Joi.string().required(),
  positiveinterpret: Joi.string().required(),
});

module.exports = { kitSchema };
