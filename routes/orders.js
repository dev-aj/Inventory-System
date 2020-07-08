const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

//For DB
const util = require('util');
const { connectDB, conn } = require('../config/db');
const query = util.promisify(conn.query).bind(conn);

//@route /api/stock/add
//@desc add new item to the stock
//@access private

router.post(
  '/add',
  [
    auth,
    [
      check('item_name', 'Item Name is required').not().isEmpty(),
      check('quantity', 'Quantity is required').not().isEmpty(),
      check('rate', 'Price(Rate) is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const data = ({ item_name, quantity, rate } = req.body);

    try {
      const ifExist = await query(
        `Select count(*) as len from stock where Lower(item_name) = LOWER('${item_name}')`
      );
      if (ifExist[0].len > 0) {
        // return res.status(400).json({
        //   msg: 'Item Already Exist, Please Update or add another item',
        // });
        const update = `UPDATE stock SET quantity = ${quantity}, rate = ${rate} WHERE Lower(item_name) = LOWER('${item_name}')`;
        const result = await query(update);
        res.json('Item Updated Successfully');
      } else {
        const sql = 'INSERT INTO stock SET ?';
        const rows = await query(sql, data);

        console.log(rows);
        res.json('Item Added successfully');
      }
    } catch (err) {
      res.status(500).json('Server Error in adding Item');
    }
  }
);

//@route /api/order/
//@desc get all the items with their rate and quantity from stock.
//@access private

router.get('/', auth, async (req, res) => {
  try {
    const data = await query(
      `SELECT item_name, rate, quantity FROM stock where quantity > 0`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json('Server error in getting all the stocks');
  }
});

//@route /api/stock/delete/:id
//@desc remove the stock by id
//@access private

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const sql = `DELETE FROM stock WHERE item_id = ${req.params.id}`;
    const result = await query(sql);
    console.log(result);

    res.json('Item Removed Successfully');
  } catch (err) {
    res.status(500).json('Server error in updating the required item stock');
  }
});

//@route /api/stock/additem
//@desc add item names
//@access private (only for admins)

router.post(
  '/additem',
  [auth, [check('item_name', 'Item Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    if (req.user.user_type == 'admin') {
      try {
        const item_name = req.body.item_name;
        const ifExist = await query(
          `Select count(*) as len from stock where Lower(item_name) = LOWER('${item_name}')`
        );
        if (ifExist[0].len > 0) {
          return res.status(400).json({
            msg: 'Item Already Exist, Please Update or add another item',
          });
        }

        const sql = `insert into items (item_name) values ('${item_name}')`;
        const rows = await query(sql);

        //console.log(rows);
        res.json('Item Added successfully');
      } catch (error) {}
    }
  }
);

//@route /api/stock/getitems
//@desc get all the stock
//@access private

router.get('/getitems', auth, async (req, res) => {
  try {
    const data = await query(`SELECT item_name FROM items`);
    res.json(data);
  } catch (err) {
    res.status(500).json('Server error in getting all the items');
  }
});

module.exports = router;
