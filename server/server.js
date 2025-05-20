require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({
  origin: 'http://localhost:3000',   // клиент по-умолчанию на 3000
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const apiRouter = require('./routes/index');
app.use('/api', apiRouter);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Берём PORT из .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
