const express = require('express');
const {
  getAllInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', getAllInventory);

router.post('/', addInventory);

router.put('/:id', updateInventory);

router.delete('/:id', deleteInventory);

module.exports = router;
