/**
 * Конфигурация базы данных PostgreSQL
 */

const { Pool } = require('pg');
require('dotenv').config();

// Конфигурация подключения к PostgreSQL
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sushi_store',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  // Настройки кодировки
  client_encoding: 'utf8',
  // Настройки для продакшена
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Настройки пула соединений
  max: 20, // максимальное количество соединений в пуле
  idleTimeoutMillis: 30000, // время ожидания перед закрытием неактивного соединения
  connectionTimeoutMillis: 2000, // время ожидания подключения
};

// Создаем пул соединений
const pool = new Pool(dbConfig);

// Обработка ошибок подключения
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Функция для выполнения запросов
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Функция для получения клиента из пула
const getClient = async () => {
  return await pool.connect();
};

// Функция для транзакций
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Функция для закрытия всех соединений
const close = async () => {
  await pool.end();
};

module.exports = {
  query,
  getClient,
  transaction,
  close,
  pool
};
