const fs = require('fs');
const path = require('path');

// Путь к файлу базы данных
const DATA_FILE = path.join(__dirname, 'db.json');

/**
 * Считывает данные из JSON‑файла базы данных.
 * Возвращает объект данных (products, news, orders, users и т.д.).
 */
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

/**
 * Записывает данные в JSON‑файл базы данных.
 * @param {object} data Объект данных
 */
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { DATA_FILE, readData, writeData };