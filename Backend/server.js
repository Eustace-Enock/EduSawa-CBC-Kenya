const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'edusawa',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS,
});

//  API ROUTES 

// Database Setup - Creates both materials and quizzes tables
app.get('/api/setup', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        subject VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subject VARCHAR(50),
        questions JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        quiz_id INTEGER REFERENCES quizzes(id),
        score INTEGER,
        completed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Adding sample quizzes
    const quizCount = await pool.query("SELECT COUNT(*) FROM quizzes");
    if (parseInt(quizCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO quizzes (title, subject, questions) VALUES 
        ('Grade 7 Mathematics - Numbers', 'Mathematics', 
         '[{"q":"What is 12 × 8?", "o":["86","96","106"], "a":1}, 
           {"q":"Solve 3x + 5 = 20", "o":["x=4","x=5","x=6"], "a":1}]'),
        ('Grade 7 Science - Photosynthesis', 'Science', 
         '[{"q":"What do plants need for photosynthesis?", "o":["Sunlight, water and carbon dioxide","Only water","Only sunlight"], "a":0}]')
        ON CONFLICT DO NOTHING;
      `);
    }

    res.json({ message: " All tables created successfully! Sample quizzes added." });
  } catch (err) {
    console.error("Setup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Real AI
app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return res.json({ reply: "GEMINI_API_KEY is missing in .env" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Edusawa AI, a helpful Kenyan CBC teacher. Answer simply. Question: ${prompt}` }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (e) {
    console.error("AI Error:", e.message);
    res.json({ reply: "AI temporarily unavailable." });
  }
});

// Materials Routes 
app.get('/api/materials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load materials" });
  }
});

app.post('/api/materials', async (req, res) => {
  const { title, content, subject } = req.body;
  try {
    await pool.query(
      'INSERT INTO materials (title, content, subject) VALUES ($1, $2, $3)', 
      [title, content, subject || 'General']
    );
    res.json({ success: true, message: "Material uploaded successfully!" });
  } catch (err) {
    console.error("Materials POST Error:", err.message);
    res.status(500).json({ error: "Failed to upload material" });
  }
});

// QUIZ ROUTES 

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, subject, questions FROM quizzes');
    res.json(result.rows);
  } catch (err) {
    console.error("Quizzes GET Error:", err.message);
    res.status(500).json({ error: "Failed to load quizzes" });
  }
});

// Submit quiz score
app.post('/api/quizzes', async (req, res) => {
  const { title, subject, questions } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO quizzes (title, subject, questions) VALUES ($1, $2, $3) RETURNING *',
      [title, subject, questions]
    );
    res.json({ success: true, quiz: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload quiz" });
  }
});

// Get user progress (demo)
app.get('/api/progress', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.score, p.completed_at, q.title 
      FROM progress p 
      JOIN quizzes q ON p.quiz_id = q.id 
      ORDER BY p.completed_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load progress" });
  }
});

// CATCH-ALL.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(` Edusawa running on http://localhost:${PORT}`);
});