# Family Fitness Trainer — семейное фитнес-приложение (React + Express + MySQL)
**Кратко (30 сек):** веб-приложение с ролями родитель/ребёнок/админ, каталогом упражнений и 30-дневными программами по целям (Сила / Похудение / Кардио). Есть семейные связи «родитель → ребёнок» и журнал прохождения по дням и **панель администратора**. Клиент на CRA, сервер на Express, БД — MySQL.
**Origin & статус.** Проект начат как дипломная работа под дедлайн. Сейчас идёт доводка под более высокие стандарты: единый контракт API, миграции БД, безопасность (bcrypt/JWT/.env), базовые тесты и CI. В БД встречаются как старые SHA-256, так и корректные bcrypt-хэши — см. «Безопасность» и «Миграции».

## Демо / скриншоты
- Деплой: _добавь ссылку (Netlify)_
- Скриншоты: `./docs/screenshots/`

## Стек
- **Frontend:** React 18 (CRA `react-scripts`), React Router, MUI
- **Backend:** Node.js, Express, CORS, body-parser, dotenv, jsonwebtoken
- **База Данных:** MySQL (mysql2)
- **Авторизация:** JWT (Bearer / httpOnly cookie)

## Фичи (то, что есть сейчас)
- Регистрация/вход; роли: parent, child, admin
- Связь семьи: **родитель** → **ребёнок**, просмотр прогресса ребёнка
- Цели/программы: 30-дневные планы (Сила/Похудение/Кардио)
- Журнал прохождения по дням (start/continue/finish)

## Архитектура БД (кратко)
```
exercise(id, name, about, how_to_do, lose_weight, strength, cardio, is_family)   -- каталог упражнений
purpose(id, name, count_day, calories)                                           -- цели/программы (30 дней)
purpose_config(id, purpose_id, exercise_id, day)                                 -- сетка упражнений на каждый день
users(id, name, password, last_name_update, avatar, role enum('parent','child','admin'))
family_members(parent_id, child_id)                                              -- связь "родитель → ребёнок"
journal(id, purpose_id, user_id, is_over, current_day, date_started, end_date)   -- прогресс пользователя

```
## Связи
- purpose_config.purpose_id → purpose.id (1:M)
- purpose_config.exercise_id → exercise.id (1:M)
- family_members.parent_id → users.id (M:1, role=parent)
- family_members.child_id → users.id (M:1, role=child)
- journal.user_id → users.id (M:1), journal.purpose_id → purpose.id (M:1)

## Переменные окружения
Используется секретный ключ для хеширования пароля:
```bash
# client/.env
REACT_APP_API_BASE=http://localhost:5000

# server/.env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=fitnes
JWT_SECRET=super_secret
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

```
## Метрики (цели для мобильных)
- Lighthouse: **90–100**
- Web Vitals: **LCP < 2.0 s**, **CLS ~ 0.01**
- Bundle: **≤ 300 KB**
> Скриншоты с Lighthouse положи в `./docs/screenshots/`.

## Безопасность
- **Пароли:** перейти полностью на bcrypt (12 rounds). Тактика: «ленивая миграция» — при первом логине пользователя со старым SHA-256 перехэшировать bcrypt и сохранить; запретить новые SHA-варианты.
- **JWT:** хранение в httpOnly cookie (или Bearer), добавить refresh-пару и ротацию.
- **Роли:** middleware уровня маршрутов: requireAuth, requireRole("parent").
- **Конфиги:** все ключи/доступы — только через .env.
- **Rate limits:** защитить /auth/* и /journal/*.

## Текущие нюансы
- Смешанные схемы хеширования (SHA-256 и bcrypt) → миграция в процессе
- Нет формальных миграций/сидов, часть скриптов ad-hoc
- Нет мониторинга ошибок (Sentry/аналог), нет rate-limits
- Отсутствует публичный деплой (front+API+DB)

## Roadmap
- [ ] Bcrypt-only, httpOnly JWT, refresh-поток, RBAC middleware
- [ ] Миграции/сиды + индексы; docs/API.md и ER-схема (docs/db.png)
- [ ] Документация: ```docs/API.md```, ER-диаграмма (```docs/db.png```)
- [ ] e2e (Playwright) + unit; GitHub Actions (lint/test/build)
- [ ] Улучшение панели администратора
- [ ] Возможность изменять профиль пользователя (аватар/смена пароля/история)
- [ ] Новые графики для лучшего отображения прогресса
- [ ] Улучшение дизайна
- [ ] Деплой: фронт/бэкенд/БД; Lighthouse/Web Vitals скрины

## Цель проекта
Показать end-to-end разработку: роли и авторизация (включая админ-панель) → доменная модель (цели/упражнения/журнал) → UI прогресса → стабильный API и БД → метрики качества и деплой.

## Запуск
```bash
# 1) База данных
#   - Поднимите MySQL 8
#   - Импортируйте дамп: family-fitnes.24.06.25.sql
#   - Убедитесь, что создана БД "fitnes"

# 2) Сервер (Express)
cd server
npm i
node index.js                 # http://localhost:5000

# 3) Клиент (CRA)
cd client                     # если клиент в корне – пропустите cd
npm i
npm start                     # http://localhost:3000 (CRA с proxy на 5000)
```
