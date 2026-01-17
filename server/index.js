const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/habits', require('./routes/habits'));
app.use('/journal', require('./routes/journal'));
app.use('/analytics', require('./routes/analytics'));
app.use('/admin', require('./routes/admin'));
app.use('/chat', require('./routes/chat'));

app.get('/', (req, res) => {
    res.send('Habit Tracker API is running');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
