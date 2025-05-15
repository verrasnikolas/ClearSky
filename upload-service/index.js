 const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');
const port = process.env.PORT || 3006;
const app = express();

app.use(express.json());
app.use('/api/upload', uploadRoutes);

(async () => {
    await connectRabbitMQ();
    app.listen(port, () => {
        console.log(`UploadExcelService running on port ${port}`);
    });
})();
