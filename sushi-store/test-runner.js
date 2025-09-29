#!/usr/bin/env node

/**
 * Скрипт для запуска тестов Sushi Store
 * Поддерживает различные типы тестов согласно Vue.js Testing документации
 */

const { execSync } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.cyan}🚀 ${description}${colors.reset}`);
  log(`${colors.yellow}Выполняется: ${command}${colors.reset}\n`);
  
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`${colors.green}✅ ${description} - УСПЕШНО${colors.reset}`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ ${description} - ОШИБКА${colors.reset}`);
    log(`${colors.red}${error.message}${colors.reset}`);
    return false;
  }
}

function checkDependencies() {
  log(`${colors.blue}🔍 Проверка зависимостей...${colors.reset}`);
  
  try {
    require('jest');
    require('@vue/test-utils');
    log(`${colors.green}✅ Jest и Vue Test Utils установлены${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Зависимости не установлены${colors.reset}`);
    log(`${colors.yellow}Установите зависимости: npm install${colors.reset}`);
    process.exit(1);
  }
}

function runTests() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  
  log(`${colors.bright}${colors.magenta}🍣 Sushi Store - Система тестирования${colors.reset}`);
  log(`${colors.blue}Основано на Vue.js Testing документации${colors.reset}`);
  log(`${colors.blue}https://www.compilenrun.com/docs/framework/vue/vuejs-testing/${colors.reset}\n`);
  
  checkDependencies();
  
  let success = true;
  
  switch (testType) {
    case 'unit':
      log(`${colors.cyan}📋 Запуск Unit тестов${colors.reset}`);
      success = runCommand('npm test -- tests/utils.test.js', 'Unit тесты');
      break;
      
    case 'component':
      log(`${colors.cyan}🧩 Запуск Component тестов${colors.reset}`);
      success = runCommand('npm test -- tests/simple-components.test.js', 'Component тесты');
      break;
      
    case 'integration':
      log(`${colors.cyan}🔗 Запуск Integration тестов${colors.reset}`);
      success = runCommand('npm test -- tests/simple-integration.test.js', 'Integration тесты');
      break;
      
    case 'security':
      log(`${colors.cyan}🔒 Запуск Security тестов${colors.reset}`);
      success = runCommand('npm test -- tests/security.test.js', 'Security тесты');
      break;
      
    case 'crud':
      log(`${colors.cyan}📝 Запуск CRUD тестов${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-products.test.js', 'CRUD тесты продуктов') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-categories.test.js', 'CRUD тесты категорий') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-orders.test.js', 'CRUD тесты заказов') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-news.test.js', 'CRUD тесты новостей') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-reviews.test.js', 'CRUD тесты отзывов') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-seo.test.js', 'CRUD тесты SEO') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-category-blocks.test.js', 'CRUD тесты блоков категорий') && success;
      break;
      
    case 'crud-products':
      log(`${colors.cyan}🍣 Запуск CRUD тестов продуктов${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-products.test.js', 'CRUD тесты продуктов');
      break;
      
    case 'crud-categories':
      log(`${colors.cyan}📁 Запуск CRUD тестов категорий${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-categories.test.js', 'CRUD тесты категорий');
      break;
      
    case 'crud-orders':
      log(`${colors.cyan}📋 Запуск CRUD тестов заказов${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-orders.test.js', 'CRUD тесты заказов');
      break;
      
    case 'crud-news':
      log(`${colors.cyan}📰 Запуск CRUD тестов новостей${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-news.test.js', 'CRUD тесты новостей');
      break;
      
    case 'crud-reviews':
      log(`${colors.cyan}⭐ Запуск CRUD тестов отзывов${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-reviews.test.js', 'CRUD тесты отзывов');
      break;
      
    case 'crud-seo':
      log(`${colors.cyan}🔍 Запуск CRUD тестов SEO${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-seo.test.js', 'CRUD тесты SEO');
      break;
      
    case 'crud-category-blocks':
      log(`${colors.cyan}📦 Запуск CRUD тестов блоков категорий${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-category-blocks.test.js', 'CRUD тесты блоков категорий');
      break;
      
    case 'e2e':
      log(`${colors.cyan}🌐 Запуск E2E тестов${colors.reset}`);
      log(`${colors.yellow}Убедитесь, что сервер запущен на http://localhost:3000${colors.reset}`);
      success = runCommand('npx cypress run', 'E2E тесты');
      break;
      
    case 'coverage':
      log(`${colors.cyan}📊 Запуск тестов с покрытием кода${colors.reset}`);
      success = runCommand('npm run test:coverage', 'Тесты с покрытием');
      break;
      
    case 'watch':
      log(`${colors.cyan}👀 Запуск тестов в режиме наблюдения${colors.reset}`);
      runCommand('npm run test:watch', 'Тесты в режиме наблюдения');
      return; // Не завершаем процесс для watch режима
      
    case 'all':
    default:
      log(`${colors.cyan}🎯 Запуск всех тестов${colors.reset}`);
      
      // Unit тесты
      success = runCommand('npm test -- tests/utils.test.js', 'Unit тесты') && success;
      
      // Component тесты
      success = runCommand('npm test -- tests/simple-components.test.js', 'Component тесты') && success;
      
      // Integration тесты
      success = runCommand('npm test -- tests/simple-integration.test.js', 'Integration тесты') && success;
      
      // Security тесты
      success = runCommand('npm test -- tests/security.test.js', 'Security тесты') && success;
      
      // CRUD тесты
      log(`${colors.cyan}📝 Запуск CRUD тестов${colors.reset}`);
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-products.test.js', 'CRUD тесты продуктов') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-categories.test.js', 'CRUD тесты категорий') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-orders.test.js', 'CRUD тесты заказов') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-news.test.js', 'CRUD тесты новостей') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-reviews.test.js', 'CRUD тесты отзывов') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-seo.test.js', 'CRUD тесты SEO') && success;
      success = runCommand('npx jest --config jest.config.crud.js tests/crud-category-blocks.test.js', 'CRUD тесты блоков категорий') && success;
      
      // Покрытие кода
      success = runCommand('npm run test:coverage', 'Покрытие кода') && success;
      
      break;
  }
  
  if (success) {
    log(`\n${colors.green}${colors.bright}🎉 Все тесты прошли успешно!${colors.reset}`);
    log(`${colors.green}Ваше приложение готово к продакшену! 🍣${colors.reset}`);
  } else {
    log(`\n${colors.red}${colors.bright}💥 Некоторые тесты не прошли${colors.reset}`);
    log(`${colors.red}Проверьте ошибки выше и исправьте их${colors.reset}`);
    process.exit(1);
  }
}

function showHelp() {
  log(`${colors.bright}${colors.magenta}🍣 Sushi Store - Помощь по тестированию${colors.reset}\n`);
  
  log(`${colors.cyan}Использование:${colors.reset}`);
  log(`  node test-runner.js [тип_теста]\n`);
  
  log(`${colors.cyan}Доступные типы тестов:${colors.reset}`);
  log(`  ${colors.green}unit${colors.reset}        - Unit тесты для утилитарных функций`);
  log(`  ${colors.green}component${colors.reset}   - Component тесты для Vue компонентов`);
  log(`  ${colors.green}integration${colors.reset} - Integration тесты для взаимодействия`);
  log(`  ${colors.green}security${colors.reset}    - Security тесты для проверки безопасности`);
  log(`  ${colors.green}crud${colors.reset}        - Все CRUD тесты (продукты, категории, заказы, новости, отзывы, SEO, блоки категорий)`);
  log(`  ${colors.green}crud-products${colors.reset} - CRUD тесты для продуктов`);
  log(`  ${colors.green}crud-categories${colors.reset} - CRUD тесты для категорий`);
  log(`  ${colors.green}crud-orders${colors.reset} - CRUD тесты для заказов`);
  log(`  ${colors.green}crud-news${colors.reset}   - CRUD тесты для новостей`);
  log(`  ${colors.green}crud-reviews${colors.reset} - CRUD тесты для отзывов`);
  log(`  ${colors.green}crud-seo${colors.reset}    - CRUD тесты для SEO блоков`);
  log(`  ${colors.green}crud-category-blocks${colors.reset} - CRUD тесты для блоков категорий`);
  log(`  ${colors.green}e2e${colors.reset}         - E2E тесты для полных сценариев`);
  log(`  ${colors.green}coverage${colors.reset}    - Тесты с покрытием кода`);
  log(`  ${colors.green}watch${colors.reset}       - Тесты в режиме наблюдения`);
  log(`  ${colors.green}all${colors.reset}         - Все тесты (по умолчанию)\n`);
  
  log(`${colors.cyan}Примеры:${colors.reset}`);
  log(`  node test-runner.js unit`);
  log(`  node test-runner.js component`);
  log(`  node test-runner.js e2e`);
  log(`  node test-runner.js all\n`);
  
  log(`${colors.cyan}Дополнительные команды:${colors.reset}`);
  log(`  npm test                    - Запуск Jest тестов`);
  log(`  npm run test:watch          - Jest в режиме наблюдения`);
  log(`  npm run test:coverage       - Jest с покрытием кода`);
  log(`  npx cypress open            - Открыть Cypress GUI`);
  log(`  npx cypress run             - Запуск Cypress в headless режиме\n`);
  
  log(`${colors.blue}Документация: https://www.compilenrun.com/docs/framework/vue/vuejs-testing/${colors.reset}`);
}

// Проверяем аргументы командной строки
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
} else {
  runTests();
}
