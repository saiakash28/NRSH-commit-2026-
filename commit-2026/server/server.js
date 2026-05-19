const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.sqlite');
let db;

app.use(cors());
app.use(express.json());

// Initialize Database connection and Tables schemas
async function initDb() {
  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  // Enable foreign key cascades support
  await db.run('PRAGMA foreign_keys = ON');

  // Create relational SQL Schemas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      branch TEXT,
      year TEXT,
      password TEXT,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      title TEXT,
      content TEXT,
      urgency TEXT,
      deadline TEXT,
      tags TEXT, -- JSON array string
      upvotes INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      author TEXT,
      credibilityScore INTEGER DEFAULT 0,
      confirmedCount INTEGER DEFAULT 0,
      outdatedCount INTEGER DEFAULT 0,
      misleadingCount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipId INTEGER,
      author TEXT,
      text TEXT,
      FOREIGN KEY(tipId) REFERENCES tips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      message TEXT,
      time TEXT,
      read INTEGER DEFAULT 0,
      type TEXT
    );

    CREATE TABLE IF NOT EXISTS reminders (
      tipId INTEGER PRIMARY KEY,
      email TEXT,
      time TEXT
    );
  `);

  // Self-healing migration for existing databases: Ensure password column exists
  try {
    await db.run('ALTER TABLE users ADD COLUMN password TEXT');
  } catch (err) {
    // Column already exists, ignore safely
  }

  // Self-healing migration: Ensure avatar column exists
  try {
    await db.run('ALTER TABLE users ADD COLUMN avatar TEXT');
  } catch (err) {
    // Column already exists, ignore safely
  }

  // Set default passwords for pre-existing records to ensure login stability
  try {
    await db.run("UPDATE users SET password = 'password123' WHERE password IS NULL");
  } catch (err) {
    console.error('Password update migration error:', err);
  }
  // Self-healing migration: Set credibility score to 0 for any tip that has zero verification votes
  try {
    await db.run('UPDATE tips SET credibilityScore = 0 WHERE confirmedCount = 0 AND outdatedCount = 0 AND misleadingCount = 0');
  } catch (err) {
    console.error('Credibility score self-healing migration error:', err);
  }
  // Auto-seed database if fresh
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('🌱 Seeding freshly created SQLite relational tables...');

    // Seed default user profiles
    await db.run('INSERT INTO users (name, email, branch, year, password, avatar) VALUES (?, ?, ?, ?, ?, ?)', 
      'Akash Test', 'akash@university.edu', 'CSE', '1', 'password123', '');
    await db.run('INSERT INTO users (name, email, branch, year, password, avatar) VALUES (?, ?, ?, ?, ?, ?)', 
      'Jane Doe', 'student@university.edu', 'CSE', '4', 'password123', '');

    // Seed default activity logs
    await db.run('INSERT INTO notifications (title, message, time, read, type) VALUES (?, ?, ?, ?, ?)',
      'Post Confirmed! ✅', 'Your tip on "Goldman Sachs Mock Interviews" has been confirmed by 5 senior peers.', '2 hours ago', 0, 'confirm');
    await db.run('INSERT INTO notifications (title, message, time, read, type) VALUES (?, ?, ?, ?, ?)',
      'Upcoming Deadline ⚠️', 'Reminder: The application for "Google STEP Program" closes in 2 days.', '5 hours ago', 0, 'deadline');
    await db.run('INSERT INTO notifications (title, message, time, read, type) VALUES (?, ?, ?, ?, ?)',
      'New Scholarship Alert 🎓', 'A new scholarship "First-Gen STEM Grant" was posted for CSE students.', '1 day ago', 1, 'info');

    // Seed default posts
    const initialTips = [
      {
        category: 'Internship',
        title: 'Google STEP Program closing in 2 days!',
        content: 'If you are a sophomore or freshman, apply now! They care more about your data structures knowledge than past experience. Make sure to use the XYZ referral trick if possible.',
        urgency: 'high',
        deadline: 'Oct 15, 2026',
        tags: ['#CS', '#Google', '#Sophomore'],
        upvotes: 245,
        verified: 1,
        author: 'Final Year CSE Senior',
        credibilityScore: 87,
        confirmedCount: 24,
        outdatedCount: 2,
        misleadingCount: 1,
        comments: [
          { author: 'Alex_ECE', text: 'Apply fast! The server gets super slow on the last day.' },
          { author: 'Rahul_Kumar', text: 'Does this require any prior internship experience?' }
        ]
      },
      {
        category: 'Academics',
        title: 'Avoid Prof. Smith for Intro to Algorithms',
        content: 'The syllabus looks easy but his exams test edge cases not covered in class. Take Prof. Johnson instead if you want to save your GPA.',
        urgency: 'med',
        deadline: 'Registration: Nov 1',
        tags: ['#CS101', '#CourseReg'],
        upvotes: 189,
        verified: 1,
        author: 'Junior Year IT Student',
        credibilityScore: 92,
        confirmedCount: 18,
        outdatedCount: 0,
        misleadingCount: 0,
        comments: [
          { author: 'CS_Junior', text: 'Completely agree, his midterms are brutal.' }
        ]
      },
      {
        category: 'Scholarship',
        title: 'First-Gen STEM Grant Application Open',
        content: 'Not many people know about this departmental grant. It covers textbooks for the whole year. You just need a short essay about your background.',
        urgency: 'low',
        deadline: 'Dec 1, 2026',
        tags: ['#Funding', '#FirstGen', '#STEM'],
        upvotes: 88,
        verified: 0,
        author: 'Alumni (Class of 2024)',
        credibilityScore: 45,
        confirmedCount: 3,
        outdatedCount: 12,
        misleadingCount: 8,
        comments: []
      },
      {
        category: 'Campus Life',
        title: 'Free dinner and study spaces at the Student Union tonight!',
        content: 'The Student Union is hosting an late-night study jam tonight from 8 PM to midnight. They have free pizza, coffee, and quiet study areas. Perfect if your dorm is too noisy!',
        urgency: 'low',
        deadline: 'Tonight: 8 PM',
        tags: ['#CampusLife', '#FreeFood', '#StudyJam'],
        upvotes: 112,
        verified: 1,
        author: 'Sophomore Peer Leader',
        credibilityScore: 89,
        confirmedCount: 19,
        outdatedCount: 0,
        misleadingCount: 0,
        comments: [
          { author: 'Freshie_01', text: 'Is there a vegetarian option?' }
        ]
      },
      {
        category: 'Club',
        title: 'Robotics Club info session and project showcase',
        content: 'Looking to join a tech club? The Robotics Club is having an info session in Room 302. No prior coding experience required—they train you from scratch. Plus, you get to work on actual competition bots!',
        urgency: 'med',
        deadline: 'Session: Oct 20',
        tags: ['#Clubs', '#Robotics', '#Tech'],
        upvotes: 95,
        verified: 1,
        author: 'Robotics Lead',
        credibilityScore: 95,
        confirmedCount: 15,
        outdatedCount: 1,
        misleadingCount: 0,
        comments: [
          { author: 'Alex_ECE', text: 'Can freshman join the competition team right away?' }
        ]
      },
      {
        category: 'Placement',
        title: 'Mock Interviews with Goldman Sachs Alumni next week!',
        content: 'Career services just launched the registration portal for mock interviews with Goldman Sachs and JPMorgan alumni. Slots are super limited, so register on Handshake today. They give brilliant resume feedback!',
        urgency: 'high',
        deadline: 'Register by Oct 18',
        tags: ['#Finance', '#Placement', '#MockInterviews'],
        upvotes: 310,
        verified: 1,
        author: 'Placement Coordinator',
        credibilityScore: 98,
        confirmedCount: 34,
        outdatedCount: 0,
        misleadingCount: 0,
        comments: [
          { author: 'Jane Doe (You)', text: 'Just registered! The slots are filling up fast!' }
        ]
      },
      {
        category: 'Research',
        title: 'Undergrad Research Positions in AI Lab (Prof. Lee)',
        content: 'Prof. Lee is looking for 2 undergraduate research assistants to help with data cleaning and model training in the NLP lab. Paid position or course credit. Send your resume and transcript to his email.',
        urgency: 'high',
        deadline: 'Apply by Oct 25',
        tags: ['#Research', '#AI', '#NLP'],
        upvotes: 142,
        verified: 0,
        author: 'PhD Assistant (NLP Lab)',
        credibilityScore: 78,
        confirmedCount: 11,
        outdatedCount: 2,
        misleadingCount: 1,
        comments: []
      }
    ];

    for (const t of initialTips) {
      const result = await db.run(`
        INSERT INTO tips (category, title, content, urgency, deadline, tags, upvotes, verified, author, credibilityScore, confirmedCount, outdatedCount, misleadingCount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, t.category, t.title, t.content, t.urgency, t.deadline, JSON.stringify(t.tags), t.upvotes, t.verified, t.author, t.credibilityScore, t.confirmedCount, t.outdatedCount, t.misleadingCount);
      
      const newTipId = result.lastID;
      for (const c of t.comments) {
        await db.run('INSERT INTO comments (tipId, author, text) VALUES (?, ?, ?)', newTipId, c.author, c.text);
      }
    }
    console.log('🌱 SQLite relational seeding completed successfully.');
  }
}

// REST API Endpoints

// 1. Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, branch, year, password, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const existingUser = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered. Please login instead.' });
    }

    const result = await db.run(`
      INSERT INTO users (name, email, branch, year, password, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `, name || 'Jane Doe', email, branch || 'CSE', year || '4', password || 'password123', avatar || '');

    const newUser = {
      id: result.lastID,
      name: name || 'Jane Doe',
      email,
      branch: branch || 'CSE',
      year: year || '4',
      avatar: avatar || ''
    };
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Registration query error:', err);
    res.status(500).json({ error: 'Database execution failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email.toLowerCase());
    if (user) {
      if (user.password === password) {
        res.json(user);
      } else {
        res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }
    } else {
      res.status(404).json({ error: 'Email address not found. Please register first.' });
    }
  } catch (err) {
    console.error('Login query error:', err);
    res.status(500).json({ error: 'Database verification failed' });
  }
});

app.put('/api/users/profile', async (req, res) => {
  const { email, name, branch, year, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required to update profile.' });
  }

  try {
    await db.run(`
      UPDATE users
      SET name = ?, branch = ?, year = ?, avatar = ?
      WHERE LOWER(email) = ?
    `, name, branch, year, avatar, email.toLowerCase());

    const updatedUser = await db.get('SELECT id, name, email, branch, year, avatar FROM users WHERE LOWER(email) = ?', email.toLowerCase());
    res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update user profile:', err);
    res.status(500).json({ error: 'Database profile update failed' });
  }
});

app.get('/api/users/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await db.get('SELECT id, name, email, branch, year, avatar FROM users WHERE LOWER(email) = ?', email.toLowerCase());
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 2. Feed / Tips routes
app.get('/api/tips', async (req, res) => {
  try {
    const tipsList = await db.all('SELECT * FROM tips ORDER BY id DESC');
    const commentsList = await db.all('SELECT * FROM comments');

    const formatted = tipsList.map(t => ({
      ...t,
      tags: JSON.parse(t.tags || '[]'),
      verified: t.verified === 1,
      comments: commentsList.filter(c => c.tipId === t.id)
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Fetching tips error:', err);
    res.status(500).json({ error: 'Database retrieval failed' });
  }
});

app.post('/api/tips', async (req, res) => {
  const { category, title, content, urgency, deadline, tags, author } = req.body;

  try {
    const result = await db.run(`
      INSERT INTO tips (category, title, content, urgency, deadline, tags, author)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, category || 'General', title, content || '', urgency || 'low', deadline || 'TBA', JSON.stringify(tags || []), author || 'Jane Doe (You)');

    const newTip = {
      id: result.lastID,
      category: category || 'General',
      title,
      content: content || '',
      urgency: urgency || 'low',
      deadline: deadline || 'TBA',
      tags: tags || [],
      upvotes: 0,
      verified: false,
      author: author || 'Jane Doe (You)',
      credibilityScore: 0,
      confirmedCount: 0,
      outdatedCount: 0,
      misleadingCount: 0,
      comments: []
    };
    res.status(201).json(newTip);
  } catch (err) {
    console.error('Creating tip error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// 3. Peer Verification votes
app.post('/api/tips/:id/vote', async (req, res) => {
  const tipId = parseInt(req.params.id);
  const { type, prevVote } = req.body;

  try {
    const tip = await db.get('SELECT * FROM tips WHERE id = ?', tipId);
    if (!tip) {
      return res.status(404).json({ error: 'Tip not found.' });
    }

    let confirmed = tip.confirmedCount;
    let outdated = tip.outdatedCount;
    let misleading = tip.misleadingCount;

    // Decrement previous vote count
    if (prevVote === 'confirm') confirmed = Math.max(0, confirmed - 1);
    if (prevVote === 'outdate') outdated = Math.max(0, outdated - 1);
    if (prevVote === 'mislead') misleading = Math.max(0, misleading - 1);

    // Increment new vote count
    if (type === 'confirm') confirmed += 1;
    if (type === 'outdate') outdated += 1;
    if (type === 'mislead') misleading += 1;

    // Dynamically calculate credibility score
    let score = 0;
    const total = confirmed + outdated + misleading;
    if (total > 0) {
      score = Math.round((confirmed / total) * 100);
    }
    const verified = (score >= 75 && confirmed >= 5) ? 1 : 0;

    await db.run(`
      UPDATE tips
      SET confirmedCount = ?, outdatedCount = ?, misleadingCount = ?, credibilityScore = ?, verified = ?
      WHERE id = ?
    `, confirmed, outdated, misleading, score, verified, tipId);

    const updated = await db.get('SELECT * FROM tips WHERE id = ?', tipId);
    const comments = await db.all('SELECT * FROM comments WHERE tipId = ?', tipId);

    res.json({
      ...updated,
      tags: JSON.parse(updated.tags || '[]'),
      verified: updated.verified === 1,
      comments
    });
  } catch (err) {
    console.error('Voting error:', err);
    res.status(500).json({ error: 'Database update failed' });
  }
});

// 4. Comments
app.post('/api/tips/:id/comments', async (req, res) => {
  const tipId = parseInt(req.params.id);
  const { author, text } = req.body;

  try {
    await db.run('INSERT INTO comments (tipId, author, text) VALUES (?, ?, ?)',
      tipId, author || 'Jane Doe (You)', text || '');

    const updated = await db.get('SELECT * FROM tips WHERE id = ?', tipId);
    const comments = await db.all('SELECT * FROM comments WHERE tipId = ?', tipId);

    res.status(201).json({
      ...updated,
      tags: JSON.parse(updated.tags || '[]'),
      verified: updated.verified === 1,
      comments
    });
  } catch (err) {
    console.error('Comment insertion error:', err);
    res.status(500).json({ error: 'Comment creation failed' });
  }
});

app.delete('/api/tips/:id/comments/:commentId', async (req, res) => {
  const tipId = parseInt(req.params.id);
  const commentId = parseInt(req.params.commentId);

  try {
    await db.run('DELETE FROM comments WHERE id = ? AND tipId = ?', commentId, tipId);

    const updated = await db.get('SELECT * FROM tips WHERE id = ?', tipId);
    const comments = await db.all('SELECT * FROM comments WHERE tipId = ?', tipId);

    res.json({
      ...updated,
      tags: JSON.parse(updated.tags || '[]'),
      verified: updated.verified === 1,
      comments
    });
  } catch (err) {
    console.error('Comment deletion error:', err);
    res.status(500).json({ error: 'Comment deletion failed' });
  }
});

// CRUD: Delete a tip post
app.delete('/api/tips/:id', async (req, res) => {
  const tipId = parseInt(req.params.id);

  try {
    await db.run('DELETE FROM tips WHERE id = ?', tipId);
    // Also delete any reminders associated with this tip ID to avoid orphans
    await db.run('DELETE FROM reminders WHERE tipId = ?', tipId);
    res.json({ success: true, message: 'Tip deleted successfully' });
  } catch (err) {
    console.error('Tip deletion error:', err);
    res.status(500).json({ error: 'Tip deletion failed' });
  }
});

// CRUD: Update/Edit a tip post
app.put('/api/tips/:id', async (req, res) => {
  const tipId = parseInt(req.params.id);
  const { title, content, category, urgency, deadline } = req.body;

  try {
    await db.run(`
      UPDATE tips 
      SET title = ?, content = ?, category = ?, urgency = ?, deadline = ?
      WHERE id = ?
    `, title, content, category, urgency, deadline, tipId);

    const updated = await db.get('SELECT * FROM tips WHERE id = ?', tipId);
    const comments = await db.all('SELECT * FROM comments WHERE tipId = ?', tipId);

    res.json({
      ...updated,
      tags: JSON.parse(updated.tags || '[]'),
      verified: updated.verified === 1,
      comments
    });
  } catch (err) {
    console.error('Tip update error:', err);
    res.status(500).json({ error: 'Tip update failed' });
  }
});

// 5. Reminders
app.post('/api/tips/:id/reminder', async (req, res) => {
  const tipId = parseInt(req.params.id);
  const { email, dateTimeStr } = req.body;

  try {
    await db.run('INSERT OR REPLACE INTO reminders (tipId, email, time) VALUES (?, ?, ?)',
      tipId, email, dateTimeStr);

    console.log(`\n==================================================`);
    console.log(`🔔 [SQLITE REMINDER SERVICE] Scheduled email notification:`);
    console.log(`➡️ Target Email: ${email}`);
    console.log(`➡️ Post ID: ${tipId}`);
    console.log(`➡️ Alert Time: ${new Date(dateTimeStr).toLocaleString()}`);
    console.log(`==================================================\n`);

    res.json({ success: true, email, time: dateTimeStr });
  } catch (err) {
    console.error('Reminder scheduling error:', err);
    res.status(500).json({ error: 'Reminder setting failed' });
  }
});

app.delete('/api/tips/:id/reminder', async (req, res) => {
  const tipId = parseInt(req.params.id);

  try {
    await db.run('DELETE FROM reminders WHERE tipId = ?', tipId);
    res.json({ success: true });
  } catch (err) {
    console.error('Reminder delete error:', err);
    res.status(500).json({ error: 'Reminder removal failed' });
  }
});

// 6. Notifications routes
app.get('/api/notifications', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM notifications ORDER BY id DESC');
    res.json(rows.map(r => ({ ...r, read: r.read === 1 })));
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

app.post('/api/notifications/read-all', async (req, res) => {
  try {
    await db.run('UPDATE notifications SET read = 1');
    const rows = await db.all('SELECT * FROM notifications ORDER BY id DESC');
    res.json(rows.map(r => ({ ...r, read: r.read === 1 })));
  } catch (err) {
    console.error('Read notifications error:', err);
    res.status(500).json({ error: 'Database update failed' });
  }
});

app.delete('/api/notifications', async (req, res) => {
  try {
    await db.run('DELETE FROM notifications');
    res.json([]);
  } catch (err) {
    console.error('Clear notifications error:', err);
    res.status(500).json({ error: 'Database clear failed' });
  }
});

app.delete('/api/notifications/:id', async (req, res) => {
  const notifId = parseInt(req.params.id);

  try {
    await db.run('DELETE FROM notifications WHERE id = ?', notifId);
    const rows = await db.all('SELECT * FROM notifications ORDER BY id DESC');
    res.json(rows.map(r => ({ ...r, read: r.read === 1 })));
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

// Boot SQL and listen Express
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CollegeIntel SQLite Relational Backend listening at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize SQLite relational database:', err);
});
