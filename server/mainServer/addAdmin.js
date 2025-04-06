const bcrypt = require('bcrypt');
const db = require('./api');

const addAdmin = async () => {
    const adminName = "admin";
    const adminPassword = "secretPassword*123#";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const query = 'INSERT INTO users (name, password, is_admin) VALUES (?, ?, ?)';
    db.query(query, [adminName, hashedPassword, 1], (err) => {
        if (err) {
            console.error("Ошибка добавления администратора:", err.message);
        } else {
            console.log("Администратор успешно добавлен!");
        }
    });
};

addAdmin();
