require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// ✅ CORS must be above routes
app.use(cors());

app.use((req, res, next) => {
    console.log(`[GATEWAY] ${req.method} ${req.url}`);
    next();
});

app.use('/', routes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
