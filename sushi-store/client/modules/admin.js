// Admin views extracted incrementally from main.js
// Assumes global Vue, VueRouter, axios, and shared globals (auth) are available

// Присваиваем экспорты в window для совместимости с браузером
// Настраиваем axios на использование сохранённого admin токена, как в немодульной версии
try {
  (function initializeAxiosAuthHeader() {
    const savedToken = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + savedToken;
    }
  })();
} catch (e) {
  console.warn('Auth header init skipped:', e);
}
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
          <router-link to="/admin/site-settings" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-teal-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-teal-100 text-teal-600 group-hover:bg-teal-200 transition">
                  <i class="fa-solid fa-cog text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Настройки сайта</h3>
              </div>
              <p class="text-gray-600 mb-4">Управление логотипом, названием сайта, фавиконом и текстами блоков</p>
              <div class="flex items-center text-teal-600 group-hover:text-teal-700">
                <span class="text-sm font-medium">Перейти к настройкам</span>
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
window.AdminDashboardView = {
  name: 'AdminDashboardView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-gray-900">Админ-панель</h1>
          <p class="mt-2 text-gray-600">Выберите раздел для управления контентом</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="/admin/orders" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-700">Заказы</h3>
            <p class="text-gray-600 mt-1">Просмотр и управление заказами</p>
          </router-link>

          <router-link to="/admin/products" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-sushi"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-emerald-700">Товары</h3>
            <p class="text-gray-600 mt-1">Каталог продукции</p>
          </router-link>

          <router-link to="/admin/categories" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-folder-tree"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-orange-700">Категории</h3>
            <p class="text-gray-600 mt-1">Структура каталога</p>
          </router-link>

          <router-link to="/admin/news" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-newspaper"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-700">Новости</h3>
            <p class="text-gray-600 mt-1">Публикации и анонсы</p>
          </router-link>

          <router-link to="/admin/seo" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-amber-700">SEO</h3>
            <p class="text-gray-600 mt-1">Мета-теги, OG и sitemap</p>
          </router-link>

          <router-link to="/admin/category-blocks" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-grip"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-pink-700">Блоки категорий</h3>
            <p class="text-gray-600 mt-1">Карточки на главной</p>
          </router-link>

          <router-link to="/admin/reviews" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-star"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-teal-700">Отзывы</h3>
            <p class="text-gray-600 mt-1">Отзывы покупателей</p>
          </router-link>

          <router-link to="/admin/site-settings" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-cog"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-cyan-700">Настройки сайта</h3>
            <p class="text-gray-600 mt-1">Логотип, название, тексты</p>
          </router-link>

          <router-link to="/admin/stats" class="group block bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-slate-700">Статистика</h3>
            <p class="text-gray-600 mt-1">Ключевые показатели</p>
          </router-link>
        </div>
      </div>
    </div>
  `
};

window.AdminOrdersView = {
  name: 'AdminOrdersView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Управление заказами</h1>
          <p class="text-gray-600">Просматривайте и управляйте заказами клиентов</p>
        </div>

        <!-- Статистика заказов -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-shopping-cart text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Всего заказов</p>
                <p class="text-2xl font-bold text-gray-900">{{ orders.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-clock text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Срочные заказы</p>
                <p class="text-2xl font-bold text-gray-900">{{ orders.filter(o => o.deliveryTime === 'asap').length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-calendar text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Запланированные</p>
                <p class="text-2xl font-bold text-gray-900">{{ orders.filter(o => o.deliveryTime === 'scheduled').length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-ruble-sign text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Общая сумма</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatPrice(orders.reduce((sum, o) => sum + o.total, 0)) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Список заказов -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Список заказов</h3>
                <p class="text-gray-600 mt-1">{{ orders.length }} заказов в системе</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <i class="fa-solid fa-list"></i>
                <span>Все заказы</span>
              </div>
            </div>
          </div>

          <div v-if="loading" class="text-center py-12">
            <div class="inline-flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>Загрузка заказов...</span>
            </div>
          </div>
          
          <div v-else-if="orders.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <i class="fa-solid fa-shopping-cart text-4xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-500 mb-2">Заказы отсутствуют</h3>
            <p class="text-gray-400">Пока что никто не сделал заказ</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Заказ</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Клиент</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Доставка</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Товары</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Сумма</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Оплачено</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4">
                    <div>
                      <div class="font-semibold text-gray-900">#{{ order.id.slice(-6) }}</div>
                      <div class="text-sm text-gray-500">{{ formatDate(order.date) }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div>
                      <div class="font-semibold text-gray-900">{{ order.customer.name }}</div>
                      <div class="text-sm text-gray-500">{{ order.customer.address.phone }}</div>
                      <div class="text-sm text-gray-500">{{ order.customer.address.city }}, {{ order.customer.address.street }}, {{ order.customer.address.apartment }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="order.deliveryTime === 'asap'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i class="fa-solid fa-bolt mr-1"></i>
                      Как можно скорее
                    </div>
                    <div v-else-if="order.deliveryTime === 'scheduled' && order.scheduledTime" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <i class="fa-solid fa-calendar mr-1"></i>
                      {{ formatScheduledTime(order.scheduledTime) }}
                    </div>
                    <div v-else class="text-gray-500">—</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="relative inline-block"
                         @mouseenter="hoverOrderId = order.id"
                         @mouseleave="hoverOrderId = null">
                      <button class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition">
                        <i class="fa-solid fa-receipt mr-2"></i>
                        Товары
                        <span class="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full bg-orange-500 text-white text-[11px]">{{ order.items.length }}</span>
                      </button>

                      <div v-if="hoverOrderId === order.id"
                           class="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fadeIn">
                        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                          <div class="font-semibold text-gray-900 flex items-center">
                            <i class="fa-solid fa-bag-shopping text-orange-500 mr-2"></i>
                            Состав заказа
                          </div>
                          <div class="text-xs text-gray-500">{{ order.items.length }} поз.</div>
                        </div>
                        <div class="max-h-72 overflow-auto">
                          <div v-for="it in order.items" :key="it.id + '_' + it.name" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                            <div class="flex items-center space-x-3">
                              <img :src="getItemImage(it)" alt="" class="w-10 h-10 object-cover rounded-lg border border-gray-200" loading="lazy" />
                              <div>
                                <div class="text-sm font-medium text-gray-900">{{ getItemName(it) }}</div>
                                <div class="text-xs text-gray-500">Цена: {{ formatPrice(getItemUnitPrice(it)) }}</div>
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="text-sm text-gray-700">× {{ it.quantity }}</div>
                              <div class="text-sm font-semibold text-gray-900">{{ formatPrice(getItemUnitPrice(it) * it.quantity) }}</div>
                            </div>
                          </div>
                          <div v-if="order.extrasSelection && order.extrasSelection.some(qty => qty > 0)" class="px-4 py-2 bg-orange-50 border-t border-orange-100">
                            <div class="text-xs font-semibold text-orange-700 mb-1 flex items-center"><i class="fa-solid fa-plus mr-1"></i>Дополнительно</div>
                            <div v-for="(qty, idx) in (order.extrasSelection || [])" :key="'ex-' + idx" v-if="qty > 0" class="text-xs text-orange-700 flex justify-between">
                              <span>{{ (order.extras && order.extras[idx] ? order.extras[idx].name : defaultExtras[idx].name) }}</span>
                              <span>× {{ qty }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-2xl">
                          <span class="text-sm text-gray-600">Итого по товарам</span>
                          <span class="text-sm font-bold text-orange-600">{{ formatPrice(order.items.reduce((s, i) => s + i.price * i.quantity, 0)) }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-semibold text-gray-900">{{ formatPrice(order.total) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center">
                      <button 
                        @click="togglePaidStatus(order)"
                        :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
                          order.paid 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        ]"
                      >
                        <i :class="order.paid ? 'fa-solid fa-check-circle mr-1' : 'fa-solid fa-times-circle mr-1'"></i>
                        {{ order.paid ? 'Оплачено' : 'Не оплачено' }}
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center space-x-2">
                      <button 
                        @click="openEditModal(order)" 
                        class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition"
                        title="Редактировать"
                      >
                        <i class="fa-solid fa-edit"></i>
                      </button>
                      <button 
                        @click="deleteOrder(order)" 
                        class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Удалить"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Модальное окно редактирования заказа -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-red-900/20 to-orange-900/20 backdrop-blur-sm"></div>
        <!-- Dialog -->
        <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-white/40 max-w-5xl w-full max-h-[92vh] overflow-y-auto modal-enter">
          <!-- Header -->
          <div class="sticky top-0 rounded-t-3xl px-8 py-6 border-b border-white/40 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-start space-x-3">
                <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                  <i class="fa-solid fa-receipt text-white text-xl"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-extrabold tracking-tight drop-shadow-sm">Редактировать заказ</h3>
                  <p class="text-orange-100 text-sm">Номер заказа: <span class="font-semibold">#{{ editingOrder?.id?.slice(-6) }}</span></p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold shadow-sm', editingOrder?.paid ? 'bg-emerald-400/20 text-white border border-white/30' : 'bg-yellow-400/20 text-white border border-white/30']">
                  {{ editingOrder?.paid ? 'Оплачен' : 'Не оплачен' }}
                </span>
                <button @click="closeEditModal" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-200">
                  <i class="fa-solid fa-xmark text-white text-lg"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="editingOrder" class="p-8 space-y-6">
            <!-- Товары в заказе -->
            <div class="bg-gray-50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fa-solid fa-box mr-2 text-orange-500"></i>
                  Товары в заказе
                </h4>
                <span class="text-sm text-gray-500">{{ editingOrder.items.length }} товаров</span>
              </div>
              
              <div v-if="editingOrder.items.length === 0" class="text-gray-500 text-center py-8">
                <i class="fa-solid fa-shopping-cart text-4xl mb-4 text-gray-300"></i>
                <p>Нет товаров в заказе</p>
              </div>
              
              <div v-else class="space-y-3">
                <div v-for="(item, index) in editingOrder.items" :key="(item.id || index) + '_' + index" 
                     class="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center space-x-4">
                    <img :src="getItemImage(item)" 
                         alt="" 
                         class="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                         loading="lazy" />
                    <div class="flex-1">
                      <h5 class="font-medium text-gray-900 text-lg">{{ getItemName(item) }}</h5>
                      <p class="text-sm text-gray-500">{{ formatPrice(getItemUnitPrice(item)) }} за шт.</p>
                      <p class="text-xs text-gray-400">ID: {{ item.id?.slice(-8) || 'N/A' }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button @click="decreaseItemQty(index)" 
                              class="w-8 h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition shadow-sm">
                        <i class="fa-solid fa-minus text-sm text-gray-600"></i>
                      </button>
                      <span class="w-12 text-center font-bold text-lg">{{ item.quantity }}</span>
                      <button @click="increaseItemQty(index)" 
                              class="w-8 h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition shadow-sm">
                        <i class="fa-solid fa-plus text-sm text-gray-600"></i>
                      </button>
                    </div>
                    
                    <div class="text-right">
                      <div class="font-bold text-lg text-gray-900">
                        {{ formatPrice(getItemUnitPrice(item) * item.quantity) }}
                      </div>
                    </div>
                    
                    <button @click="removeItemFromOrder(index)" 
                            class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                            title="Удалить товар">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Добавление нового товара -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h5 class="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <i class="fa-solid fa-plus mr-2 text-green-500"></i>
                  Добавить товар
                </h5>
                <div class="flex space-x-3">
                  <select v-model="selectedProductId" 
                          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option disabled value="">Выберите товар для добавления</option>
                    <option v-for="product in availableProducts" 
                            :key="product.id" 
                            :value="product.id">
                      {{ product.name }} - {{ formatPrice(product.price) }}
                    </option>
                  </select>
                  <button @click="addProductToOrder" 
                          :disabled="!selectedProductId"
                          class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition">
                    <i class="fa-solid fa-plus mr-2"></i>
                    Добавить
                  </button>
                </div>
              </div>
            </div>

            <!-- Информация о клиенте -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-user mr-2 text-orange-500"></i>
                Информация о клиенте
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input v-model="editingOrder.customer.name" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input v-model="editingOrder.customer.address.phone" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Город</label>
                  <input v-model="editingOrder.customer.address.city" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Улица</label>
                  <input v-model="editingOrder.customer.address.street" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Дом/Квартира</label>
                  <input v-model="editingOrder.customer.address.apartment" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Количество персон</label>
                  <div class="flex items-center space-x-2">
                    <button @click="decreasePersons" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                      <i class="fa-solid fa-minus text-sm"></i>
                    </button>
                    <span class="w-8 text-center font-medium">{{ editingOrder.persons }}</span>
                    <button @click="increasePersons" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                      <i class="fa-solid fa-plus text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Дополнительные товары -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-plus-circle mr-2 text-orange-500"></i>
                Дополнительные товары
              </h4>
              <div class="space-y-3">
                <div v-for="(extra, idx) in defaultExtras" :key="extra.name" 
                     class="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i class="fa-solid fa-utensils text-orange-600"></i>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900">{{ extra.name }}</h5>
                      <p class="text-sm text-gray-500">{{ formatPrice(extra.price) }} за шт.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button @click="decreaseExtraQty(idx)" 
                              class="w-8 h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition shadow-sm">
                        <i class="fa-solid fa-minus text-sm text-gray-600"></i>
                      </button>
                      <span class="w-12 text-center font-bold text-lg">
                        {{ (editingOrder.extrasSelection || [])[idx] || 0 }}
                      </span>
                      <button @click="increaseExtraQty(idx)" 
                              class="w-8 h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition shadow-sm">
                        <i class="fa-solid fa-plus text-sm text-gray-600"></i>
                      </button>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-lg text-gray-900">
                        {{ formatPrice(extra.price * ((editingOrder.extrasSelection || [])[idx] || 0)) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Время доставки -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-clock mr-2 text-orange-500"></i>
                Время доставки
              </h4>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input 
                      v-model="editingOrder.deliveryTime" 
                      type="radio" 
                      value="asap" 
                      class="mr-2 text-orange-500 focus:ring-orange-500"
                    />
                    <span class="text-gray-700">Как можно скорее</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="editingOrder.deliveryTime" 
                      type="radio" 
                      value="scheduled" 
                      class="mr-2 text-orange-500 focus:ring-orange-500"
                    />
                    <span class="text-gray-700">Запланированное время</span>
                  </label>
                </div>
                <div v-if="editingOrder.deliveryTime === 'scheduled'" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Дата и время доставки</label>
                  <input 
                    v-model="editingOrder.scheduledTime" 
                    type="datetime-local" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <!-- Статус оплаты -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-credit-card mr-2 text-orange-500"></i>
                Статус оплаты
              </h4>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input 
                    v-model="editingOrder.paid" 
                    type="checkbox" 
                    class="mr-2 text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span class="text-gray-700">Заказ оплачен</span>
                </label>
              </div>
            </div>

            <!-- Итоговая сумма -->
            <div class="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">Итоговая сумма</h4>
                  <p class="text-sm text-gray-600">С учетом товаров и дополнений</p>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-orange-600">{{ formatPrice(calculateTotal()) }}</div>
                </div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                @click="closeEditModal" 
                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
              >
                Отмена
              </button>
              <button 
                @click="saveOrderChanges" 
                class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, computed, onMounted } = Vue;
    const { useRouter } = VueRouter;
    const router = useRouter();
    
    const orders = ref([]);
    const hoverOrderId = ref(null);
    const loading = ref(true);
    const showEditModal = ref(false);
    const editingOrder = ref(null);
    const products = ref([]);
    const selectedProductId = ref('');

    // Стандартный список допов
    const defaultExtras = [
      { name: 'Соевый соус', price: 50 },
      { name: 'Имбирь', price: 50 },
      { name: 'Васаби', price: 50 }
    ];

    function standardizeItemShape(rawItem) {
      const id = rawItem.product_id || rawItem.id;
      return {
        id,
        name: rawItem.name || getProductById(id)?.name || null,
        image: rawItem.image || getProductById(id)?.image || null,
        price: typeof rawItem.price === 'number' ? rawItem.price : (getProductById(id)?.price || 0),
        quantity: rawItem.quantity || 1
      };
    }

    function enrichOrderItems(order) {
      if (!order || !Array.isArray(order.items)) return order;
      order.items = order.items.map(standardizeItemShape);
      return order;
    }

    async function fetchOrders() {
      try {
        const res = await axios.get('/api/orders');
        orders.value = (res.data || []).map(o => enrichOrderItems({
          ...o,
          deliveryTime: o.delivery_time || o.deliveryTime || 'asap',
          scheduledTime: o.scheduled_time || o.scheduledTime || null,
          extrasSelection: Array.isArray(o.extras_selection) ? o.extras_selection : (o.extrasSelection || [])
        }));
      } catch (e) {
        console.error('Не удалось получить заказы', e);
      } finally {
        loading.value = false;
      }
    }

    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products');
        products.value = res.data || [];
      } catch (e) {
        console.error('Не удалось получить товары', e);
      }
    }

    onMounted(async () => {
      await fetchProducts();
      await fetchOrders();
    });

    async function deleteOrder(order) {
      if (!confirm('Удалить заказ?')) return;
      try {
        await axios.delete(`/api/orders/${order.id}`);
        await fetchOrders();
      } catch (e) {
        console.error('Не удалось удалить заказ', e);
        alert('Ошибка удаления заказа');
      }
    }

    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function formatScheduledTime(dateTimeStr) {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('ru-RU', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    function openEditModal(order) {
      const copy = JSON.parse(JSON.stringify(order));
      editingOrder.value = enrichOrderItems(copy);
      // Гарантируем корректную инициализацию массива допов под длину defaultExtras
      if (!Array.isArray(editingOrder.value.extrasSelection)) {
        editingOrder.value.extrasSelection = defaultExtras.map(() => 0);
      } else if (editingOrder.value.extrasSelection.length !== defaultExtras.length) {
        const base = editingOrder.value.extrasSelection.slice();
        editingOrder.value.extrasSelection = defaultExtras.map((_, idx) => Number(base[idx]) || 0);
      }
      
      // Инициализируем extrasSelection если его нет
      if (!editingOrder.value.extrasSelection) {
        editingOrder.value.extrasSelection = defaultExtras.map(() => 0);
      }
      
      showEditModal.value = true;
    }

    function closeEditModal() {
      showEditModal.value = false;
      editingOrder.value = null;
    }

    function editOrder(order) {
      router.push('/admin/orders/' + order.id + '/edit');
    }

    async function togglePaidStatus(order) {
      try {
        await axios.put(`/api/orders/${order.id}`, {
          paid: !order.paid
        });
        await fetchOrders();
      } catch (e) {
        console.error('Не удалось изменить статус оплаты', e);
        alert('Ошибка изменения статуса оплаты');
      }
    }

    // Функции для работы с модальным окном
    function increaseItemQty(index) {
      if (editingOrder.value && editingOrder.value.items[index]) {
        editingOrder.value.items[index].quantity++;
      }
    }

    function decreaseItemQty(index) {
      if (editingOrder.value && editingOrder.value.items[index] && editingOrder.value.items[index].quantity > 1) {
        editingOrder.value.items[index].quantity--;
      }
    }

    function removeItemFromOrder(index) {
      if (editingOrder.value && editingOrder.value.items[index]) {
        editingOrder.value.items.splice(index, 1);
      }
    }

    function increasePersons() {
      if (editingOrder.value) {
        editingOrder.value.persons++;
      }
    }

    function decreasePersons() {
      if (editingOrder.value && editingOrder.value.persons > 1) {
        editingOrder.value.persons--;
      }
    }

    function getProductById(productId) {
      return products.value.find(p => p.id === productId);
    }

    function findProductImage(productId) {
      const p = getProductById(productId);
      return (p && p.image) ? p.image : 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10';
    }

    function getItemName(item) {
      return item.name || getProductById(item.id)?.name || 'Неизвестный товар';
    }

    function getItemImage(item) {
      return item.image || getProductById(item.id)?.image || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10';
    }

    function getItemUnitPrice(item) {
      if (typeof item.price === 'number') return item.price;
      const p = getProductById(item.id);
      return p ? p.price : 0;
    }

    function calculateTotal() {
      if (!editingOrder.value) return 0;
      let total = 0;
      editingOrder.value.items.forEach(item => {
        total += item.price * item.quantity;
      });
      // Добавляем стоимость допов
      if (editingOrder.value.extrasSelection) {
        editingOrder.value.extrasSelection.forEach((qty, idx) => {
          if (qty > 0 && defaultExtras[idx]) {
            total += defaultExtras[idx].price * qty;
          }
        });
      }
      return total;
    }

    // Функции для работы с допами
    function increaseExtraQty(idx) {
      if (!editingOrder.value) return;
      if (!Array.isArray(editingOrder.value.extrasSelection)) {
        editingOrder.value.extrasSelection = defaultExtras.map(() => 0);
      }
      const next = [...editingOrder.value.extrasSelection];
      next[idx] = Number(next[idx] || 0) + 1;
      editingOrder.value.extrasSelection = next;
    }

    function decreaseExtraQty(idx) {
      if (!editingOrder.value || !Array.isArray(editingOrder.value.extrasSelection)) return;
      const current = Number(editingOrder.value.extrasSelection[idx] || 0);
      if (current <= 0) return;
      const next = [...editingOrder.value.extrasSelection];
      next[idx] = current - 1;
      editingOrder.value.extrasSelection = next;
    }

    // Функции для добавления товаров
    function addProductToOrder() {
      if (!selectedProductId.value || !editingOrder.value) return;
      
      const product = products.value.find(p => p.id === selectedProductId.value);
      if (!product) return;

      // Проверяем, есть ли уже такой товар в заказе
      const existingItem = editingOrder.value.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        editingOrder.value.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      selectedProductId.value = '';
    }

    // Computed для доступных товаров
    const availableProducts = computed(() => {
      if (!editingOrder.value) return products.value;
      const existingIds = editingOrder.value.items.map(item => item.id);
      return products.value.filter(product => !existingIds.includes(product.id));
    });

    async function saveOrderChanges() {
      if (!editingOrder.value) return;
      
      try {
        const updatedOrder = {
          customer_name: editingOrder.value.customer?.name || editingOrder.value.customer_name || '',
          customer_phone: editingOrder.value.customer?.address?.phone || editingOrder.value.customer_phone || '',
          customer_address: editingOrder.value.customer?.address ? 
            `${editingOrder.value.customer.address.city || ''}, ${editingOrder.value.customer.address.street || ''}, ${editingOrder.value.customer.address.apartment || ''}`.trim() :
            editingOrder.value.customer_address || '',
          total_amount: calculateTotal(),
          persons: editingOrder.value.persons,
          extras_selection: editingOrder.value.extrasSelection || [],
          notes: editingOrder.value.notes || '',
          delivery_time: editingOrder.value.deliveryTime || 'asap',
          scheduled_time: (editingOrder.value.deliveryTime === 'scheduled') ? (editingOrder.value.scheduledTime || null) : null,
          paid: editingOrder.value.paid || false
        };
        
        await axios.put(`/api/orders/${editingOrder.value.id}`, updatedOrder);
        await fetchOrders();
        closeEditModal();
      } catch (e) {
        console.error('Не удалось сохранить изменения заказа', e);
        alert('Ошибка сохранения заказа');
      }
    }

    return { 
      orders, 
      loading, 
      showEditModal, 
      editingOrder, 
      products,
      selectedProductId,
      availableProducts,
      deleteOrder, 
      editOrder, 
      openEditModal, 
      closeEditModal, 
      togglePaidStatus, 
      increaseItemQty, 
      decreaseItemQty, 
      removeItemFromOrder, 
      increasePersons, 
      decreasePersons, 
      increaseExtraQty,
      decreaseExtraQty,
      addProductToOrder,
      findProductImage, 
      getProductById,
      getItemName,
      getItemImage,
      getItemUnitPrice,
      calculateTotal, 
      saveOrderChanges, 
      formatPrice, 
      formatDate, 
      formatScheduledTime, 
      defaultExtras,
      hoverOrderId 
    };
  }
};

window.AdminProductsView = {
  name: 'AdminProductsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Управление товарами</h1>
            <p class="text-gray-600">Добавляйте, редактируйте и удаляйте товары в вашем магазине</p>
          </div>
          <button @click="openCreateModal" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition">
            <i class="fa-solid fa-plus mr-2"></i>
            Добавить товар
          </button>
        </div>

        <!-- Модалка добавления/редактирования товара -->
        <div v-if="showProductModal" class="fixed inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-enter" @click.self="closeProductModal">
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto hover-lift">
            <!-- Заголовок модалки -->
            <div class="relative px-8 py-6 border-b border-gray-200/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i class="fa-solid fa-box text-white text-xl animate-pulse-slow"></i>
                  </div>
                  <div>
                    <h2 class="text-3xl font-bold gradient-text">{{ editMode ? 'Редактировать товар' : 'Добавить товар' }}</h2>
                    <p class="text-gray-600 mt-1">{{ editMode ? 'Внесите изменения в товар' : 'Заполните информацию о новом товаре' }}</p>
                  </div>
                </div>
                <button @click="closeProductModal" class="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <i class="fa-solid fa-times text-lg"></i>
                </button>
              </div>
            </div>

            <form @submit.prevent="saveProduct" class="p-8 space-y-8">
              <!-- Основная информация -->
              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-tags text-orange-500 mr-2"></i>
                      Категория товара
                    </label>
                    <input 
                      v-model="form.category" 
                      list="product-categories" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg" 
                      placeholder="Выберите или введите категорию" 
                      required 
                    />
                    <datalist id="product-categories">
                      <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                    </datalist>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-tag text-orange-500 mr-2"></i>
                      Название товара
                    </label>
                    <input 
                      v-model="form.name" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg" 
                      placeholder="Введите название товара" 
                      required 
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-align-left text-orange-500 mr-2"></i>
                      Описание товара
                    </label>
                    <textarea 
                      v-model="form.description" 
                      rows="4" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg resize-none" 
                      placeholder="Опишите товар подробно..."
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-ruble-sign text-orange-500 mr-2"></i>
                      Цена (₽)
                    </label>
                    <input 
                      v-model="form.price" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg" 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                </div>

                <!-- Изображение и настройки -->
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-image text-orange-500 mr-2"></i>
                      Изображение товара
                    </label>
                    
                    <!-- Предпросмотр изображения -->
                    <div v-if="form.image" class="mb-4">
                      <div class="relative group">
                        <img 
                          :src="form.image" 
                          alt="Предпросмотр" 
                          class="w-full h-48 object-cover rounded-2xl border-4 border-orange-200 shadow-lg group-hover:shadow-xl transition-all duration-300" 
                        />
                        <button 
                          @click="clearImage" 
                          type="button"
                          class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <i class="fa-solid fa-times text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <!-- URL изображения -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-600 mb-2">URL изображения</label>
                      <div class="flex space-x-2">
                        <input 
                          v-model="imageUrl" 
                          type="url" 
                          class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300" 
                          placeholder="https://example.com/image.jpg" 
                        />
                        <button 
                          @click="updateImagePreview" 
                          type="button"
                          class="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          <i class="fa-solid fa-search"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Загрузка с ПК -->
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-2">Загрузка с компьютера</label>
                      <div class="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          @change="onImageFileSelected" 
                          class="w-full px-4 py-3 border-2 border-dashed border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:border-orange-400 cursor-pointer" 
                        />
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="text-center">
                            <i class="fa-solid fa-cloud-upload-alt text-orange-500 text-2xl mb-2"></i>
                            <p class="text-sm text-gray-500">Выберите изображение</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Настройки товара -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                      <div class="flex items-center">
                        <i class="fa-solid fa-check-circle text-green-500 text-xl mr-3"></i>
                        <span class="font-semibold text-gray-700">Товар доступен для заказа</span>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input v-model="form.available" type="checkbox" class="sr-only peer" />
                        <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                      <div class="flex items-center">
                        <i class="fa-solid fa-fire text-orange-500 text-xl mr-3 animate-pulse-slow"></i>
                        <span class="font-semibold text-gray-700">Хит продаж</span>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input v-model="form.hit" type="checkbox" class="sr-only peer" />
                        <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Кнопки действий -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  @click="closeProductModal" 
                  class="px-8 py-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
                >
                  <i class="fa-solid fa-times mr-2"></i>
                  Отмена
                </button>
                <button 
                  type="submit" 
                  :disabled="loading" 
                  class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-300 font-bold hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-2"></i>
                  <i v-else-if="editMode" class="fa-solid fa-save mr-2"></i>
                  <i v-else class="fa-solid fa-plus mr-2"></i>
                  {{ loading ? 'Сохранение...' : (editMode ? 'Сохранить изменения' : 'Добавить товар') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Список товаров -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Список товаров</h3>
                <p class="text-gray-600 mt-1">{{ products.length }} товаров в каталоге</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <i class="fa-solid fa-list"></i>
                <span>Все товары</span>
              </div>
            </div>
          </div>

          <div v-if="products.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <i class="fa-solid fa-box text-4xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-500 mb-2">Товары отсутствуют</h3>
            <p class="text-gray-400">Добавьте первый товар в ваш магазин</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Товар</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Категория</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Цена</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Доступен</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Хит продаж</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-4">
                      <img 
                        :src="product.image || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" 
                        :alt="product.name" 
                        class="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                        loading="lazy"
                      />
                      <div>
                        <div class="font-semibold text-gray-900">{{ product.name }}</div>
                        <div class="text-sm text-gray-500 max-w-xs truncate">{{ product.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {{ product.category_name || product.category || 'Без категории' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-semibold text-gray-900">{{ formatPrice(product.price) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center">
                      <span 
                        :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                          product.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        ]"
                      >
                        <i :class="product.available ? 'fa-solid fa-check-circle mr-1' : 'fa-solid fa-times-circle mr-1'"></i>
                        {{ product.available ? 'Доступен' : 'Недоступен' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center">
                      <span 
                        :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                          product.hit 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        <i :class="product.hit ? 'fa-solid fa-fire mr-1' : 'fa-solid fa-minus mr-1'"></i>
                        {{ product.hit ? 'Хит' : 'Обычный' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center space-x-2">
                      <button 
                        @click="editProduct(product)" 
                        class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition"
                        title="Редактировать"
                      >
                        <i class="fa-solid fa-edit"></i>
                      </button>
                      <button 
                        @click="deleteProduct(product)" 
                        class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Удалить"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, computed, onMounted } = Vue;
    
    const products = ref([]);
    const categories = ref([]);
    const form = ref({
      id: null,
      name: '',
      description: '',
      price: '',
      image: '',
      available: true,
      category: '',
      hit: false
    });
    const editMode = ref(false);
    const loading = ref(false);
    const showProductModal = ref(false);
    const imageUrl = ref('');

    // Список доступных категорий
    const categoryOptions = computed(() => {
      const set = new Set();
      categories.value.forEach(c => set.add(c.name));
      products.value.forEach(p => {
        if (p.category_name) set.add(p.category_name);
      });
      return Array.from(set);
    });

    async function fetchProducts() {
      loading.value = true;
      try {
        const res = await axios.get('/api/products');
        products.value = res.data;
        const catsRes = await axios.get('/api/categories');
        categories.value = catsRes.data;
      } finally {
        loading.value = false;
      }
    }

    onMounted(fetchProducts);

    function openCreateModal() {
      resetForm();
      editMode.value = false;
      showProductModal.value = true;
    }

    async function saveProduct() {
      console.log('Form data before save:', form.value);
      console.log('Available categories:', categories.value);
      
      if (!form.value.category) {
        alert('Пожалуйста, выберите категорию.');
        return;
      }
      
      const category = categories.value.find(c => c.name === form.value.category);
      if (!category) {
        alert('Категория не найдена. Пожалуйста, выберите существующую категорию.');
        return;
      }
      const payload = {
        name: form.value.name,
        description: form.value.description,
        price: parseFloat(form.value.price),
        image: form.value.image,
        available: form.value.available,
        category_id: category.id,
        hit: !!form.value.hit
      };
      
      console.log('Sending payload:', payload);
      
      try {
        if (editMode.value) {
          await axios.put(`/api/products/${form.value.id}`, payload);
        } else {
          await axios.post('/api/products', payload);
        }
        await fetchProducts();
        closeProductModal();
      } catch (error) {
        console.error('Error saving product:', error);
        console.error('Error response:', error.response?.data);
        alert('Ошибка при сохранении товара: ' + (error.response?.data?.error || error.message));
      }
    }

    function editProduct(product) {
      form.value.id = product.id;
      form.value.name = product.name;
      form.value.description = product.description;
      form.value.price = product.price;
      form.value.image = product.image;
      form.value.available = product.available;
      form.value.category = product.category_name || product.category || '';
      form.value.hit = product.hit || false;
      editMode.value = true;
      showProductModal.value = true;
    }

    async function deleteProduct(product) {
      if (confirm('Удалить этот товар?')) {
        await axios.delete(`/api/products/${product.id}`);
        await fetchProducts();
      }
    }

    function resetForm() {
      form.value.id = null;
      form.value.name = '';
      form.value.description = '';
      form.value.price = '';
      form.value.image = '';
      form.value.available = true;
      form.value.category = '';
      form.value.hit = false;
      editMode.value = false;
    }

    function closeProductModal() {
      showProductModal.value = false;
    }

    function onImageFileSelected(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        // Устанавливаем data URL как источник изображения
        form.value.image = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function updateImagePreview() {
      if (imageUrl.value) {
        form.value.image = imageUrl.value;
      }
    }

    function clearImage() {
      form.value.image = '';
      imageUrl.value = '';
    }

    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }

    return { 
      products, 
      form, 
      editMode, 
      loading,
      categoryOptions,
      imageUrl,
      saveProduct, 
      editProduct, 
      deleteProduct, 
      resetForm, 
      openCreateModal,
      closeProductModal,
      showProductModal,
      formatPrice,
      onImageFileSelected,
      updateImagePreview,
      clearImage
    };
  }
};

window.AdminNewsView = {
  name: 'AdminNewsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Управление новостями</h1>
          <p class="text-gray-600">Добавляйте, редактируйте и удаляйте новости</p>
        </div>

        <!-- Кнопка добавления новости -->
        <div class="mb-8">
          <button @click="openCreateModal" class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg">
            <i class="fa-solid fa-plus mr-2"></i>
            Добавить новость
          </button>
        </div>

        <!-- Модалка добавления/редактирования новости -->
        <div v-if="showNewsModal" class="fixed inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-enter" @click.self="closeNewsModal">
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hover-lift">
            <!-- Заголовок модалки -->
            <div class="relative px-8 py-6 border-b border-gray-200/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i class="fa-solid fa-newspaper text-white text-xl animate-pulse-slow"></i>
                  </div>
                  <div>
                    <h2 class="text-3xl font-bold gradient-text">{{ editMode ? 'Редактировать новость' : 'Добавить новость' }}</h2>
                    <p class="text-gray-600 mt-1">{{ editMode ? 'Внесите изменения в новость' : 'Заполните информацию о новой новости' }}</p>
                  </div>
                </div>
                <button @click="closeNewsModal" class="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <i class="fa-solid fa-times text-lg"></i>
                </button>
              </div>
            </div>

            <form @submit.prevent="saveNews" class="p-8 space-y-8">
              <!-- Основная информация -->
              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-heading text-orange-500 mr-2"></i>
                      Заголовок новости
                    </label>
                    <input 
                      v-model="form.title" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg" 
                      placeholder="Введите заголовок новости" 
                      required 
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-align-left text-orange-500 mr-2"></i>
                      Краткое описание
                    </label>
                    <textarea 
                      v-model="form.excerpt" 
                      rows="4" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg resize-none" 
                      placeholder="Краткое описание новости для превью..."
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-calendar text-orange-500 mr-2"></i>
                      Дата публикации
                    </label>
                    <input 
                      v-model="form.publishedAt" 
                      type="datetime-local" 
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg" 
                    />
                  </div>
                </div>

                <!-- Изображение и настройки -->
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <i class="fa-solid fa-image text-orange-500 mr-2"></i>
                      Изображение новости
                    </label>
                    
                    <!-- Предпросмотр изображения -->
                    <div v-if="form.image" class="mb-4">
                      <div class="relative group">
                        <img 
                          :src="form.image" 
                          alt="Предпросмотр" 
                          class="w-full h-48 object-cover rounded-2xl border-4 border-orange-200 shadow-lg group-hover:shadow-xl transition-all duration-300" 
                        />
                        <button 
                          @click="clearImage" 
                          type="button"
                          class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <i class="fa-solid fa-times text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <!-- URL изображения -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-600 mb-2">URL изображения</label>
                      <div class="flex space-x-2">
                        <input 
                          v-model="imageUrl" 
                          type="url" 
                          class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300" 
                          placeholder="https://example.com/image.jpg" 
                        />
                        <button 
                          @click="updateImagePreview" 
                          type="button"
                          class="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          <i class="fa-solid fa-search"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Загрузка с ПК -->
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-2">Загрузка с компьютера</label>
                      <div class="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          @change="onImageFileSelected" 
                          class="w-full px-4 py-3 border-2 border-dashed border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:border-orange-400 cursor-pointer" 
                        />
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="text-center">
                            <i class="fa-solid fa-cloud-upload-alt text-orange-500 text-2xl mb-2"></i>
                            <p class="text-sm text-gray-500">Выберите изображение</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Настройки публикации -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                      <div class="flex items-center">
                        <i class="fa-solid fa-globe text-green-500 text-xl mr-3"></i>
                        <span class="font-semibold text-gray-700">Опубликовать новость</span>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input v-model="form.published" type="checkbox" class="sr-only peer" />
                        <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Полный текст новости -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <i class="fa-solid fa-file-text text-orange-500 mr-2"></i>
                  Полное содержание новости
                </label>
                <textarea 
                  v-model="form.content" 
                  rows="8" 
                  class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg resize-none" 
                  placeholder="Напишите полное содержание новости..."
                ></textarea>
              </div>

              <!-- Кнопки действий -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  @click="closeNewsModal" 
                  class="px-8 py-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
                >
                  <i class="fa-solid fa-times mr-2"></i>
                  Отмена
                </button>
                <button 
                  type="submit" 
                  :disabled="loading" 
                  class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-300 font-bold hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-2"></i>
                  <i v-else-if="editMode" class="fa-solid fa-save mr-2"></i>
                  <i v-else class="fa-solid fa-plus mr-2"></i>
                  {{ loading ? 'Сохранение...' : (editMode ? 'Сохранить изменения' : 'Добавить новость') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Список новостей -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Список новостей</h3>
                <p class="text-gray-600 mt-1">{{ news.length }} новостей в системе</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <i class="fa-solid fa-list"></i>
                <span>Все новости</span>
              </div>
            </div>
          </div>

          <div v-if="news.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <i class="fa-solid fa-newspaper text-4xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-500 mb-2">Новости отсутствуют</h3>
            <p class="text-gray-400">Добавьте первую новость</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Новость</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Дата публикации</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Статус</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in news" :key="item.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-4">
                      <img 
                        :src="item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'" 
                        :alt="item.title" 
                        class="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                        loading="lazy"
                      />
                      <div>
                        <div class="font-semibold text-gray-900">{{ item.title }}</div>
                        <div class="text-sm text-gray-500 max-w-xs truncate">{{ item.excerpt }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ formatDate(item.publishedAt) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center">
                      <span 
                        :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                          item.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        <i :class="item.published ? 'fa-solid fa-check-circle mr-1' : 'fa-solid fa-clock mr-1'"></i>
                        {{ item.published ? 'Опубликовано' : 'Черновик' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center space-x-2">
                      <button 
                        @click="editItem(item)" 
                        class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition"
                        title="Редактировать"
                      >
                        <i class="fa-solid fa-edit"></i>
                      </button>
                      <button 
                        @click="deleteItem(item)" 
                        class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Удалить"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, onMounted } = Vue;
    
    const news = ref([]);
    const form = ref({
      id: null,
      title: '',
      excerpt: '',
      content: '',
      image: '',
      published: true,
      publishedAt: new Date().toISOString().slice(0, 16)
    });
    const editMode = ref(false);
    const loading = ref(false);
    const showNewsModal = ref(false);
    const imageUrl = ref('');

    async function fetchNews() {
      try {
        const res = await axios.get('/api/news');
        news.value = res.data || [];
      } catch (e) {
        console.error('Не удалось загрузить новости', e);
      }
    }

    onMounted(fetchNews);

    async function saveNews() {
      loading.value = true;
      try {
        const payload = {
          title: form.value.title,
          excerpt: form.value.excerpt,
          content: form.value.content,
          image: form.value.image,
          published: form.value.published,
          publishedAt: form.value.publishedAt
        };

        console.log('Saving news with payload:', payload);
        console.log('Edit mode:', editMode.value);
        console.log('Form ID:', form.value.id);
        console.log('Auth header:', axios.defaults.headers.common['Authorization']);

        if (editMode.value) {
          console.log('PUT request to:', `/api/news/${form.value.id}`);
          await axios.put(`/api/news/${form.value.id}`, payload);
        } else {
          console.log('POST request to:', '/api/news');
          await axios.post('/api/news', payload);
        }

        await fetchNews();
        closeNewsModal();
      } catch (error) {
        console.error('Error saving news:', error);
        console.error('Error response:', error.response?.data);
        alert('Ошибка при сохранении новости: ' + (error.response?.data?.error || error.message));
      } finally {
        loading.value = false;
      }
    }

    function openCreateModal() {
      resetForm();
      editMode.value = false;
      showNewsModal.value = true;
    }

    function editItem(item) {
      form.value.id = item.id;
      form.value.title = item.title;
      form.value.excerpt = item.excerpt;
      form.value.content = item.content;
      form.value.image = item.image;
      form.value.published = item.published;
      form.value.publishedAt = item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
      editMode.value = true;
      showNewsModal.value = true;
    }

    function closeNewsModal() {
      showNewsModal.value = false;
    }

    async function deleteItem(item) {
      if (confirm('Удалить новость?')) {
        await axios.delete(`/api/news/${item.id}`);
        await fetchNews();
      }
    }

    function resetForm() {
      form.value.id = null;
      form.value.title = '';
      form.value.excerpt = '';
      form.value.content = '';
      form.value.image = '';
      form.value.published = true;
      form.value.publishedAt = new Date().toISOString().slice(0, 16);
      editMode.value = false;
    }

    function onImageFileSelected(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        form.value.image = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function updateImagePreview() {
      if (imageUrl.value) {
        form.value.image = imageUrl.value;
      }
    }

    function clearImage() {
      form.value.image = '';
      imageUrl.value = '';
    }

    function formatDate(dateStr) {
      if (!dateStr) return 'Не определена';
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return { 
      news, 
      form, 
      editMode, 
      loading,
      showNewsModal,
      imageUrl,
      saveNews, 
      editItem, 
      deleteItem, 
      resetForm, 
      openCreateModal,
      closeNewsModal,
      onImageFileSelected,
      updateImagePreview,
      clearImage,
      formatDate 
    };
  }
};

// Placeholder assignments for other admin components
// AdminCategoriesView - управление категориями
window.AdminCategoriesView = {
  name: 'AdminCategoriesView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Управление категориями</h1>
            <p class="mt-2 text-gray-600">Добавляйте, редактируйте и удаляйте категории товаров</p>
          </div>
          <button @click="openAddModal" class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover-lift flex items-center space-x-2">
            <i class="fa-solid fa-plus animate-pulse-slow"></i>
            <span>Добавить категорию</span>
          </button>
        </div>

        <!-- Список категорий -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Список категорий</h2>
          </div>
          
          <div v-if="loading" class="p-6 text-center">
            <div class="inline-flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>Загрузка категорий...</span>
            </div>
          </div>
          
          <div v-else-if="categories.length === 0" class="p-6 text-center text-gray-500">
            <i class="fa-solid fa-folder-open text-4xl mb-4"></i>
            <p>Категории не найдены</p>
          </div>
          
          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="category in categories" :key="category.id" class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <!-- Изображение категории -->
              <div class="relative h-48 overflow-hidden">
                <img 
                  v-if="category.image" 
                  :src="category.image" 
                  :alt="category.name" 
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <i class="fa-solid fa-folder text-gray-400 text-4xl"></i>
                </div>
                
                <!-- Overlay с кнопками -->
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <button 
                    @click="editCategory(category)" 
                    class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors transform hover:scale-105"
                    title="Редактировать"
                  >
                    <i class="fa-solid fa-edit mr-2"></i>
                    Редактировать
                  </button>
                  <button 
                    @click="deleteCategory(category)" 
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors transform hover:scale-105"
                    title="Удалить"
                  >
                    <i class="fa-solid fa-trash mr-2"></i>
                    Удалить
                  </button>
                </div>
              </div>
              
              <!-- Информация о категории -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{{ category.name }}</h3>
                <p v-if="category.description" class="text-gray-600 mb-3 line-clamp-2">{{ category.description }}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span class="flex items-center">
                    <i class="fa-solid fa-hashtag mr-1"></i>
                    ID: {{ category.id }}
                  </span>
                  <span class="flex items-center text-orange-500">
                    <i class="fa-solid fa-folder mr-1"></i>
                    Категория
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Супер красивая модалка добавления/редактирования -->
        <div v-if="showAddForm || editingCategory" class="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-orange-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="cancelEdit">
          <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100 modal-enter hover-lift">
            <!-- Заголовок с градиентом -->
            <div class="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-t-3xl px-8 py-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <i class="fa-solid fa-folder-plus text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-white">{{ editingCategory ? 'Редактировать категорию' : 'Создать категорию' }}</h3>
                    <p class="text-orange-100 text-sm">{{ editingCategory ? 'Обновите информацию о категории' : 'Добавьте новую категорию товаров' }}</p>
                  </div>
                </div>
                <button @click="cancelEdit" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-200 group">
                  <i class="fa-solid fa-times text-white text-lg group-hover:scale-110 transition-transform"></i>
                </button>
              </div>
            </div>

            <form @submit.prevent="saveCategory" class="p-8 space-y-6">
              <!-- Название категории -->
              <div class="space-y-2">
                <label class="flex items-center text-sm font-semibold text-gray-700">
                  <i class="fa-solid fa-tag mr-2 text-orange-500"></i>
                  Название категории
                </label>
                <div class="relative">
                  <input 
                    v-model="categoryForm.name" 
                    type="text" 
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-lg font-medium" 
                    placeholder="Введите название категории" 
                    required 
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                    <i class="fa-solid fa-check-circle text-green-500 opacity-0 transition-opacity duration-200" :class="{ 'opacity-100': categoryForm.name.length > 0 }"></i>
                  </div>
                </div>
              </div>

              <!-- Изображение категории -->
              <div class="space-y-4">
                <label class="flex items-center text-sm font-semibold text-gray-700">
                  <i class="fa-solid fa-image mr-2 text-orange-500"></i>
                  Изображение категории
                </label>
                
                <!-- Предварительный просмотр изображения -->
                <div class="relative">
                  <div v-if="imagePreview" class="relative group">
                    <img 
                      :src="imagePreview" 
                      alt="Предварительный просмотр" 
                      class="w-full h-48 object-cover rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                      <button 
                        type="button" 
                        @click="clearImage" 
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
                      >
                        <i class="fa-solid fa-trash mr-2"></i>
                        Удалить
                      </button>
                    </div>
                  </div>
                  
                  <!-- Плейсхолдер для изображения -->
                  <div v-else class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group hover:border-orange-400 hover:bg-orange-50 transition-all duration-200">
                    <i class="fa-solid fa-cloud-upload-alt text-4xl text-gray-400 group-hover:text-orange-500 transition-colors mb-2"></i>
                    <p class="text-gray-500 group-hover:text-orange-600 transition-colors">Загрузите изображение</p>
                  </div>
                </div>

                <!-- Кнопки загрузки -->
                <div class="flex space-x-3">
                  <!-- Загрузка с компьютера -->
                  <label class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover-lift flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-upload animate-pulse-slow"></i>
                    <span>С компьютера</span>
                    <input 
                      type="file" 
                      @change="onImageFileSelected" 
                      accept="image/*" 
                      class="hidden"
                    />
                  </label>
                  
                  <!-- URL изображения -->
                  <button 
                    type="button" 
                    @click="showUrlInput = !showUrlInput" 
                    class="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover-lift flex items-center justify-center space-x-2"
                  >
                    <i class="fa-solid fa-link"></i>
                    <span>По ссылке</span>
                  </button>
                </div>

                <!-- Поле для URL -->
                <div v-if="showUrlInput" class="space-y-2 animate-fadeIn">
                  <label class="text-sm font-medium text-gray-600">URL изображения</label>
                  <div class="flex space-x-2">
                    <input 
                      v-model="categoryForm.image" 
                      type="url" 
                      class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200" 
                      placeholder="https://example.com/image.jpg"
                      @input="updateImagePreview"
                    />
                    <button 
                      type="button" 
                      @click="updateImagePreview" 
                      class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-colors"
                    >
                      <i class="fa-solid fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Описание -->
              <div class="space-y-2">
                <label class="flex items-center text-sm font-semibold text-gray-700">
                  <i class="fa-solid fa-align-left mr-2 text-orange-500"></i>
                  Описание категории
                </label>
                <textarea 
                  v-model="categoryForm.description" 
                  rows="4" 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none" 
                  placeholder="Опишите категорию товаров..."
                ></textarea>
              </div>

              <!-- Кнопки действий -->
              <div class="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  @click="cancelEdit" 
                  class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-200 transform hover:scale-105 hover-lift flex items-center justify-center space-x-2"
                >
                  <i class="fa-solid fa-times"></i>
                  <span>Отмена</span>
                </button>
                <button 
                  type="submit" 
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover-lift flex items-center justify-center space-x-2"
                >
                  <i class="fa-solid fa-save animate-pulse-slow"></i>
                  <span>{{ editingCategory ? 'Сохранить изменения' : 'Создать категорию' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, onMounted } = Vue;
    const categories = ref([]);
    const loading = ref(true);
    const showAddForm = ref(false);
    const editingCategory = ref(null);
    const categoryForm = ref({ name: '', description: '', image: '' });
    const imagePreview = ref('');
    const showUrlInput = ref(false);

    async function fetchCategories() {
      try {
        const res = await axios.get('/api/categories');
        categories.value = res.data || [];
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      } finally {
        loading.value = false;
      }
    }

    async function saveCategory() {
      try {
        if (editingCategory.value) {
          await axios.put(`/api/categories/${editingCategory.value.id}`, categoryForm.value);
        } else {
          await axios.post('/api/categories', categoryForm.value);
        }
        
        await fetchCategories();
        cancelEdit();
      } catch (error) {
        console.error('Ошибка сохранения категории:', error);
        alert('Ошибка сохранения категории: ' + (error.response?.data?.error || error.message));
      }
    }

    function editCategory(category) {
      editingCategory.value = category;
      categoryForm.value = {
        name: category.name,
        description: category.description || '',
        image: category.image || ''
      };
      // Устанавливаем предварительный просмотр изображения
      if (category.image) {
        imagePreview.value = category.image;
      }
      showUrlInput.value = false;
    }

    async function deleteCategory(category) {
      if (!confirm(`Удалить категорию "${category.name}"?`)) return;
      
      try {
        await axios.delete(`/api/categories/${category.id}`);
        await fetchCategories();
      } catch (error) {
        console.error('Ошибка удаления категории:', error);
        alert('Ошибка удаления категории');
      }
    }

    function openAddModal() {
      showAddForm.value = true;
      editingCategory.value = null;
      resetForm();
    }

    function cancelEdit() {
      showAddForm.value = false;
      editingCategory.value = null;
      resetForm();
    }

    function resetForm() {
      categoryForm.value = {
        name: '',
        description: '',
        image: ''
      };
      imagePreview.value = '';
      showUrlInput.value = false;
    }

    // Функция для обработки выбора файла
    function onImageFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
          categoryForm.value.image = e.target.result; // Сохраняем base64
        };
        reader.readAsDataURL(file);
      }
    }

    // Функция для обновления предварительного просмотра по URL
    function updateImagePreview() {
      if (categoryForm.value.image) {
        imagePreview.value = categoryForm.value.image;
      }
    }

    // Функция для очистки изображения
    function clearImage() {
      imagePreview.value = '';
      categoryForm.value.image = '';
    }

    onMounted(fetchCategories);
    
    return {
      categories,
      loading,
      showAddForm,
      editingCategory,
      categoryForm,
      imagePreview,
      showUrlInput,
      fetchCategories,
      saveCategory,
      editCategory,
      deleteCategory,
      openAddModal,
      cancelEdit,
      resetForm,
      onImageFileSelected,
      updateImagePreview,
      clearImage
    };
  }
};

window.AdminOrderEditView = {
  name: 'AdminOrderEditView',
  template: /* html */`
    <div>
      <h2 class="text-2xl font-bold mb-4">Редактировать заказ</h2>
      <div v-if="loading" class="text-center py-8">Загрузка...</div>
      <div v-else-if="!order" class="text-gray-600">Заказ не найден.</div>
      <div v-else class="space-y-6">
        <!-- Товары -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Товары</h3>
          <div v-if="order.items.length === 0" class="text-gray-600 mb-3">Нет товаров.</div>
          <div v-for="it in order.items" :key="it.id" class="flex items-center justify-between py-2 border-b last:border-b-0">
            <div class="flex items-center space-x-3">
              <img :src="it.image || findProductImage(it.id)" alt="" class="w-10 h-10 object-cover rounded" loading="lazy" />
              <span>{{ it.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="decreaseQty(it)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">-</button>
              <span>{{ it.quantity }}</span>
              <button @click="increaseQty(it)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">+</button>
              <button @click="removeItem(it)" class="ml-2 text-red-600 hover:underline">Удалить</button>
            </div>
          </div>
          <!-- Добавление нового товара -->
          <div class="mt-4">
            <label class="block font-medium mb-1">Добавить товар</label>
            <select v-model="selectedProductId" class="w-full border rounded px-3 py-2">
              <option disabled value="">Выберите товар</option>
              <option v-for="prod in availableProducts" :key="prod.id" :value="prod.id">{{ prod.name }} ({{ formatPrice(prod.price) }})</option>
            </select>
            <button @click="addItem" class="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" :disabled="!selectedProductId">Добавить</button>
          </div>
        </div>

        <!-- Персоны и допы -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Настройки</h3>
          <div class="flex items-center space-x-3 mb-3">
            <span class="font-medium">Количество персон:</span>
            <button @click="decreasePersons" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">-</button>
            <span>{{ order.persons }}</span>
            <button @click="increasePersons" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">+</button>
          </div>
          <div>
            <span class="font-medium">Дополнительно:</span>
            <div v-for="(extra, idx) in extras" :key="extra.name" class="flex items-center justify-between py-2 border-b last:border-b-0">
              <div class="flex items-center space-x-2">
                <span>{{ extra.name }}</span>
                <span class="text-sm text-gray-500">({{ formatPrice(extra.price) }})</span>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="decreaseExtra(idx)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">-</button>
                <span>{{ (order.extrasSelection || [])[idx] || 0 }}</span>
                <button @click="increaseExtra(idx)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Время доставки -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Время доставки</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="order.delivery_time" 
                  value="asap" 
                  class="mr-2"
                />
                Как можно скорее
              </label>
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="order.delivery_time" 
                  value="scheduled" 
                  class="mr-2"
                />
                Запланировать на время
              </label>
            </div>
            <div v-if="order.delivery_time === 'scheduled'" class="mt-3">
              <label class="block font-medium mb-1">Дата и время доставки</label>
              <input 
                v-model="order.scheduled_time" 
                type="datetime-local" 
                class="w-full border rounded px-3 py-2" 
              />
            </div>
          </div>
        </div>

        <!-- Данные клиента -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Данные клиента</h3>
          <div class="space-y-3">
            <div>
              <label class="block font-medium mb-1">Имя</label>
              <input v-model="order.customer.name" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Город</label>
              <input v-model="order.customer.address.city" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Улица</label>
              <input v-model="order.customer.address.street" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Дом / квартира</label>
              <input v-model="order.customer.address.apartment" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Телефон</label>
              <input v-model="order.customer.address.phone" class="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        <!-- Итоги -->
        <div class="bg-white p-4 rounded shadow flex justify-between items-center">
          <div class="text-lg font-semibold">Итого: {{ formatPrice(total) }}</div>
          <div class="space-x-3">
            <button @click="saveOrder" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Сохранить</button>
            <button @click="cancelEdit" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, computed, onMounted } = Vue;
    const { useRoute, useRouter } = VueRouter;
    const route = useRoute();
    const router = useRouter();
    const order = ref(null);
    const products = ref([]);
    const loading = ref(true);
    const selectedProductId = ref('');
    const extras = [
      { name: 'Соевый соус', price: 50 },
      { name: 'Имбирь', price: 50 },
      { name: 'Васаби', price: 50 }
    ];

    async function fetchData() {
      loading.value = true;
      try {
        const orderId = route.params.id;
        const [ordRes, prodRes] = await Promise.all([
          axios.get('/api/orders/' + orderId).catch(() => null),
          axios.get('/api/products')
        ]);
        if (ordRes && ordRes.data) {
          const orderData = JSON.parse(JSON.stringify(ordRes.data));
          order.value = {
            ...orderData,
            customer: {
              name: orderData.customer_name || '',
              address: {
                city: orderData.customer_address ? orderData.customer_address.split(', ')[0] || '' : '',
                street: orderData.customer_address ? orderData.customer_address.split(', ')[1] || '' : '',
                apartment: orderData.customer_address ? orderData.customer_address.split(', ')[2] || '' : '',
                phone: orderData.customer_phone || ''
              }
            },
            delivery_time: orderData.delivery_time || 'asap',
            scheduled_time: orderData.scheduled_time || null,
            extrasSelection: Array.isArray(orderData.extras_selection) ? orderData.extras_selection : (orderData.extrasSelection || [])
          };
          if (!order.value.extrasSelection) order.value.extrasSelection = extras.map(() => 0);
        }
        products.value = (prodRes.data || []);
      } catch (e) {
        console.error('Ошибка загрузки данных', e);
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchData);

    function findProduct(id) {
      return products.value.find(p => p.id === id);
    }
    function findProductImage(id) {
      const p = findProduct(id);
      return p ? p.image : '';
    }
    const availableProducts = computed(() => {
      if (!order.value) return [];
      const existingIds = order.value.items.map(i => i.id);
      return products.value.filter(p => !existingIds.includes(p.id));
    });

    function increaseQty(it) { it.quantity++; }
    function decreaseQty(it) { if (it.quantity > 1) it.quantity--; else removeItem(it); }
    function removeItem(it) {
      const idx = order.value.items.indexOf(it);
      if (idx >= 0) order.value.items.splice(idx, 1);
    }
    function addItem() {
      if (!selectedProductId.value) return;
      const p = findProduct(selectedProductId.value);
      if (!p) return;
      order.value.items.push({ id: p.id, name: p.name, price: p.price, quantity: 1, image: p.image });
      selectedProductId.value = '';
    }
    function increaseExtra(index) {
      if (!order.value.extrasSelection) order.value.extrasSelection = extras.map(() => 0);
      order.value.extrasSelection[index]++;
    }
    function decreaseExtra(index) {
      if (!order.value.extrasSelection) order.value.extrasSelection = extras.map(() => 0);
      if (order.value.extrasSelection[index] > 0) order.value.extrasSelection[index]--;
    }
    function increasePersons() { order.value.persons++; }
    function decreasePersons() { if (order.value.persons > 1) order.value.persons--; }

    const total = computed(() => {
      if (!order.value) return 0;
      const itemsSum = order.value.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const extrasSum = extras.reduce((sum, ex, idx) => {
        const qty = order.value.extrasSelection ? order.value.extrasSelection[idx] : 0;
        return sum + ex.price * qty;
      }, 0);
      return itemsSum + extrasSum;
    });

    async function saveOrder() {
      if (!order.value) return;
      const payload = {
        customer_name: order.value.customer?.name || order.value.customer_name || '',
        customer_phone: order.value.customer?.address?.phone || order.value.customer_phone || '',
        customer_address: order.value.customer?.address ? 
          `${order.value.customer.address.city || ''}, ${order.value.customer.address.street || ''}, ${order.value.customer.address.apartment || ''}`.trim() :
          order.value.customer_address || '',
        total_amount: total.value,
        persons: order.value.persons,
        extras_selection: order.value.extrasSelection || extras.map(() => 0),
        notes: order.value.notes || '',
        delivery_time: order.value.delivery_time || 'asap',
        scheduled_time: order.value.scheduled_time || null
      };
      try {
        await axios.put('/api/orders/' + order.value.id, payload);
        alert('Заказ обновлён');
        router.push('/admin/orders');
      } catch (e) {
        console.error('Ошибка обновления заказа', e);
        alert('Не удалось сохранить заказ');
      }
    }
    function cancelEdit() { router.push('/admin/orders'); }
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }

    return {
      order,
      products,
      loading,
      selectedProductId,
      availableProducts,
      extras,
      findProductImage,
      increaseQty,
      decreaseQty,
      removeItem,
      addItem,
      increaseExtra,
      decreaseExtra,
      increasePersons,
      decreasePersons,
      total,
      saveOrder,
      cancelEdit,
      formatPrice
    };
  }
};
// AdminReviewsView - управление отзывами
window.AdminReviewsView = {
  name: 'AdminReviewsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Управление отзывами</h1>
          <p class="mt-2 text-gray-600">Модерация, редактирование и публикация отзывов</p>
        </div>

        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Список отзывов</h2>
            <div class="flex items-center space-x-2 text-sm">
              <button @click="filter = 'all'" :class="btnFilter('all')">Все</button>
              <button @click="filter = 'pending'" :class="btnFilter('pending')">На модерации</button>
              <button @click="filter = 'approved'" :class="btnFilter('approved')">Одобренные</button>
            </div>
          </div>

          <div v-if="loading" class="p-6 text-center text-gray-500">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span class="ml-2">Загрузка отзывов...</span>
          </div>

          <div v-else-if="filteredReviews.length === 0" class="p-10 text-center text-gray-500">
            <i class="fa-solid fa-comments text-4xl mb-4"></i>
            <p>Нет отзывов по выбранному фильтру</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div v-for="rev in filteredReviews" :key="rev.id" class="p-6 flex items-start justify-between hover:bg-gray-50">
              <div class="flex-1 pr-6">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="flex">
                    <i v-for="star in 5" :key="star" :class="['fa-solid fa-star', star <= rev.rating ? 'text-yellow-400' : 'text-gray-300']"></i>
                  </div>
                  <span class="text-sm text-gray-500">{{ rev.rating }}/5</span>
                  <span class="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="rev.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ rev.approved ? 'Одобрен' : 'На модерации' }}
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ rev.name }}</h3>
                <p class="text-gray-700 mt-1 whitespace-pre-line">{{ rev.comment }}</p>
                <div class="mt-2 text-sm text-gray-500">
                  <i class="fa-solid fa-calendar mr-1"></i>{{ formatDate(rev.createdAt) }}
                  <span v-if="rev.phone" class="ml-3"><i class="fa-solid fa-phone mr-1"></i>{{ rev.phone }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button v-if="!rev.approved" @click="approve(rev)" class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
                  <i class="fa-solid fa-check mr-1"></i>Одобрить
                </button>
                <button @click="openEdit(rev)" class="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">
                  <i class="fa-solid fa-pen mr-1"></i>Редактировать
                </button>
                <button @click="remove(rev)" class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
                  <i class="fa-solid fa-trash mr-1"></i>Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Модалка редактирования -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-slideIn">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <h3 class="text-lg font-semibold">Редактировать отзыв</h3>
              <button @click="closeModal" class="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form @submit.prevent="save" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input v-model="form.name" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Рейтинг</label>
                <select v-model.number="form.rating" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea v-model="form.comment" rows="5" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Текст отзыва"></textarea>
              </div>
              <div class="flex items-center justify-between">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="form.approved" />
                  <span class="text-sm text-gray-700">Одобрен</span>
                </label>
                <div class="space-x-2">
                  <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Отмена</button>
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50">
                    <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-1"></i>
                    Сохранить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const reviews = ref([]);
    const loading = ref(true);
    const filter = ref('all'); // all | pending | approved
    const showModal = ref(false);
    const saving = ref(false);
    const form = ref({ id: null, name: '', rating: 5, comment: '', approved: false });

    const filteredReviews = Vue.computed(() => {
      if (filter.value === 'pending') return reviews.value.filter(r => !r.approved);
      if (filter.value === 'approved') return reviews.value.filter(r => r.approved);
      return reviews.value;
    });

    function btnFilter(key) {
      return [
        'px-3 py-1 rounded-lg border text-sm',
        filter.value === key ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      ].join(' ');
    }

    async function fetchReviews() {
      loading.value = true;
      try {
        const res = await axios.get('/api/admin/reviews');
        reviews.value = res.data || [];
      } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
      } finally {
        loading.value = false;
      }
    }

    async function approve(rev) {
      try {
        await axios.post(`/api/admin/reviews/${rev.id}/approve`);
        await fetchReviews();
      } catch (e) {
        console.error('Ошибка одобрения отзыва', e);
        alert('Не удалось одобрить отзыв');
      }
    }

    function openEdit(rev) {
      form.value = { id: rev.id, name: rev.name || '', rating: Number(rev.rating) || 5, comment: rev.comment || '', approved: !!rev.approved };
      showModal.value = true;
    }
    function closeModal() { showModal.value = false; }

    async function save() {
      if (!form.value.id) return;
      saving.value = true;
      try {
        await axios.put(`/api/admin/reviews/${form.value.id}`, {
          name: form.value.name,
          rating: form.value.rating,
          comment: form.value.comment,
          approved: form.value.approved
        });
        showModal.value = false;
        await fetchReviews();
      } catch (e) {
        console.error('Ошибка сохранения отзыва', e);
        alert('Не удалось сохранить изменения');
      } finally {
        saving.value = false;
      }
    }

    async function remove(rev) {
      if (!confirm(`Удалить отзыв от ${rev.name}?`)) return;
      try {
        await axios.delete(`/api/admin/reviews/${rev.id}`);
        await fetchReviews();
      } catch (e) {
        console.error('Ошибка удаления отзыва', e);
        alert('Не удалось удалить отзыв');
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return 'Дата не указана';
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    onMounted(fetchReviews);
    
    return {
      reviews,
      loading,
      filter,
      filteredReviews,
      showModal,
      saving,
      form,
      fetchReviews,
      approve,
      openEdit,
      closeModal,
      save,
      remove,
      btnFilter,
      formatDate
    };
  }
};

// AdminStatsView - статистика
window.AdminStatsView = {
  name: 'AdminStatsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Статистика</h1>
          <p class="mt-2 text-gray-600">Общая статистика по заказам и продажам</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Общее количество заказов -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <i class="fa-solid fa-shopping-cart text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Всего заказов</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
              </div>
            </div>
          </div>

          <!-- Общая сумма продаж -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <i class="fa-solid fa-ruble-sign text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Общая сумма</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.totalRevenue) }}</p>
              </div>
            </div>
          </div>

          <!-- Средний чек -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <i class="fa-solid fa-chart-line text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Средний чек</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.averageOrder) }}</p>
              </div>
            </div>
          </div>

          <!-- Активные заказы -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                <i class="fa-solid fa-clock text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Активные заказы</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.activeOrders }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- График продаж -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Продажи по дням</h2>
          <div class="h-64 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <i class="fa-solid fa-chart-bar text-4xl mb-2"></i>
              <p>График будет добавлен в следующих версиях</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const stats = ref({
      totalOrders: 0,
      totalRevenue: 0,
      averageOrder: 0,
      activeOrders: 0
    });

    async function fetchStats() {
      try {
        // Здесь можно добавить API для получения статистики
        // Пока используем моковые данные
        stats.value = {
          totalOrders: 156,
          totalRevenue: 125000,
          averageOrder: 800,
          activeOrders: 12
        };
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      }
    }

    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }

    onMounted(fetchStats);
    
    return {
      stats,
      fetchStats,
      formatPrice
    };
  }
};
// AdminSEOView - управление SEO настройками
window.AdminSEOView = {
  name: 'AdminSEOView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center">
              <i class="fa-solid fa-magnifying-glass-chart text-orange-600 mr-3"></i>
              SEO настройки
            </h1>
            <p class="mt-1 text-gray-600">Мета‑теги, OpenGraph, Twitter Cards, robots.txt, sitemap</p>
          </div>
          <div class="space-x-3">
            <button @click="openJsonModal" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition shadow-sm hover:shadow"><i class="fa-solid fa-code mr-2"></i>Structured Data</button>
            <button @click="saveSEO" :disabled="saving" class="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition shadow disabled:opacity-50">
              <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-2"></i>
              <i v-else class="fa-solid fa-save mr-2"></i>Сохранить
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center space-x-2 text-gray-500">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Загрузка SEO настроек...</span>
          </div>
        </div>

        <div v-else class="space-y-8">
          <!-- Основные -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-solid fa-gear text-orange-500 mr-2"></i>Основные</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Название сайта</label><input v-model="seoData.site.title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Ключевые слова</label><input v-model="seoData.site.keywords" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">Описание сайта</label><textarea v-model="seoData.site.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Автор</label><input v-model="seoData.site.author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label><input v-model="seoData.site.canonical" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Язык</label><input v-model="seoData.site.language" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Robots</label><input v-model="seoData.site.robots" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
            </div>
          </div>

          <!-- Open Graph -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-brands fa-facebook text-orange-500 mr-2"></i>Open Graph</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium text-gray-700 mb-2">OG Заголовок</label><input v-model="seoData.site.ogTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">OG URL</label><input v-model="seoData.site.ogUrl" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">OG Описание</label><textarea v-model="seoData.site.ogDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">OG Изображение</label><input v-model="seoData.site.ogImage" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">OG Site Name</label><input v-model="seoData.site.ogSiteName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">OG Type</label><input v-model="seoData.site.ogType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
            </div>
          </div>

          <!-- Twitter Cards -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-brands fa-x-twitter text-orange-500 mr-2"></i>Twitter Cards</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label><input v-model="seoData.site.twitterTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Тип карточки</label><select v-model="seoData.site.twitterCard" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"><option value="summary">Summary</option><option value="summary_large_image">Summary Large Image</option><option value="app">App</option><option value="player">Player</option></select></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">Описание</label><textarea v-model="seoData.site.twitterDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">Изображение</label><input v-model="seoData.site.twitterImage" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
            </div>
          </div>

          <!-- VK / Одноклассники -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-brands fa-vk text-orange-500 mr-2"></i>VK / <i class="fa-brands fa-odnoklassniki text-orange-500 ml-2 mr-2"></i>Одноклассники</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium text-gray-700 mb-2">VK Title</label><input v-model="seoData.site.vkTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">VK Image</label><input v-model="seoData.site.vkImage" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">VK Description</label><textarea v-model="seoData.site.vkDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">OK Title</label><input v-model="seoData.site.okTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">OK Image</label><input v-model="seoData.site.okImage" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">OK Description</label><textarea v-model="seoData.site.okDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea></div>
            </div>
          </div>

          <!-- Robots.txt / Sitemap -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-solid fa-robot text-orange-500 mr-2"></i>Robots.txt и <i class="fa-solid fa-sitemap text-orange-500 ml-2 mr-2"></i>Sitemap</h2>
            <div class="grid gap-6">
              <div class="grid md:grid-cols-2 gap-4">
                <label class="flex items-center space-x-2"><input type="checkbox" v-model="seoData.robots.enabled" /><span class="text-gray-700">Robots включен</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" v-model="seoData.sitemap.enabled" /><span class="text-gray-700">Sitemap включен <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">автогенерация</span></span></label>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Allow</label>
                  <textarea v-model="robotsAllow" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Каждый путь с новой строки"></textarea>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Disallow</label>
                  <textarea v-model="robotsDisallow" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Каждый путь с новой строки"></textarea>
                </div>
                <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">Sitemap URL</label><input v-model="seoData.robots.sitemap" class="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="animate-fadeIn">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 flex items-center"><i class="fa-solid fa-file-lines text-orange-500 mr-2"></i>Превью robots.txt</h3>
                    <button @click="copyToClipboard(robotsPreview)" class="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg"><i class="fa-solid fa-copy mr-1"></i>Копировать</button>
                  </div>
                  <textarea :value="robotsPreview" readonly rows="10" class="w-full font-mono text-xs px-3 py-2 border border-gray-300 rounded-md bg-gray-50"></textarea>
                </div>
                <div class="animate-fadeIn">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 flex items-center"><i class="fa-solid fa-diagram-project text-orange-500 mr-2"></i>Превью sitemap.xml</h3>
                    <button @click="copyToClipboard(sitemapPreview)" class="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg"><i class="fa-solid fa-copy mr-1"></i>Копировать</button>
                  </div>
                  <textarea :value="sitemapPreview" readonly rows="10" class="w-full font-mono text-xs px-3 py-2 border border-gray-300 rounded-md bg-gray-50"></textarea>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-3">Настройки страниц для Sitemap</h3>
                <div class="grid md:grid-cols-3 gap-4">
                  <div v-for="(v, key) in pagesList" :key="'sm-' + key" class="bg-white rounded-xl border p-4">
                    <div class="font-medium text-gray-900 mb-2">{{ key }}</div>
                    <label class="block text-xs text-gray-600 mb-1">Priority</label>
                    <input v-model.number="seoData.sitemap.priority[key]" type="number" min="0" max="1" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" />
                    <label class="block text-xs text-gray-600 mb-1">Changefreq</label>
                    <select v-model="seoData.sitemap.changefreq[key]" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="always">always</option>
                      <option value="hourly">hourly</option>
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                      <option value="never">never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Страницы -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-solid fa-file-pen text-orange-500 mr-2"></i>Мета-теги страниц</h2>
            <div class="grid md:grid-cols-3 gap-4">
              <div v-for="(v, key) in pagesList" :key="key" class="border rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 mb-3">{{ key }}</h3>
                <label class="block text-xs text-gray-600 mb-1">Title</label>
                <input v-model="seoData.pages[key].title" class="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" />
                <label class="block text-xs text-gray-600 mb-1">Description</label>
                <textarea v-model="seoData.pages[key].description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"></textarea>
                <label class="block text-xs text-gray-600 mb-1">Keywords</label>
                <input v-model="seoData.pages[key].keywords" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

          <!-- Экспорт / Импорт -->
          <div class="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-solid fa-right-left text-orange-500 mr-2"></i>Экспорт / Импорт</h2>
            <div class="flex items-center space-x-3">
              <button @click="exportSEO" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl"><i class="fa-solid fa-file-export mr-2"></i>Экспорт JSON</button>
              <label class="px-4 py-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                <i class="fa-solid fa-file-import mr-2"></i>Импорт JSON
                <input type="file" accept="application/json" class="hidden" @change="importSEO" />
              </label>
            </div>
          </div>

          <!-- Тост -->
          <div v-if="toast.show" class="fixed bottom-6 right-6 bg-white shadow-2xl border border-gray-200 rounded-xl px-5 py-3 flex items-center space-x-3" :class="toast.type === 'success' ? 'text-green-700' : 'text-red-700'">
            <i :class="toast.type === 'success' ? 'fa-solid fa-check-circle' : 'fa-solid fa-triangle-exclamation'"></i>
            <span class="text-sm">{{ toast.text }}</span>
          </div>

          <!-- JSON Modal -->
          <div v-if="showJson" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeJsonModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center"><i class="fa-solid fa-code text-orange-500 mr-2"></i>Структурированные данные (JSON-LD)</h3>
                <button @click="closeJsonModal" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"><i class="fa-solid fa-times text-xl"></i></button>
              </div>
              <div class="p-6">
                <textarea v-model="structuredDataRaw" rows="16" class="w-full font-mono text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                <div class="mt-4 flex justify-end space-x-3">
                  <button @click="closeJsonModal" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">Отмена</button>
                  <button @click="applyStructuredData" class="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md">Применить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, onMounted } = Vue;
    const seoData = ref({
      site: {
        title: '',
        description: '',
        keywords: '',
        author: '',
        language: 'ru',
        robots: 'index, follow',
        canonical: '',
        siteName: '',
        locale: 'ru_RU',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogSiteName: '',
        ogType: 'website',
        ogUrl: '',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        vkTitle: '',
        vkDescription: '',
        vkImage: '',
        okTitle: '',
        okDescription: '',
        okImage: ''
      }
    });
    
    const loading = ref(true);
    const saving = ref(false);
    const showJson = ref(false);
    const structuredDataRaw = ref('');
    const toast = ref({ show: false, text: '', type: 'success' });
    const robotsAllow = ref('');
    const robotsDisallow = ref('');
    const pagesList = ref({ home: {}, news: {}, cart: {} });
    const robotsPreview = Vue.computed(() => buildRobotsTxtPreview(seoData.value, robotsAllow.value, robotsDisallow.value));
    const sitemapPreview = Vue.computed(() => buildSitemapXmlPreview(seoData.value));

    async function fetchSEOData() {
      try {
        const res = await axios.get('/api/seo');
        seoData.value = res.data;
        // Развернуть allow/disallow в textarea
        robotsAllow.value = (seoData.value.robots?.allow || []).join('\n');
        robotsDisallow.value = (seoData.value.robots?.disallow || []).join('\n');
        // Инициализировать страницы
        if (!seoData.value.pages) seoData.value.pages = { home: {}, news: {}, cart: {} };
        pagesList.value = seoData.value.pages;
      } catch (error) {
        console.error('Ошибка загрузки SEO данных:', error);
      } finally {
        loading.value = false;
      }
    }

    async function saveSEO() {
      saving.value = true;
      try {
        // Свернуть textarea в массивы
        if (!seoData.value.robots) seoData.value.robots = {};
        seoData.value.robots.allow = robotsAllow.value.split(/\n+/).map(s => s.trim()).filter(Boolean);
        seoData.value.robots.disallow = robotsDisallow.value.split(/\n+/).map(s => s.trim()).filter(Boolean);
        seoData.value.pages = pagesList.value;
        await axios.put('/api/seo', seoData.value);
        showToast('SEO настройки успешно сохранены', 'success');
        await fetchSEOData();
      } catch (error) {
        console.error('Ошибка сохранения SEO данных:', error);
        showToast('Ошибка сохранения SEO настроек', 'error');
      } finally {
        saving.value = false;
      }
    }

    function openJsonModal() {
      structuredDataRaw.value = JSON.stringify(seoData.value.site.structuredData || {}, null, 2);
      showJson.value = true;
    }
    function closeJsonModal() { showJson.value = false; }
    function applyStructuredData() {
      try {
        const parsed = JSON.parse(structuredDataRaw.value || '{}');
        seoData.value.site.structuredData = parsed;
        showJson.value = false;
        showToast('Structured Data обновлены', 'success');
      } catch (e) {
        showToast('Некорректный JSON', 'error');
      }
    }

    function showToast(text, type) {
      toast.value = { show: true, text, type };
      setTimeout(() => { toast.value.show = false; }, 2000);
    }

    function exportSEO() {
      const blob = new Blob([JSON.stringify(seoData.value, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'seo-settings.json';
      a.click();
      URL.revokeObjectURL(url);
    }

    function importSEO(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          seoData.value = parsed;
          robotsAllow.value = (seoData.value.robots?.allow || []).join('\n');
          robotsDisallow.value = (seoData.value.robots?.disallow || []).join('\n');
          pagesList.value = seoData.value.pages || { home: {}, news: {}, cart: {} };
          showToast('Файл импортирован. Не забудьте сохранить.', 'success');
        } catch (_) {
          showToast('Некорректный JSON', 'error');
        }
      };
      reader.readAsText(file, 'utf-8');
      e.target.value = '';
    }

    function copyToClipboard(text) {
      try { navigator.clipboard.writeText(text); showToast('Скопировано', 'success'); }
      catch (_) { showToast('Не удалось скопировать', 'error'); }
    }

    function buildRobotsTxtPreview(data, allowStr, disallowStr) {
      const allow = (allowStr || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
      const disallow = (disallowStr || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
      const lines = [
        'User-agent: *',
        ...(allow.length ? allow.map(a => `Allow: ${a}`) : ['Allow: /']),
        ...disallow.map(d => `Disallow: ${d}`),
        '',
        `Sitemap: ${data?.robots?.sitemap || 'https://example.com/sitemap.xml'}`
      ];
      return lines.join('\n');
    }

    function buildSitemapXmlPreview(data) {
      const base = (data?.site?.canonical || 'https://example.com/').replace(/\/$/, '');
      const pr = data?.sitemap?.priority || {}; const cf = data?.sitemap?.changefreq || {};
      const urls = [
        { loc: `${base}/`, priority: pr.home ?? 1.0, changefreq: cf.home ?? 'daily' },
        { loc: `${base}/news`, priority: pr.news ?? 0.8, changefreq: cf.news ?? 'weekly' },
        { loc: `${base}/cart`, priority: pr.cart ?? 0.6, changefreq: cf.cart ?? 'monthly' }
      ];
      const today = new Date().toISOString().split('T')[0];
      const body = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n');
      return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
    }

    onMounted(fetchSEOData);
    
    return {
      seoData,
      loading,
      saving,
      toast,
      showJson,
      structuredDataRaw,
      fetchSEOData,
      saveSEO,
      openJsonModal,
      closeJsonModal,
      applyStructuredData,
      robotsAllow,
      robotsDisallow,
      pagesList,
      exportSEO,
      importSEO,
      robotsPreview,
      sitemapPreview,
      copyToClipboard
    };
  }
};
// AdminCategoryBlocksView - управление блоками категорий
window.AdminCategoryBlocksView = {
  name: 'AdminCategoryBlocksView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900"><i class="fa-solid fa-grip text-orange-600 mr-3"></i>Блоки категорий</h1>
            <p class="mt-2 text-gray-600">Управление блоками категорий на главной странице</p>
          </div>
          <button @click="openCreateModal" class="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition shadow"><i class="fa-solid fa-plus mr-2"></i>Добавить блок</button>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center space-x-2 text-gray-500">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Загрузка блоков категорий...</span>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="(block, index) in categoryBlocks" :key="block.id + '-' + index" class="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ block.name }}</h3>
              <div class="flex items-center space-x-2">
                <button 
                  @click="toggleBlock(block)" 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    block.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ block.enabled ? 'Включен' : 'Отключен' }}
                </button>
                
                <div class="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <button @click="decreaseOrder(block)" class="px-2 py-1 text-gray-600 hover:bg-gray-100" title="Снизить порядок"><i class="fa-solid fa-chevron-left"></i></button>
                  <div class="px-3 py-1 text-sm font-medium text-gray-700">{{ block.order }}</div>
                  <button @click="increaseOrder(block)" class="px-2 py-1 text-gray-600 hover:bg-gray-100" title="Повысить порядок"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <button @click="openEditModal(block)" class="text-blue-600 hover:text-blue-700 p-2" title="Редактировать"><i class="fa-solid fa-pen"></i></button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-if="block.image" class="md:col-span-1">
                <img :src="block.image" :alt="block.name" class="w-full h-32 object-cover rounded-lg" />
              </div>
              
              <div :class="block.image ? 'md:col-span-2' : 'md:col-span-3'">
                <p class="text-gray-600 mb-2">{{ block.description }}</p>
                <p class="text-sm text-gray-500">Порядок: {{ block.order }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Модальное окно создания/редактирования блока -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl">
            <div class="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center"><i class="fa-solid fa-grip"></i></div>
                <h3 class="text-xl font-bold">{{ editingBlock ? 'Редактировать блок категории' : 'Добавить блок категории' }}</h3>
              </div>
              <button @click="closeModal" class="text-white/80 hover:text-white"><i class="fa-solid fa-times text-xl"></i></button>
            </div>
            <form @submit.prevent="saveBlock" class="bg-white p-6 space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Название (внутреннее)</label>
                  <input v-model="form.name" class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок (для клиента)</label>
                  <input v-model="form.title" class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
                  <div class="flex space-x-2">
                    <input v-model="imageUrl" type="url" placeholder="https://..." class="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <button type="button" @click="updateImagePreview" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl">Предпросмотр</button>
                  </div>
                  <div class="mt-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Или загрузить файл</label>
                    <input type="file" accept="image/*" @change="onImageFileSelected" class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Предпросмотр</label>
                  <div class="relative h-40 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    <img v-if="form.image" :src="form.image" alt="preview" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="text-gray-400 text-sm">Нет изображения</div>
                    <button v-if="form.image" type="button" @click="clearImage" class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-xl px-3 py-1 shadow">Очистить</button>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Порядок</label>
                  <input v-model.number="form.order" @change="validateOrder" type="number" min="0" class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <p class="text-xs text-gray-500 mt-1">Порядок должен быть уникальным</p>
                </div>
                <div class="flex items-center">
                  <label class="flex items-center"><input v-model="form.enabled" type="checkbox" class="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-orange-500" /><span class="ml-2 text-sm text-gray-700">Включен</span></label>
                </div>
              </div>
              <div class="flex justify-end space-x-3 pt-2">
                <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl">Отмена</button>
                <button type="submit" class="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, onMounted } = Vue;
    const categoryBlocks = ref([]);
    const loading = ref(true);
    const showModal = ref(false);
    const editingBlock = ref(null);
    const form = ref({ name: '', title: '', description: '', image: '', order: 0, enabled: true });
    const imageUrl = ref('');

    async function fetchCategoryBlocks() {
      try {
        const res = await axios.get('/api/category-blocks');
        categoryBlocks.value = (res.data || []).map(b => ({ id: b.id, name: b.title || b.name, title: b.title || b.name, description: b.description, image: b.image, order: b.order_index ?? b.order ?? 0, enabled: !!b.enabled, _seed: typeof b.id === 'string' && b.id.startsWith('cat-block-') }));
      } catch (error) {
        console.error('Ошибка загрузки блоков категорий:', error);
      } finally {
        loading.value = false;
      }
    }

    async function toggleBlock(block) {
      block.enabled = !block.enabled;
      await persist(block);
    }

    function openCreateModal() {
      editingBlock.value = null;
      form.value = { name: '', title: '', description: '', image: '', order: 0, enabled: true };
      imageUrl.value = '';
      showModal.value = true;
    }
    function openEditModal(block) {
      editingBlock.value = block;
      form.value = { name: block.name || '', title: block.title || '', description: block.description || '', image: block.image || '', order: block.order || 0, enabled: !!block.enabled };
      imageUrl.value = '';
      showModal.value = true;
    }
    function closeModal() { showModal.value = false; }

    async function saveBlock() {
      if (categoryBlocks.value.some(b => (!editingBlock.value || b.id !== editingBlock.value.id) && Number(b.order) === Number(form.value.order))) {
        alert('Порядок должен быть уникальным');
        return;
      }
      const payload = toPayload(form.value);
      if (editingBlock.value) {
        if (editingBlock.value._seed) {
          const res = await axios.post('/api/admin/category-blocks', payload);
          const idx = categoryBlocks.value.indexOf(editingBlock.value);
          if (idx >= 0) categoryBlocks.value.splice(idx, 1, { id: res.data.id, ...payload, _seed: false });
        } else {
          await axios.put(`/api/admin/category-blocks/${editingBlock.value.id}`, payload);
          Object.assign(editingBlock.value, { ...payload, _seed: false });
        }
      } else {
        const res = await axios.post('/api/admin/category-blocks', payload);
        categoryBlocks.value.push({ id: res.data.id, ...payload, _seed: false });
      }
      closeModal();
    }

    function toPayload(f) { return { name: f.name || f.title, title: f.title, description: f.description, image: f.image, order: Number(f.order) || 0, enabled: !!f.enabled }; }
    function validateOrder() { form.value.order = Number(form.value.order) || 0; }
    async function persist(block) {
      try {
        const payload = toPayload(block);
        if (!block.id || block._seed) {
          const res = await axios.post('/api/admin/category-blocks', payload);
          block.id = res.data.id; block._seed = false;
        } else {
          await axios.put(`/api/admin/category-blocks/${block.id}`, payload);
        }
      } catch (e) { console.error('Ошибка сохранения блока', e); }
    }
    async function increaseOrder(block) { block.order = Number(block.order) + 1; await persist(block); }
    async function decreaseOrder(block) { block.order = Math.max(0, Number(block.order) - 1); await persist(block); }

    async function confirmDelete(block) {
      if (!confirm('Удалить блок категории?')) return;
      try {
        if (block._seed || !block.id) {
          const idx = categoryBlocks.value.indexOf(block);
          if (idx >= 0) categoryBlocks.value.splice(idx, 1);
        } else {
          await axios.delete(`/api/admin/category-blocks/${block.id}`);
          const idx = categoryBlocks.value.indexOf(block);
          if (idx >= 0) categoryBlocks.value.splice(idx, 1);
        }
      } catch (e) { console.error('Не удалось удалить блок', e); }
    }

    function onImageFileSelected(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { form.value.image = reader.result; };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
    function updateImagePreview() {
      if (imageUrl.value && /^https?:\/\//i.test(imageUrl.value)) {
        form.value.image = imageUrl.value;
      }
    }
    function clearImage() { form.value.image = ''; imageUrl.value = ''; }

    onMounted(fetchCategoryBlocks);
    
    return {
      categoryBlocks,
      loading,
      showModal,
      editingBlock,
      form,
      imageUrl,
      fetchCategoryBlocks,
      toggleBlock,
      openCreateModal,
      openEditModal,
      closeModal,
      saveBlock,
      increaseOrder,
      decreaseOrder,
      validateOrder,
      confirmDelete,
      onImageFileSelected,
      updateImagePreview,
      clearImage
    };
  }
};
