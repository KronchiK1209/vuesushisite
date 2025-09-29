// Admin views moved out of main.js. Attach to window for global availability.
// Assumes global Vue, VueRouter, axios are present.

// AdminHomeView (Dashboard) migrated from main.js
window.AdminHomeView = {
  name: 'AdminHomeView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
          <p class="text-gray-600">Управление интернет-магазином суши</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <i class="fa-solid fa-box text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Товары</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.products }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <i class="fa-solid fa-shopping-cart text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Заказы</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.orders }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <i class="fa-solid fa-newspaper text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Новости</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.news }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <i class="fa-solid fa-star text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Отзывы</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.reviews }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="/admin/products" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
                  <i class="fa-solid fa-box text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Товары</h3>
              </div>
              <p class="text-gray-600 mb-4">Управление каталогом товаров, добавление, редактирование и удаление позиций</p>
              <div class="flex items-center text-blue-600 group-hover:text-blue-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
          <router-link to="/admin/categories" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-green-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 transition">
                  <i class="fa-solid fa-tags text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Категории</h3>
              </div>
              <p class="text-gray-600 mb-4">Управление категориями товаров, создание и редактирование разделов</p>
              <div class="flex items-center text-green-600 group-hover:text-green-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
          <router-link to="/admin/news" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-yellow-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 transition">
                  <i class="fa-solid fa-newspaper text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Новости</h3>
              </div>
              <p class="text-gray-600 mb-4">Создание и редактирование новостей, публикация обновлений</p>
              <div class="flex items-center text-yellow-600 group-hover:text-yellow-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
          <router-link to="/admin/orders" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-red-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition">
                  <i class="fa-solid fa-shopping-cart text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Заказы</h3>
              </div>
              <p class="text-gray-600 mb-4">Просмотр и управление заказами клиентов, отслеживание статусов</p>
              <div class="flex items-center text-red-600 group-hover:text-red-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
          <router-link to="/admin/reviews" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition">
                  <i class="fa-solid fa-star text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Отзывы</h3>
              </div>
              <p class="text-gray-600 mb-4">Просмотр и управление отзывами клиентов, анализ рейтингов</p>
              <div class="flex items-center text-purple-600 group-hover:text-purple-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
          <router-link to="/admin/seo" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-indigo-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition">
                  <i class="fa-solid fa-search text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">SEO</h3>
              </div>
              <p class="text-gray-600 mb-4">Управление мета-тегами, Open Graph, Twitter Cards, sitemap и robots.txt</p>
              <div class="flex items-center text-indigo-600 group-hover:text-indigo-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
          <router-link to="/admin/category-blocks" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-pink-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-200 transition">
                  <i class="fa-solid fa-images text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Блоки категорий</h3>
              </div>
              <p class="text-gray-600 mb-4">Управление блоком "Категории и блюда" на главной странице</p>
              <div class="flex items-center text-pink-600 group-hover:text-pink-700">
                <span class="text-sm font-medium">Перейти к управлению</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, onMounted } = Vue;
    const stats = ref({ products: 0, orders: 0, news: 0, reviews: 0 });
    async function fetchStats() {
      try {
        const [productsRes, ordersRes, newsRes, reviewsRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders'),
          axios.get('/api/news'),
          axios.get('/api/reviews')
        ]);
        stats.value = {
          products: (productsRes.data || []).length,
          orders: (ordersRes.data || []).length,
          news: (newsRes.data || []).length,
          reviews: (reviewsRes.data || []).length
        };
      } catch (e) {
        console.error('Ошибка загрузки статистики', e);
      }
    }
    onMounted(fetchStats);
    return { stats };
  }
};

// Placeholders for all admin views; real templates will be registered at runtime via window.* assignments by main.js migration step
window.AdminProductsView = window.AdminProductsView || { name: 'AdminProductsView', template: '<div>Загрузка...</div>' };
window.AdminCategoriesView = window.AdminCategoriesView || { name: 'AdminCategoriesView', template: '<div>Загрузка...</div>' };
window.AdminNewsView = window.AdminNewsView || { name: 'AdminNewsView', template: '<div>Загрузка...</div>' };
window.AdminOrdersView = window.AdminOrdersView || { name: 'AdminOrdersView', template: '<div>Загрузка...</div>' };
window.AdminOrderEditView = window.AdminOrderEditView || { name: 'AdminOrderEditView', template: '<div>Загрузка...</div>' };
window.AdminReviewsView = window.AdminReviewsView || { name: 'AdminReviewsView', template: '<div>Загрузка...</div>' };
window.AdminSEOView = window.AdminSEOView || { name: 'AdminSEOView', template: '<div>Загрузка...</div>' };
window.AdminCategoryBlocksView = window.AdminCategoryBlocksView || { name: 'AdminCategoryBlocksView', template: '<div>Загрузка...</div>' };


