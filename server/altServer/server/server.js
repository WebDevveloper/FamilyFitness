const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('../routes/routeHub');

const app = express();
const port = 5000;

// app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({ 
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    }));

app.use('/api', authRouter);
app.options('*', cors());

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
