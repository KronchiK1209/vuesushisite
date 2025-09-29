// Используем глобальные сборки Vue и VueRouter, подключённые через CDN.
const { createApp, reactive, ref, computed, onMounted, onUnmounted, watch } = Vue;
const { createRouter, createWebHistory } = VueRouter;
const { useRouter, useRoute } = VueRouter;

// Используем глобальные переменные, загруженные из модулей
// Эти переменные будут доступны после загрузки модулей в index.html

// Динамические обертки для админ-компонентов: рендерят window.* когда они загружаются
const AdminLoadingFallback = { name: 'AdminLoadingFallback', template: '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div><p class="text-gray-600">Загрузка админского раздела...</p></div></div>' };

function makeWindowWrapper(windowKey) {
  return {
    name: windowKey + 'Wrapper',
    components: { AdminLoadingFallback },
  setup() {
      const current = ref(window[windowKey] || null);
      const intervalId = setInterval(() => {
        if (!current.value && window[windowKey]) {
          current.value = window[windowKey];
          clearInterval(intervalId);
        }
      }, 100);
      onUnmounted(() => { try { clearInterval(intervalId); } catch (_) {} });
      return { current };
    },
    template: '<component :is="current || AdminLoadingFallback" />'
  };
}

const AdminDashboardView = makeWindowWrapper('AdminHomeView');
const AdminOrdersView = makeWindowWrapper('AdminOrdersView');
const AdminOrderEditView = makeWindowWrapper('AdminOrderEditView');
const AdminProductsView = makeWindowWrapper('AdminProductsView');
const AdminNewsView = makeWindowWrapper('AdminNewsView');
const AdminCategoriesView = makeWindowWrapper('AdminCategoriesView');
const AdminReviewsView = makeWindowWrapper('AdminReviewsView');
const AdminStatsView = makeWindowWrapper('AdminStatsView');
const AdminSEOView = makeWindowWrapper('AdminSEOView');
const AdminCategoryBlocksView = makeWindowWrapper('AdminCategoryBlocksView');
const PublicLoginView = makeWindowWrapper('LoginView');
const AccountView = makeWindowWrapper('AccountView');
const AdminSiteSettingsView = makeWindowWrapper('AdminSiteSettingsView');

// Компонент анимации загрузки с суши и палочками
const LoadingSpinner = {
  name: 'LoadingSpinner',
  template: /* html */`
    <div class="fixed inset-0 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl p-12 flex flex-col items-center space-y-6 shadow-2xl">
        <!-- Анимация суши и палочек -->
              <div class="relative">
          <!-- Палочки -->
          <div class="flex space-x-2 mb-4">
            <div class="w-1 h-8 bg-amber-600 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
            <div class="w-1 h-8 bg-amber-600 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
              </div>
          
          <!-- Суши роллы -->
          <div class="flex space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" style="animation-delay: 0s;"></div>
            <div class="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
            <div class="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
          </div>
          
          <!-- Дополнительные элементы -->
          <div class="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          <div class="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                
        <!-- Текст загрузки -->
        <div class="text-center">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Загрузка меню...</h3>
          <p class="text-gray-600 text-sm">Готовим для вас самые вкусные суши и пиццу</p>
          </div>
                
          <!-- Прогресс бар -->
        <div class="w-64 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out relative"
            :style="{ width: progress + '%' }"
          >
            <!-- Блестящий эффект -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                    
        <!-- Процент -->
        <div class="text-center">
          <span class="text-2xl font-bold text-orange-600">{{ progress }}%</span>
          <p class="text-xs text-gray-500 mt-1">Почти готово...</p>
                </div>
              </div>
    </div>
  `,
  props: {
    progress: {
      type: Number,
      default: 0
    }
  }
};

// Глобальное состояние загрузки
const globalLoading = reactive({
  isLoading: true,
  progress: 0
});

// Простое глобальное состояние для корзины. Каждый элемент содержит id, name, price, image, quantity.
// Глобальное состояние корзины и информации о заказе
const cart = reactive({
  items: [],
  persons: 1,
  extrasSelection: [0, 0, 0], // Соевый соус, Имбирь, Васаби
  deliveryTime: 'asap',
  scheduledTime: null
});
// Экспортируем корзину глобально для модулей (например, главной страницы)
window.cart = cart;

// Глобальное состояние аутентификации
const auth = reactive({
  isLoggedIn: false,
  user: null,
  token: localStorage.getItem('admin_token')
});

// Инициализируем состояние из localStorage без допущений
try {
  const savedUser = localStorage.getItem('auth_user');
  if (auth.token && savedUser) {
    auth.user = JSON.parse(savedUser);
    auth.isLoggedIn = true;
  }
} catch (_) {}

// Функция для добавления товара в корзину
function addToCart(product) {
  const existingItem = cart.items.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
}

// Импортируем компоненты из модулей
const HomeView = window.HomeView;
const CartView = window.CartView;
const CheckoutView = window.CheckoutView;

// Если модули не загружены, создаем fallback компоненты
const HomeViewFallback = {
  name: 'HomeView',
  template: '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div><p class="text-gray-600">Загрузка главной страницы...</p></div></div>'
};

const CartViewFallback = {
  name: 'CartView', 
  template: '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div><p class="text-gray-600">Загрузка корзины...</p></div></div>'
};

const CheckoutViewFallback = {
  name: 'CheckoutView',
  template: '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div><p class="text-gray-600">Загрузка оформления заказа...</p></div></div>'
};

// Используем загруженные компоненты или fallback
const HomeViewComponent = HomeView || HomeViewFallback;
const CartViewComponent = CartView || CartViewFallback;
const CheckoutViewComponent = CheckoutView || CheckoutViewFallback;

/**
 * Компонент списка новостей.
 */
const NewsListView = {
  name: 'NewsListView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Новости</h1>
          <p class="text-xl text-gray-600">Следите за нашими новостями и акциями</p>
          </div>

          <div v-if="loading" class="text-center py-12">
            <div class="inline-flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Загрузка новостей...</span>
            </div>
          </div>
          
        <div v-else-if="news.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
            <i class="fa-solid fa-newspaper text-6xl"></i>
            </div>
          <h3 class="text-xl font-semibold text-gray-500 mb-2">Новости отсутствуют</h3>
          <p class="text-gray-400">Скоро здесь появятся интересные новости</p>
          </div>

        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="item in news" :key="item.id" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="aspect-w-16 aspect-h-9">
              <img 
                :src="item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'" 
                :alt="item.title" 
                class="w-full h-48 object-cover"
                loading="lazy"
              />
                </div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <i class="fa-solid fa-calendar mr-2"></i>
                <time>{{ formatDate(item.publishedAt) }}</time>
                </div>
              <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{{ item.title }}</h2>
              <p class="text-gray-600 mb-4 line-clamp-3">{{ item.excerpt }}</p>
              <router-link 
                :to="'/news/' + item.id" 
                class="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Читать далее
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </router-link>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  setup() {
    const news = ref([]);
    const loading = ref(true);
    
    async function fetchNews() {
      try {
        const res = await axios.get('/api/news');
        news.value = res.data || [];
      } catch (e) {
        console.error('Не удалось загрузить новости', e);
      } finally {
        loading.value = false;
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return 'Дата не указана';
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
    }

    onMounted(fetchNews);
    return { news, loading, formatDate };
  }
};

/**
 * Компонент просмотра одной новости.
 */
const NewsDetailView = {
  name: 'NewsDetailView',
  props: ['id'],
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Загрузка новости...</span>
            </div>
          </div>
          
        <div v-else-if="!newsItem" class="text-center py-12">
            <div class="text-gray-400 mb-4">
            <i class="fa-solid fa-newspaper text-6xl"></i>
            </div>
          <h3 class="text-xl font-semibold text-gray-500 mb-2">Новость не найдена</h3>
          <p class="text-gray-400">Запрашиваемая новость не существует</p>
          </div>

        <article v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="aspect-w-16 aspect-h-9">
            <img 
              :src="newsItem.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'" 
              :alt="newsItem.title" 
              class="w-full h-64 md:h-96 object-cover"
              loading="lazy"
            />
                      </div>
          <div class="p-8">
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <i class="fa-solid fa-calendar mr-2"></i>
              <time>{{ formatDate(newsItem.publishedAt) }}</time>
                    </div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{{ newsItem.title }}</h1>
            <div class="prose prose-lg max-w-none text-gray-700" v-html="newsItem.content"></div>
                  </div>
        </article>

        <div class="mt-8 text-center">
          <router-link 
            to="/news" 
            class="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <i class="fa-solid fa-arrow-left mr-2"></i>
            Вернуться к списку новостей
          </router-link>
        </div>
      </div>
    </div>
  `,
  setup(props) {
    const newsItem = ref(null);
    const loading = ref(true);

    async function fetchItem() {
      try {
        const res = await axios.get(`/api/news/${props.id}`);
        newsItem.value = res.data;
      } catch (e) {
        console.error('Не удалось загрузить новость', e);
      } finally {
        loading.value = false;
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return 'Дата не указана';
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric', 
        month: 'long',
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    onMounted(fetchItem);
    return { newsItem, loading, formatDate };
  }
};

// Страница логина перенесена в модуль client/modules/auth.js (window.LoginView)

/**
 * Компонент оформления заказа.
 */
const ThankYouView = {
  name: 'ThankYouView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full text-center">
          <div class="bg-white rounded-2xl shadow-lg p-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fa-solid fa-check text-green-600 text-2xl"></i>
              </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Заказ принят!</h1>
          <p class="text-gray-600 mb-6">Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
          <div class="space-y-3">
            <button 
              @click="goHome" 
              class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl transition"
            >
                      <i class="fa-solid fa-home mr-2"></i>
              На главную
            </button>
            <button 
              @click="goReview" 
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition"
                >
              <i class="fa-solid fa-star mr-2"></i>
              Оставить отзыв
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const orderId = route.query.orderId;
    
    function goHome() {
          router.push('/');
    }
    
    function goReview() {
      if (orderId) {
        router.push(`/review/${orderId}`);
        } else {
        router.push('/');
      }
    }
    
    return { goHome, goReview };
  }
};

/**
 * Компонент для оставления отзыва.
 */
const ReviewView = {
  name: 'ReviewView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-2xl mx-auto px-4">
        <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Оставить отзыв</h1>
            <p class="text-gray-600">Поделитесь своим мнением о нашем сервисе</p>
          </div>

          <form @submit.prevent="submitReview" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fa-solid fa-star mr-2 text-orange-500"></i>
                Оценка
                  </label>
              <div class="flex space-x-2">
                <button 
                  v-for="star in 5" 
                  :key="star" 
                  type="button"
                  @click="form.rating = star"
                  :class="[
                    'w-12 h-12 rounded-full flex items-center justify-center transition',
                    star <= form.rating 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  ]"
                >
                  <i class="fa-solid fa-star"></i>
            </button>
            </div>
            </div>
                  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fa-solid fa-comment mr-2 text-orange-500"></i>
                Комментарий
                    </label>
              <textarea 
                v-model="form.comment" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                rows="4" 
                placeholder="Расскажите о вашем опыте..."
              ></textarea>
                </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fa-solid fa-user mr-2 text-orange-500"></i>
                Ваше имя
                    </label>
                    <input 
                v-model="form.name" 
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                placeholder="Введите ваше имя" 
                      required 
                    />
            </div>
                  
                <button 
                  type="submit" 
              :disabled="loading"
              class="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition"
                >
              <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-2"></i>
              <i v-else class="fa-solid fa-paper-plane mr-2"></i>
              {{ loading ? 'Отправка...' : 'Отправить отзыв' }}
                </button>
            </form>
                  </div>
      </div>
    </div>
  `,
  setup() {
    const form = ref({
      rating: 0,
      comment: '',
      name: ''
    });
    const loading = ref(false);
    const router = useRouter();
    const route = useRoute();
    const orderId = route.params.orderId;

    async function submitReview() {
      if (form.value.rating === 0) {
        alert('Пожалуйста, выберите оценку');
        return;
      }
      
      loading.value = true;
      
      try {
        await axios.post('/api/reviews', {
          ...form.value,
          orderId
        });
        
        alert('Спасибо за ваш отзыв!');
        router.push('/');
      } catch (e) {
        console.error('Ошибка отправки отзыва', e);
        alert('Произошла ошибка при отправке отзыва');
      } finally {
        loading.value = false;
      }
    }
    
    return { form, loading, submitReview };
  }
};

// Определяем маршруты для приложения
const routes = [
  { path: '/', component: HomeViewComponent },
  { path: '/cart', component: CartViewComponent },
  { path: '/checkout', component: CheckoutViewComponent },
  { path: '/thankyou', component: ThankYouView },
  { path: '/review/:orderId', component: ReviewView },
  { path: '/news', component: NewsListView },
  { path: '/news/:id', component: NewsDetailView, props: true },
  { path: '/admin', component: AdminDashboardView },
  { path: '/admin/dashboard', component: AdminDashboardView },
  { path: '/admin/products', component: AdminProductsView },
  { path: '/admin/categories', component: AdminCategoriesView },
  { path: '/admin/news', component: AdminNewsView },
  { path: '/admin/orders', component: AdminOrdersView },
  { path: '/admin/orders/:id/edit', component: AdminOrderEditView },
  { path: '/admin/reviews', component: AdminReviewsView },
  { path: '/admin/seo', component: AdminSEOView },
  { path: '/admin/site-settings', component: AdminSiteSettingsView },
  { path: '/admin/category-blocks', component: AdminCategoryBlocksView },
  { path: '/login', component: PublicLoginView },
  { path: '/account', component: AccountView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Глобальный навигационный охранник: запрещаем доступ к /admin*
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin') && to.path !== '/login') {
    const userRole = auth.user?.role;
    if (!auth.isLoggedIn || userRole !== 'admin') {
      return next('/login');
    }
  }
  next();
});

// Главный компонент приложения
const App = {
  name: 'App',
  template: /* html */`
    <div id="app" class="min-h-screen bg-gray-50">
      <!-- Показываем только загрузку до полной готовности -->
      <LoadingSpinner v-if="globalLoading.isLoading" :progress="globalLoading.progress" />
      
      <!-- Основное приложение показываем только после загрузки -->
      <div v-else>
        <!-- Навигационная панель -->
        <nav class="bg-white shadow-lg sticky top-0 z-40">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <!-- Логотип -->
              <div class="flex items-center">
                <router-link to="/" class="flex items-center space-x-2">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                    <img v-if="siteLogo" :src="siteLogo" alt="logo" class="w-full h-full object-cover" />
                    <div v-else class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <i class="fa-solid fa-utensils text-white text-lg"></i>
          </div>
                  </div>
                  <span class="text-xl font-bold text-gray-900">{{ siteTitle }}</span>
            </router-link>
            </div>

              <!-- Навигационные ссылки -->
              <div class="hidden md:flex items-center space-x-8">
                <router-link 
                  to="/" 
                  class="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  active-class="text-orange-600"
                >
                  Главная
                </router-link>
                <router-link 
                  to="/news" 
                  class="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  active-class="text-orange-600"
                >
                  Новости
                </router-link>

                <!-- Кнопка корзины с всплывающим превью по наведению -->
                <div class="relative"
                     @mouseenter="hoverCart = true"
                     @mouseleave="hoverCart = false">
          <button
            @click="goToCart"
                    class="relative text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <i class="fa-solid fa-shopping-cart mr-1"></i>
                    Корзина
                    <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartCount }}
            </span>
                  </button>

                  <!-- Поповер превью корзины -->
                  <div v-if="hoverCart && cartItems.length > 0" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                    <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div class="font-semibold text-gray-900 flex items-center">
                        <i class="fa-solid fa-bag-shopping text-orange-500 mr-2"></i>
                        Ваша корзина
            </div>
                      <div class="text-xs text-gray-500">{{ cartCount }} поз.</div>
                    </div>
                    <div class="max-h-72 overflow-auto">
                      <div v-for="it in cartItems" :key="it.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                          <img :src="it.image" alt="" class="w-10 h-10 object-cover rounded-lg border border-gray-200" loading="lazy" />
                          <div>
                            <div class="text-sm font-medium text-gray-900 truncate max-w-[160px]">{{ it.name }}</div>
                            <div class="text-xs text-gray-500">Цена: {{ formatPrice(it.price) }}</div>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-sm text-gray-700">× {{ it.quantity }}</div>
                          <div class="text-sm font-semibold text-gray-900">{{ formatPrice(it.price * it.quantity) }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm text-gray-600">Итого</span>
                        <span class="text-sm font-bold text-orange-600">{{ formatPrice(cartTotal) }}</span>
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                        <button @click="goToCart" class="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition">
                          Оформить
          </button>
                        <button @click="showCartPreview" class="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 transition">
                          Просмотр
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  v-if="!isAdmin" 
                  @click="showCartPreview" 
                  class="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <i class="fa-solid fa-eye mr-1"></i>
                  Предпросмотр корзины
                </button>
                <router-link 
                  v-if="!authLoggedIn" 
                  to="/login" 
                  class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i class="fa-solid fa-sign-in-alt mr-1"></i>
                  Войти
                </router-link>
                <router-link 
                  v-else-if="isAdmin" 
                  to="/admin" 
                  class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i class="fa-solid fa-cog mr-1"></i>
                  Админка
                </router-link>
                <router-link 
                  v-else 
                  to="/account" 
                  class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i class="fa-solid fa-user mr-1"></i>
                  Личный кабинет
                </router-link>
                <button 
                  v-if="authLoggedIn" 
                  @click="logout" 
                  class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <i class="fa-solid fa-sign-out-alt mr-1"></i>
                  Выйти
                </button>
            </div>

              <!-- Мобильное меню -->
              <div class="md:hidden">
                <button 
                  @click="showMobileMenu = !showMobileMenu" 
                  class="text-gray-700 hover:text-orange-600 p-2"
                >
                  <i class="fa-solid fa-bars text-xl"></i>
          </button>
              </div>
            </div>
            
            <!-- Мобильное меню -->
            <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
              <div class="space-y-2">
                <router-link 
                  to="/" 
                  class="block text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium"
                  @click="showMobileMenu = false"
                >
                  Главная
                </router-link>
                <router-link 
                  to="/news" 
                  class="block text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium"
                  @click="showMobileMenu = false"
                >
                  Новости
                </router-link>
                <button 
                  @click="goToCart(); showMobileMenu = false" 
                  class="block w-full text-left text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  <i class="fa-solid fa-shopping-cart mr-1"></i>
                  Корзина ({{ cartCount }})
                </button>
                <router-link 
                  v-if="!authLoggedIn" 
                  to="/login" 
                  class="block bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-base font-medium mx-3"
                  @click="showMobileMenu = false"
                >
                  <i class="fa-solid fa-sign-in-alt mr-1"></i>
                  Войти
                </router-link>
                <router-link 
                  v-else-if="isAdmin" 
                  to="/admin" 
                  class="block bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-base font-medium mx-3"
                  @click="showMobileMenu = false"
                >
                  <i class="fa-solid fa-cog mr-1"></i>
                  Админка
                </router-link>
                <router-link 
                  v-else 
                  to="/account" 
                  class="block bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-base font-medium mx-3"
                  @click="showMobileMenu = false"
                >
                  <i class="fa-solid fa-user mr-1"></i>
                  Личный кабинет
                </router-link>
                <button 
                  v-if="authLoggedIn" 
                  @click="logout(); showMobileMenu = false" 
                  class="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  <i class="fa-solid fa-sign-out-alt mr-1"></i>
                  Выйти
                </button>
          </div>
                </div>
              </div>
        </nav>

        <!-- Основной контент -->
        <main class="flex-1">
          <router-view />
        </main>

        <!-- Плавающая корзина -->
        <component :is="FloatingCartComp" v-if="FloatingCartComp && cartCount > 0" />

        <!-- Предпросмотр корзины -->
        <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Корзина</h3>
                <button 
                  @click="hideCartPreview" 
                  class="text-gray-400 hover:text-gray-600"
                >
                  <i class="fa-solid fa-times text-xl"></i>
                </button>
          </div>
                </div>
            <div class="p-6">
              <div v-if="cartItems.length === 0" class="text-center py-8">
                <i class="fa-solid fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Корзина пуста</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="item in cartItems" :key="item.id" class="flex items-center space-x-4">
                  <img :src="item.image" :alt="item.name" class="w-12 h-12 object-cover rounded-lg" />
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
            </div>
                  <p class="font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-gray-900">Итого:</span>
                    <span class="text-lg font-bold text-orange-600">{{ formatPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) }}</span>
              </div>
              <button 
                    @click="goToCart(); hideCartPreview()" 
                    class="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                    Перейти к оформлению
              </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const showMobileMenu = ref(false);
    const showPreview = ref(false);
    const hoverCart = ref(false);
    const FloatingCartComp = ref(window.FloatingCart || null);
    const pollId = setInterval(() => {
      if (!FloatingCartComp.value && window.FloatingCart) {
        FloatingCartComp.value = window.FloatingCart;
        clearInterval(pollId);
      }
    }, 150);
    // Безопасные ссылки на корзину для шаблона (исключаем ошибки при ранней инициализации)
    const cartItems = computed(() => Array.isArray(window.cart?.items) ? window.cart.items : []);
    const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0));
    const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const isAdmin = computed(() => auth.isLoggedIn && auth.user?.role === 'admin');
    const authLoggedIn = computed(() => !!auth.isLoggedIn);
    const router = useRouter();
    const siteTitle = ref('Точка суши и пиццы');
    const siteLogo = ref('');

    function goToCart() {
      router.push('/cart');
    }

    function showCartPreview() {
      showPreview.value = true;
    }

    function hideCartPreview() {
      showPreview.value = false;
    }

    function logout() {
      auth.isLoggedIn = false;
      auth.user = null;
      auth.token = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('auth_user');
      router.push('/');
    }
    
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    
    // Загружаем настройки сайта (только для отображения заголовка/логотипа)
    (async () => {
      try {
        const res = await axios.get('/api/site-settings');
        const data = res.data || {};
        siteTitle.value = data.site_title || siteTitle.value;
        siteLogo.value = data.logo || '';
      } catch (_) {}
    })();
    
    return { 
      showMobileMenu, 
      showPreview, 
      hoverCart,
      FloatingCartComp,
      cartItems,
      cartCount, 
      cartTotal,
      isAdmin, 
      authLoggedIn,
      goToCart, 
      showCartPreview, 
      hideCartPreview, 
      logout,
      formatPrice,
      globalLoading,
      siteTitle,
      siteLogo
    };
  }
};

// Создаём и монтируем приложение
// Функция для обновления админских компонентов после загрузки модулей
function updateAdminComponents() {
  if (window.AdminHomeView) {
    app.component('AdminHomeView', window.AdminHomeView);
  }
  if (window.AdminOrdersView) {
    app.component('AdminOrdersView', window.AdminOrdersView);
  }
  if (window.AdminDashboardView) {
    app.component('AdminDashboardView', window.AdminDashboardView);
  }
  if (window.AdminOrderEditView) {
    app.component('AdminOrderEditView', window.AdminOrderEditView);
  }
  if (window.AdminProductsView) {
    app.component('AdminProductsView', window.AdminProductsView);
  }
  if (window.AdminNewsView) {
    app.component('AdminNewsView', window.AdminNewsView);
  }
  if (window.AdminCategoriesView) {
    app.component('AdminCategoriesView', window.AdminCategoriesView);
  }
  if (window.AdminReviewsView) {
    app.component('AdminReviewsView', window.AdminReviewsView);
  }
  if (window.AdminStatsView) {
    app.component('AdminStatsView', window.AdminStatsView);
  }
  if (window.AdminSEOView) {
    app.component('AdminSEOView', window.AdminSEOView);
  }
  if (window.AdminCategoryBlocksView) {
    app.component('AdminCategoryBlocksView', window.AdminCategoryBlocksView);
  }
}

const app = createApp(App);
app.component('LoadingSpinner', LoadingSpinner);
app.use(router);
app.mount('#app');

// Обновляем компоненты после загрузки модулей
setTimeout(updateAdminComponents, 100);

// Делаем функцию обновления и глобальное состояние доступными
window.updateAdminComponents = updateAdminComponents;
window.globalLoading = globalLoading;
// Экспортируем добавление в корзину глобально, чтобы им мог пользоваться HomeView
window.addToCart = addToCart;

// Завершаем загрузку после инициализации приложения
document.addEventListener('DOMContentLoaded', () => {
  // Симулируем реалистичную загрузку
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15 + 5; // Случайный прирост от 5 до 20%
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Скрываем загрузку после завершения анимации
  setTimeout(() => {
        globalLoading.isLoading = false;
      }, 800);
    }
    globalLoading.progress = Math.min(progress, 100);
  }, 200);
});
