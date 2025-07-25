
const { z } = require('zod');

const email_validator = z
  .string({ message: "Invalid email format" })
  .email({ message: "Invalid email format" })
  .min(10, "Email should be not less than 10 characters")
  .max(25, "Email should not be more than 25 characters");

const password_validator = z
  .string({ message: "Invalid password format" })
  .min(8, "Password should be minimum 8 characters")
  .max(20, "Password should be maximum 20 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
  );

const cookie_validator = z
  .string({ message: "Invalid cookie format" })
  .min(8, "Cookie should be minimum 8 characters")
  .max(800, "Cookie should be maximum 800 characters")

const first_name_validator = z
  .string({ message: "Invalid last name format" })
  .min(3, "Cookie should be minimum 3 characters")
  .max(25, "First Name should be maximum 25 characters")

const last_name_validator = z
  .string({ message: "Invalid last name format" })
  .min(1, "Last Name should be minimum 1 characters")
  .max(25, "Last Name should be maximum 25 characters")

const username_validator = z
  .string({ message: "Invalid username format" })
  .min(5, "User name should be minimum 5 characters")
  .max(25, "Last Name should be maximum 25 characters")

const date_validator = z.preprocess(
  (arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      const parsed = new Date(arg);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  },
  z.date({ required_error: "Date of birth is required" })
);

const level_validator = z.coerce.number({
  required_error: "This field is required",
  invalid_type_error: "Value must be a number"
})
.int("Value must be an integer")
.refine((val) => [0, 1, 2, 3].includes(val), {
  message: "Value must be one of 0, 1, 2, or 3"
});

module.exports = {
  email_validator,
  password_validator,
  cookie_validator,
  first_name_validator,
  last_name_validator,
  username_validator,
  date_validator,
  level_validator
};
