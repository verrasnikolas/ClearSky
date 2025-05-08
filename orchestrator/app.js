// app.js - main file of orchestrator
// setup Express server, basic middleware and connect routes
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // PORT 300 by default for orchestrator

// Middleware
app.use(express.json()); // Για να αναλύεις JSON στο body των requests

// Routes
const userRoutes = require('./routes/user-routes');
app.use('/users', userRoutes);

const gradesRoutes = require('./routes/grades-routes'); // Import το grades routes
app.use('/grades', gradesRoutes); // Mount το grades routes στο /grades path

// more routes here

// Error handling middleware (πρέπει να οριστεί τελευταίο)
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Orchestrator listening on port ${port}`);
});