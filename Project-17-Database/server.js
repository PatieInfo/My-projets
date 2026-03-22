const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ── CREATE ────────────────────────────────────────────────────────────────────
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, category } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  try {
    const result = db.prepare(
      'INSERT INTO contacts (name, email, phone, category) VALUES (@name, @email, @phone, @category)'
    ).run({ name, email, phone: phone || null, category: category || 'personal' });

    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch {
    res.status(409).json({ success: false, error: 'Email already exists.' });
  }
});

// ── READ ALL ──────────────────────────────────────────────────────────────────
app.get('/api/contacts', (req, res) => {
  const { category, search } = req.query;
  const conditions = [];
  const params = {};

  if (category && category !== 'all') {
    conditions.push('category = @category');
    params.category = category;
  }

  if (search) {
    conditions.push('(name LIKE @search OR email LIKE @search)');
    params.search = `%${search}%`;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const contacts = db.prepare(
    `SELECT * FROM contacts ${where} ORDER BY created DESC`
  ).all(params);

  res.json({ success: true, total: contacts.length, contacts });
});

// ── READ ONE ──────────────────────────────────────────────────────────────────
app.get('/api/contacts/:id', (req, res) => {
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);

  if (!contact) {
    return res.status(404).json({ success: false, error: 'Contact not found.' });
  }

  res.json({ success: true, contact });
});

// ── UPDATE ────────────────────────────────────────────────────────────────────
app.put('/api/contacts/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);

  if (!existing) {
    return res.status(404).json({ success: false, error: 'Contact not found.' });
  }

  const { name, email, phone, category } = req.body;

  try {
    db.prepare(`
      UPDATE contacts
      SET name = @name, email = @email, phone = @phone, category = @category
      WHERE id = @id
    `).run({
      name:     name     ?? existing.name,
      email:    email    ?? existing.email,
      phone:    phone    ?? existing.phone,
      category: category ?? existing.category,
      id: req.params.id,
    });

    res.json({ success: true, message: 'Contact updated.' });
  } catch {
    res.status(409).json({ success: false, error: 'Email already exists.' });
  }
});

// ── DELETE ────────────────────────────────────────────────────────────────────
app.delete('/api/contacts/:id', (req, res) => {
  const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, error: 'Contact not found.' });
  }

  res.json({ success: true, message: 'Contact deleted.' });
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/contacts`);
});
