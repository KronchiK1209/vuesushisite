-- Миграция: добавление полей name и email в таблицу users
-- Дата: 2024

-- Добавляем поля name и email в таблицу users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name VARCHAR(100),
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Создаем индекс для email (если он будет уникальным)
-- ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Обновляем комментарии к таблице
COMMENT ON COLUMN users.name IS 'Имя пользователя';
COMMENT ON COLUMN users.email IS 'Email пользователя (опционально)';
