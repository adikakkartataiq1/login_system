const { z } = require('zod');

const number_validator = z.coerce.number({
  required_error: "This field is required",
  invalid_type_error: "Value must be a number"
});

const bearer_token_validator = z
  .string()
  .regex(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/, {
    message: "Invalid or missing Authorization token",
  })
   .max(800, "Filename must be less than 800 characters");

module.exports = {
  number_validator,
  bearer_token_validator
};
