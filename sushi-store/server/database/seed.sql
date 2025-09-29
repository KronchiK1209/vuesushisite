-- Начальные данные для Sushi Store
-- Выполнить после создания схемы

-- Создание админа (пароль: admin123)
INSERT INTO users (phone, password_hash, role) VALUES 
('+7 (999) 123-45-67', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'admin');

-- Создание категорий
INSERT INTO categories (name, image, description, order_index) VALUES 
('Роллы', 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', 'Классические и авторские роллы', 1),
('Суши', 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91', 'Традиционные суши с рыбой', 2),
('Сеты', 'https://images.unsplash.com/photo-1553621042-f6e147245754', 'Готовые наборы для компании', 3),
('Бургеры', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Сочные бургеры с мясом', 4);

-- Создание товаров
INSERT INTO products (name, description, price, image, category_id, hit, order_index) VALUES 
('Суши‑ролл Калифорния', 'Классический ролл с крабом, авокадо и огурцом, покрытый икрой масаго.', 899.00, 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', (SELECT id FROM categories WHERE name = 'Роллы'), true, 1),
('Салмон Нигири', 'Две нигири с нежным филе лосося на подушке из риса.', 599.00, 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91', (SELECT id FROM categories WHERE name = 'Суши'), false, 2),
('Сет Ассорти', 'Большой сет с разнообразными роллами и нигири для компании.', 2499.00, 'https://images.unsplash.com/photo-1553621042-f6e147245754', (SELECT id FROM categories WHERE name = 'Сеты'), true, 3),
('Филадельфия', 'Ролл с лососем, сливочным сыром и огурцом.', 799.00, 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', (SELECT id FROM categories WHERE name = 'Роллы'), false, 4),
('Дракон', 'Ролл с угрем, авокадо и огурцом, покрытый соусом унаги.', 1199.00, 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', (SELECT id FROM categories WHERE name = 'Роллы'), false, 5),
('Классический бургер', 'Сочная котлета из говядины с овощами и соусом.', 599.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', (SELECT id FROM categories WHERE name = 'Бургеры'), false, 6);

-- Создание SEO настроек
INSERT INTO seo_settings (page, title, description, keywords, author, language, robots, canonical, og_title, og_description, og_image, og_site_name, twitter_card, twitter_title, twitter_description, twitter_image) VALUES 
('home', 'Интернет‑магазин суши и пиццы | Доставка суши и пиццы | Sushi Store', 'Лучший интернет-магазин суши и пиццы с быстрой доставкой. Свежие роллы, пицца, салаты и напитки. Закажите онлайн с доставкой на дом!', 'суши, пицца, доставка еды, роллы, японская кухня, итальянская кухня, заказ еды онлайн, доставка на дом', 'Sushi Store', 'ru', 'index, follow', 'https://sushi-store.com/', 'Интернет‑магазин суши и пиццы | Доставка суши и пиццы', 'Лучший интернет-магазин суши и пиццы с быстрой доставкой. Свежие роллы, пицца, салаты и напитки.', 'https://sushi-store.com/assets/logo.png', 'Sushi Store', 'summary_large_image', 'Интернет‑магазин суши и пиццы | Доставка суши и пиццы', 'Лучший интернет-магазин суши и пиццы с быстрой доставкой. Свежие роллы, пицца, салаты и напитки.', 'https://sushi-store.com/assets/logo.png'),
('cart', 'Корзина | Sushi Store', 'Ваша корзина с выбранными товарами. Оформите заказ с доставкой на дом.', 'корзина, заказ, доставка, суши, пицца', 'Sushi Store', 'ru', 'noindex, nofollow', 'https://sushi-store.com/cart', 'Корзина | Sushi Store', 'Ваша корзина с выбранными товарами. Оформите заказ с доставкой на дом.', 'https://sushi-store.com/assets/logo.png', 'Sushi Store', 'summary', 'Корзина | Sushi Store', 'Ваша корзина с выбранными товарами. Оформите заказ с доставкой на дом.', 'https://sushi-store.com/assets/logo.png'),
('checkout', 'Оформление заказа | Sushi Store', 'Оформите заказ с доставкой на дом. Быстро, удобно и безопасно.', 'оформление заказа, доставка, суши, пицца', 'Sushi Store', 'ru', 'noindex, nofollow', 'https://sushi-store.com/checkout', 'Оформление заказа | Sushi Store', 'Оформите заказ с доставкой на дом. Быстро, удобно и безопасно.', 'https://sushi-store.com/assets/logo.png', 'Sushi Store', 'summary', 'Оформление заказа | Sushi Store', 'Оформите заказ с доставкой на дом. Быстро, удобно и безопасно.', 'https://sushi-store.com/assets/logo.png'),
('news', 'Новости | Sushi Store', 'Последние новости и акции нашего ресторана. Следите за обновлениями!', 'новости, акции, ресторан, суши, пицца', 'Sushi Store', 'ru', 'index, follow', 'https://sushi-store.com/news', 'Новости | Sushi Store', 'Последние новости и акции нашего ресторана. Следите за обновлениями!', 'https://sushi-store.com/assets/logo.png', 'Sushi Store', 'summary', 'Новости | Sushi Store', 'Последние новости и акции нашего ресторана. Следите за обновлениями!', 'https://sushi-store.com/assets/logo.png');

-- Создание блоков категорий для главной страницы
INSERT INTO category_blocks (title, description, image, category_id, enabled, order_index) VALUES 
('Это вкусно', 'Попробуйте наши хиты продаж', 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', (SELECT id FROM categories WHERE name = 'Роллы'), true, 1),
('Свежие суши', 'Традиционная японская кухня', 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91', (SELECT id FROM categories WHERE name = 'Суши'), true, 2),
('Сеты для компании', 'Большие наборы для друзей', 'https://images.unsplash.com/photo-1553621042-f6e147245754', (SELECT id FROM categories WHERE name = 'Сеты'), true, 3);

-- Создание новостей
INSERT INTO news (title, content, image, author_id, published, published_at) VALUES 
('Новое меню!', 'Мы добавили новые роллы и суши в наше меню. Попробуйте наши авторские рецепты!', 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', (SELECT id FROM users WHERE role = 'admin'), true, CURRENT_TIMESTAMP),
('Акция на доставку', 'При заказе от 2000 рублей доставка бесплатно! Акция действует до конца месяца.', 'https://images.unsplash.com/photo-1553621042-f6e147245754', (SELECT id FROM users WHERE role = 'admin'), true, CURRENT_TIMESTAMP),
('Новые бургеры', 'Попробуйте наши новые бургеры с мясом премиум качества!', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', (SELECT id FROM users WHERE role = 'admin'), true, CURRENT_TIMESTAMP);
