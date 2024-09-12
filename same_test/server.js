const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

// Настройка подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gretta',
  password: 'postgres',
  port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

// Обслуживание статических файлов из каталога "public"
app.use(express.static(path.join(__dirname, 'public')));

// Корневой маршрут для отображения HTML-страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршруты для получения данных из таблиц с фильтрацией
const tables = ['video_card', 'cpu', 'cooler', 'ssd', 'ram', 'power_unit', 'frame', 'motherboard'];

tables.forEach(table => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      // Получаем параметр search из запроса
      const searchQuery = req.query.search ? `%${req.query.search.toLowerCase()}%` : '%';

      // Выполняем запрос к базе данных с фильтрацией по имени
      const result = await pool.query(
        `SELECT id, name, price FROM ${table} WHERE LOWER(name) LIKE $1`,
        [searchQuery]
      );

      res.json(result.rows);
    } catch (err) {
      console.error('Ошибка при запросе к базе данных', err.stack);
      res.status(500).send('Ошибка сервера');
    }
  });
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
