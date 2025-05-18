const db = require('../config/db');

const getAllCategories = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch categories' });
    res.json(results);
  });
};
const addCategory = (req, res) => {
  const { name, note } = req.body;

  if (!name || !note) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query(
    'INSERT INTO categories (name, note) VALUES (?, ?)',
    [name, note],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add category' });
      res.status(201).json({ message: 'Category added', categoryId: result.insertId });
    }
  );
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, note } = req.body;

  db.query(
    'UPDATE categories SET name = ?, note = ? WHERE id = ?',
    [name, note, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update category' });
      res.json({ message: 'Category updated' });
    }
  );
};

const deleteCategory = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete category' });
    res.json({ message: 'Category deleted' });
  });
};

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
