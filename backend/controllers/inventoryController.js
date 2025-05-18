const db = require('../config/db');

const getAllInventory = (req, res) => {
  db.query('SELECT * FROM inventory', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch inventory' });
    res.json(results);
  });
};

const addInventory = (req, res) => {
  const { product_id, quantity, location } = req.body;

  if (product_id == null || quantity == null || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query(
    'INSERT INTO inventory (product_id, quantity, location) VALUES (?, ?, ?)',
    [product_id, quantity, location],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add inventory' });
      res.status(201).json({ message: 'Inventory added', inventoryId: result.insertId });
    }
  );
};

const updateInventory = (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, location } = req.body;

  if (product_id == null || quantity == null || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query(
    'UPDATE inventory SET product_id = ?, quantity = ?, location = ? WHERE id = ?',
    [product_id, quantity, location, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update inventory' });
      res.json({ message: 'Inventory updated' });
    }
  );
};

const deleteInventory = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM inventory WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete inventory' });
    res.json({ message: 'Inventory deleted' });
  });
};

module.exports = {
  getAllInventory,
  addInventory,
  updateInventory,
  deleteInventory,
};
