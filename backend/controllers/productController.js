const db = require('../config/db');


const getAllProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products' });
    res.json(results);
  });
};


const addProduct = (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query(
    'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
    [name, description, price],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add product' });
      res.status(201).json({ message: 'Product added', productId: result.insertId });
    }
  );
};


const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  db.query(
    'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
    [name, description, price, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update product' });
      res.json({ message: 'Product updated' });
    }
  );
};


const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete product' });
    res.json({ message: 'Product deleted' });
  });
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};

