const express = require('express');
const cors = require('cors');
const holidays = require('./data/holidays.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * GET /holidays
 * Returns all Indian holidays or filtered by year/month query params.
 * Output format: [ { "date": "YYYY-MM-DD", "holiday": "Holiday Name" }, ... ]
 */
app.get(['/', '/holidays'], (req, res) => {
  const { year, month } = req.query;
  let results = holidays;

  if (year) {
    results = results.filter((h) => h.date.startsWith(year));
  }

  if (month) {
    const formattedMonth = month.length === 1 ? `0${month}` : month;
    results = results.filter((h) => {
      // Handles either YYYY-MM or MM
      if (formattedMonth.includes('-')) {
        return h.date.startsWith(formattedMonth);
      }
      return h.date.split('-')[1] === formattedMonth;
    });
  }

  res.status(200).json(results);
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found. Use GET /holidays to get the list of holidays.',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Indian Holidays Express server is running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  - GET http://localhost:${PORT}/holidays`);
  console.log(`  - GET http://localhost:${PORT}/holidays?year=2026`);
  console.log(`  - GET http://localhost:${PORT}/holidays?year=2027`);
});
