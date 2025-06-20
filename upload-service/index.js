 const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');
const port = process.env.PORT || 3006;
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/', uploadRoutes);

(async () => {
    await connectRabbitMQ();
    app.listen(port, () => {
        console.log(`UploadExcelService running on port ${port}`);
    });
})();
