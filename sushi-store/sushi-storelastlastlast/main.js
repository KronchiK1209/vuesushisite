// Используем глобальные сборки Vue и VueRouter, подключённые через CDN.
const { createApp, reactive, ref, computed, onMounted, onUnmounted, watch } = Vue;
const { createRouter, createWebHistory } = VueRouter;
const { useRouter, useRoute } = VueRouter;

// Компонент анимации загрузки
const LoadingSpinner = {
  name: 'LoadingSpinner',
  template: /* html */`
    <div class="loading-overlay">
      <div class="loading-container">
        <!-- Анимированные суши -->
        <div class="sushi-animation">
          <div class="sushi-roll">
            <div class="sushi-piece" v-for="i in 8" :key="i" :style="{ '--delay': (i - 1) * 0.1 + 's' }"></div>
          </div>
          <div class="chopsticks">
            <div class="chopstick left"></div>
            <div class="chopstick right"></div>
          </div>
        </div>
        
        <!-- Логотип и текст -->
        <div class="loading-content">
          <div class="loading-logo">
            <i class="fa-solid fa-fish text-4xl text-orange-500 mb-4 animate-pulse"></i>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Точка суши и пиццы</h2>
            <p class="text-gray-600">Готовим для вас самое вкусное...</p>
          </div>
          
          <!-- Прогресс бар -->
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <p class="progress-text">{{ progress }}%</p>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    // Анимация прогресса
    const animateProgress = () => {
      const interval = setInterval(() => {
        if (globalLoading.progress < 100) {
          globalLoading.progress += Math.random() * 15;
          if (globalLoading.progress > 100) globalLoading.progress = 100;
        } else {
          clearInterval(interval);
          // Завершаем загрузку через 500мс после достижения 100%
          setTimeout(() => {
            globalLoading.isLoading = false;
          }, 500);
        }
      }, 200);
    };
    
    onMounted(() => {
      animateProgress();
    });
    
    return {
      progress: computed(() => Math.round(globalLoading.progress))
    };
  }
};

// Простое глобальное состояние для корзины. Каждый элемент содержит id, name, price, image, quantity.
// Глобальное состояние корзины и информации о заказе
const cart = reactive({
  items: [],
  // количество персон для заказа
  persons: 1,
  // количество выбранных допов (Соевый соус, Имбирь, Васаби)
  extrasSelection: [0, 0, 0],
  // время доставки: 'asap' - как можно скорее, 'scheduled' - запланированное время
  deliveryTime: 'asap',
  // запланированное время доставки (если выбрано)
  scheduledTime: ''
});

// Глобальное состояние загрузки
const globalLoading = reactive({
  isLoading: true,
  progress: 0
});

// Глобальное состояние аутентификации (токен и роль).
// При загрузке страницы читаем токен и роль из localStorage,
// чтобы сохранять состояние между перезагрузками.
const auth = reactive({
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || ''
});

// Настройка axios: устанавливаем заголовок Authorization при изменении токена.
if (typeof axios !== 'undefined') {
  if (auth.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
  }
}

// Следим за изменениями auth.token и обновляем localStorage и axios.
watch(
  () => auth.token,
  (newToken) => {
    if (typeof axios !== 'undefined') {
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }
);

// Следим за изменениями роли, чтобы сохранять/удалять в localStorage
watch(
  () => auth.role,
  (newRole) => {
    if (newRole) {
      localStorage.setItem('role', newRole);
    } else {
      localStorage.removeItem('role');
    }
  }
);

/**
 * Добавляет товар в корзину. Если товар уже присутствует, увеличивает количество.
 * @param {Object} product Товар, который нужно добавить
 */
function addToCart(product) {
  const existing = cart.items.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }
}

/**
 * Компонент главной страницы (список товаров).
 */
const HomeView = {
  name: 'HomeView',
  template: /* html */`
    <div>
      <!-- Новый баннер в стиле Brox -->
      <section class="relative bg-red-600 text-white overflow-hidden">
        <!-- декоративные завитки как фон -->
        <img src="/banner.png" class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="" />
        <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <!-- Левый столбец: текст и кнопка -->
          <div>
            <p class="text-yellow-200 uppercase tracking-wider mb-3">Быстро и вкусно</p>
            <h1 class="text-4xl lg:text-5xl font-bold mb-4 leading-tight">Попробуйте наши <span class="text-yellow-300">особые суши</span></h1>
            <p class="text-lg mb-6 max-w-md">Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.</p>
            <button @click="scrollToMenu" class="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center space-x-2">
              <span>Начать заказ</span>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <div class="flex space-x-8 mt-8 text-sm">
              <div class="flex items-center space-x-2"><i class="fa-solid fa-truck-fast"></i><span>Доставка</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-box-open"></i><span>Самовывоз</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-chair"></i><span>В ресторане</span></div>
            </div>
          </div>
          <!-- Правый столбец: изображение с сетом и значком скидки -->
          <div class="relative hidden md:block">
            <!-- Обернём изображение в transition для плавной смены слайдов с эффектом размытия -->
            <transition name="pixel-fade" mode="out-in">
              <img :key="currentSlideIndex" :src="(currentSlide && currentSlide.image) || heroImage || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" alt="Слайд" class="w-full h-80 object-cover rounded-lg shadow-lg" />
            </transition>
            <!-- Значок скидки: уменьшенный размер и аккуратное позиционирование -->
            <div class="absolute top-4 right-4">
              <div class="relative">
                <i class="fa-solid fa-star text-yellow-400 text-4xl"></i>
                <span class="absolute inset-0 flex items-center justify-center text-red-700 text-xs font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Волнообразный низ блока: SVG внутри, рисует волну в цвете следующего блока -->
        <svg class="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-32" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <!-- Цвет нижней части волны соответствует блоку категорий (#f9f4e5) -->
          <path fill="#f9f4e5" d="M0 50 Q 360 80 720 50 T 1440 50 V100 H0 Z"></path>
        </svg>
      </section>
      <!-- Наши категории -->
      <!--
        Настраиваем фон и цвета для блока категорий. Пользователь просил сделать фон
        светлым (код #f9f4e5) и использовать чёрный, оранжевый и красный оттенки
        для надписи. Для фона используется inline‑style, чтобы не зависеть от
        встроенных классов Tailwind. Для текста основного заголовка добавляем
        класс text-black, а для выделенных слов используем text-orange-600 и
        text-red-600 соответственно.
      -->
      <section class="py-12" style="background-color:#f9f4e5;">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">
          <span class="text-orange-600">Категории</span> и
          <span class="text-red-600">блюда</span>, которых вы не&nbsp;найдёте нигде
        </h2>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <div
            v-for="(cat, index) in categoryBlocks"
            :key="cat.id"
            class="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn"
            :style="{ animationDelay: (index * 0.2) + 's' }"
          >
            <div class="w-32 h-32 rounded-full overflow-hidden relative group">
              <img :src="cat.image || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" alt="" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="mt-4 font-semibold text-xl text-red-700 group-hover:text-orange-600 transition-colors duration-300">{{ cat.name }}</h3>
            <p class="mt-2 text-sm text-gray-700">{{ cat.description }}</p>
            <div class="mt-2 w-12 h-1 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full group-hover:w-16 transition-all duration-300"></div>
          </div>
        </div>
      </section>

      <!-- старый блок меню с поиском и карточками удалён -->

      <!-- Категории старая секция удалена -->

      <!-- Раздел меню с вертикальным выбором категории и списком товаров -->
      <section class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Заголовок меню с декоративными элементами -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center space-x-2 mb-4">
              <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
              <h2 ref="menuSection" class="text-4xl font-bold text-gray-900">Наше меню</h2>
              <div class="w-8 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">Выберите категорию и наслаждайтесь нашими изысканными блюдами</p>
          </div>
          
          <div class="grid lg:grid-cols-4 gap-8">
            <!-- Боковая панель с поиском и категориями -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <!-- Поиск -->
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-search mr-2 text-orange-500"></i>
                    Поиск по меню
                  </label>
                  <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
                      placeholder="Введите название блюда..."
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
                
                <!-- Категории -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fa-solid fa-tags mr-2 text-orange-500"></i>
                    Категории
                  </h3>
            <div class="space-y-2">
                    <!-- Фильтр "Хиты" -->
                    <button
                      @click="selectedVertical = 'Хиты'"
                      :class="[
                        'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group',
                        selectedVertical === 'Хиты'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                          : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 hover:from-yellow-100 hover:to-orange-100 hover:shadow-md'
                      ]"
                    >
                      <span class="font-medium flex items-center">
                        <i class="fa-solid fa-star mr-2 text-yellow-500"></i>
                        Хиты
                      </span>
                      <i v-if="selectedVertical === 'Хиты'" class="fa-solid fa-check text-sm"></i>
                      <i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i>
                    </button>
                    
                    <!-- Обычные категории -->
              <button
                v-for="cat in verticalCategories"
                :key="cat"
                @click="selectedVertical = cat"
                      :class="[
                        'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group',
                        selectedVertical === cat
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md'
                      ]"
                    >
                      <span class="font-medium">{{ cat }}</span>
                      <i v-if="selectedVertical === cat" class="fa-solid fa-check text-sm"></i>
                      <i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i>
              </button>
            </div>
          </div>
                
                <!-- Дополнительная информация -->
                <div class="mt-8 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                  <div class="flex items-center text-orange-700 mb-2">
                    <i class="fa-solid fa-star mr-2"></i>
                    <span class="font-semibold">Популярное</span>
                  </div>
                  <p class="text-sm text-orange-600">Попробуйте наши хиты продаж!</p>
                </div>
              </div>
            </div>
            <!-- Список товаров выбранной категории -->
            <div class="lg:col-span-3">
               <!-- Заголовок категории -->
               <div class="mb-6">
                 <h3 class="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                   <i v-if="selectedVertical === 'Хиты'" class="fa-solid fa-star text-yellow-500 mr-3"></i>
                   {{ selectedVertical }}
                 </h3>
                 <p class="text-gray-600">
                   {{ selectedVerticalProducts?.length || 0 }} 
                   {{ selectedVertical === 'Хиты' ? 'хитов продаж' : 'блюд в этой категории' }}
                 </p>
               </div>
              
              <!-- Сетка товаров -->
              <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <transition-group name="fade" tag="div" class="contents">
              <div
                v-for="product in (selectedVerticalProducts || [])"
                :key="product.id"
                    class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
                    @click="openProductModal(product)"
                  >
                    <!-- Изображение товара -->
                    <div class="relative h-48 overflow-hidden">
                      <img 
                        :src="product.image" 
                        :alt="product.name" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div class="absolute top-4 right-4 flex flex-col space-y-2">
                        <!-- Звездочка хитов -->
                        <div v-if="product.hit" class="bg-yellow-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <i class="fa-solid fa-star text-white text-sm"></i>
                </div>
                        <!-- Цена -->
                        <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span class="text-orange-600 font-bold text-sm">{{ formatPrice(product.price) }}</span>
                  </div>
                  </div>
                      <!-- Иконка для просмотра деталей -->
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <i class="fa-solid fa-eye text-orange-600 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Контент карточки с flex-grow -->
                    <div class="p-6 flex flex-col flex-grow">
                      <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                        {{ product.name }}
                      </h4>
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
                      
                      <!-- Кнопка заказа всегда внизу -->
                      <button 
                        @click.stop.prevent="add(product)" 
                        class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
                      >
                        <i class="fa-solid fa-plus"></i>
                        <span>Заказать</span>
                      </button>
                </div>
              </div>
            </transition-group>
          </div>
              
              <!-- Сообщение, если товары не найдены -->
              <div v-if="(selectedVerticalProducts || []).length === 0" class="text-center py-12">
                <i class="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-500 mb-2">Товары не найдены</h3>
                <p class="text-gray-400">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
              </div>
            </div>
        </div>
        </div>
        </div>

        <!-- Модальное окно для детального просмотра товара -->
        <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeProductModal">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="grid md:grid-cols-2 gap-0">
              <!-- Левая часть - изображение -->
              <div class="relative h-64 md:h-auto">
                <img 
                  :src="selectedProduct.image" 
                  :alt="selectedProduct.name" 
                  class="w-full h-full object-cover rounded-l-2xl"
                />
                <div class="absolute top-4 right-4 flex flex-col space-y-2">
                  <!-- Звездочка хитов -->
                  <div v-if="selectedProduct.hit" class="bg-yellow-500/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <i class="fa-solid fa-star text-white text-lg"></i>
                  </div>
                  <!-- Цена -->
                  <div class="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span class="text-orange-600 font-bold text-lg">{{ formatPrice(selectedProduct.price) }}</span>
                  </div>
                </div>
                <!-- Кнопка закрытия -->
                <button 
                  @click="closeProductModal"
                  class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition"
                >
                  <i class="fa-solid fa-times text-gray-600"></i>
                </button>
              </div>
              
              <!-- Правая часть - информация -->
              <div class="p-8 flex flex-col justify-between">
                <div>
                  <div class="flex items-center mb-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mr-3">
                      {{ selectedProduct.category }}
                    </span>
                    <span v-if="selectedProduct.hit" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <i class="fa-solid fa-star mr-1"></i>
                      Хит продаж
                    </span>
                  </div>
                  
                  <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ selectedProduct.name }}</h2>
                  
                  <p class="text-gray-600 text-lg leading-relaxed mb-6">{{ selectedProduct.description }}</p>
                  
                  <div class="flex items-center space-x-4 mb-6">
                    <div class="text-3xl font-bold text-orange-600">{{ formatPrice(selectedProduct.price) }}</div>
                    <div class="text-sm text-gray-500">за порцию</div>
                  </div>
                </div>
                
                <!-- Кнопки действий -->
                <div class="space-y-4">
                  <button 
                    @click="addToCartFromModal"
                    class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 text-lg"
                  >
                    <i class="fa-solid fa-plus"></i>
                    <span>Добавить в корзину</span>
                  </button>
                  
                  <button 
                    @click="addToCartAndGoToCheckout"
                    class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 text-lg"
                  >
                    <i class="fa-solid fa-shopping-cart"></i>
                    <span>Заказать сейчас</span>
                  </button>
                </div>
          </div>
        </div>
        </div>
        </div>
      </section>
      <!-- Статистика: опыт, категории и товары с интерактивной каруселью -->
      <section class="py-12" style="background-color:#f9f4e5;">
        <div class="max-w-6xl mx-auto px-4">
          <!-- Заголовок секции -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Это вкусно!</h2>
            <p class="text-gray-600">Наша статистика и популярные категории</p>
          </div>
          
          <!-- Интерактивная карусель карточек -->
          <div 
            class="relative cursor-grab select-none"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseLeave"
            :class="{ 'cursor-grabbing': isDragging }"
          >
            <!-- Контейнер карточек -->
            <div class="overflow-hidden">
              <div 
                class="flex transition-transform duration-1000 ease-out"
                :style="{ 
                  transform: 'translateX(' + carouselPosition + '%)',
                  transition: isDragging ? 'none' : 'transform 1s ease-out'
                }"
              >
                <!-- Все карточки в цикле (включая "Это вкусно!") -->
                <div 
                  v-for="(card, index) in infiniteStatsCards" 
                  :key="card.name + '-' + index"
                  class="w-1/4 flex-shrink-0 px-2"
                >
                  <div 
                    :class="[
                      'rounded-xl p-6 flex flex-col items-center justify-center shadow-lg text-center h-full min-h-[200px] carousel-card',
                      card.isMain 
                        ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white' 
                        : 'bg-white'
                    ]"
                  >
                    <div v-if="card.isMain" class="text-center">
                      <i class="fa-solid fa-heart text-4xl mb-4 text-orange-200"></i>
                      <h3 class="text-lg font-bold mb-2">{{ card.name }}</h3>
                      <span class="text-4xl font-extrabold">{{ card.count }}</span>
                      <p class="text-xs mt-1 text-orange-100 text-center">{{ card.description }}</p>
                    </div>
                    <div v-else>
                      <div class="w-16 h-16 mb-3 rounded-full overflow-hidden">
                        <img :src="card.image" alt="" class="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <h3 class="font-semibold mb-1">{{ card.name }}</h3>
                      <p class="text-2xl text-red-600 font-bold mb-1">{{ card.count }}</p>
                      <p class="text-sm text-gray-600">{{ card.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Автопрокрутка переключатель -->
          <div class="flex justify-center mt-6">
            <button
              @click="toggleAutoRotate"
              :class="[
                'px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl',
                isAutoRotating 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              <i :class="isAutoRotating ? 'fa-solid fa-pause' : 'fa-solid fa-play'" class="mr-2"></i>
              {{ isAutoRotating ? 'Пауза автопрокрутки' : 'Запустить автопрокрутку' }}
            </button>
          </div>
          
          <!-- Подсказка -->
          <div class="text-center mt-2">
            <p class="text-sm text-gray-500">
              <i class="fa-solid fa-infinity mr-1"></i>
              Перетащите мышью для прокрутки • Бесконечное циклическое движение
            </p>
          </div>
        </div>
      </section>
      <!-- Самое популярное -->
      <section class="py-12" style="background-color:#ffebb7;">
        <div class="max-w-6xl mx-auto mb-6">
          <h2 class="text-2xl font-bold">Самое популярное</h2>
        </div>
        <!-- Сетка карточек самых популярных товаров (топ‑3) -->
        <div class="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="product in popularProducts"
            :key="product.id"
            class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1 h-full"
          >
            <!-- круглая картинка товара -->
            <div class="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4">
              <img :src="product.image" alt="" class="w-full h-full object-cover" loading="lazy" />
            </div>
            
            <!-- Контент карточки с flex-grow -->
            <div class="flex flex-col items-center flex-grow w-full">
            <h3 class="font-semibold text-lg mb-2 text-center text-red-700">{{ product.name }}</h3>
              <p class="text-sm text-gray-600 mb-4 text-center flex-grow">{{ product.description }}</p>
            </div>
            
            <!-- Кнопка и цена всегда внизу -->
            <div class="w-full flex flex-col items-center mt-auto">
              <p class="text-red-600 font-bold text-lg mb-2">{{ formatPrice(product.price) }}</p>
              <button @click.stop.prevent="add(product)" class="w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition text-center">Заказать</button>
            </div>
          </div>
        </div>
      </section>
      <!-- Отзывы -->
      <section class="py-12 bg-red-100">
        <h2 class="text-2xl font-bold mb-6 text-center">Отзывы</h2>
        <div class="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
          <div v-for="t in computedTestimonials" :key="t.name + t.quote + t.date" class="bg-white rounded-lg shadow p-6 flex flex-col">
            <div class="flex items-center mb-4">
              <img :src="t.image" alt="" class="w-12 h-12 object-cover rounded-full mr-3" loading="lazy" />
              <div>
                <h3 class="font-semibold">{{ t.name }}</h3>
                <p class="text-sm text-gray-500">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-gray-700 flex-grow mb-4">{{ t.quote }}</p>
            <div class="text-orange-400 flex space-x-1">
              <i v-for="n in 5" :key="n" :class="['fa', n <= t.rating ? 'fa-solid fa-star' : 'fa-regular fa-star']"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  setup() {
    // Все объявления переменных в начале
    const seoData = ref(null);
    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const selectedCategory = ref('Все');
    const categories = ref([]);
    const categoriesData = ref([]);
    const reviews = ref([]);
    const heroSlides = ref([]);
    const currentSlideIndex = ref(0);
    const menuSection = ref(null);
    const showProductModal = ref(false);
    const selectedProduct = ref({});
    const categoryBlocks = ref([]);
    const selectedVertical = ref(null);
    const bestsellerContainer = ref(null);
    
    // Загружаем SEO данные
    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        seoData.value = response.data;
      } catch (e) {
        console.error('Ошибка загрузки SEO данных:', e);
      }
    }
    
    // SEO мета-теги для главной страницы (упрощенная версия без VueUseHead)
    function updatePageTitle() {
      if (seoData.value) {
        const site = seoData.value.site || {};
        const pages = seoData.value.pages || {};
        const home = pages.home || {};
        const title = home.title || site.title || 'Интернет‑магазин суши и пиццы | Доставка суши и пиццы | Точка суши и пиццы';
        document.title = title;
      }
    }

    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products');
        products.value = res.data;
        // формируем набор слайдов для баннера
        heroSlides.value = products.value.map(p => ({
          heading: p.name,
          subheading: p.description,
          image: p.image
        }));
      } catch (e) {
        console.error('Не удалось загрузить список товаров', e);
      } finally {
        loading.value = false;
      }
    }

    async function fetchCategories() {
      try {
        const res = await axios.get('/api/categories');
        // Сохраняем полные данные категорий
        categoriesData.value = res.data;
        // Преобразуем массив объектов категорий в массив строк для совместимости
        categories.value = ['Все', ...res.data.map(cat => cat.name)];
      } catch (e) {
        console.error('Не удалось загрузить список категорий', e);
        // Fallback к статическим категориям
        categories.value = ['Все', 'Роллы', 'Пицца', 'Салаты', 'Напитки'];
        categoriesData.value = [];
      }
    }

    // Анимация дождя из сушиков и пицц
    const foodEmojis = ['🍣', '🍱', '🍙', '🍘', '🍥', '🍜', '🍲', '🍕', '🍝', '🍛', '🥟', '🍤', '🍢', '🍡', '🥢'];
    const foodTypes = ['sushi', 'pizza'];
    const foodSizes = ['small', 'medium', 'large'];
    
    function createFoodRain() {
      const rainContainer = document.getElementById('food-rain');
      if (!rainContainer) return;
      
      // Очищаем контейнер
      rainContainer.innerHTML = '';
      
      // Создаем 50 элементов еды
      for (let i = 0; i < 50; i++) {
        const foodItem = document.createElement('div');
        const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
        const randomSize = foodSizes[Math.floor(Math.random() * foodSizes.length)];
        
        foodItem.textContent = randomEmoji;
        foodItem.className = `food-item ${randomType}-item ${randomSize}`;
        
        // Случайная позиция по горизонтали
        foodItem.style.left = Math.random() * 100 + '%';
        
        // Случайная задержка анимации
        foodItem.style.animationDelay = Math.random() * 5 + 's';
        
        // Случайная длительность анимации
        const duration = 3 + Math.random() * 3; // от 3 до 6 секунд
        foodItem.style.animationDuration = duration + 's';
        
        rainContainer.appendChild(foodItem);
      }
    }
    
    function startFoodRain() {
      createFoodRain();
      
      // Обновляем дождь каждые 10 секунд для разнообразия
      setInterval(() => {
        createFoodRain();
      }, 10000);
    }

    onMounted(() => {
      fetchSEOData().then(() => {
        updatePageTitle();
      });
      fetchCategoryBlocks();
      fetchProducts();
      fetchCategories();
      
      // Запускаем ротацию карточек после загрузки данных
      setTimeout(() => {
        startCardRotation();
        startAutoRotate(); // Запускаем новую автопрокрутку
      }, 2000);
      
      // Запускаем дождь из сушиков и пицц
      setTimeout(() => {
        startFoodRain();
      }, 1000);
    });

    // Останавливаем ротацию при размонтировании компонента
    onUnmounted(() => {
      stopCardRotation();
      stopAutoRotate();
    });


    // загружаем отзывы с сервера
    async function fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
        reviews.value = res.data;
      } catch (e) {
        console.error('Не удалось загрузить отзывы', e);
      }
    }
    onMounted(fetchReviews);
    function add(product) {
      addToCart(product);
    }
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    // выделяем уникальные категории
    const uniqueCategories = computed(() => {
      const set = new Set();
      products.value.forEach(p => {
        if (p.category_name) set.add(p.category_name);
      });
      return ['Все', ...Array.from(set)];
    });
    const filteredProducts = computed(() => {
      return products.value.filter(p => {
        const matchesCategory = selectedCategory.value === 'Все' || p.category_name === selectedCategory.value;
        const q = searchQuery.value.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
    });
    // Выбираем изображение для главного баннера (сета), если есть
    const heroImage = computed(() => {
      const setProduct = products.value.find(p => p.category_name === 'Сеты');
      return setProduct ? setProduct.image : '';
    });

    // Слайды для баннера: заполним после загрузки продуктов
    const currentSlide = computed(() => heroSlides.value[currentSlideIndex.value] || {});
    // При загрузке продуктов формируем слайды (заполняется в fetchProducts)
    // Запускаем автопереключение слайдов
    onMounted(() => {
      setInterval(() => {
        if (heroSlides.value.length > 0) {
          currentSlideIndex.value = (currentSlideIndex.value + 1) % heroSlides.value.length;
        }
      }, 7000);
    });

    // ссылка на секцию меню для плавной прокрутки
    function scrollToMenu() {
      if (menuSection.value) {
        menuSection.value.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Модальное окно для товара
    function openProductModal(product) {
      selectedProduct.value = product;
      showProductModal.value = true;
    }
    
    function closeProductModal() {
      showProductModal.value = false;
      selectedProduct.value = {};
    }
    
    function addToCartFromModal() {
      add(selectedProduct.value);
      closeProductModal();
    }
    
    function addToCartAndGoToCheckout() {
      add(selectedProduct.value);
      closeProductModal();
      router.push('/cart');
    }
    // Загружаем динамические блоки категорий
    async function fetchCategoryBlocks() {
      try {
        const response = await axios.get('/api/category-blocks');
        categoryBlocks.value = response.data;
      } catch (e) {
        console.error('Ошибка загрузки блоков категорий:', e);
        // Fallback к статическим данным
        categoryBlocks.value = [
          {
            id: 'fallback-1',
            name: 'Роллы',
            description: 'Большой выбор традиционных и авторских роллов',
            image: 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'
          },
          {
            id: 'fallback-2',
            name: 'Суши',
            description: 'Классические нигири с нежнейшей рыбой',
            image: 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91'
          },
          {
            id: 'fallback-3',
            name: 'Сеты',
            description: 'Сеты для дружеских компаний и семейных вечеров',
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754'
          }
        ];
      }
    }
    // Данные для секции «Статистика»
    const statsCards = [
      { title: '5+ лет', subtitle: 'опыта доставки', color: 'bg-blue-600' },
      { title: '10+ товаров', subtitle: 'в меню', color: 'bg-green-600' },
      { title: '1000+ заказов', subtitle: 'выполнено', color: 'bg-orange-500' }
    ];
    // Статические отзывы (для примера)
    const staticTestimonials = [
      { name: 'Арина', role: 'Постоянный клиент', quote: 'Лучшие суши в городе! Свежесть и вкус на высоте.', image: '/testimonial1.png', rating: 5 },
      { name: 'Мария', role: 'Любитель роллов', quote: 'Очень вкусно и быстро. Всегда заказываю только здесь.', image: '/testimonial2.png', rating: 4 }
    ];

    // Компонуем отзывы: динамические из базы + статические
    const computedTestimonials = computed(() => {
      // преобразуем динамические отзывы в формат testimonial
      const dyn = reviews.value.map(r => {
        return {
          name: r.name || 'Аноним',
          role: r.phone ? `Пользователь ${r.phone}` : 'Гость',
          quote: r.comment || '',
          // случайно выбираем одно из двух изображений для анонимного пользователя
          image: Math.random() > 0.5 ? '/testimonial1.png' : '/testimonial2.png',
          rating: r.rating || 0
        };
      });
      return dyn.concat(staticTestimonials);
    });
    // Самые популярные товары (используем топ‑3 по цене как приближение к «самым покупаемым»)
    const popularProducts = computed(() => {
      // создаём копию массива, чтобы не мутировать исходные данные
      const arr = products.value.slice().filter(p => p.available !== false);
      // сортируем по количеству покупок (по убыванию). Если поле purchases отсутствует, считаем его равным нулю
      arr.sort((a, b) => {
        const ap = a.purchases || 0;
        const bp = b.purchases || 0;
        return bp - ap;
      });
      return arr.slice(0, 3);
    });

    // Для вертикального меню
    const verticalCategories = computed(() => categories.value.filter(cat => cat !== 'Все'));
    
    // Автоматически выбираем первую категорию после загрузки
    watch(verticalCategories, (newCategories) => {
      if (newCategories.length > 0 && !selectedVertical.value) {
        selectedVertical.value = newCategories[0];
      }
    }, { immediate: true });
    
    // выбранная категория по умолчанию
    const selectedVerticalItem = computed(() => {
      const cat = selectedVertical.value || (verticalCategories.value.length > 0 ? verticalCategories.value[0] : null);
      if (!cat) return null;
      return products.value.find(p => p.category_name === cat) || null;
    });
    // Список товаров выбранной вертикальной категории
    const selectedVerticalProducts = computed(() => {
      const q = searchQuery.value.toLowerCase().trim();
      // Если есть поисковый запрос, возвращаем все товары, подходящие под поиск по имени или описанию
      if (q) {
        return products.value.filter(p => {
          return (
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        });
      }
      // Если выбраны "Хиты", показываем только товары с hit: true
      if (selectedVertical.value === 'Хиты') {
        return products.value.filter(p => p.hit === true);
      }
      // В противном случае показываем товары выбранной категории
      const cat = selectedVertical.value || (verticalCategories.value.length > 0 ? verticalCategories.value[0] : null);
      if (!cat) return [];
      // Используем category_name вместо category, так как в данных товаров есть поле category_name
      return products.value.filter(p => p.category_name === cat);
    });

    // Статистика для блока "Опыт, товары, заказы".
    // Создаём список карточек с динамическим подсчётом количества товаров по каждой категории.
    const allStatsCards = computed(() => {
      // Формируем карточки для каждой уникальной категории (без 'Все')
      return categories.value
        .filter(cat => cat !== 'Все')
        .map(cat => {
          const count = products.value.filter(p => p.category_name === cat).length;
          // Находим изображение для категории из API категорий
          const categoryData = categoriesData.value.find(c => c.name === cat);
          return {
            name: cat,
            count: `${count}+`,
            description: 'товаров',
            image: categoryData ? categoryData.image : 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'
          };
        });
    });

    // Индекс для переключения карточек
    const currentCardIndex = ref(0);
    
    // Показываем максимум 3 карточки с возможностью переключения
    const statsCardsMenu = computed(() => {
      const cards = allStatsCards.value;
      if (cards.length <= 3) {
        return cards;
      }
      
      // Если карточек больше 3, показываем по 3 с переключением
      const startIndex = currentCardIndex.value;
      const endIndex = Math.min(startIndex + 3, cards.length);
      let result = cards.slice(startIndex, endIndex);
      
      // Если не хватает карточек до 3, добавляем с начала
      if (result.length < 3 && cards.length > 3) {
        const remaining = 3 - result.length;
        result = result.concat(cards.slice(0, remaining));
      }
      
      return result;
    });

    // Видимые карточки для карусели (включая "Это вкусно!")
    const visibleStatsCards = computed(() => {
      const cards = allStatsCards.value;
      const startIndex = currentCardIndex.value;
      const endIndex = Math.min(startIndex + 3, cards.length);
      return cards.slice(startIndex, endIndex);
    });

    // Автоматическое переключение карточек каждые 5 секунд
    let cardRotationInterval = null;
    
    function startCardRotation() {
      if (allStatsCards.value.length > 3) {
        cardRotationInterval = setInterval(() => {
          currentCardIndex.value = (currentCardIndex.value + 1) % allStatsCards.value.length;
        }, 5000);
      }
    }
    
    function stopCardRotation() {
      if (cardRotationInterval) {
        clearInterval(cardRotationInterval);
        cardRotationInterval = null;
      }
    }

    // Интерактивная карусель с перетаскиванием
    const carouselPosition = ref(0);
    const isDragging = ref(false);
    const startX = ref(0);
    const isAutoRotating = ref(true);
    
    // Создаем бесконечный массив карточек (дублируем для бесконечного кружения)
    const infiniteStatsCards = computed(() => {
      const cards = allStatsCards.value;
      if (cards.length === 0) return [];
      
      // Добавляем карточку "Это вкусно!" в начало каждого цикла
      const mainCard = {
        name: "Это вкусно!",
        count: "12k",
        description: "Ежедневно обслуживаем клиентов",
        image: "https://images.unsplash.com/photo-1607301405418-780ee5e6dd10",
        isMain: true
      };
      
      // Создаем много копий для бесконечного кружения
      const copies = [];
      for (let i = 0; i < 20; i++) { // Увеличиваем количество копий
        copies.push(mainCard, ...cards);
      }
      return copies;
    });
    
    // Автоматическое кружение с циклической логикой
    let lastTime = 0;
    const scrollSpeed = 25; // пикселей в секунду
    const scrollInterval = 2000; // интервал между переходами
    
    function startAutoRotate() {
      isAutoRotating.value = true;
      
      function animate(currentTime) {
        if (!isAutoRotating.value) return;
        
        if (currentTime - lastTime >= scrollInterval) {
          carouselPosition.value -= 25; // Перемещаем на 25% (одна карточка)
          lastTime = currentTime;
        }
        
        requestAnimationFrame(animate);
      }
      
      requestAnimationFrame(animate);
    }
    
    function stopAutoRotate() {
      isAutoRotating.value = false;
    }
    
    function toggleAutoRotate() {
      if (isAutoRotating.value) {
        stopAutoRotate();
      } else {
        startAutoRotate();
      }
    }
    
    // Обработчики перетаскивания
    function onMouseDown(event) {
      isDragging.value = true;
      startX.value = event.clientX;
    }
    
    function onMouseMove(event) {
      if (!isDragging.value) return;
      
      const deltaX = event.clientX - startX.value;
      const sensitivity = 0.2; // Уменьшаем чувствительность
      carouselPosition.value += deltaX * sensitivity;
      
      startX.value = event.clientX;
    }
    
    function onMouseUp() {
      if (!isDragging.value) return;
      
      isDragging.value = false;
      
      // Привязываем к ближайшей позиции карточки
      const cardWidth = 25; // 25% на карточку
      const targetPosition = Math.round(carouselPosition.value / cardWidth) * cardWidth;
      
      // Плавно переходим к целевой позиции
      const startPosition = carouselPosition.value;
      const duration = 300;
      const startTime = Date.now();
      
      function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        carouselPosition.value = startPosition + (targetPosition - startPosition) * easeProgress;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
        // Убираем логику возврата к началу - карусель бесконечная
      }
      
      requestAnimationFrame(animate);
    }
    
    function onMouseLeave() {
      if (isDragging.value) {
        onMouseUp();
      }
    }
    // Ссылки на DOM для слайдера
    function scrollBestseller(direction) {
      const container = bestsellerContainer.value;
      if (!container) return;
      const scrollAmount = 300;
      if (direction === 'left') container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      else container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    return {
      products,
      loading,
      add,
      formatPrice,
      searchQuery,
      categories,
      categoriesData,
      // selectedCategory и filteredProducts более не используются, фильтрация выполняется в selectedVerticalProducts
      categoryBlocks,
      statsCards,
      computedTestimonials,
      popularProducts,
      bestsellerContainer,
      scrollBestseller,
      heroImage,
      menuSection,
      scrollToMenu,
      verticalCategories,
      selectedVertical,
      selectedVerticalItem,
      selectedVerticalProducts,
      statsCardsMenu,
      allStatsCards,
      infiniteStatsCards,
      carouselPosition,
      isDragging,
      isAutoRotating,
      toggleAutoRotate,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      // Функции дождя из сушиков и пицц
      createFoodRain,
      startFoodRain,
      // возвращаем текущий слайд, чтобы шаблон мог безопасно его использовать
      currentSlide,
      // индекс текущего слайда нужен для анимации переходов
      currentSlideIndex,
      // Модальное окно товара
      showProductModal,
      selectedProduct,
      openProductModal,
      closeProductModal,
      addToCartFromModal,
      addToCartAndGoToCheckout
    };
  }
};

/**
 * Компонент страницы корзины.
 */
const CartView = {
  name: 'CartView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <i class="fa-solid fa-shopping-cart text-orange-600 mr-4"></i>
            Ваша корзина
          </h1>
          <p class="text-gray-600 text-lg">Проверьте заказ и перейдите к оформлению</p>
                  </div>

        <div v-if="items.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div class="text-gray-400 mb-6">
              <i class="fa-solid fa-shopping-cart text-6xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 mb-4">Корзина пуста</h3>
            <p class="text-gray-500 mb-6">Добавьте товары из меню, чтобы сделать заказ</p>
            <router-link 
              to="/" 
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <i class="fa-solid fa-arrow-left mr-2"></i>
              Вернуться в меню
            </router-link>
          </div>
        </div>

        <div v-else class="grid lg:grid-cols-3 gap-8">
          <!-- Левая колонка - товары -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Список товаров -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-list mr-3"></i>
                  Товары в корзине ({{ items.length }})
                </h2>
              </div>
              
              <div class="divide-y divide-gray-200">
                <div v-for="item in items" :key="item.id" class="p-6 hover:bg-gray-50 transition">
                  <div class="flex items-center space-x-4">
                    <!-- Изображение товара -->
                    <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    
                    <!-- Информация о товаре -->
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                      <p class="text-gray-600">{{ formatPrice(item.price) }} за штуку</p>
                    </div>
                    
                    <!-- Управление количеством -->
            <div class="flex items-center space-x-3">
                      <button 
                        @click="decrease(item)" 
                        class="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                      >
                        <i class="fa-solid fa-minus text-gray-600"></i>
                      </button>
                      <span class="text-xl font-bold text-gray-900 min-w-[2rem] text-center">{{ item.quantity }}</span>
                      <button 
                        @click="increase(item)" 
                        class="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition"
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    
                    <!-- Сумма -->
                    <div class="text-right">
                      <div class="text-xl font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
                    </div>
                    
                    <!-- Кнопка удаления -->
                    <button 
                      @click="removeItem(item)" 
                      class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                      title="Удалить товар"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Дополнительные услуги -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-plus mr-3"></i>
                  Дополнительно
                </h2>
              </div>
              
              <div class="p-6 space-y-4">
                <div v-for="(extra, idx) in extras" :key="idx" class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i class="fa-solid fa-utensils text-gray-600"></i>
            </div>
            <div>
                      <div class="font-semibold text-gray-900">{{ extra.name }}</div>
                      <div class="text-sm text-gray-500">{{ formatPrice(extra.price) }}</div>
                </div>
                </div>
                  
                  <div class="flex items-center space-x-3">
                    <button 
                      @click="decreaseExtra(idx)" 
                      class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                    >
                      <i class="fa-solid fa-minus text-gray-600 text-sm"></i>
                    </button>
                    <span class="text-lg font-bold text-gray-900 min-w-[1.5rem] text-center">{{ extrasSelection[idx] }}</span>
                    <button 
                      @click="increaseExtra(idx)" 
                      class="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition"
                    >
                      <i class="fa-solid fa-plus text-sm"></i>
                    </button>
              </div>
            </div>
          </div>
          </div>

            <!-- Количество персон -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-users mr-3"></i>
                  Количество персон
                </h2>
        </div>
              
              <div class="p-6">
                <div class="flex items-center justify-center space-x-4">
                  <button 
                    @click="decreasePersons" 
                    class="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                  >
                    <i class="fa-solid fa-minus text-gray-600"></i>
                  </button>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-gray-900">{{ persons }}</div>
                    <div class="text-sm text-gray-500">{{ persons === 1 ? 'персона' : persons < 5 ? 'персоны' : 'персон' }}</div>
      </div>
                  <button 
                    @click="increasePersons" 
                    class="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Правая колонка - итого и оформление -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-calculator mr-3"></i>
                  Итого
                </h2>
              </div>
              
              <div class="p-6 space-y-4">
                <!-- Детализация -->
                <div class="space-y-3">
                  <div class="flex justify-between text-gray-600">
                    <span>Товары ({{ items.reduce((sum, item) => sum + item.quantity, 0) }} шт.)</span>
                    <span>{{ formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0)) }}</span>
                  </div>
                  
                  <div v-if="extrasTotal > 0" class="flex justify-between text-gray-600">
                    <span>Дополнительно</span>
                    <span>{{ formatPrice(extrasTotal) }}</span>
                  </div>
                  
                  <div class="border-t pt-3">
                    <div class="flex justify-between text-xl font-bold text-gray-900">
                      <span>Итого</span>
                      <span class="text-orange-600">{{ formatPrice(total + extrasTotal) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Кнопка оформления -->
                <button 
                  @click="goToCheckout" 
                  class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <i class="fa-solid fa-credit-card"></i>
                  <span>Оформить заказ</span>
                </button>
                
                <!-- Дополнительная информация -->
                <div class="text-center text-sm text-gray-500 space-y-2">
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-truck"></i>
                    <span>Быстрая доставка</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-shield-alt"></i>
                    <span>Безопасная оплата</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    // Загружаем SEO данные
    const seoData = ref(null);
    
    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        seoData.value = response.data;
      } catch (e) {
        console.error('Ошибка загрузки SEO данных:', e);
      }
    }
    
    // SEO мета-теги для страницы корзины (упрощенная версия)
    function updateCartPageTitle() {
      if (seoData.value) {
        const site = seoData.value.site || {};
        const pages = seoData.value.pages || {};
        const cart = pages.cart || {};
        const title = cart.title || 'Корзина | Интернет‑магазин суши и пиццы | Точка суши и пиццы';
        document.title = title;
      }
    }
    
    onMounted(() => {
      fetchSEOData().then(() => {
        updateCartPageTitle();
      });
    });

    const items = computed(() => cart.items);
    // управление количеством товаров в строке
    function increase(item) {
      item.quantity++;
    }
    function decrease(item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeItem(item);
      }
    }
    function removeItem(item) {
      const index = cart.items.indexOf(item);
      if (index >= 0) cart.items.splice(index, 1);
    }
    // форматирование цены
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    // количество персон хранится в глобальном состоянии корзины
    const persons = computed({
      get() { return cart.persons; },
      set(val) { cart.persons = val; }
    });
    function increasePersons() {
      cart.persons++;
    }
    function decreasePersons() {
      if (cart.persons > 1) cart.persons--;
    }
    // список допов (фиксирован) и их выбор хранится в корзине
    const extras = [
      { name: 'Соевый соус', price: 50 },
      { name: 'Имбирь', price: 50 },
      { name: 'Васаби', price: 50 }
    ];
    const extrasSelection = computed({
      get() { return cart.extrasSelection; },
      set(val) { cart.extrasSelection = val; }
    });
    function increaseExtra(index) {
      cart.extrasSelection[index]++;
    }
    function decreaseExtra(index) {
      if (cart.extrasSelection[index] > 0) cart.extrasSelection[index]--;
    }
    const extrasTotal = computed(() => {
      return extras.reduce((sum, extra, idx) => sum + extra.price * cart.extrasSelection[idx], 0);
    });
    const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const router = useRouter();
    function goToCheckout() {
      router.push('/checkout');
    }
    return {
      items,
      total,
      increase,
      decrease,
      removeItem,
      formatPrice,
      persons,
      increasePersons,
      decreasePersons,
      extras,
      extrasSelection,
      increaseExtra,
      decreaseExtra,
      extrasTotal,
      goToCheckout
    };
  }
};

/**
 * Компонент списка новостей.
 */
const NewsListView = {
  name: 'NewsListView',
  template: /* html */`
    <div>
      <h2 class="text-2xl font-bold mb-4">Новости</h2>
      <div v-if="loading" class="text-center py-8">Загрузка...</div>
      <div v-else>
        <div v-if="news.length === 0" class="text-gray-600">Пока нет новостей.</div>
        <div v-else class="space-y-6">
          <div v-for="item in news" :key="item.id" class="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col sm:flex-row">
            <div v-if="item.image" class="w-full sm:w-40 h-40 mb-3 sm:mb-0 sm:mr-4 overflow-hidden rounded">
              <img :src="item.image" alt="" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold mb-1">
                <router-link :to="'/news/' + item.id" class="hover:underline text-blue-600">{{ item.title }}</router-link>
              </h3>
              <p class="text-sm text-gray-500 mb-2">{{ formatDate(item.date) }}</p>
              <p class="text-gray-700">{{ item.content.substring(0, 120) }}...</p>
              <router-link :to="'/news/' + item.id" class="text-blue-600 hover:underline text-sm mt-2 inline-block">Читать далее</router-link>
            </div>
          </div>
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
        news.value = res.data;
      } catch (e) {
        console.error('Не удалось загрузить новости', e);
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchNews);
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return { news, loading, formatDate };
  }
};

/**
 * Компонент просмотра одной новости.
 */
const NewsDetailView = {
  name: 'NewsDetailView',
  template: /* html */`
    <div>
      <button @click="$router.back()" class="mb-4 text-blue-600 hover:underline">← Назад</button>
      <div v-if="loading" class="text-center py-8">Загрузка...</div>
      <div v-else-if="!newsItem" class="text-gray-600">Новость не найдена.</div>
      <div v-else class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-2">{{ newsItem.title }}</h2>
        <p class="text-sm text-gray-500 mb-4">{{ formatDate(newsItem.date) }}</p>
        <div v-if="newsItem.image" class="mb-4 w-full h-60 overflow-hidden rounded">
          <img :src="newsItem.image" alt="" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <p class="text-gray-700 whitespace-pre-line">{{ newsItem.content }}</p>
      </div>
    </div>
  `,
  setup() {
    // Используем useRoute для доступа к параметрам маршрута. Деструктуризация
    // параметров из контекста setup не работает, поэтому импортируем useRoute.
    const route = useRoute();
    const newsItem = ref(null);
    const loading = ref(true);
    // Загружаем конкретную новость по ID из параметров маршрута
    async function fetchItem() {
      loading.value = true;
      const id = route.params.id;
      try {
        const res = await axios.get('/api/news/' + id);
        newsItem.value = res.data;
      } catch (e) {
        newsItem.value = null;
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchItem);
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return { newsItem, loading, formatDate };
  }
};

/**
 * Компонент управления товарами для админа.
 */
const AdminProductsView = {
  name: 'AdminProductsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Управление товарами</h1>
          <p class="text-gray-600">Добавляйте, редактируйте и удаляйте товары в вашем магазине</p>
        </div>

        <!-- Форма добавления/редактирования -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <i class="fa-solid fa-plus text-white text-xl"></i>
            </div>
          <div>
              <h2 class="text-2xl font-bold text-gray-900" v-text="editMode ? 'Редактировать товар' : 'Добавить товар'"></h2>
              <p class="text-gray-600" v-text="editMode ? 'Внесите изменения в товар' : 'Заполните информацию о новом товаре'"></p>
            </div>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-tags mr-2 text-orange-500"></i>
                  Категория
                </label>
                <input 
                  v-model="form.category" 
                  list="product-categories" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                  placeholder="Выберите или введите категорию" 
                  required 
                />
            <datalist id="product-categories">
              <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
            </datalist>
          </div>
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-tag mr-2 text-orange-500"></i>
                  Название товара
                </label>
                <input 
                  v-model="form.name" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                  placeholder="Введите название товара"
                  required 
                />
          </div>
          </div>

            <div class="grid md:grid-cols-2 gap-6">
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-ruble-sign mr-2 text-orange-500"></i>
                  Цена (RUB)
                </label>
                <input 
                  type="number" 
                  step="1" 
                  v-model="form.price" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                  placeholder="0"
                  required 
                />
          </div>
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-image mr-2 text-orange-500"></i>
                  URL изображения
                </label>
                <input 
                  v-model="form.image" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                  placeholder="https://example.com/image.jpg" 
                />
          </div>
            </div>

          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-align-left mr-2 text-orange-500"></i>
                Описание
            </label>
              <textarea 
                v-model="form.description" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                rows="4"
                placeholder="Опишите товар..."
              ></textarea>
          </div>

            <div class="flex flex-wrap gap-6">
              <label class="inline-flex items-center px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                <input type="checkbox" v-model="form.available" class="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                <i class="fa-solid fa-check-circle mr-2 text-green-500"></i>
                <span class="font-medium">Доступен для заказа</span>
              </label>
              <label class="inline-flex items-center px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                <input type="checkbox" v-model="form.hit" class="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                <i class="fa-solid fa-star mr-2 text-yellow-500"></i>
                <span class="font-medium">Хит продаж</span>
              </label>
            </div>

            <div class="flex space-x-4 pt-4">
              <button 
                type="submit" 
                class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <i class="fa-solid fa-save"></i>
                <span>{{ editMode ? 'Сохранить изменения' : 'Добавить товар' }}</span>
              </button>
              <button 
                v-if="editMode" 
                @click="resetForm" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <i class="fa-solid fa-times"></i>
                <span>Отмена</span>
              </button>
          </div>
        </form>
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

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-8 py-4 text-left text-sm font-semibold text-gray-700">Товар</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Категория</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Цена</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Статус</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition">
                  <td class="px-8 py-4">
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" loading="lazy" />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                          <i class="fa-solid fa-image"></i>
                        </div>
                      </div>
                      <div>
                        <div class="font-semibold text-gray-900 flex items-center">
                          {{ product.name }}
                          <i v-if="product.hit" class="fa-solid fa-star text-yellow-500 ml-2 text-sm"></i>
                        </div>
                        <div class="text-sm text-gray-500 line-clamp-1">{{ product.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {{ product.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ formatPrice(product.price) }}</td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      product.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]">
                      <i :class="[
                        'mr-1',
                        product.available ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'
                      ]"></i>
                      {{ product.available ? 'Доступен' : 'Недоступен' }}
                    </span>
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
    const products = ref([]);
    const categories = ref([]);
    // Форма товара содержит поле категории для возможности выбора или ввода новой
    const form = reactive({ id: null, name: '', description: '', price: '', image: '', available: true, category: '', hit: false });
    const editMode = ref(false);
    const loading = ref(false);

    // Список доступных категорий основан на данных с сервера и на уже существующих товарах
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
        // после загрузки продуктов также загружаем категории, если ещё не
        const catsRes = await axios.get('/api/categories');
        categories.value = catsRes.data;
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchProducts);

    async function saveProduct() {
      // Находим ID категории по названию
      const category = categories.value.find(c => c.name === form.category);
      if (!category) {
        alert('Категория не найдена. Пожалуйста, выберите существующую категорию.');
        return;
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image: form.image,
        available: form.available,
        category_id: category.id
      };
      if (editMode.value) {
        await axios.put(`/api/products/${form.id}`, payload);
      } else {
        await axios.post('/api/products', payload);
      }
      await fetchProducts();
      resetForm();
    }
    function editProduct(product) {
      form.id = product.id;
      form.name = product.name;
      form.description = product.description;
      form.price = product.price;
      form.image = product.image;
      form.available = product.available;
      form.category = product.category_name || product.category || '';
      form.hit = product.hit || false;
      editMode.value = true;
    }
    async function deleteProduct(product) {
      if (confirm('Удалить этот товар?')) {
        await axios.delete(`/api/products/${product.id}`);
        await fetchProducts();
      }
    }
    function resetForm() {
      form.id = null;
      form.name = '';
      form.description = '';
      form.price = '';
      form.image = '';
      form.available = true;
      form.category = '';
      form.hit = false;
      editMode.value = false;
    }
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    return { products, form, editMode, saveProduct, editProduct, deleteProduct, resetForm, formatPrice, categoryOptions };
  }
};

/**
 * Компонент управления новостями для админа.
 */
const AdminNewsView = {
  name: 'AdminNewsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Управление новостями</h1>
          <p class="text-gray-600">Создавайте и редактируйте новости для вашего магазина</p>
        </div>

        <!-- Форма добавления/редактирования -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <i class="fa-solid fa-newspaper text-white text-xl"></i>
            </div>
          <div>
              <h2 class="text-2xl font-bold text-gray-900" v-text="editMode ? 'Редактировать новость' : 'Добавить новость'"></h2>
              <p class="text-gray-600" v-text="editMode ? 'Внесите изменения в новость' : 'Создайте новую новость для клиентов'"></p>
          </div>
          </div>

          <form @submit.prevent="saveNews" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-heading mr-2 text-blue-500"></i>
                  Заголовок новости
                </label>
                <input 
                  v-model="form.title" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  placeholder="Введите заголовок новости"
                  required 
                />
          </div>
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-calendar mr-2 text-blue-500"></i>
                  Дата публикации
                </label>
                <input 
                  type="date" 
                  v-model="form.date" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                />
          </div>
            </div>

          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-image mr-2 text-blue-500"></i>
                URL изображения
              </label>
              <input 
                v-model="form.image" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                placeholder="https://example.com/image.jpg" 
              />
          </div>

          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-align-left mr-2 text-blue-500"></i>
                Содержание новости
              </label>
              <textarea 
                v-model="form.content" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                rows="6"
                placeholder="Напишите содержание новости..."
                required
              ></textarea>
            </div>

            <div class="flex space-x-4 pt-4">
              <button 
                type="submit" 
                class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <i class="fa-solid fa-save"></i>
                <span>{{ editMode ? 'Сохранить изменения' : 'Опубликовать новость' }}</span>
              </button>
              <button 
                v-if="editMode" 
                @click="resetForm" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <i class="fa-solid fa-times"></i>
                <span>Отмена</span>
              </button>
          </div>
        </form>
      </div>

        <!-- Список новостей -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Список новостей</h3>
                <p class="text-gray-600 mt-1">{{ news.length }} новостей опубликовано</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <i class="fa-solid fa-newspaper"></i>
                <span>Все новости</span>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-8 py-4 text-left text-sm font-semibold text-gray-700">Новость</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Дата</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in news" :key="item.id" class="hover:bg-gray-50 transition">
                  <td class="px-8 py-4">
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                          <i class="fa-solid fa-newspaper"></i>
                        </div>
                      </div>
                      <div>
                        <div class="font-semibold text-gray-900">{{ item.title }}</div>
                        <div class="text-sm text-gray-500 line-clamp-2">{{ item.content }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <i class="fa-solid fa-calendar mr-1"></i>
                      {{ formatDate(item.date) }}
                    </span>
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
    const news = ref([]);
    const form = reactive({ id: null, title: '', date: '', content: '', image: '' });
    const editMode = ref(false);
    const loading = ref(false);
    async function fetchNews() {
      loading.value = true;
      try {
        const res = await axios.get('/api/news');
        news.value = res.data;
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchNews);
    async function saveNews() {
      const payload = {
        title: form.title,
        date: form.date,
        content: form.content,
        image: form.image
      };
      if (editMode.value) {
        await axios.put(`/api/news/${form.id}`, payload);
      } else {
        await axios.post('/api/news', payload);
      }
      await fetchNews();
      resetForm();
    }
    function editItem(item) {
      form.id = item.id;
      form.title = item.title;
      form.date = item.date;
      form.content = item.content;
      form.image = item.image || '';
      editMode.value = true;
    }
    async function deleteItem(item) {
      if (confirm('Удалить эту новость?')) {
        await axios.delete(`/api/news/${item.id}`);
        await fetchNews();
      }
    }
    function resetForm() {
      form.id = null;
      form.title = '';
      form.date = '';
      form.content = '';
      form.image = '';
      editMode.value = false;
    }
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU');
    }
    return { news, form, editMode, saveNews, editItem, deleteItem, resetForm, formatDate };
  }
};

/**
 * Компонент для администрирования заказов.
 * Позволяет просматривать все заказы и удалять их при необходимости.
 */
const AdminOrdersView = {
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
                    <div class="space-y-1">
                      <div v-for="it in order.items" :key="it.id" class="text-sm">
                        <span class="font-medium">{{ it.name }}</span>
                        <span class="text-gray-500">× {{ it.quantity }}</span>
                      </div>
                      <div v-if="order.extrasSelection && order.extrasSelection.some(qty => qty > 0)" class="text-xs text-gray-500 mt-2">
                        <div class="font-medium">Допы:</div>
                        <div v-for="(qty, idx) in (order.extrasSelection || [])" :key="idx" v-if="qty > 0">
                      {{ (order.extras && order.extras[idx] ? order.extras[idx].name : defaultExtras[idx].name) }} × {{ qty }}
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
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Редактировать заказ</h3>
                <p class="text-gray-600 mt-1">#{{ editingOrder?.id?.slice(-6) }}</p>
              </div>
              <button 
                @click="closeEditModal" 
                class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <i class="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <div v-if="editingOrder" class="p-8 space-y-6">
            <!-- Товары в заказе -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-box mr-2 text-orange-500"></i>
                Товары в заказе
              </h4>
              <div v-if="editingOrder.items.length === 0" class="text-gray-500 text-center py-4">
                Нет товаров в заказе
              </div>
              <div v-else class="space-y-3">
                <div v-for="(item, index) in editingOrder.items" :key="index" class="flex items-center justify-between bg-white p-4 rounded-lg border">
                  <div class="flex items-center space-x-3">
                    <img :src="item.image || findProductImage(item.id)" alt="" class="w-12 h-12 object-cover rounded-lg" loading="lazy" />
                    <div>
                      <h5 class="font-medium text-gray-900">{{ item.name }}</h5>
                      <p class="text-sm text-gray-500">{{ formatPrice(item.price) }} за шт.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <button @click="decreaseItemQty(index)" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                      <i class="fa-solid fa-minus text-sm"></i>
                    </button>
                    <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                    <button @click="increaseItemQty(index)" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                      <i class="fa-solid fa-plus text-sm"></i>
                    </button>
                    <button @click="removeItemFromOrder(index)" class="ml-4 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
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
    const orders = ref([]);
    const loading = ref(true);
    const showEditModal = ref(false);
    const editingOrder = ref(null);

    // Стандартный список допов, который используем если у заказа не определены имена допов
    const defaultExtras = [
      { name: 'Соевый соус', price: 50 },
      { name: 'Имбирь', price: 50 },
      { name: 'Васаби', price: 50 }
    ];
    async function fetchOrders() {
      try {
        const res = await axios.get('/api/orders');
        // Нормализуем поля из snake_case в camelCase для фронта
        orders.value = (res.data || []).map(o => ({
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
    onMounted(fetchOrders);
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
    const router = useRouter();
    
    function openEditModal(order) {
      editingOrder.value = JSON.parse(JSON.stringify(order)); // Глубокое копирование
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
    
    function findProductImage(productId) {
      // Простая функция для поиска изображения товара
      return 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10';
    }
    
    function calculateTotal() {
      if (!editingOrder.value) return 0;
      let total = 0;
      editingOrder.value.items.forEach(item => {
        total += item.price * item.quantity;
      });
      return total;
    }
    
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
          // Поля времени доставки из модалки
          delivery_time: editingOrder.value.deliveryTime || 'asap',
          scheduled_time: (editingOrder.value.deliveryTime === 'scheduled') ? (editingOrder.value.scheduledTime || null) : null,
          // Статус оплаты
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
      findProductImage, 
      calculateTotal, 
      saveOrderChanges, 
      formatPrice, 
      formatDate, 
      formatScheduledTime, 
      defaultExtras 
    };
  }
};

/**
 * Компонент редактирования конкретного заказа в админке.
 * Позволяет изменять список товаров, количество, допы и данные клиента.
 */
const AdminOrderEditView = {
  name: 'AdminOrderEditView',
  template: /* html */`
    <div>
      <h2 class="text-2xl font-bold mb-4">Редактировать заказ</h2>
      <div v-if="loading" class="text-center py-8">Загрузка...</div>
      <div v-else-if="!order" class="text-gray-600">Заказ не найден.</div>
      <div v-else class="space-y-6">
        <!-- Список товаров в заказе -->
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
        <!-- Итоги и действия -->
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
    const route = useRoute();
    const router = useRouter();
    const order = ref(null);
    const products = ref([]);
    const loading = ref(true);
    const selectedProductId = ref('');
    // фиксированный список допов
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
          // Преобразуем данные из формата сервера в формат фронтенда
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
            scheduled_time: orderData.scheduled_time || null
          };
        }
        products.value = prodRes.data;
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
    // доступные для добавления продукты (не входящие в текущий заказ)
    const availableProducts = computed(() => {
      if (!order.value) return [];
      const existingIds = order.value.items.map(i => i.id);
      return products.value.filter(p => !existingIds.includes(p.id));
    });
    // Методы для редактирования
    function increaseQty(it) {
      it.quantity++;
    }
    function decreaseQty(it) {
      if (it.quantity > 1) it.quantity--;
      else removeItem(it);
    }
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
    function increasePersons() {
      order.value.persons++;
    }
    function decreasePersons() {
      if (order.value.persons > 1) order.value.persons--;
    }
    // вычисляем итоговую сумму
    const total = computed(() => {
      if (!order.value) return 0;
      const itemsSum = order.value.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const extrasSum = extras.reduce((sum, ex, idx) => {
        const qty = order.value.extrasSelection ? order.value.extrasSelection[idx] : 0;
        return sum + ex.price * qty;
      }, 0);
      return itemsSum + extrasSum;
    });
    // Сохранить заказ
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
    function cancelEdit() {
      router.push('/admin/orders');
    }
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

/**
 * Компонент управления отзывами в админке.
 */
const AdminReviewsView = {
  name: 'AdminReviewsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50">
      <!-- Заголовок страницы -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Управление отзывами</h1>
                <p class="mt-2 text-gray-600">Просмотр и управление отзывами клиентов</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-500">
                  <i class="fa-solid fa-star mr-1"></i>
                  Всего отзывов: {{ reviews.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Статистика отзывов -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-star text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Средний рейтинг</p>
                <p class="text-2xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-thumbs-up text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Положительные</p>
                <p class="text-2xl font-bold text-gray-900">{{ positiveReviews }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-thumbs-down text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Отрицательные</p>
                <p class="text-2xl font-bold text-gray-900">{{ negativeReviews }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-comments text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Всего отзывов</p>
                <p class="text-2xl font-bold text-gray-900">{{ reviews.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Фильтры -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Фильтр по рейтингу:</label>
              <select v-model="ratingFilter" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Все отзывы</option>
                <option value="5">5 звёзд</option>
                <option value="4">4 звезды</option>
                <option value="3">3 звезды</option>
                <option value="2">2 звезды</option>
                <option value="1">1 звезда</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Сортировка:</label>
              <select v-model="sortBy" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="date">По дате</option>
                <option value="rating">По рейтингу</option>
                <option value="name">По имени</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Поиск по имени или комментарию..." 
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
              <i class="fa-solid fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Список отзывов -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Список отзывов</h3>
                <p class="text-gray-600 mt-1">{{ filteredReviews.length }} отзывов</p>
              </div>
            </div>
          </div>

          <div v-if="loading" class="text-center py-12">
            <div class="inline-flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>Загрузка отзывов...</span>
            </div>
          </div>
          
          <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <i class="fa-solid fa-comments text-4xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-500 mb-2">Отзывы отсутствуют</h3>
            <p class="text-gray-400">Пока что никто не оставил отзыв</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div v-for="review in filteredReviews" :key="review.id" class="p-6 hover:bg-gray-50 transition">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="flex items-center space-x-1">
                      <div v-for="i in 5" :key="i" class="text-lg">
                        <i 
                          :class="i <= review.rating ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star text-gray-300'"
                        ></i>
                      </div>
                    </div>
                    <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                  </div>
                  
                  <div class="mb-3">
                    <h4 class="font-semibold text-gray-900 mb-1">{{ review.name || 'Анонимный пользователь' }}</h4>
                    <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
                  </div>

                  <div v-if="review.orderId" class="text-sm text-gray-500">
                    <i class="fa-solid fa-receipt mr-1"></i>
                    Заказ #{{ review.orderId.slice(-6) }}
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button 
                    @click="deleteReview(review)" 
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                    title="Удалить отзыв"
                  >
                    <i class="fa-solid fa-trash"></i>
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
    const reviews = ref([]);
    const loading = ref(true);
    const ratingFilter = ref('');
    const sortBy = ref('date');
    const searchQuery = ref('');

    async function fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
        reviews.value = res.data;
      } catch (e) {
        console.error('Не удалось получить отзывы', e);
      } finally {
        loading.value = false;
      }
    }

    async function deleteReview(review) {
      if (!confirm('Удалить отзыв?')) return;
      try {
        await axios.delete(`/api/reviews/${review.id}`);
        await fetchReviews();
      } catch (e) {
        console.error('Не удалось удалить отзыв', e);
        alert('Ошибка удаления отзыва');
      }
    }

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('ru-RU', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    const filteredReviews = computed(() => {
      let filtered = [...reviews.value];

      // Фильтр по рейтингу
      if (ratingFilter.value) {
        filtered = filtered.filter(review => review.rating === parseInt(ratingFilter.value));
      }

      // Поиск
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(review => 
          (review.name && review.name.toLowerCase().includes(query)) ||
          review.comment.toLowerCase().includes(query)
        );
      }

      // Сортировка
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'date':
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });

      return filtered;
    });

    const averageRating = computed(() => {
      if (reviews.value.length === 0) return 0;
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.value.length;
    });

    const positiveReviews = computed(() => {
      return reviews.value.filter(review => review.rating >= 4).length;
    });

    const negativeReviews = computed(() => {
      return reviews.value.filter(review => review.rating <= 2).length;
    });

    onMounted(fetchReviews);

    return { 
      reviews, 
      loading, 
      ratingFilter, 
      sortBy, 
      searchQuery, 
      filteredReviews, 
      averageRating, 
      positiveReviews, 
      negativeReviews, 
      deleteReview, 
      formatDate 
    };
  }
};

/**
 * Компонент управления SEO в админке.
 */
const AdminSEOView = {
  name: 'AdminSEOView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50">
      <!-- Заголовок страницы -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Управление SEO</h1>
                <p class="mt-2 text-gray-600">Настройка мета-тегов, Open Graph, Twitter Cards и структурированных данных</p>
              </div>
              <div class="flex items-center space-x-4">
                <button @click="saveSEO" :disabled="loading" 
                        class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                  <i class="fa-solid fa-save"></i>
                  <span>{{ loading ? 'Сохранение...' : 'Сохранить' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Уведомления -->
        <div v-if="message" class="mb-6 p-4 rounded-xl" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ message }}
        </div>

        <!-- Основные SEO настройки -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Общие настройки сайта -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-globe mr-3 text-orange-500"></i>
              Общие настройки сайта
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок сайта</label>
                <input v-model="seoData.site.title" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Рекомендуется до 60 символов</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Описание сайта</label>
                <textarea v-model="seoData.site.description" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
                <p class="text-xs text-gray-500 mt-1">Рекомендуется до 160 символов</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ключевые слова</label>
                <input v-model="seoData.site.keywords" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Через запятую</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Автор</label>
                <input v-model="seoData.site.author" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Канонический URL</label>
                <input v-model="seoData.site.canonical" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Open Graph настройки -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-brands fa-facebook mr-3 text-blue-600"></i>
              Open Graph (Facebook)
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OG Заголовок</label>
                <input v-model="seoData.site.ogTitle" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OG Описание</label>
                <textarea v-model="seoData.site.ogDescription" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OG Изображение</label>
                <input v-model="seoData.site.ogImage" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Рекомендуется 1200x630px</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Название сайта</label>
                <input v-model="seoData.site.ogSiteName" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Локаль</label>
                <input v-model="seoData.site.ogLocale" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Например: ru_RU</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Twitter Cards и структурированные данные -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <!-- Twitter Cards -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-brands fa-twitter mr-3 text-blue-400"></i>
              Twitter Cards
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Тип карточки</label>
                <select v-model="seoData.site.twitterCard" 
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter Заголовок</label>
                <input v-model="seoData.site.twitterTitle" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter Описание</label>
                <textarea v-model="seoData.site.twitterDescription" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter Изображение</label>
                <input v-model="seoData.site.twitterImage" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Структурированные данные -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-code mr-3 text-green-500"></i>
              Структурированные данные
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Название ресторана</label>
                <input v-model="seoData.site.structuredData.name" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                <input v-model="seoData.site.structuredData.telephone" type="tel" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Страна</label>
                <input v-model="seoData.site.structuredData.address.addressCountry" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Город</label>
                <input v-model="seoData.site.structuredData.address.addressLocality" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Часы работы</label>
                <input v-model="seoData.site.structuredData.openingHours" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Например: Mo-Su 10:00-23:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- VK и Одноклассники Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <!-- VK Cards -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-brands fa-vk mr-3 text-blue-600"></i>
              VK Cards
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Тип карточки</label>
                <select v-model="seoData.site.vkCard" 
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="article">Article</option>
                  <option value="website">Website</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">VK Заголовок</label>
                <input v-model="seoData.site.vkTitle" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">VK Описание</label>
                <textarea v-model="seoData.site.vkDescription" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">VK Изображение</label>
                <input v-model="seoData.site.vkImage" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Рекомендуется 1200x630px</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Название сайта</label>
                <input v-model="seoData.site.vkSiteName" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Одноклассники Cards -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-users mr-3 text-orange-500"></i>
              Одноклассники Cards
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Тип карточки</label>
                <select v-model="seoData.site.okCard" 
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="article">Article</option>
                  <option value="website">Website</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OK Заголовок</label>
                <input v-model="seoData.site.okTitle" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OK Описание</label>
                <textarea v-model="seoData.site.okDescription" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OK Изображение</label>
                <input v-model="seoData.site.okImage" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Рекомендуется 1200x630px</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Название сайта</label>
                <input v-model="seoData.site.okSiteName" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>
          </div>
        </div>

        <!-- Настройки страниц -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fa-solid fa-file-lines mr-3 text-purple-500"></i>
            Настройки страниц
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Главная страница -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Главная страница</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input v-model="seoData.pages.home.title" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea v-model="seoData.pages.home.description" rows="2"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
                  <input v-model="seoData.pages.home.keywords" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>
            </div>

            <!-- Корзина -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Корзина</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input v-model="seoData.pages.cart.title" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea v-model="seoData.pages.cart.description" rows="2"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
                  <input v-model="seoData.pages.cart.keywords" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>
            </div>

            <!-- Новости -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Новости</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input v-model="seoData.pages.news.title" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea v-model="seoData.pages.news.description" rows="2"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
                  <input v-model="seoData.pages.news.keywords" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sitemap и Robots.txt -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <!-- Sitemap настройки -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-sitemap mr-3 text-indigo-500"></i>
              Sitemap настройки
            </h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input v-model="seoData.sitemap.enabled" type="checkbox" id="sitemap-enabled" 
                       class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500">
                <label for="sitemap-enabled" class="ml-2 text-sm font-medium text-gray-700">
                  Включить автоматическую генерацию sitemap.xml
                </label>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Приоритет главной</label>
                  <input v-model.number="seoData.sitemap.priority.home" type="number" step="0.1" min="0" max="1" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Частота обновления</label>
                  <select v-model="seoData.sitemap.changefreq.home" 
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-2">Sitemap будет доступен по адресу:</p>
                <code class="text-sm bg-white px-2 py-1 rounded border">{{ seoData.site.canonical }}/sitemap.xml</code>
              </div>
            </div>
          </div>

          <!-- Robots.txt настройки -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-robot mr-3 text-gray-500"></i>
              Robots.txt настройки
            </h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input v-model="seoData.robots.enabled" type="checkbox" id="robots-enabled" 
                       class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500">
                <label for="robots-enabled" class="ml-2 text-sm font-medium text-gray-700">
                  Включить robots.txt
                </label>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">User-Agent</label>
                <input v-model="seoData.robots.userAgent" type="text" 
                       class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Разрешенные пути</label>
                <textarea v-model="robotsAllowText" rows="3"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                <p class="text-xs text-gray-500 mt-1">По одному пути на строку</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Запрещенные пути</label>
                <textarea v-model="robotsDisallowText" rows="3"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                <p class="text-xs text-gray-500 mt-1">По одному пути на строку</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-2">Robots.txt будет доступен по адресу:</p>
                <code class="text-sm bg-white px-2 py-1 rounded border">{{ seoData.site.canonical }}/robots.txt</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const seoData = ref({
      site: {
        title: '',
        description: '',
        keywords: '',
        author: '',
        language: 'ru',
        robots: 'index, follow',
        canonical: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogSiteName: '',
        ogLocale: 'ru_RU',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        // VK Cards
        vkCard: 'article',
        vkTitle: '',
        vkDescription: '',
        vkImage: '',
        vkSiteName: '',
        // Одноклассники Cards
        okCard: 'article',
        okTitle: '',
        okDescription: '',
        okImage: '',
        okSiteName: '',
        structuredData: {
          name: '',
          description: '',
          url: '',
          telephone: '',
          address: {
            addressCountry: '',
            addressLocality: ''
          },
          servesCuisine: [],
          hasMenu: '',
          acceptsReservations: false,
          priceRange: '$$',
          paymentAccepted: [],
          deliveryAvailable: true,
          openingHours: ''
        }
      },
      pages: {
        home: { title: '', description: '', keywords: '' },
        cart: { title: '', description: '', keywords: '' },
        news: { title: '', description: '', keywords: '' }
      },
      sitemap: {
        enabled: true,
        priority: { home: 1.0, news: 0.8, products: 0.7, cart: 0.6 },
        changefreq: { home: 'daily', news: 'weekly', products: 'weekly', cart: 'monthly' }
      },
      robots: {
        enabled: true,
        userAgent: '*',
        allow: [],
        disallow: [],
        sitemap: ''
      }
    });

    const loading = ref(false);
    const message = ref('');
    const messageType = ref('');

    // Computed для robots.txt текста
    const robotsAllowText = computed({
      get: () => seoData.value.robots.allow.join('\n'),
      set: (value) => {
        seoData.value.robots.allow = value.split('\n').filter(line => line.trim());
      }
    });

    const robotsDisallowText = computed({
      get: () => seoData.value.robots.disallow.join('\n'),
      set: (value) => {
        seoData.value.robots.disallow = value.split('\n').filter(line => line.trim());
      }
    });

    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        console.log('SEO API response:', response.data);
        
        // Если сервер вернул данные, обновляем всю структуру
        if (response.data) {
          // Обновляем все секции данных
          if (response.data.site) {
            seoData.value.site = { 
              ...seoData.value.site, 
              ...response.data.site 
            };
            
            // Убеждаемся что все вложенные объекты существуют
            if (!seoData.value.site.structuredData) {
              seoData.value.site.structuredData = {
                name: '',
                description: '',
                url: '',
                telephone: '',
                address: {
                  addressCountry: '',
                  addressLocality: ''
                },
                servesCuisine: [],
                hasMenu: '',
                acceptsReservations: false,
                priceRange: '$$',
                paymentAccepted: [],
                deliveryAvailable: true,
                openingHours: ''
              };
            }
            
            if (!seoData.value.site.structuredData.address) {
              seoData.value.site.structuredData.address = {
                addressCountry: '',
                addressLocality: ''
              };
            }
          }
          
          // Обновляем настройки страниц
          if (response.data.pages) {
            seoData.value.pages = { 
              ...seoData.value.pages, 
              ...response.data.pages 
            };
          }
          
          // Обновляем настройки sitemap
          if (response.data.sitemap) {
            seoData.value.sitemap = { 
              ...seoData.value.sitemap, 
              ...response.data.sitemap 
            };
          }
          
          // Обновляем настройки robots
          if (response.data.robots) {
            seoData.value.robots = { 
              ...seoData.value.robots, 
              ...response.data.robots 
            };
          }
        }
        
        console.log('Final SEO data:', seoData.value);
      } catch (e) {
        console.error('Ошибка загрузки SEO данных:', e);
        showMessage('Ошибка загрузки SEO данных', 'error');
      }
    }

    async function saveSEO() {
      loading.value = true;
      try {
        await axios.put('/api/seo', seoData.value);
        showMessage('SEO настройки успешно сохранены!', 'success');
      } catch (e) {
        console.error('Ошибка сохранения SEO данных:', e);
        showMessage('Ошибка сохранения SEO данных', 'error');
      } finally {
        loading.value = false;
      }
    }

    function showMessage(text, type) {
      message.value = text;
      messageType.value = type;
      setTimeout(() => {
        message.value = '';
        messageType.value = '';
      }, 5000);
    }

    onMounted(fetchSEOData);

    return {
      seoData,
      loading,
      message,
      messageType,
      robotsAllowText,
      robotsDisallowText,
      saveSEO
    };
  }
};

/**
 * Компонент управления блоками категорий в админке.
 */
const AdminCategoryBlocksView = {
  name: 'AdminCategoryBlocksView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50">
      <!-- Заголовок страницы -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Управление блоками категорий</h1>
                <p class="mt-2 text-gray-600">Настройка блока "Категории и блюда" на главной странице</p>
              </div>
              <div class="flex items-center space-x-4">
                <button @click="showAddForm = true" 
                        class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                  <i class="fa-solid fa-plus"></i>
                  <span>Добавить блок</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Уведомления -->
        <div v-if="message" class="mb-6 p-4 rounded-xl" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ message }}
        </div>

        <!-- Форма добавления/редактирования -->
        <div v-if="showAddForm || editingBlock" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ editingBlock ? 'Редактировать блок' : 'Добавить новый блок' }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Название категории</label>
              <input v-model="form.name" type="text" 
                     class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Порядок отображения</label>
              <input v-model.number="form.order" type="number" min="1" 
                     class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
              <textarea v-model="form.description" rows="3"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
              <input v-model="form.image" type="url" 
                     class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <p class="text-xs text-gray-500 mt-1">Рекомендуется квадратное изображение для лучшего отображения</p>
            </div>
            
            <div class="md:col-span-2">
              <div class="flex items-center">
                <input v-model="form.enabled" type="checkbox" id="enabled" 
                       class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500">
                <label for="enabled" class="ml-2 text-sm font-medium text-gray-700">
                  Показывать на главной странице
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 mt-6">
            <button @click="saveBlock" :disabled="loading" 
                    class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
              <i class="fa-solid fa-save"></i>
              <span>{{ loading ? 'Сохранение...' : 'Сохранить' }}</span>
            </button>
            <button @click="cancelEdit" 
                    class="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200">
              Отмена
            </button>
          </div>
        </div>

        <!-- Список блоков -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="block in blocks" :key="block.id" 
               class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div class="relative">
              <img :src="block.image" :alt="block.name" 
                   class="w-full h-48 object-cover">
              <div class="absolute top-4 right-4">
                <span class="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  #{{ block.order }}
                </span>
              </div>
              <div v-if="!block.enabled" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span class="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  Скрыто
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ block.name }}</h3>
              <p class="text-gray-600 mb-4">{{ block.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <button @click="editBlock(block)" 
                          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    <i class="fa-solid fa-edit"></i>
                  </button>
                  <button @click="deleteBlock(block)" 
                          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
                
                <div class="flex items-center">
                  <span class="text-sm text-gray-500 mr-2">Показать:</span>
                  <button @click="toggleEnabled(block)" 
                          :class="block.enabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'"
                          class="text-white px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200">
                    {{ block.enabled ? 'Да' : 'Нет' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="blocks.length === 0" class="text-center py-12">
          <i class="fa-solid fa-images text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Нет блоков категорий</h3>
          <p class="text-gray-500 mb-6">Добавьте первый блок категории для отображения на главной странице</p>
          <button @click="showAddForm = true" 
                  class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
            Добавить блок
          </button>
        </div>
      </div>
    </div>
  `,
  setup() {
    const blocks = ref([]);
    const loading = ref(false);
    const showAddForm = ref(false);
    const editingBlock = ref(null);
    const message = ref('');
    const messageType = ref('');
    
    const form = reactive({
      name: '',
      description: '',
      image: '',
      order: 1,
      enabled: true
    });

    async function fetchBlocks() {
      try {
        loading.value = true;
        const response = await axios.get('/api/category-blocks');
        blocks.value = response.data;
      } catch (e) {
        console.error('Ошибка загрузки блоков:', e);
        showMessage('Ошибка загрузки блоков категорий', 'error');
      } finally {
        loading.value = false;
      }
    }

    async function saveBlock() {
      if (!form.name.trim() || !form.description.trim() || !form.image.trim()) {
        showMessage('Заполните все обязательные поля', 'error');
        return;
      }

      loading.value = true;
      try {
        if (editingBlock.value) {
          await axios.put(`/api/category-blocks/${editingBlock.value.id}`, form);
        } else {
          await axios.post('/api/category-blocks', form);
        }
        await fetchBlocks();
        cancelEdit();
        showMessage(editingBlock.value ? 'Блок обновлен!' : 'Блок добавлен!', 'success');
      } catch (e) {
        console.error('Ошибка сохранения блока:', e);
        showMessage('Ошибка сохранения блока', 'error');
      } finally {
        loading.value = false;
      }
    }

    function editBlock(block) {
      editingBlock.value = block;
      form.name = block.name;
      form.description = block.description;
      form.image = block.image;
      form.order = block.order;
      form.enabled = block.enabled;
      showAddForm.value = false;
    }

    function cancelEdit() {
      showAddForm.value = false;
      editingBlock.value = null;
      resetForm();
    }

    function resetForm() {
      form.name = '';
      form.description = '';
      form.image = '';
      form.order = blocks.value.length + 1;
      form.enabled = true;
    }

    async function deleteBlock(block) {
      if (!confirm(`Удалить блок "${block.name}"?`)) return;
      
      try {
        await axios.delete(`/api/category-blocks/${block.id}`);
        await fetchBlocks();
        showMessage('Блок удален!', 'success');
      } catch (e) {
        console.error('Ошибка удаления блока:', e);
        showMessage('Ошибка удаления блока', 'error');
      }
    }

    async function toggleEnabled(block) {
      try {
        await axios.put(`/api/category-blocks/${block.id}`, {
          ...block,
          enabled: !block.enabled
        });
        await fetchBlocks();
        showMessage(`Блок ${!block.enabled ? 'показан' : 'скрыт'}!`, 'success');
      } catch (e) {
        console.error('Ошибка изменения статуса блока:', e);
        showMessage('Ошибка изменения статуса блока', 'error');
      }
    }

    function showMessage(text, type) {
      message.value = text;
      messageType.value = type;
      setTimeout(() => {
        message.value = '';
        messageType.value = '';
      }, 5000);
    }

    onMounted(fetchBlocks);

    return {
      blocks,
      loading,
      showAddForm,
      editingBlock,
      message,
      messageType,
      form,
      saveBlock,
      editBlock,
      cancelEdit,
      deleteBlock,
      toggleEnabled
    };
  }
};

/**
 * Страница входа для администратора. Пользователь вводит номер телефона и пароль.
 * После успешной аутентификации в локальное состояние сохраняется токен и роль,
 * и пользователь перенаправляется в раздел администрирования.
 */
const LoginView = {
  name: 'LoginView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Логотип и заголовок -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-user text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Добро пожаловать!</h2>
          <p class="text-gray-600">Войдите в свой аккаунт или зарегистрируйтесь</p>
        </div>

        <!-- Переключатель входа/регистрации -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button 
              @click="isLogin = true"
              :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                isLogin 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Вход
            </button>
            <button 
              @click="isLogin = false"
              :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                !isLogin 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Регистрация
            </button>
          </div>

          <!-- Форма входа -->
          <form v-if="isLogin" @submit.prevent="login" class="space-y-6">
        <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-phone mr-2 text-orange-500"></i>
                Телефон
              </label>
              <input 
                v-model="phone" 
                type="tel"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="+7 (999) 123-45-67" 
                required 
              />
        </div>
        <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-lock mr-2 text-orange-500"></i>
                Пароль
              </label>
              <input 
                type="password" 
                v-model="password" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Введите пароль" 
                required 
              />
        </div>
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              <i class="fa-solid fa-exclamation-triangle mr-2"></i>
              {{ error }}
            </div>
            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <i class="fa-solid fa-sign-in-alt"></i>
              <span>Войти</span>
            </button>
      </form>

          <!-- Форма регистрации -->
          <form v-else @submit.prevent="register" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-phone mr-2 text-orange-500"></i>
                Телефон
              </label>
              <input 
                v-model="regPhone" 
                type="tel"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="+7 (999) 123-45-67" 
                required 
              />
            </div>
            <div v-if="regError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              <i class="fa-solid fa-exclamation-triangle mr-2"></i>
              {{ regError }}
            </div>
            <div v-if="regSuccess" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              <i class="fa-solid fa-check-circle mr-2"></i>
              {{ regSuccess }}
            </div>
            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <i class="fa-solid fa-user-plus"></i>
              <span>Зарегистрироваться</span>
            </button>
          </form>

          <!-- Дополнительная информация -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              <i class="fa-solid fa-shield-alt mr-1"></i>
              Ваши данные защищены
            </p>
          </div>
        </div>

        <!-- Ссылка на главную -->
        <div class="text-center">
          <router-link to="/" class="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center space-x-2">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Вернуться на главную</span>
          </router-link>
        </div>
      </div>
    </div>
  `,
  setup() {
    const phone = ref('');
    const password = ref('');
    const error = ref('');
    const regPhone = ref('');
    const regError = ref('');
    const regSuccess = ref('');
    const isLogin = ref(true);
    const router = useRouter();
    
    async function login() {
      error.value = '';
      try {
        const res = await axios.post('/api/login', { 
          phone: phone.value, 
          password: password.value 
        });
        
        console.log('Login response:', res.data);
        
        auth.token = res.data.token;
        auth.role = res.data.role;
        
        console.log('Auth state after login:', { token: auth.token, role: auth.role });
        
        // Небольшая задержка для обновления состояния
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Если админ, перенаправляем в админку. Иначе на главную.
        if (res.data.role === 'admin') {
          console.log('Redirecting to admin...');
          router.push('/admin');
        } else {
          console.log('Redirecting to home...');
          router.push('/');
        }
      } catch (err) {
        console.error('Login error:', err);
        if (err.response && err.response.status === 401) {
            error.value = 'Неверный телефон или пароль';
          } else {
            error.value = 'Ошибка входа';
          }
      }
    }
    
    async function register() {
      regError.value = '';
      regSuccess.value = '';
      try {
        const res = await axios.post('/api/users', { phone: regPhone.value.trim() });
        regSuccess.value = `Аккаунт создан! Ваш пароль: ${res.data.password}`;
        regPhone.value = '';
      } catch (e) {
        if (e.response && e.response.status === 409) {
          regSuccess.value = `Аккаунт уже существует! Ваш пароль: ${e.response.data.password}`;
        } else {
          regError.value = 'Ошибка регистрации';
        }
      }
    }
    
    return { 
      phone, 
      password, 
      error, 
      regPhone, 
      regError, 
      regSuccess, 
      isLogin, 
      login, 
      register 
    };
  }
};

/**
 * Компонент оформления заказа.
 * Позволяет пользователю ввести ФИО и адрес, просмотреть итог заказа
 * и отправить информацию на сервер. После отправки корзина очищается.
 */
const CheckoutView = {
  name: 'CheckoutView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <i class="fa-solid fa-credit-card text-orange-600 mr-4"></i>
            Оформление заказа
          </h1>
          <p class="text-gray-600 text-lg">Заполните данные для доставки</p>
          </div>

        <div v-if="items.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div class="text-gray-400 mb-6">
              <i class="fa-solid fa-shopping-cart text-6xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 mb-4">Корзина пуста</h3>
            <p class="text-gray-500 mb-6">Добавьте товары в корзину для оформления заказа</p>
            <router-link 
              to="/" 
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <i class="fa-solid fa-arrow-left mr-2"></i>
              Вернуться в меню
            </router-link>
          </div>
        </div>

        <div v-else class="grid lg:grid-cols-3 gap-8">
          <!-- Левая колонка - форма -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Информация о заказе -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-list mr-3"></i>
                  Ваш заказ
                </h2>
              </div>
              
              <div class="p-6">
                <div class="space-y-4">
                  <div v-for="item in items" :key="item.id" class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                      <p class="text-sm text-gray-600">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
                    </div>
                    <div class="text-lg font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
                  </div>
                  
                  <!-- Дополнительно -->
                  <div v-if="extrasSelectedList.length > 0" class="border-t pt-4">
                    <h4 class="font-semibold text-gray-900 mb-3">Дополнительно:</h4>
                    <div class="space-y-2">
                      <div v-for="ex in extrasSelectedList" :key="ex.name" class="flex justify-between text-sm">
                <span>{{ ex.name }} × {{ ex.quantity }}</span>
                        <span class="text-orange-600">{{ formatPrice(ex.price * ex.quantity) }}</span>
            </div>
          </div>
                  </div>
                  
                  <!-- Количество персон -->
                  <div class="border-t pt-4">
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-gray-900">Количество персон:</span>
                      <span class="text-orange-600 font-bold">{{ persons }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Форма данных клиента -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-user mr-3"></i>
                  Данные для доставки
                </h2>
              </div>
              
              <div class="p-6 space-y-6">
                <!-- Имя -->
            <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-user mr-2"></i>
                    Ваше имя (ФИО)
                  </label>
                  <input 
                    v-model="customerName" 
                    type="text" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                    placeholder="Иван Иванов" 
                    required 
                  />
            </div>

                <!-- Адрес -->
                <div class="grid md:grid-cols-2 gap-4">
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-city mr-2"></i>
                      Город
                    </label>
                    <input 
                      list="cities" 
                      v-model="customerCity" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="Выберите или введите город" 
                      required 
                    />
              <datalist id="cities">
                <option value="Москва"></option>
                <option value="Санкт-Петербург"></option>
                <option value="Казань"></option>
                <option value="Новосибирск"></option>
                <option value="Сочи"></option>
                <option value="Екатеринбург"></option>
              </datalist>
            </div>
                  
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-road mr-2"></i>
                      Улица
                    </label>
                    <input 
                      list="streets" 
                      v-model="customerStreet" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="Улица" 
                      required 
                    />
              <datalist id="streets">
                <option value="Ленина"></option>
                <option value="Тверская"></option>
                <option value="Невский проспект"></option>
                <option value="Садовая"></option>
                <option value="Пушкинская"></option>
              </datalist>
            </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-home mr-2"></i>
                      Дом / Квартира
                    </label>
                    <input 
                      v-model="customerApartment" 
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="Например, 10 кв.5" 
                      required 
                    />
            </div>
                  
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-phone mr-2"></i>
                      Телефон для связи
                    </label>
                    <input 
                      v-model="customerPhone" 
                      type="tel" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="8XXXXXXXXXX" 
                      required 
                    />
            </div>
          </div>
          </div>
        </div>

            <!-- Время доставки -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-clock mr-3"></i>
                  Время доставки
                </h2>
      </div>
              
              <div class="p-6">
                <div class="space-y-4">
                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition" :class="{ 'border-orange-500 bg-orange-50': deliveryTime === 'asap' }">
                    <input 
                      type="radio" 
                      v-model="deliveryTime" 
                      value="asap" 
                      class="h-5 w-5 text-orange-600 focus:ring-orange-500"
                    />
                    <div class="ml-4">
                      <div class="font-semibold text-gray-900 flex items-center">
                        <i class="fa-solid fa-bolt text-yellow-500 mr-2"></i>
                        Как можно скорее
                      </div>
                      <div class="text-sm text-gray-600">Доставим в течение 30-60 минут</div>
                    </div>
                  </label>
                  
                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition" :class="{ 'border-orange-500 bg-orange-50': deliveryTime === 'scheduled' }">
                    <input 
                      type="radio" 
                      v-model="deliveryTime" 
                      value="scheduled" 
                      class="h-5 w-5 text-orange-600 focus:ring-orange-500"
                    />
                    <div class="ml-4">
                      <div class="font-semibold text-gray-900 flex items-center">
                        <i class="fa-solid fa-calendar text-blue-500 mr-2"></i>
                        Запланировать на время
                      </div>
                      <div class="text-sm text-gray-600">Выберите удобное время</div>
                    </div>
                  </label>
                </div>
                
                <div v-if="deliveryTime === 'scheduled'" class="mt-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-calendar-alt mr-2"></i>
                    Выберите дату и время
                  </label>
                  <input 
                    type="datetime-local" 
                    v-model="scheduledTime" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    :min="minDateTime"
                    required
                  />
                  <p class="text-sm text-gray-500 mt-2">
                    <i class="fa-solid fa-info-circle mr-1"></i>
                    Минимальное время заказа: 1 час от текущего времени
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Правая колонка - итого и подтверждение -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-calculator mr-3"></i>
                  Итого к оплате
                </h2>
              </div>
              
              <div class="p-6 space-y-4">
                <!-- Детализация -->
                <div class="space-y-3">
                  <div class="flex justify-between text-gray-600">
                    <span>Товары ({{ items.reduce((sum, item) => sum + item.quantity, 0) }} шт.)</span>
                    <span>{{ formatPrice(total) }}</span>
                  </div>
                  
                  <div v-if="extrasTotal > 0" class="flex justify-between text-gray-600">
                    <span>Дополнительно</span>
                    <span>{{ formatPrice(extrasTotal) }}</span>
                  </div>
                  
                  <div class="border-t pt-3">
                    <div class="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Итого</span>
                      <span class="text-orange-600">{{ formatPrice(total + extrasTotal) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Кнопка подтверждения -->
                <button 
                  @click="submitOrder" 
                  class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Подтвердить заказ</span>
                </button>
                
                <!-- Дополнительная информация -->
                <div class="text-center text-sm text-gray-500 space-y-2">
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-shield-alt text-green-500"></i>
                    <span>Безопасная оплата</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-truck text-blue-500"></i>
                    <span>Быстрая доставка</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-undo text-purple-500"></i>
                    <span>Возврат в течение 24 часов</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    // Загружаем SEO данные
    const seoData = ref(null);
    
    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        seoData.value = response.data;
      } catch (e) {
        console.error('Ошибка загрузки SEO данных:', e);
      }
    }
    
    // SEO мета-теги для страницы оформления заказа (упрощенная версия)
    function updateCheckoutPageTitle() {
      document.title = 'Оформление заказа | Интернет‑магазин суши и пиццы | Точка суши и пиццы';
    }
    
    onMounted(() => {
      updateCheckoutPageTitle();
    });

    const items = computed(() => cart.items);
    const persons = computed(() => cart.persons);
    // те же допы, что в корзине
    const extras = [
      { name: 'Соевый соус', price: 50 },
      { name: 'Имбирь', price: 50 },
      { name: 'Васаби', price: 50 }
    ];
    // Выбор допов берём напрямую из корзины. Создаём список выбранных допов для удобства отображения.
    const extrasSelection = computed(() => cart.extrasSelection);
    const extrasSelectedList = computed(() => {
      return extras.map((extra, idx) => ({ ...extra, quantity: cart.extrasSelection[idx] }))
        .filter(item => item.quantity > 0);
    });
    const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const extrasTotal = computed(() => {
      return extras.reduce((sum, extra, idx) => sum + extra.price * cart.extrasSelection[idx], 0);
    });
    const customerName = ref('');
    const customerCity = ref('');
    const customerStreet = ref('');
    const customerApartment = ref('');
    const customerPhone = ref('');
    
    // Время доставки - берем из глобального состояния корзины
    const deliveryTime = computed({
      get() { return cart.deliveryTime; },
      set(val) { cart.deliveryTime = val; }
    });
    const scheduledTime = computed({
      get() { return cart.scheduledTime; },
      set(val) { cart.scheduledTime = val; }
    });
    
    // Минимальная дата для выбора времени (текущее время + 1 час)
    const minDateTime = computed(() => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now.toISOString().slice(0, 16);
    });
    
    const router = useRouter();
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    async function submitOrder() {
      if (!customerName.value.trim() || !customerCity.value.trim() || !customerStreet.value.trim() || !customerApartment.value.trim() || !customerPhone.value.trim()) {
        alert('Пожалуйста, заполните все поля (ФИО, город, улица, дом/квартира, телефон).');
        return;
      }
      
      // Валидация времени доставки
      if (deliveryTime.value === 'scheduled' && !scheduledTime.value) {
        alert('Пожалуйста, выберите время доставки.');
        return;
      }
      
      const order = {
        user_id: auth.user?.id,
        customer_name: customerName.value.trim(),
        customer_phone: customerPhone.value.trim(),
        customer_address: `${customerCity.value.trim()}, ${customerStreet.value.trim()}, ${customerApartment.value.trim()}`,
        total_amount: total.value + extrasTotal.value,
        status: 'pending',
        delivery_time: deliveryTime.value,
        scheduled_time: deliveryTime.value === 'scheduled' ? scheduledTime.value : null,
        persons: cart.persons,
        extras_selection: cart.extrasSelection.slice(),
        notes: '',
        items: cart.items.map(item => ({ 
          product_id: item.id, 
          quantity: item.quantity, 
          price: item.price 
        }))
      };
      try {
        const response = await axios.post('/api/orders', order);
        // очищаем корзину
        cart.items.splice(0, cart.items.length);
        cart.persons = 1;
        cart.extrasSelection = cart.extrasSelection.map(() => 0);
        cart.deliveryTime = 'asap';
        cart.scheduledTime = '';
        const orderId = response.data.id;
        // перенаправляем пользователя на страницу завершения заказа
        router.push({ path: '/thankyou', query: { orderId } });
      } catch (e) {
        console.error('Ошибка оформления заказа', e);
        alert('Не удалось оформить заказ. Попробуйте ещё раз.');
      }
    }
    return {
      items,
      persons,
      extras,
      extrasSelection,
      extrasSelectedList,
      total,
      extrasTotal,
      formatPrice,
      customerName,
      customerCity,
      customerStreet,
      customerApartment,
      customerPhone,
      deliveryTime,
      scheduledTime,
      minDateTime,
      submitOrder
    };
  }
};

/**
 * Компонент страницы благодарности после оформления заказа.
 * Позволяет перейти на главную или оставить отзыв.
 */
const ThankYouView = {
  name: 'ThankYouView',
  template: /* html */`
    <section class="py-12" style="background-color:#ffebb7;">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow p-6 text-center">
        <h2 class="text-2xl font-bold mb-4 text-red-700">Спасибо за ваш заказ!</h2>
        <p class="mb-6">Ваш заказ успешно принят. Мы ценим ваше доверие.</p>
        <div class="space-y-4">
          <button @click="goHome" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition">Вернуться на главную</button>
          <button @click="goReview" class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full transition">Оставить отзыв</button>
        </div>
      </div>
    </section>
  `,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const orderId = route.query.orderId;
    function goHome() {
      router.push('/');
    }
    function goReview() {
      if (orderId) router.push(`/review/${orderId}`);
      else router.push('/');
    }
    return { goHome, goReview };
  }
};

/**
 * Компонент для оставления отзыва.
 * Пользователь может указать оценку, комментарий, имя и телефон.
 * При желании можно создать учётную запись, указав телефон. Сгенерированный пароль отображается пользователю.
 */
const ReviewView = {
  name: 'ReviewView',
  template: /* html */`
    <section class="py-12" style="background-color:#ffebb7;">
      <div class="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold mb-4 text-red-700">Оставить отзыв</h2>
        <p class="mb-6 text-gray-700">Нам важно ваше мнение. Оцените наш сервис и поделитесь впечатлениями.</p>
        <div class="space-y-4">
          <div>
            <label class="block font-medium mb-1">Оценка</label>
            <select v-model.number="rating" class="w-full border rounded px-3 py-2">
              <option disabled value="0">Выберите оценку</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
            </select>
          </div>
          <div>
            <label class="block font-medium mb-1">Комментарий</label>
            <textarea v-model="comment" class="w-full border rounded px-3 py-2" rows="4" placeholder="Напишите ваш отзыв..." required></textarea>
          </div>
          <div>
            <label class="block font-medium mb-1">Ваше имя (необязательно)</label>
            <input v-model="name" type="text" class="w-full border rounded px-3 py-2" placeholder="Ваше имя" />
          </div>
          <div>
            <label class="block font-medium mb-1">Телефон (необязательно)</label>
            <input v-model="phone" type="tel" class="w-full border rounded px-3 py-2" placeholder="8XXXXXXXXXX" />
          </div>
          <div class="flex items-center space-x-2">
            <input id="createAccount" type="checkbox" v-model="createAccount" class="h-4 w-4">
            <label for="createAccount" class="select-none">Создать аккаунт (сгенерируем пароль)</label>
          </div>
          <div v-if="generatedPassword" class="bg-green-50 border border-green-200 text-green-800 p-3 rounded text-sm">
            <p>Учётная запись создана. Ваш пароль: <strong>{{ generatedPassword }}</strong></p>
            <p class="mt-1 text-gray-600">Сохраните его. На почту будет выслано письмо с подтверждением (в реальном приложении).</p>
          </div>
          <button @click="submitReview" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition">Отправить отзыв</button>
        </div>
      </div>
    </section>
  `,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const rating = ref(0);
    const comment = ref('');
    const name = ref('');
    const phone = ref('');
    const createAccount = ref(false);
    const generatedPassword = ref('');
    const orderId = route.params.orderId;
    async function submitReview() {
      if (!rating.value || !comment.value.trim()) {
        alert('Пожалуйста, укажите оценку и заполните комментарий.');
        return;
      }
      let registeredPhone = '';
      // если пользователь хочет создать аккаунт и указал телефон
      if (createAccount.value && phone.value.trim()) {
        try {
          const res = await axios.post('/api/users', { phone: phone.value.trim() });
          registeredPhone = res.data.phone;
          generatedPassword.value = res.data.password;
        } catch (e) {
          console.error('Ошибка регистрации пользователя', e);
          alert('Не удалось создать учётную запись. Попробуйте позже.');
          return;
        }
      }
      // отправляем отзыв
      try {
        await axios.post('/api/reviews', {
          rating: rating.value,
          comment: comment.value.trim(),
          name: name.value.trim(),
          phone: createAccount.value ? phone.value.trim() : '',
          orderId
        });
        alert('Спасибо за ваш отзыв!');
        router.push('/');
      } catch (e) {
        console.error('Ошибка отправки отзыва', e);
        alert('Не удалось отправить отзыв. Попробуйте ещё раз.');
      }
    }
    return {
      rating,
      comment,
      name,
      phone,
      createAccount,
      generatedPassword,
      submitReview
    };
  }
};

/**
 * Главный компонент админки, отображает ссылки на разделы управления.
 */
const AdminHomeView = window.AdminHomeView || { name: 'AdminHomeView', template: '<div>Загрузка...</div>' };

/**
 * Компонент управления категориями
 */
const AdminCategoriesView = {
  name: 'AdminCategoriesView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Заголовок -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
    <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Управление категориями</h1>
              <p class="text-gray-600">Создание и редактирование категорий товаров</p>
    </div>
            <button @click="showAddForm = true" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition flex items-center">
              <i class="fa-solid fa-plus mr-2"></i>
              Добавить категорию
            </button>
          </div>
        </div>
        
        <!-- Список категорий -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Список категорий</h2>
          </div>
          
          <div v-if="loading" class="p-8 text-center">
            <i class="fa-solid fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="mt-2 text-gray-500">Загрузка...</p>
          </div>
          
          <div v-else-if="categories.length === 0" class="p-8 text-center">
            <i class="fa-solid fa-tags text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">Категории не найдены</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div v-for="category in categories" :key="category.id" class="p-6 hover:bg-gray-50 transition">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-lg overflow-hidden mr-4 border border-gray-200">
                    <img 
                      v-if="category.image" 
                      :src="category.image" 
                      :alt="category.name" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="w-full h-full bg-green-100 flex items-center justify-center">
                      <i class="fa-solid fa-tag text-green-600"></i>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500">ID: {{ category.id }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="editCategory(category)" class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition">
                    <i class="fa-solid fa-edit"></i>
                  </button>
                  <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Модальное окно добавления/редактирования -->
        <div v-if="showAddForm || editingCategory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ editingCategory ? 'Редактировать категорию' : 'Добавить категорию' }}
              </h3>
            </div>
            
            <form @submit.prevent="saveCategory" class="p-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Название категории</label>
                <input 
                  v-model="categoryForm.name" 
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="Введите название категории"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Изображение категории</label>
                <input 
                  v-model="categoryForm.image" 
                  type="url" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="https://example.com/image.jpg"
                />
                <p class="text-xs text-gray-500 mt-1">URL изображения для отображения в карточках</p>
              </div>
              
              <div v-if="categoryForm.image" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Предварительный просмотр</label>
                <div class="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <img :src="categoryForm.image" alt="Предварительный просмотр" class="w-full h-full object-cover" />
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  type="button" 
                  @click="cancelEdit" 
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  {{ editingCategory ? 'Сохранить' : 'Добавить' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const categories = ref([]);
    const loading = ref(true);
    const showAddForm = ref(false);
    const editingCategory = ref(null);
    const categoryForm = ref({ name: '', image: '' });
    
    async function fetchCategories() {
      try {
        loading.value = true;
        const res = await axios.get('/api/categories');
        categories.value = res.data;
      } catch (e) {
        console.error('Ошибка загрузки категорий', e);
        alert('Не удалось загрузить категории');
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
        alert(editingCategory.value ? 'Категория обновлена' : 'Категория добавлена');
      } catch (e) {
        console.error('Ошибка сохранения категории', e);
        alert('Не удалось сохранить категорию');
      }
    }
    
    function editCategory(category) {
      editingCategory.value = category;
      categoryForm.value = { name: category.name, image: category.image || '' };
    }
    
    function cancelEdit() {
      showAddForm.value = false;
      editingCategory.value = null;
      categoryForm.value = { name: '', image: '' };
    }
    
    async function deleteCategory(id) {
      if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
      
      try {
        await axios.delete(`/api/categories/${id}`);
        await fetchCategories();
        alert('Категория удалена');
      } catch (e) {
        console.error('Ошибка удаления категории', e);
        alert('Не удалось удалить категорию');
      }
    }
    
    onMounted(fetchCategories);
    
    return {
      categories,
      loading,
      showAddForm,
      editingCategory,
      categoryForm,
      saveCategory,
      editCategory,
      cancelEdit,
      deleteCategory
    };
  }
};

// Определяем маршруты для приложения
const routes = [
  { path: '/', component: HomeView },
  { path: '/cart', component: CartView },
  { path: '/checkout', component: CheckoutView },
  { path: '/thankyou', component: ThankYouView },
  { path: '/review/:orderId', component: ReviewView },
  { path: '/news', component: NewsListView },
  { path: '/news/:id', component: NewsDetailView, props: true },
  { path: '/admin', component: AdminHomeView },
  { path: '/admin/products', component: AdminProductsView },
  { path: '/admin/categories', component: AdminCategoriesView },
  { path: '/admin/news', component: AdminNewsView },
  { path: '/admin/orders', component: AdminOrdersView },
  { path: '/admin/orders/:id/edit', component: AdminOrderEditView },
  { path: '/admin/reviews', component: AdminReviewsView },
  { path: '/admin/seo', component: AdminSEOView },
  { path: '/admin/category-blocks', component: AdminCategoryBlocksView },
  { path: '/login', component: LoginView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Глобальный навигационный охранник: запрещаем доступ к /admin*
// если пользователь не является администратором. В таком случае
// перенаправляем на страницу входа.
router.beforeEach((to, from, next) => {
  console.log('Router guard:', { to: to.path, from: from.path });
  
  if (to.path.startsWith('/admin')) {
    // Проверяем токен и роль
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Admin access check:', { token: !!token, role, authRole: auth.role });
    
    if (token && role === 'admin') {
      // Обновляем глобальное состояние если нужно
      if (auth.token !== token) auth.token = token;
      if (auth.role !== role) auth.role = role;
      console.log('Admin access granted');
      return next();
    } else {
      console.log('Admin access denied, redirecting to login');
      return next('/login');
    }
  }
  next();
});

/**
 * Корневой компонент приложения. Содержит навигацию и отображает текущий маршрут.
 */
const App = {
  name: 'App',
  template: /* html */`
    <div class="relative min-h-screen flex flex-col">
      <!-- Анимация загрузки -->
      <LoadingSpinner v-if="globalLoading.isLoading" />
      
      <header class="bg-white shadow mb-6">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <router-link to="/" class="flex items-center">
              <img src="/assets/logo.png" alt="Logo" class="h-10 w-auto" />
            </router-link>
            <router-link to="/" class="text-gray-600 hover:text-gray-900">Меню</router-link>
            <router-link to="/news" class="text-gray-600 hover:text-gray-900">Новости</router-link>
          </div>
          <div class="flex items-center space-x-6">
            <router-link to="/cart" class="relative text-gray-600 hover:text-gray-900 hidden md:inline-block">
              <i class="fa-solid fa-shopping-cart text-xl"></i>
              <span v-if="cartCount" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">{{ cartCount }}</span>
            </router-link>
            <div v-if="isAdmin" class="flex items-center space-x-4">
              <router-link to="/admin" class="text-gray-600 hover:text-gray-900">Admin</router-link>
              <button @click="logout" class="text-red-600 hover:text-red-800 text-sm">Выйти</button>
            </div>
            <router-link v-else to="/login" class="text-gray-600 hover:text-gray-900">Войти</router-link>
          </div>
        </div>
      </header>
      <main class="flex-grow max-w-7xl mx-auto px-4">
        <router-view></router-view>
      </main>
      <!-- Плавающая кнопка корзины и превью содержимого -->
      <div v-if="cartCount > 0" class="fixed bottom-6 right-6 z-50">
        <div class="relative">
          <!-- Анимированная кнопка корзины -->
          <button
            @click="goToCart"
            @mouseenter="showCartPreview" @mouseleave="hideCartPreview"
            class="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-3xl group"
          >
            <!-- Иконка корзины с анимацией -->
            <div class="relative">
              <i class="fa-solid fa-shopping-cart text-2xl group-hover:animate-bounce"></i>
              <!-- Пульсирующий эффект -->
              <div class="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></div>
            </div>
            
            <!-- Счетчик товаров с анимацией -->
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
              {{ cartCount }}
            </span>
            
            <!-- Эффект "добавлено" -->
            <div v-if="justAdded" class="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              +1
            </div>
          </button>
          
          <!-- Улучшенное превью корзины -->
          <div
            v-if="showPreview"
            @mouseenter="showCartPreview" @mouseleave="hideCartPreview"
            class="absolute bottom-full right-0 mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn"
          >
            <!-- Заголовок превью -->
            <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-lg flex items-center">
                  <i class="fa-solid fa-shopping-cart mr-2"></i>
                  Корзина
                </h4>
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {{ cartCount }} {{ cartCount === 1 ? 'товар' : cartCount < 5 ? 'товара' : 'товаров' }}
                </span>
              </div>
            </div>
            
            <!-- Список товаров -->
            <div class="max-h-64 overflow-y-auto">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition">
                <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
          </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900 text-sm">{{ item.name }}</div>
                  <div class="text-gray-500 text-xs">× {{ item.quantity }}</div>
                </div>
                <div class="font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
              </div>
            </div>
            
            <!-- Итого и кнопка -->
            <div class="p-4 bg-gray-50">
              <div class="flex justify-between items-center mb-3">
                <span class="font-bold text-gray-900">Итого:</span>
                <span class="text-2xl font-bold text-orange-600">{{ formatPrice(cartTotal) }}</span>
              </div>
              <button 
                @click="goToCart"
                class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <i class="fa-solid fa-credit-card"></i>
                <span>Оформить заказ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const cartCount = computed(() => cart.items.reduce((sum, item) => sum + item.quantity, 0));
    const router = useRouter();
    function goToCart() {
      router.push('/cart');
    }
    // состояние превью корзины
    const showPreview = ref(false);
    function showCartPreview() {
      showPreview.value = true;
    }
    function hideCartPreview() {
      showPreview.value = false;
    }
    const cartItems = computed(() => cart.items);
    const cartTotal = computed(() => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    
    // Эффект "добавлено" для плавающей корзины
    const justAdded = ref(false);
    let justAddedTimeout = null;
    
    // Следим за изменениями в корзине для показа эффекта
    watch(cartCount, (newCount, oldCount) => {
      if (newCount > oldCount) {
        justAdded.value = true;
        if (justAddedTimeout) clearTimeout(justAddedTimeout);
        justAddedTimeout = setTimeout(() => {
          justAdded.value = false;
        }, 2000);
      }
    });
    
    // Вычисляем, является ли пользователь администратором
    const isAdmin = computed(() => auth.role === 'admin');
    
    // Функция выхода из аккаунта
    function logout() {
      auth.token = '';
      auth.role = '';
      router.push('/');
    }
    
    // Функция форматирования цены
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    
    return { 
      cartCount, 
      cartTotal,
      justAdded,
      goToCart, 
      showPreview, 
      showCartPreview, 
      hideCartPreview, 
      cartItems, 
      isAdmin, 
      logout,
      formatPrice,
      globalLoading
    };
  }
};

// Создаём и монтируем приложение
const app = createApp(App);
app.component('LoadingSpinner', LoadingSpinner);
app.use(router);
app.mount('#app');

// Завершаем загрузку после инициализации приложения
document.addEventListener('DOMContentLoaded', () => {
  // Небольшая задержка для демонстрации анимации
  setTimeout(() => {
    globalLoading.progress = 100;
  }, 1500);
});