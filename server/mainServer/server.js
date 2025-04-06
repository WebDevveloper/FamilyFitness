// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const authRouter = require('./authRouter');

// const app = express();
// const port = 5000;

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// app.use('/api', authRouter);

// app.use((req, res) => {
//     res.status(404).json({ error: 'Маршрут не найден' });
// });

// app.listen(port, () => {
//     console.log(`Сервер запущен на порту ${port}`);
// });
