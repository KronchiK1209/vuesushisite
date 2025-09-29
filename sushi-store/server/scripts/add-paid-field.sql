-- Добавление поля paid в таблицу orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false;

-- Обновляем существующие заказы, устанавливая paid = false
UPDATE orders SET paid = false WHERE paid IS NULL;


