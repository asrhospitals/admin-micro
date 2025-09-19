const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(30).required(),
  // role: Joi.string()
  //   .valid("admin", "reception", "doctor", "technician", "phlebotomist", "hr")
  //   .required(),
  module: Joi.array().items(Joi.string()).required(),
  role: Joi.number().integer().required(),
  first_name: Joi.string().max(50).optional(),
  last_name: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  isactive: Joi.boolean().required(),
  hospital_id: Joi.number().integer().optional().allow(null),
  nodal_id: Joi.number().integer().optional().allow(null),
  doctor_id: Joi.number().integer().optional().allow(null),
  technician_id: Joi.number().integer().optional().allow(null),
  reception_id: Joi.number().integer().optional().allow(null),
  phlebotomist_id: Joi.number().integer().optional().allow(null),
});

module.exports = { userSchema };
