const db = require('./api');

db.query('SELECT 1', [])
    .then(([rows]) => {
        console.log('Успешное подключение к базе данных:', rows);
    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных:', err);
    });
