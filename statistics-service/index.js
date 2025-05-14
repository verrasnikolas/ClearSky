const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const statsRoutes = require('./routes/statsRoutes');

app.use(express.json());
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.send('Statistics Service is running');
});

app.listen(port, () => {
    console.log(`Statistics Service running on port ${port}`);
});