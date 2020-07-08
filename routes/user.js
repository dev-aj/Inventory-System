const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

//For DB
const util = require('util');
const { connectDB, conn } = require('../config/db');
const query = util.promisify(conn.query).bind(conn);

//@route /api/user/register
//@desc register route
//@access public

router.post(
  '/register',
  [
    check('empid', 'Employee Id is required').not().isEmpty(),
    check('name', 'Name is Required').not().isEmpty(),
    check('user_type', 'Please specify the type of user').not().isEmpty(),
    check('password', 'A minimum of 6 characters is required').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    let { empid, name, user_type, password, contact } = req.body;

    try {
      //Check if user already exist
      let user = await query(`SELECT * FROM userinfo WHERE emp_id='${empid}'`);
      if (user.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User Already exists',
            },
          ],
        });
      }

      let newUser = {
        emp_name: name,
        password,
        emp_id: empid,
        user_type,
        contact,
      };
      //Encrypt password
      let salt = await bcrypt.genSalt(10);

      newUser.password = await bcrypt.hash(password, salt);
      const sql = 'INSERT INTO userinfo SET ?';
      const rows = await query(sql, newUser);
      //return JWT Webtoken
      const payload = {
        user: {
          id: newUser.emp_id,
          user_type,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route /api/user/login
//@desc authentication user and get route
//@access public

router.post(
  '/login',
  [
    check('empid', 'Please Include a valid employee id').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { empid, password } = req.body;
    try {
      //Check if user already exist
      let user = await query(`SELECT * FROM userinfo WHERE emp_id='${empid}'`);
      if (user.length <= 0) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials',
            },
          ],
        });
      }

      //compare the password
      const isMatch = await bcrypt.compare(password, user[0].password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials',
            },
          ],
        });
      }

      //return JWT Webtoken
      const payload = {
        user: {
          id: user[0].emp_id,
          user_type: user[0].user_type,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route /api/user
//@desc get current user
//@access private
router.get('/', auth, async (req, res) => {
  try {
    const sql = `SELECT emp_id, emp_name, contact, user_type FROM userinfo WHERE emp_id = '${req.user.id}'`;
    const user = await query(sql);
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: 'Server Error',
    });
  }
});

module.exports = router;
