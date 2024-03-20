import { body, param } from "express-validator";

export const loginValidator = [
    body('email', 'Invalid does not Empty').not().isEmpty(),
    body('deviceToken', 'Invalid does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 8, max: 32}),
  ]
  
  export const registerValidator = [
    body('username', 'username does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('firstname', 'firstname is required').not().isEmpty(),
    body('password', 'password does not Empty').not().isEmpty(),
    body('password', 'The minimum password length is 8 characters').isLength({min: 8, max: 32}),
  ]