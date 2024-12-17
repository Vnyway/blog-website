# Metablog

Блог-сайт для додавання власних постів та перегляду постів інших користуачів.

## Функціонал

- Автентифікація користувача
- Створення постів
- Перегляд списку всіх постів з їх коротким описом
- Перегляд обраного поста
- Редагування поста, якщо він належить користувачу
- Перегляд постів за категоріями

## Використані технології

- Node.js (back-end)
- React (frond-end)
- Mongodb (база даних)
- Amazon S3 (сховище зображень)

## Використані у API-частині пакети

- aws-sdk: завантаження зображень у хмарне сховище
- bcryptjs: хешування паролів
- cookie-parser: отримання та передача файлів cookie
- cors: комунікація front- та back-end частин
- dotenv: декларація чутливої інформації у файлі, який не відслідковує git
- express: створення серверів і маршрутизація запитів
- jsonwebtoken: створення, верифікація та декодування токенів для \* аутентифікації та авторизації
- mongoose: взаємодія з монгодб
- multer: обробка даних форм із файлами
- nodemon: для зручності розробки
- uuid: створення унікальних назв

## Використані у Client-частині пакети

- create-react-app: швидке створення базового шаблону React-додатка із попередньо налаштованим середовищем розробки, яке включає конфігурацію Webpack, Babel, ESLint
- tailwindcss: швидке створення інтерфейсів, використовуючи класи у jsx-коді
- react-router-dom: маршрутизація в UI

## Встановлення

1. Клонувати репозиторій:

- ```bash
  git clone https://github.com/Vnyway/blog-website
  cd blog-website
  ```

2. Встановити залежності

- ```bash
  cd client
  npm install
  cd ../server
  npm install
  ```

3. Додати змінні в .env-файл:

- Приклад api-змінних

- ```
  MONGODB_CONNECTION_STRING="строка підключення до монгодб, яка дається при створенні нового монго-проекта"
  JWT_SECRET="рандомно згенерована строка"
  ORIGIN="http://localhost:3000"
  ```

- Конфігувація змінних, які отримуєш при створенні aws s3 bucket

- ```
  BUCKET_NAME=**
  BUCKET_REGION=**
  ACCESS_KEY=**
  SECRET_ACCESS_KEY=**
  BUCKET_NAME1=**
  BUCKET_REGION1=**
  ACCESS_KEY1=**
  SECRET_ACCESS_KEY1=**
  ```

- Приклад client-змінних

- ```
  REACT_APP_ORIGIN="http://localhost:4400"
  ```

4. Запуск сервера

- ```
  cd server
  npm start
  ```

- Запуск UI

- ```
  cd ../client
  npm start
  ```

## Структура проекта

![alt text](image_2024-12-16_16-16-10.png)

## API

### Автентифікація

- POST /register: зберігає нового користувача в монгодб
- POST /login: при введенні правильних даних повертає у кукі дані користувача
- GET /profile: отримує інформації про профіль авторизованого користувача
- POST /logout: очищає токен з кукі

### Пости

- POST /post: створює новий пост
- PUT /post: оновлює існуючий пост
- GET /posts: отримує список постів
- GET /post/:id: отримує 1 пост за ід
