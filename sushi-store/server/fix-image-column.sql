-- Исправление размера поля image в таблице products
-- для поддержки base64 изображений

ALTER TABLE products ALTER COLUMN image TYPE VARCHAR(100000);
