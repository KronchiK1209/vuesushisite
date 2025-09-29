// РСЃРїРѕР»СЊР·СѓРµРј РіР»РѕР±Р°Р»СЊРЅС‹Рµ СЃР±РѕСЂРєРё Vue Рё VueRouter, РїРѕРґРєР»СЋС‡С‘РЅРЅС‹Рµ С‡РµСЂРµР· CDN.
const { createApp, reactive, ref, computed, onMounted, onUnmounted, watch } = Vue;
const { createRouter, createWebHistory } = VueRouter;
const { useRouter, useRoute } = VueRouter;

// РСЃРїРѕР»СЊР·СѓРµРј РіР»РѕР±Р°Р»СЊРЅС‹Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ, Р·Р°РіСЂСѓР¶РµРЅРЅС‹Рµ РёР· РјРѕРґСѓР»РµР№
// Р­С‚Рё РїРµСЂРµРјРµРЅРЅС‹Рµ Р±СѓРґСѓС‚ РґРѕСЃС‚СѓРїРЅС‹ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё РјРѕРґСѓР»РµР№ РІ index.html

// РџСЂРѕРІРµСЂСЏРµРј РґРѕСЃС‚СѓРїРЅРѕСЃС‚СЊ Р°РґРјРёРЅСЃРєРёС… РєРѕРјРїРѕРЅРµРЅС‚РѕРІ Рё СЃРѕР·РґР°РµРј fallback
const AdminOrdersView = window.AdminOrdersView || { name: 'AdminOrdersView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminOrderEditView = window.AdminOrderEditView || { name: 'AdminOrderEditView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminProductsView = window.AdminProductsView || { name: 'AdminProductsView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminNewsView = window.AdminNewsView || { name: 'AdminNewsView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminCategoriesView = window.AdminCategoriesView || { name: 'AdminCategoriesView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminReviewsView = window.AdminReviewsView || { name: 'AdminReviewsView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminStatsView = window.AdminStatsView || { name: 'AdminStatsView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminSEOView = window.AdminSEOView || { name: 'AdminSEOView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
const AdminCategoryBlocksView = window.AdminCategoryBlocksView || { name: 'AdminCategoryBlocksView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };

// РљРѕРјРїРѕРЅРµРЅС‚ Р°РЅРёРјР°С†РёРё Р·Р°РіСЂСѓР·РєРё
const LoadingSpinner = {
  name: 'LoadingSpinner',
  template: /* html */`
    <div class="loading-overlay">
      <div class="loading-container">
        <!-- РђРЅРёРјРёСЂРѕРІР°РЅРЅС‹Рµ СЃСѓС€Рё -->
        <div class="sushi-animation">
          <div class="sushi-roll">
            <div class="sushi-piece" v-for="i in 8" :key="i" :style="{ '--delay': (i - 1) * 0.1 + 's' }"></div>
          </div>
          <div class="chopsticks">
            <div class="chopstick left"></div>
            <div class="chopstick right"></div>
          </div>
        </div>
        
        <!-- Р›РѕРіРѕС‚РёРї Рё С‚РµРєСЃС‚ -->
        <div class="loading-content">
          <div class="loading-logo">
            <i class="fa-solid fa-fish text-4xl text-orange-500 mb-4 animate-pulse"></i>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">РўРѕС‡РєР° СЃСѓС€Рё Рё РїРёС†С†С‹</h2>
            <p class="text-gray-600">Р“РѕС‚РѕРІРёРј РґР»СЏ РІР°СЃ СЃР°РјРѕРµ РІРєСѓСЃРЅРѕРµ...</p>
          </div>
          
          <!-- РџСЂРѕРіСЂРµСЃСЃ Р±Р°СЂ -->
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
    // РђРЅРёРјР°С†РёСЏ РїСЂРѕРіСЂРµСЃСЃР°
    const animateProgress = () => {
      const interval = setInterval(() => {
        if (globalLoading.progress < 100) {
          globalLoading.progress += Math.random() * 15;
          if (globalLoading.progress > 100) globalLoading.progress = 100;
        } else {
          clearInterval(interval);
          // Р—Р°РІРµСЂС€Р°РµРј Р·Р°РіСЂСѓР·РєСѓ С‡РµСЂРµР· 500РјСЃ РїРѕСЃР»Рµ РґРѕСЃС‚РёР¶РµРЅРёСЏ 100%
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

// РџСЂРѕСЃС‚РѕРµ РіР»РѕР±Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ РґР»СЏ РєРѕСЂР·РёРЅС‹. РљР°Р¶РґС‹Р№ СЌР»РµРјРµРЅС‚ СЃРѕРґРµСЂР¶РёС‚ id, name, price, image, quantity.
// Р“Р»РѕР±Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ РєРѕСЂР·РёРЅС‹ Рё РёРЅС„РѕСЂРјР°С†РёРё Рѕ Р·Р°РєР°Р·Рµ
const cart = reactive({
  items: [],
  // РєРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ РґР»СЏ Р·Р°РєР°Р·Р°
  persons: 1,
  // РєРѕР»РёС‡РµСЃС‚РІРѕ РІС‹Р±СЂР°РЅРЅС‹С… РґРѕРїРѕРІ (РЎРѕРµРІС‹Р№ СЃРѕСѓСЃ, РРјР±РёСЂСЊ, Р’Р°СЃР°Р±Рё)
  extrasSelection: [0, 0, 0],
  // РІСЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё: 'asap' - РєР°Рє РјРѕР¶РЅРѕ СЃРєРѕСЂРµРµ, 'scheduled' - Р·Р°РїР»Р°РЅРёСЂРѕРІР°РЅРЅРѕРµ РІСЂРµРјСЏ
  deliveryTime: 'asap',
  // Р·Р°РїР»Р°РЅРёСЂРѕРІР°РЅРЅРѕРµ РІСЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё (РµСЃР»Рё РІС‹Р±СЂР°РЅРѕ)
  scheduledTime: ''
});

// Р“Р»РѕР±Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ Р·Р°РіСЂСѓР·РєРё
const globalLoading = reactive({
  isLoading: true,
  progress: 0
});

// Р“Р»РѕР±Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё (С‚РѕРєРµРЅ Рё СЂРѕР»СЊ).
// РџСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹ С‡РёС‚Р°РµРј С‚РѕРєРµРЅ Рё СЂРѕР»СЊ РёР· localStorage,
// С‡С‚РѕР±С‹ СЃРѕС…СЂР°РЅСЏС‚СЊ СЃРѕСЃС‚РѕСЏРЅРёРµ РјРµР¶РґСѓ РїРµСЂРµР·Р°РіСЂСѓР·РєР°РјРё.
const auth = reactive({
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || ''
});

// РќР°СЃС‚СЂРѕР№РєР° axios: СѓСЃС‚Р°РЅР°РІР»РёРІР°РµРј Р·Р°РіРѕР»РѕРІРѕРє Authorization РїСЂРё РёР·РјРµРЅРµРЅРёРё С‚РѕРєРµРЅР°.
if (typeof axios !== 'undefined') {
  if (auth.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
  }
}

// РЎР»РµРґРёРј Р·Р° РёР·РјРµРЅРµРЅРёСЏРјРё auth.token Рё РѕР±РЅРѕРІР»СЏРµРј localStorage Рё axios.
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

// РЎР»РµРґРёРј Р·Р° РёР·РјРµРЅРµРЅРёСЏРјРё СЂРѕР»Рё, С‡С‚РѕР±С‹ СЃРѕС…СЂР°РЅСЏС‚СЊ/СѓРґР°Р»СЏС‚СЊ РІ localStorage
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
 * Р”РѕР±Р°РІР»СЏРµС‚ С‚РѕРІР°СЂ РІ РєРѕСЂР·РёРЅСѓ. Р•СЃР»Рё С‚РѕРІР°СЂ СѓР¶Рµ РїСЂРёСЃСѓС‚СЃС‚РІСѓРµС‚, СѓРІРµР»РёС‡РёРІР°РµС‚ РєРѕР»РёС‡РµСЃС‚РІРѕ.
 * @param {Object} product РўРѕРІР°СЂ, РєРѕС‚РѕСЂС‹Р№ РЅСѓР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ
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
 * РљРѕРјРїРѕРЅРµРЅС‚ РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†С‹ (СЃРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ).
 */
const HomeView = {
  name: 'HomeView',
  template: /* html */`
    <div>
      <!-- РќРѕРІС‹Р№ Р±Р°РЅРЅРµСЂ РІ СЃС‚РёР»Рµ Brox -->
      <section class="relative bg-red-600 text-white overflow-hidden">
        <!-- РґРµРєРѕСЂР°С‚РёРІРЅС‹Рµ Р·Р°РІРёС‚РєРё РєР°Рє С„РѕРЅ -->
        <img src="/banner.png" class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="" />
        <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <!-- Р›РµРІС‹Р№ СЃС‚РѕР»Р±РµС†: С‚РµРєСЃС‚ Рё РєРЅРѕРїРєР° -->
          <div>
            <p class="text-yellow-200 uppercase tracking-wider mb-3">Р‘С‹СЃС‚СЂРѕ Рё РІРєСѓСЃРЅРѕ</p>
            <h1 class="text-4xl lg:text-5xl font-bold mb-4 leading-tight">РџРѕРїСЂРѕР±СѓР№С‚Рµ РЅР°С€Рё <span class="text-yellow-300">РѕСЃРѕР±С‹Рµ СЃСѓС€Рё</span></h1>
            <p class="text-lg mb-6 max-w-md">РЎР°РјС‹Рµ СЃРІРµР¶РёРµ СЂРѕР»Р»С‹ Рё РЅРёРіРёСЂРё РґР»СЏ Р»СЋР±РѕРіРѕ РЅР°СЃС‚СЂРѕРµРЅРёСЏ. Р—Р°РєР°Р·С‹РІР°Р№С‚Рµ РѕРЅР»Р°Р№РЅ РёР»Рё Р·Р°Р±РёСЂР°Р№С‚Рµ СЃР°РјРё.</p>
            <button @click="scrollToMenu" class="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center space-x-2">
              <span>РќР°С‡Р°С‚СЊ Р·Р°РєР°Р·</span>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <div class="flex space-x-8 mt-8 text-sm">
              <div class="flex items-center space-x-2"><i class="fa-solid fa-truck-fast"></i><span>Р”РѕСЃС‚Р°РІРєР°</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-box-open"></i><span>РЎР°РјРѕРІС‹РІРѕР·</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-chair"></i><span>Р’ СЂРµСЃС‚РѕСЂР°РЅРµ</span></div>
            </div>
          </div>
          <!-- РџСЂР°РІС‹Р№ СЃС‚РѕР»Р±РµС†: РёР·РѕР±СЂР°Р¶РµРЅРёРµ СЃ СЃРµС‚РѕРј Рё Р·РЅР°С‡РєРѕРј СЃРєРёРґРєРё -->
          <div class="relative hidden md:block">
            <!-- РћР±РµСЂРЅС‘Рј РёР·РѕР±СЂР°Р¶РµРЅРёРµ РІ transition РґР»СЏ РїР»Р°РІРЅРѕР№ СЃРјРµРЅС‹ СЃР»Р°Р№РґРѕРІ СЃ СЌС„С„РµРєС‚РѕРј СЂР°Р·РјС‹С‚РёСЏ -->
            <transition name="pixel-fade" mode="out-in">
              <img :key="currentSlideIndex" :src="(currentSlide && currentSlide.image) || heroImage || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" alt="РЎР»Р°Р№Рґ" class="w-full h-80 object-cover rounded-lg shadow-lg" />
            </transition>
            <!-- Р—РЅР°С‡РѕРє СЃРєРёРґРєРё: СѓРјРµРЅСЊС€РµРЅРЅС‹Р№ СЂР°Р·РјРµСЂ Рё Р°РєРєСѓСЂР°С‚РЅРѕРµ РїРѕР·РёС†РёРѕРЅРёСЂРѕРІР°РЅРёРµ -->
            <div class="absolute top-4 right-4">
              <div class="relative">
                <i class="fa-solid fa-star text-yellow-400 text-4xl"></i>
                <span class="absolute inset-0 flex items-center justify-center text-red-700 text-xs font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Р’РѕР»РЅРѕРѕР±СЂР°Р·РЅС‹Р№ РЅРёР· Р±Р»РѕРєР°: SVG РІРЅСѓС‚СЂРё, СЂРёСЃСѓРµС‚ РІРѕР»РЅСѓ РІ С†РІРµС‚Рµ СЃР»РµРґСѓСЋС‰РµРіРѕ Р±Р»РѕРєР° -->
        <svg class="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-32" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <!-- Р¦РІРµС‚ РЅРёР¶РЅРµР№ С‡Р°СЃС‚Рё РІРѕР»РЅС‹ СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓРµС‚ Р±Р»РѕРєСѓ РєР°С‚РµРіРѕСЂРёР№ (#f9f4e5) -->
          <path fill="#f9f4e5" d="M0 50 Q 360 80 720 50 T 1440 50 V100 H0 Z"></path>
        </svg>
      </section>
      <!-- РќР°С€Рё РєР°С‚РµРіРѕСЂРёРё -->
      <!--
        РќР°СЃС‚СЂР°РёРІР°РµРј С„РѕРЅ Рё С†РІРµС‚Р° РґР»СЏ Р±Р»РѕРєР° РєР°С‚РµРіРѕСЂРёР№. РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РїСЂРѕСЃРёР» СЃРґРµР»Р°С‚СЊ С„РѕРЅ
        СЃРІРµС‚Р»С‹Рј (РєРѕРґ #f9f4e5) Рё РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‡С‘СЂРЅС‹Р№, РѕСЂР°РЅР¶РµРІС‹Р№ Рё РєСЂР°СЃРЅС‹Р№ РѕС‚С‚РµРЅРєРё
        РґР»СЏ РЅР°РґРїРёСЃРё. Р”Р»СЏ С„РѕРЅР° РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ inlineвЂ‘style, С‡С‚РѕР±С‹ РЅРµ Р·Р°РІРёСЃРµС‚СЊ РѕС‚
        РІСЃС‚СЂРѕРµРЅРЅС‹С… РєР»Р°СЃСЃРѕРІ Tailwind. Р”Р»СЏ С‚РµРєСЃС‚Р° РѕСЃРЅРѕРІРЅРѕРіРѕ Р·Р°РіРѕР»РѕРІРєР° РґРѕР±Р°РІР»СЏРµРј
        РєР»Р°СЃСЃ text-black, Р° РґР»СЏ РІС‹РґРµР»РµРЅРЅС‹С… СЃР»РѕРІ РёСЃРїРѕР»СЊР·СѓРµРј text-orange-600 Рё
        text-red-600 СЃРѕРѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕ.
      -->
      <section class="py-12" style="background-color:#f9f4e5;">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">
          <span class="text-orange-600">РљР°С‚РµРіРѕСЂРёРё</span> Рё
          <span class="text-red-600">Р±Р»СЋРґР°</span>, РєРѕС‚РѕСЂС‹С… РІС‹ РЅРµ&nbsp;РЅР°Р№РґС‘С‚Рµ РЅРёРіРґРµ
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

      <!-- СЃС‚Р°СЂС‹Р№ Р±Р»РѕРє РјРµРЅСЋ СЃ РїРѕРёСЃРєРѕРј Рё РєР°СЂС‚РѕС‡РєР°РјРё СѓРґР°Р»С‘РЅ -->

      <!-- РљР°С‚РµРіРѕСЂРёРё СЃС‚Р°СЂР°СЏ СЃРµРєС†РёСЏ СѓРґР°Р»РµРЅР° -->

      <!-- Р Р°Р·РґРµР» РјРµРЅСЋ СЃ РІРµСЂС‚РёРєР°Р»СЊРЅС‹Рј РІС‹Р±РѕСЂРѕРј РєР°С‚РµРіРѕСЂРёРё Рё СЃРїРёСЃРєРѕРј С‚РѕРІР°СЂРѕРІ -->
      <section class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Р—Р°РіРѕР»РѕРІРѕРє РјРµРЅСЋ СЃ РґРµРєРѕСЂР°С‚РёРІРЅС‹РјРё СЌР»РµРјРµРЅС‚Р°РјРё -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center space-x-2 mb-4">
              <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
              <h2 ref="menuSection" class="text-4xl font-bold text-gray-900">РќР°С€Рµ РјРµРЅСЋ</h2>
              <div class="w-8 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">Р’С‹Р±РµСЂРёС‚Рµ РєР°С‚РµРіРѕСЂРёСЋ Рё РЅР°СЃР»Р°Р¶РґР°Р№С‚РµСЃСЊ РЅР°С€РёРјРё РёР·С‹СЃРєР°РЅРЅС‹РјРё Р±Р»СЋРґР°РјРё</p>
          </div>
          
          <div class="grid lg:grid-cols-4 gap-8">
            <!-- Р‘РѕРєРѕРІР°СЏ РїР°РЅРµР»СЊ СЃ РїРѕРёСЃРєРѕРј Рё РєР°С‚РµРіРѕСЂРёСЏРјРё -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <!-- РџРѕРёСЃРє -->
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-search mr-2 text-orange-500"></i>
                    РџРѕРёСЃРє РїРѕ РјРµРЅСЋ
                  </label>
                  <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
                      placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ Р±Р»СЋРґР°..."
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
                
                <!-- РљР°С‚РµРіРѕСЂРёРё -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fa-solid fa-tags mr-2 text-orange-500"></i>
                    РљР°С‚РµРіРѕСЂРёРё
                  </h3>
            <div class="space-y-2">
                    <!-- Р¤РёР»СЊС‚СЂ "РҐРёС‚С‹" -->
                    <button
                      @click="selectedVertical = 'РҐРёС‚С‹'"
                      :class="[
                        'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group',
                        selectedVertical === 'РҐРёС‚С‹'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                          : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 hover:from-yellow-100 hover:to-orange-100 hover:shadow-md'
                      ]"
                    >
                      <span class="font-medium flex items-center">
                        <i class="fa-solid fa-star mr-2 text-yellow-500"></i>
                        РҐРёС‚С‹
                      </span>
                      <i v-if="selectedVertical === 'РҐРёС‚С‹'" class="fa-solid fa-check text-sm"></i>
                      <i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i>
                    </button>
                    
                    <!-- РћР±С‹С‡РЅС‹Рµ РєР°С‚РµРіРѕСЂРёРё -->
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
                
                <!-- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ -->
                <div class="mt-8 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                  <div class="flex items-center text-orange-700 mb-2">
                    <i class="fa-solid fa-star mr-2"></i>
                    <span class="font-semibold">РџРѕРїСѓР»СЏСЂРЅРѕРµ</span>
                  </div>
                  <p class="text-sm text-orange-600">РџРѕРїСЂРѕР±СѓР№С‚Рµ РЅР°С€Рё С…РёС‚С‹ РїСЂРѕРґР°Р¶!</p>
                </div>
              </div>
            </div>
            <!-- РЎРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ РІС‹Р±СЂР°РЅРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё -->
            <div class="lg:col-span-3">
               <!-- Р—Р°РіРѕР»РѕРІРѕРє РєР°С‚РµРіРѕСЂРёРё -->
               <div class="mb-6">
                 <h3 class="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                   <i v-if="selectedVertical === 'РҐРёС‚С‹'" class="fa-solid fa-star text-yellow-500 mr-3"></i>
                   {{ selectedVertical }}
                 </h3>
                 <p class="text-gray-600">
                   {{ selectedVerticalProducts?.length || 0 }} 
                   {{ selectedVertical === 'РҐРёС‚С‹' ? 'С…РёС‚РѕРІ РїСЂРѕРґР°Р¶' : 'Р±Р»СЋРґ РІ СЌС‚РѕР№ РєР°С‚РµРіРѕСЂРёРё' }}
                 </p>
               </div>
              
              <!-- РЎРµС‚РєР° С‚РѕРІР°СЂРѕРІ -->
              <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <transition-group name="fade" tag="div" class="contents">
              <div
                v-for="product in (selectedVerticalProducts || [])"
                :key="product.id"
                    class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
                    @click="openProductModal(product)"
                  >
                    <!-- РР·РѕР±СЂР°Р¶РµРЅРёРµ С‚РѕРІР°СЂР° -->
                    <div class="relative h-48 overflow-hidden">
                      <img 
                        :src="product.image" 
                        :alt="product.name" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div class="absolute top-4 right-4 flex flex-col space-y-2">
                        <!-- Р—РІРµР·РґРѕС‡РєР° С…РёС‚РѕРІ -->
                        <div v-if="product.hit" class="bg-yellow-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <i class="fa-solid fa-star text-white text-sm"></i>
                </div>
                        <!-- Р¦РµРЅР° -->
                        <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span class="text-orange-600 font-bold text-sm">{{ formatPrice(product.price) }}</span>
                  </div>
                  </div>
                      <!-- РРєРѕРЅРєР° РґР»СЏ РїСЂРѕСЃРјРѕС‚СЂР° РґРµС‚Р°Р»РµР№ -->
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <i class="fa-solid fa-eye text-orange-600 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <!-- РљРѕРЅС‚РµРЅС‚ РєР°СЂС‚РѕС‡РєРё СЃ flex-grow -->
                    <div class="p-6 flex flex-col flex-grow">
                      <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                        {{ product.name }}
                      </h4>
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
                      
                      <!-- РљРЅРѕРїРєР° Р·Р°РєР°Р·Р° РІСЃРµРіРґР° РІРЅРёР·Сѓ -->
                      <button 
                        @click.stop.prevent="add(product)" 
                        class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
                      >
                        <i class="fa-solid fa-plus"></i>
                        <span>Р—Р°РєР°Р·Р°С‚СЊ</span>
                      </button>
                </div>
              </div>
            </transition-group>
          </div>
              
              <!-- РЎРѕРѕР±С‰РµРЅРёРµ, РµСЃР»Рё С‚РѕРІР°СЂС‹ РЅРµ РЅР°Р№РґРµРЅС‹ -->
              <div v-if="(selectedVerticalProducts || []).length === 0" class="text-center py-12">
                <i class="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-500 mb-2">РўРѕРІР°СЂС‹ РЅРµ РЅР°Р№РґРµРЅС‹</h3>
                <p class="text-gray-400">РџРѕРїСЂРѕР±СѓР№С‚Рµ РёР·РјРµРЅРёС‚СЊ РїРѕРёСЃРєРѕРІС‹Р№ Р·Р°РїСЂРѕСЃ РёР»Рё РІС‹Р±СЂР°С‚СЊ РґСЂСѓРіСѓСЋ РєР°С‚РµРіРѕСЂРёСЋ</p>
              </div>
            </div>
        </div>
        </div>
        </div>

        <!-- РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ РґР»СЏ РґРµС‚Р°Р»СЊРЅРѕРіРѕ РїСЂРѕСЃРјРѕС‚СЂР° С‚РѕРІР°СЂР° -->
        <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeProductModal">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="grid md:grid-cols-2 gap-0">
              <!-- Р›РµРІР°СЏ С‡Р°СЃС‚СЊ - РёР·РѕР±СЂР°Р¶РµРЅРёРµ -->
              <div class="relative h-64 md:h-auto">
                <img 
                  :src="selectedProduct.image" 
                  :alt="selectedProduct.name" 
                  class="w-full h-full object-cover rounded-l-2xl"
                />
                <div class="absolute top-4 right-4 flex flex-col space-y-2">
                  <!-- Р—РІРµР·РґРѕС‡РєР° С…РёС‚РѕРІ -->
                  <div v-if="selectedProduct.hit" class="bg-yellow-500/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <i class="fa-solid fa-star text-white text-lg"></i>
                  </div>
                  <!-- Р¦РµРЅР° -->
                  <div class="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span class="text-orange-600 font-bold text-lg">{{ formatPrice(selectedProduct.price) }}</span>
                  </div>
                </div>
                <!-- РљРЅРѕРїРєР° Р·Р°РєСЂС‹С‚РёСЏ -->
                <button 
                  @click="closeProductModal"
                  class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition"
                >
                  <i class="fa-solid fa-times text-gray-600"></i>
                </button>
              </div>
              
              <!-- РџСЂР°РІР°СЏ С‡Р°СЃС‚СЊ - РёРЅС„РѕСЂРјР°С†РёСЏ -->
              <div class="p-8 flex flex-col justify-between">
                <div>
                  <div class="flex items-center mb-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mr-3">
                      {{ selectedProduct.category }}
                    </span>
                    <span v-if="selectedProduct.hit" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <i class="fa-solid fa-star mr-1"></i>
                      РҐРёС‚ РїСЂРѕРґР°Р¶
                    </span>
                  </div>
                  
                  <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ selectedProduct.name }}</h2>
                  
                  <p class="text-gray-600 text-lg leading-relaxed mb-6">{{ selectedProduct.description }}</p>
                  
                  <div class="flex items-center space-x-4 mb-6">
                    <div class="text-3xl font-bold text-orange-600">{{ formatPrice(selectedProduct.price) }}</div>
                    <div class="text-sm text-gray-500">Р·Р° РїРѕСЂС†РёСЋ</div>
                  </div>
                </div>
                
                <!-- РљРЅРѕРїРєРё РґРµР№СЃС‚РІРёР№ -->
                <div class="space-y-4">
                  <button 
                    @click="addToCartFromModal"
                    class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 text-lg"
                  >
                    <i class="fa-solid fa-plus"></i>
                    <span>Р”РѕР±Р°РІРёС‚СЊ РІ РєРѕСЂР·РёРЅСѓ</span>
                  </button>
                  
                  <button 
                    @click="addToCartAndGoToCheckout"
                    class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 text-lg"
                  >
                    <i class="fa-solid fa-shopping-cart"></i>
                    <span>Р—Р°РєР°Р·Р°С‚СЊ СЃРµР№С‡Р°СЃ</span>
                  </button>
                </div>
          </div>
        </div>
        </div>
        </div>
      </section>
      <!-- РЎС‚Р°С‚РёСЃС‚РёРєР°: РѕРїС‹С‚, РєР°С‚РµРіРѕСЂРёРё Рё С‚РѕРІР°СЂС‹ СЃ РёРЅС‚РµСЂР°РєС‚РёРІРЅРѕР№ РєР°СЂСѓСЃРµР»СЊСЋ -->
      <section class="py-12" style="background-color:#f9f4e5;">
        <div class="max-w-6xl mx-auto px-4">
          <!-- Р—Р°РіРѕР»РѕРІРѕРє СЃРµРєС†РёРё -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Р­С‚Рѕ РІРєСѓСЃРЅРѕ!</h2>
            <p class="text-gray-600">РќР°С€Р° СЃС‚Р°С‚РёСЃС‚РёРєР° Рё РїРѕРїСѓР»СЏСЂРЅС‹Рµ РєР°С‚РµРіРѕСЂРёРё</p>
          </div>
          
          <!-- РРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ РєР°СЂСѓСЃРµР»СЊ РєР°СЂС‚РѕС‡РµРє -->
          <div 
            class="relative cursor-grab select-none"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseLeave"
            :class="{ 'cursor-grabbing': isDragging }"
          >
            <!-- РљРѕРЅС‚РµР№РЅРµСЂ РєР°СЂС‚РѕС‡РµРє -->
            <div class="overflow-hidden">
              <div 
                class="flex transition-transform duration-1000 ease-out"
                :style="{ 
                  transform: 'translateX(' + carouselPosition + '%)',
                  transition: isDragging ? 'none' : 'transform 1s ease-out'
                }"
              >
                <!-- Р’СЃРµ РєР°СЂС‚РѕС‡РєРё РІ С†РёРєР»Рµ (РІРєР»СЋС‡Р°СЏ "Р­С‚Рѕ РІРєСѓСЃРЅРѕ!") -->
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
          
          <!-- РђРІС‚РѕРїСЂРѕРєСЂСѓС‚РєР° РїРµСЂРµРєР»СЋС‡Р°С‚РµР»СЊ -->
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
              {{ isAutoRotating ? 'РџР°СѓР·Р° Р°РІС‚РѕРїСЂРѕРєСЂСѓС‚РєРё' : 'Р—Р°РїСѓСЃС‚РёС‚СЊ Р°РІС‚РѕРїСЂРѕРєСЂСѓС‚РєСѓ' }}
            </button>
          </div>
          
          <!-- РџРѕРґСЃРєР°Р·РєР° -->
          <div class="text-center mt-2">
            <p class="text-sm text-gray-500">
              <i class="fa-solid fa-infinity mr-1"></i>
              РџРµСЂРµС‚Р°С‰РёС‚Рµ РјС‹С€СЊСЋ РґР»СЏ РїСЂРѕРєСЂСѓС‚РєРё вЂў Р‘РµСЃРєРѕРЅРµС‡РЅРѕРµ С†РёРєР»РёС‡РµСЃРєРѕРµ РґРІРёР¶РµРЅРёРµ
            </p>
          </div>
        </div>
      </section>
      <!-- РЎР°РјРѕРµ РїРѕРїСѓР»СЏСЂРЅРѕРµ -->
      <section class="py-12" style="background-color:#ffebb7;">
        <div class="max-w-6xl mx-auto mb-6">
          <h2 class="text-2xl font-bold">РЎР°РјРѕРµ РїРѕРїСѓР»СЏСЂРЅРѕРµ</h2>
        </div>
        <!-- РЎРµС‚РєР° РєР°СЂС‚РѕС‡РµРє СЃР°РјС‹С… РїРѕРїСѓР»СЏСЂРЅС‹С… С‚РѕРІР°СЂРѕРІ (С‚РѕРївЂ‘3) -->
        <div class="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="product in popularProducts"
            :key="product.id"
            class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1 h-full"
          >
            <!-- РєСЂСѓРіР»Р°СЏ РєР°СЂС‚РёРЅРєР° С‚РѕРІР°СЂР° -->
            <div class="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4">
              <img :src="product.image" alt="" class="w-full h-full object-cover" loading="lazy" />
            </div>
            
            <!-- РљРѕРЅС‚РµРЅС‚ РєР°СЂС‚РѕС‡РєРё СЃ flex-grow -->
            <div class="flex flex-col items-center flex-grow w-full">
            <h3 class="font-semibold text-lg mb-2 text-center text-red-700">{{ product.name }}</h3>
              <p class="text-sm text-gray-600 mb-4 text-center flex-grow">{{ product.description }}</p>
            </div>
            
            <!-- РљРЅРѕРїРєР° Рё С†РµРЅР° РІСЃРµРіРґР° РІРЅРёР·Сѓ -->
            <div class="w-full flex flex-col items-center mt-auto">
              <p class="text-red-600 font-bold text-lg mb-2">{{ formatPrice(product.price) }}</p>
              <button @click.stop.prevent="add(product)" class="w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition text-center">Р—Р°РєР°Р·Р°С‚СЊ</button>
            </div>
          </div>
        </div>
      </section>
      <!-- РћС‚Р·С‹РІС‹ -->
      <section class="py-12 bg-red-100">
        <h2 class="text-2xl font-bold mb-6 text-center">РћС‚Р·С‹РІС‹</h2>
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
    // Р’СЃРµ РѕР±СЉСЏРІР»РµРЅРёСЏ РїРµСЂРµРјРµРЅРЅС‹С… РІ РЅР°С‡Р°Р»Рµ
    const seoData = ref(null);
    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const selectedCategory = ref('Р’СЃРµ');
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
    
    // Р—Р°РіСЂСѓР¶Р°РµРј SEO РґР°РЅРЅС‹Рµ
    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        seoData.value = response.data;
      } catch (e) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё SEO РґР°РЅРЅС‹С…:', e);
      }
    }
    
    // SEO РјРµС‚Р°-С‚РµРіРё РґР»СЏ РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†С‹ (СѓРїСЂРѕС‰РµРЅРЅР°СЏ РІРµСЂСЃРёСЏ Р±РµР· VueUseHead)
    function updatePageTitle() {
      if (seoData.value) {
        const site = seoData.value.site || {};
        const pages = seoData.value.pages || {};
        const home = pages.home || {};
        const title = home.title || site.title || 'РРЅС‚РµСЂРЅРµС‚вЂ‘РјР°РіР°Р·РёРЅ СЃСѓС€Рё Рё РїРёС†С†С‹ | Р”РѕСЃС‚Р°РІРєР° СЃСѓС€Рё Рё РїРёС†С†С‹ | РўРѕС‡РєР° СЃСѓС€Рё Рё РїРёС†С†С‹';
        document.title = title;
      }
    }

    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products');
        products.value = res.data;
        // С„РѕСЂРјРёСЂСѓРµРј РЅР°Р±РѕСЂ СЃР»Р°Р№РґРѕРІ РґР»СЏ Р±Р°РЅРЅРµСЂР°
        heroSlides.value = products.value.map(p => ({
          heading: p.name,
          subheading: p.description,
          image: p.image
        }));
      } catch (e) {
        console.error('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ СЃРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ', e);
      } finally {
        loading.value = false;
      }
    }

    async function fetchCategories() {
      try {
        const res = await axios.get('/api/categories');
        // РЎРѕС…СЂР°РЅСЏРµРј РїРѕР»РЅС‹Рµ РґР°РЅРЅС‹Рµ РєР°С‚РµРіРѕСЂРёР№
        categoriesData.value = res.data;
        // РџСЂРµРѕР±СЂР°Р·СѓРµРј РјР°СЃСЃРёРІ РѕР±СЉРµРєС‚РѕРІ РєР°С‚РµРіРѕСЂРёР№ РІ РјР°СЃСЃРёРІ СЃС‚СЂРѕРє РґР»СЏ СЃРѕРІРјРµСЃС‚РёРјРѕСЃС‚Рё
        categories.value = ['Р’СЃРµ', ...res.data.map(cat => cat.name)];
      } catch (e) {
        console.error('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ СЃРїРёСЃРѕРє РєР°С‚РµРіРѕСЂРёР№', e);
        // Fallback Рє СЃС‚Р°С‚РёС‡РµСЃРєРёРј РєР°С‚РµРіРѕСЂРёСЏРј
        categories.value = ['Р’СЃРµ', 'Р РѕР»Р»С‹', 'РџРёС†С†Р°', 'РЎР°Р»Р°С‚С‹', 'РќР°РїРёС‚РєРё'];
        categoriesData.value = [];
      }
    }

    // РђРЅРёРјР°С†РёСЏ РґРѕР¶РґСЏ РёР· СЃСѓС€РёРєРѕРІ Рё РїРёС†С†
    const foodEmojis = ['рџЌЈ', 'рџЌ±', 'рџЌ™', 'рџЌ', 'рџЌҐ', 'рџЌњ', 'рџЌІ', 'рџЌ•', 'рџЌќ', 'рџЌ›', 'рџҐџ', 'рџЌ¤', 'рџЌў', 'рџЌЎ', 'рџҐў'];
    const foodTypes = ['sushi', 'pizza'];
    const foodSizes = ['small', 'medium', 'large'];
    
    function createFoodRain() {
      const rainContainer = document.getElementById('food-rain');
      if (!rainContainer) return;
      
      // РћС‡РёС‰Р°РµРј РєРѕРЅС‚РµР№РЅРµСЂ
      rainContainer.innerHTML = '';
      
      // РЎРѕР·РґР°РµРј 50 СЌР»РµРјРµРЅС‚РѕРІ РµРґС‹
      for (let i = 0; i < 50; i++) {
        const foodItem = document.createElement('div');
        const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
        const randomSize = foodSizes[Math.floor(Math.random() * foodSizes.length)];
        
        foodItem.textContent = randomEmoji;
        foodItem.className = `food-item ${randomType}-item ${randomSize}`;
        
        // РЎР»СѓС‡Р°Р№РЅР°СЏ РїРѕР·РёС†РёСЏ РїРѕ РіРѕСЂРёР·РѕРЅС‚Р°Р»Рё
        foodItem.style.left = Math.random() * 100 + '%';
        
        // РЎР»СѓС‡Р°Р№РЅР°СЏ Р·Р°РґРµСЂР¶РєР° Р°РЅРёРјР°С†РёРё
        foodItem.style.animationDelay = Math.random() * 5 + 's';
        
        // РЎР»СѓС‡Р°Р№РЅР°СЏ РґР»РёС‚РµР»СЊРЅРѕСЃС‚СЊ Р°РЅРёРјР°С†РёРё
        const duration = 3 + Math.random() * 3; // РѕС‚ 3 РґРѕ 6 СЃРµРєСѓРЅРґ
        foodItem.style.animationDuration = duration + 's';
        
        rainContainer.appendChild(foodItem);
      }
    }
    
    function startFoodRain() {
      createFoodRain();
      
      // РћР±РЅРѕРІР»СЏРµРј РґРѕР¶РґСЊ РєР°Р¶РґС‹Рµ 10 СЃРµРєСѓРЅРґ РґР»СЏ СЂР°Р·РЅРѕРѕР±СЂР°Р·РёСЏ
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
      
      // Р—Р°РїСѓСЃРєР°РµРј СЂРѕС‚Р°С†РёСЋ РєР°СЂС‚РѕС‡РµРє РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С…
      setTimeout(() => {
        startCardRotation();
        startAutoRotate(); // Р—Р°РїСѓСЃРєР°РµРј РЅРѕРІСѓСЋ Р°РІС‚РѕРїСЂРѕРєСЂСѓС‚РєСѓ
      }, 2000);
      
      // Р—Р°РїСѓСЃРєР°РµРј РґРѕР¶РґСЊ РёР· СЃСѓС€РёРєРѕРІ Рё РїРёС†С†
      setTimeout(() => {
        startFoodRain();
      }, 1000);
    });

    // РћСЃС‚Р°РЅР°РІР»РёРІР°РµРј СЂРѕС‚Р°С†РёСЋ РїСЂРё СЂР°Р·РјРѕРЅС‚РёСЂРѕРІР°РЅРёРё РєРѕРјРїРѕРЅРµРЅС‚Р°
    onUnmounted(() => {
      stopCardRotation();
      stopAutoRotate();
    });


    // Р·Р°РіСЂСѓР¶Р°РµРј РѕС‚Р·С‹РІС‹ СЃ СЃРµСЂРІРµСЂР°
    async function fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
        reviews.value = res.data;
      } catch (e) {
        console.error('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РѕС‚Р·С‹РІС‹', e);
      }
    }
    onMounted(fetchReviews);
    function add(product) {
      addToCart(product);
    }
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    // РІС‹РґРµР»СЏРµРј СѓРЅРёРєР°Р»СЊРЅС‹Рµ РєР°С‚РµРіРѕСЂРёРё
    const uniqueCategories = computed(() => {
      const set = new Set();
      products.value.forEach(p => {
        if (p.category_name) set.add(p.category_name);
      });
      return ['Р’СЃРµ', ...Array.from(set)];
    });
    const filteredProducts = computed(() => {
      return products.value.filter(p => {
        const matchesCategory = selectedCategory.value === 'Р’СЃРµ' || p.category_name === selectedCategory.value;
        const q = searchQuery.value.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
    });
    // Р’С‹Р±РёСЂР°РµРј РёР·РѕР±СЂР°Р¶РµРЅРёРµ РґР»СЏ РіР»Р°РІРЅРѕРіРѕ Р±Р°РЅРЅРµСЂР° (СЃРµС‚Р°), РµСЃР»Рё РµСЃС‚СЊ
    const heroImage = computed(() => {
      const setProduct = products.value.find(p => p.category_name === 'РЎРµС‚С‹');
      return setProduct ? setProduct.image : '';
    });

    // РЎР»Р°Р№РґС‹ РґР»СЏ Р±Р°РЅРЅРµСЂР°: Р·Р°РїРѕР»РЅРёРј РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё РїСЂРѕРґСѓРєС‚РѕРІ
    const currentSlide = computed(() => heroSlides.value[currentSlideIndex.value] || {});
    // РџСЂРё Р·Р°РіСЂСѓР·РєРµ РїСЂРѕРґСѓРєС‚РѕРІ С„РѕСЂРјРёСЂСѓРµРј СЃР»Р°Р№РґС‹ (Р·Р°РїРѕР»РЅСЏРµС‚СЃСЏ РІ fetchProducts)
    // Р—Р°РїСѓСЃРєР°РµРј Р°РІС‚РѕРїРµСЂРµРєР»СЋС‡РµРЅРёРµ СЃР»Р°Р№РґРѕРІ
    onMounted(() => {
      setInterval(() => {
        if (heroSlides.value.length > 0) {
          currentSlideIndex.value = (currentSlideIndex.value + 1) % heroSlides.value.length;
        }
      }, 7000);
    });

    // СЃСЃС‹Р»РєР° РЅР° СЃРµРєС†РёСЋ РјРµРЅСЋ РґР»СЏ РїР»Р°РІРЅРѕР№ РїСЂРѕРєСЂСѓС‚РєРё
    function scrollToMenu() {
      if (menuSection.value) {
        menuSection.value.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ РґР»СЏ С‚РѕРІР°СЂР°
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
    // Р—Р°РіСЂСѓР¶Р°РµРј РґРёРЅР°РјРёС‡РµСЃРєРёРµ Р±Р»РѕРєРё РєР°С‚РµРіРѕСЂРёР№
    async function fetchCategoryBlocks() {
      try {
        const response = await axios.get('/api/category-blocks');
        categoryBlocks.value = response.data;
      } catch (e) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё Р±Р»РѕРєРѕРІ РєР°С‚РµРіРѕСЂРёР№:', e);
        // Fallback Рє СЃС‚Р°С‚РёС‡РµСЃРєРёРј РґР°РЅРЅС‹Рј
        categoryBlocks.value = [
          {
            id: 'fallback-1',
            name: 'Р РѕР»Р»С‹',
            description: 'Р‘РѕР»СЊС€РѕР№ РІС‹Р±РѕСЂ С‚СЂР°РґРёС†РёРѕРЅРЅС‹С… Рё Р°РІС‚РѕСЂСЃРєРёС… СЂРѕР»Р»РѕРІ',
            image: 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'
          },
          {
            id: 'fallback-2',
            name: 'РЎСѓС€Рё',
            description: 'РљР»Р°СЃСЃРёС‡РµСЃРєРёРµ РЅРёРіРёСЂРё СЃ РЅРµР¶РЅРµР№С€РµР№ СЂС‹Р±РѕР№',
            image: 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91'
          },
          {
            id: 'fallback-3',
            name: 'РЎРµС‚С‹',
            description: 'РЎРµС‚С‹ РґР»СЏ РґСЂСѓР¶РµСЃРєРёС… РєРѕРјРїР°РЅРёР№ Рё СЃРµРјРµР№РЅС‹С… РІРµС‡РµСЂРѕРІ',
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754'
          }
        ];
      }
    }
    // Р”Р°РЅРЅС‹Рµ РґР»СЏ СЃРµРєС†РёРё В«РЎС‚Р°С‚РёСЃС‚РёРєР°В»
    const statsCards = [
      { title: '5+ Р»РµС‚', subtitle: 'РѕРїС‹С‚Р° РґРѕСЃС‚Р°РІРєРё', color: 'bg-blue-600' },
      { title: '10+ С‚РѕРІР°СЂРѕРІ', subtitle: 'РІ РјРµРЅСЋ', color: 'bg-green-600' },
      { title: '1000+ Р·Р°РєР°Р·РѕРІ', subtitle: 'РІС‹РїРѕР»РЅРµРЅРѕ', color: 'bg-orange-500' }
    ];
    // РЎС‚Р°С‚РёС‡РµСЃРєРёРµ РѕС‚Р·С‹РІС‹ (РґР»СЏ РїСЂРёРјРµСЂР°)
    const staticTestimonials = [
      { name: 'РђСЂРёРЅР°', role: 'РџРѕСЃС‚РѕСЏРЅРЅС‹Р№ РєР»РёРµРЅС‚', quote: 'Р›СѓС‡С€РёРµ СЃСѓС€Рё РІ РіРѕСЂРѕРґРµ! РЎРІРµР¶РµСЃС‚СЊ Рё РІРєСѓСЃ РЅР° РІС‹СЃРѕС‚Рµ.', image: '/testimonial1.png', rating: 5 },
      { name: 'РњР°СЂРёСЏ', role: 'Р›СЋР±РёС‚РµР»СЊ СЂРѕР»Р»РѕРІ', quote: 'РћС‡РµРЅСЊ РІРєСѓСЃРЅРѕ Рё Р±С‹СЃС‚СЂРѕ. Р’СЃРµРіРґР° Р·Р°РєР°Р·С‹РІР°СЋ С‚РѕР»СЊРєРѕ Р·РґРµСЃСЊ.', image: '/testimonial2.png', rating: 4 }
    ];

    // РљРѕРјРїРѕРЅСѓРµРј РѕС‚Р·С‹РІС‹: РґРёРЅР°РјРёС‡РµСЃРєРёРµ РёР· Р±Р°Р·С‹ + СЃС‚Р°С‚РёС‡РµСЃРєРёРµ
    const computedTestimonials = computed(() => {
      // РїСЂРµРѕР±СЂР°Р·СѓРµРј РґРёРЅР°РјРёС‡РµСЃРєРёРµ РѕС‚Р·С‹РІС‹ РІ С„РѕСЂРјР°С‚ testimonial
      const dyn = reviews.value.map(r => {
        return {
          name: r.name || 'РђРЅРѕРЅРёРј',
          role: r.phone ? `РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ ${r.phone}` : 'Р“РѕСЃС‚СЊ',
          quote: r.comment || '',
          // СЃР»СѓС‡Р°Р№РЅРѕ РІС‹Р±РёСЂР°РµРј РѕРґРЅРѕ РёР· РґРІСѓС… РёР·РѕР±СЂР°Р¶РµРЅРёР№ РґР»СЏ Р°РЅРѕРЅРёРјРЅРѕРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
          image: Math.random() > 0.5 ? '/testimonial1.png' : '/testimonial2.png',
          rating: r.rating || 0
        };
      });
      return dyn.concat(staticTestimonials);
    });
    // РЎР°РјС‹Рµ РїРѕРїСѓР»СЏСЂРЅС‹Рµ С‚РѕРІР°СЂС‹ (РёСЃРїРѕР»СЊР·СѓРµРј С‚РѕРївЂ‘3 РїРѕ С†РµРЅРµ РєР°Рє РїСЂРёР±Р»РёР¶РµРЅРёРµ Рє В«СЃР°РјС‹Рј РїРѕРєСѓРїР°РµРјС‹РјВ»)
    const popularProducts = computed(() => {
      // СЃРѕР·РґР°С‘Рј РєРѕРїРёСЋ РјР°СЃСЃРёРІР°, С‡С‚РѕР±С‹ РЅРµ РјСѓС‚РёСЂРѕРІР°С‚СЊ РёСЃС…РѕРґРЅС‹Рµ РґР°РЅРЅС‹Рµ
      const arr = products.value.slice().filter(p => p.available !== false);
      // СЃРѕСЂС‚РёСЂСѓРµРј РїРѕ РєРѕР»РёС‡РµСЃС‚РІСѓ РїРѕРєСѓРїРѕРє (РїРѕ СѓР±С‹РІР°РЅРёСЋ). Р•СЃР»Рё РїРѕР»Рµ purchases РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚, СЃС‡РёС‚Р°РµРј РµРіРѕ СЂР°РІРЅС‹Рј РЅСѓР»СЋ
      arr.sort((a, b) => {
        const ap = a.purchases || 0;
        const bp = b.purchases || 0;
        return bp - ap;
      });
      return arr.slice(0, 3);
    });

    // Р”Р»СЏ РІРµСЂС‚РёРєР°Р»СЊРЅРѕРіРѕ РјРµРЅСЋ
    const verticalCategories = computed(() => categories.value.filter(cat => cat !== 'Р’СЃРµ'));
    
    // РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРё РІС‹Р±РёСЂР°РµРј РїРµСЂРІСѓСЋ РєР°С‚РµРіРѕСЂРёСЋ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё
    watch(verticalCategories, (newCategories) => {
      if (newCategories.length > 0 && !selectedVertical.value) {
        selectedVertical.value = newCategories[0];
      }
    }, { immediate: true });
    
    // РІС‹Р±СЂР°РЅРЅР°СЏ РєР°С‚РµРіРѕСЂРёСЏ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
    const selectedVerticalItem = computed(() => {
      const cat = selectedVertical.value || (verticalCategories.value.length > 0 ? verticalCategories.value[0] : null);
      if (!cat) return null;
      return products.value.find(p => p.category_name === cat) || null;
    });
    // РЎРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ РІС‹Р±СЂР°РЅРЅРѕР№ РІРµСЂС‚РёРєР°Р»СЊРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё
    const selectedVerticalProducts = computed(() => {
      const q = searchQuery.value.toLowerCase().trim();
      // Р•СЃР»Рё РµСЃС‚СЊ РїРѕРёСЃРєРѕРІС‹Р№ Р·Р°РїСЂРѕСЃ, РІРѕР·РІСЂР°С‰Р°РµРј РІСЃРµ С‚РѕРІР°СЂС‹, РїРѕРґС…РѕРґСЏС‰РёРµ РїРѕРґ РїРѕРёСЃРє РїРѕ РёРјРµРЅРё РёР»Рё РѕРїРёСЃР°РЅРёСЋ
      if (q) {
        return products.value.filter(p => {
          return (
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        });
      }
      // Р•СЃР»Рё РІС‹Р±СЂР°РЅС‹ "РҐРёС‚С‹", РїРѕРєР°Р·С‹РІР°РµРј С‚РѕР»СЊРєРѕ С‚РѕРІР°СЂС‹ СЃ hit: true
      if (selectedVertical.value === 'РҐРёС‚С‹') {
        return products.value.filter(p => p.hit === true);
      }
      // Р’ РїСЂРѕС‚РёРІРЅРѕРј СЃР»СѓС‡Р°Рµ РїРѕРєР°Р·С‹РІР°РµРј С‚РѕРІР°СЂС‹ РІС‹Р±СЂР°РЅРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё
      const cat = selectedVertical.value || (verticalCategories.value.length > 0 ? verticalCategories.value[0] : null);
      if (!cat) return [];
      // РСЃРїРѕР»СЊР·СѓРµРј category_name РІРјРµСЃС‚Рѕ category, С‚Р°Рє РєР°Рє РІ РґР°РЅРЅС‹С… С‚РѕРІР°СЂРѕРІ РµСЃС‚СЊ РїРѕР»Рµ category_name
      return products.value.filter(p => p.category_name === cat);
    });

    // РЎС‚Р°С‚РёСЃС‚РёРєР° РґР»СЏ Р±Р»РѕРєР° "РћРїС‹С‚, С‚РѕРІР°СЂС‹, Р·Р°РєР°Р·С‹".
    // РЎРѕР·РґР°С‘Рј СЃРїРёСЃРѕРє РєР°СЂС‚РѕС‡РµРє СЃ РґРёРЅР°РјРёС‡РµСЃРєРёРј РїРѕРґСЃС‡С‘С‚РѕРј РєРѕР»РёС‡РµСЃС‚РІР° С‚РѕРІР°СЂРѕРІ РїРѕ РєР°Р¶РґРѕР№ РєР°С‚РµРіРѕСЂРёРё.
    const allStatsCards = computed(() => {
      // Р¤РѕСЂРјРёСЂСѓРµРј РєР°СЂС‚РѕС‡РєРё РґР»СЏ РєР°Р¶РґРѕР№ СѓРЅРёРєР°Р»СЊРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё (Р±РµР· 'Р’СЃРµ')
      return categories.value
        .filter(cat => cat !== 'Р’СЃРµ')
        .map(cat => {
          const count = products.value.filter(p => p.category_name === cat).length;
          // РќР°С…РѕРґРёРј РёР·РѕР±СЂР°Р¶РµРЅРёРµ РґР»СЏ РєР°С‚РµРіРѕСЂРёРё РёР· API РєР°С‚РµРіРѕСЂРёР№
          const categoryData = categoriesData.value.find(c => c.name === cat);
          return {
            name: cat,
            count: `${count}+`,
            description: 'С‚РѕРІР°СЂРѕРІ',
            image: categoryData ? categoryData.image : 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'
          };
        });
    });

    // РРЅРґРµРєСЃ РґР»СЏ РїРµСЂРµРєР»СЋС‡РµРЅРёСЏ РєР°СЂС‚РѕС‡РµРє
    const currentCardIndex = ref(0);
    
    // РџРѕРєР°Р·С‹РІР°РµРј РјР°РєСЃРёРјСѓРј 3 РєР°СЂС‚РѕС‡РєРё СЃ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊСЋ РїРµСЂРµРєР»СЋС‡РµРЅРёСЏ
    const statsCardsMenu = computed(() => {
      const cards = allStatsCards.value;
      if (cards.length <= 3) {
        return cards;
      }
      
      // Р•СЃР»Рё РєР°СЂС‚РѕС‡РµРє Р±РѕР»СЊС€Рµ 3, РїРѕРєР°Р·С‹РІР°РµРј РїРѕ 3 СЃ РїРµСЂРµРєР»СЋС‡РµРЅРёРµРј
      const startIndex = currentCardIndex.value;
      const endIndex = Math.min(startIndex + 3, cards.length);
      let result = cards.slice(startIndex, endIndex);
      
      // Р•СЃР»Рё РЅРµ С…РІР°С‚Р°РµС‚ РєР°СЂС‚РѕС‡РµРє РґРѕ 3, РґРѕР±Р°РІР»СЏРµРј СЃ РЅР°С‡Р°Р»Р°
      if (result.length < 3 && cards.length > 3) {
        const remaining = 3 - result.length;
        result = result.concat(cards.slice(0, remaining));
      }
      
      return result;
    });

    // Р’РёРґРёРјС‹Рµ РєР°СЂС‚РѕС‡РєРё РґР»СЏ РєР°СЂСѓСЃРµР»Рё (РІРєР»СЋС‡Р°СЏ "Р­С‚Рѕ РІРєСѓСЃРЅРѕ!")
    const visibleStatsCards = computed(() => {
      const cards = allStatsCards.value;
      const startIndex = currentCardIndex.value;
      const endIndex = Math.min(startIndex + 3, cards.length);
      return cards.slice(startIndex, endIndex);
    });

    // РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРµ РїРµСЂРµРєР»СЋС‡РµРЅРёРµ РєР°СЂС‚РѕС‡РµРє РєР°Р¶РґС‹Рµ 5 СЃРµРєСѓРЅРґ
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

    // РРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ РєР°СЂСѓСЃРµР»СЊ СЃ РїРµСЂРµС‚Р°СЃРєРёРІР°РЅРёРµРј
    const carouselPosition = ref(0);
    const isDragging = ref(false);
    const startX = ref(0);
    const isAutoRotating = ref(true);
    
    // РЎРѕР·РґР°РµРј Р±РµСЃРєРѕРЅРµС‡РЅС‹Р№ РјР°СЃСЃРёРІ РєР°СЂС‚РѕС‡РµРє (РґСѓР±Р»РёСЂСѓРµРј РґР»СЏ Р±РµСЃРєРѕРЅРµС‡РЅРѕРіРѕ РєСЂСѓР¶РµРЅРёСЏ)
    const infiniteStatsCards = computed(() => {
      const cards = allStatsCards.value;
      if (cards.length === 0) return [];
      
      // Р”РѕР±Р°РІР»СЏРµРј РєР°СЂС‚РѕС‡РєСѓ "Р­С‚Рѕ РІРєСѓСЃРЅРѕ!" РІ РЅР°С‡Р°Р»Рѕ РєР°Р¶РґРѕРіРѕ С†РёРєР»Р°
      const mainCard = {
        name: "Р­С‚Рѕ РІРєСѓСЃРЅРѕ!",
        count: "12k",
        description: "Р•Р¶РµРґРЅРµРІРЅРѕ РѕР±СЃР»СѓР¶РёРІР°РµРј РєР»РёРµРЅС‚РѕРІ",
        image: "https://images.unsplash.com/photo-1607301405418-780ee5e6dd10",
        isMain: true
      };
      
      // РЎРѕР·РґР°РµРј РјРЅРѕРіРѕ РєРѕРїРёР№ РґР»СЏ Р±РµСЃРєРѕРЅРµС‡РЅРѕРіРѕ РєСЂСѓР¶РµРЅРёСЏ
      const copies = [];
      for (let i = 0; i < 20; i++) { // РЈРІРµР»РёС‡РёРІР°РµРј РєРѕР»РёС‡РµСЃС‚РІРѕ РєРѕРїРёР№
        copies.push(mainCard, ...cards);
      }
      return copies;
    });
    
    // РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРµ РєСЂСѓР¶РµРЅРёРµ СЃ С†РёРєР»РёС‡РµСЃРєРѕР№ Р»РѕРіРёРєРѕР№
    let lastTime = 0;
    const scrollSpeed = 25; // РїРёРєСЃРµР»РµР№ РІ СЃРµРєСѓРЅРґСѓ
    const scrollInterval = 2000; // РёРЅС‚РµСЂРІР°Р» РјРµР¶РґСѓ РїРµСЂРµС…РѕРґР°РјРё
    
    function startAutoRotate() {
      isAutoRotating.value = true;
      
      function animate(currentTime) {
        if (!isAutoRotating.value) return;
        
        if (currentTime - lastTime >= scrollInterval) {
          carouselPosition.value -= 25; // РџРµСЂРµРјРµС‰Р°РµРј РЅР° 25% (РѕРґРЅР° РєР°СЂС‚РѕС‡РєР°)
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
    
    // РћР±СЂР°Р±РѕС‚С‡РёРєРё РїРµСЂРµС‚Р°СЃРєРёРІР°РЅРёСЏ
    function onMouseDown(event) {
      isDragging.value = true;
      startX.value = event.clientX;
    }
    
    function onMouseMove(event) {
      if (!isDragging.value) return;
      
      const deltaX = event.clientX - startX.value;
      const sensitivity = 0.2; // РЈРјРµРЅСЊС€Р°РµРј С‡СѓРІСЃС‚РІРёС‚РµР»СЊРЅРѕСЃС‚СЊ
      carouselPosition.value += deltaX * sensitivity;
      
      startX.value = event.clientX;
    }
    
    function onMouseUp() {
      if (!isDragging.value) return;
      
      isDragging.value = false;
      
      // РџСЂРёРІСЏР·С‹РІР°РµРј Рє Р±Р»РёР¶Р°Р№С€РµР№ РїРѕР·РёС†РёРё РєР°СЂС‚РѕС‡РєРё
      const cardWidth = 25; // 25% РЅР° РєР°СЂС‚РѕС‡РєСѓ
      const targetPosition = Math.round(carouselPosition.value / cardWidth) * cardWidth;
      
      // РџР»Р°РІРЅРѕ РїРµСЂРµС…РѕРґРёРј Рє С†РµР»РµРІРѕР№ РїРѕР·РёС†РёРё
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
        // РЈР±РёСЂР°РµРј Р»РѕРіРёРєСѓ РІРѕР·РІСЂР°С‚Р° Рє РЅР°С‡Р°Р»Сѓ - РєР°СЂСѓСЃРµР»СЊ Р±РµСЃРєРѕРЅРµС‡РЅР°СЏ
      }
      
      requestAnimationFrame(animate);
    }
    
    function onMouseLeave() {
      if (isDragging.value) {
        onMouseUp();
      }
    }
    // РЎСЃС‹Р»РєРё РЅР° DOM РґР»СЏ СЃР»Р°Р№РґРµСЂР°
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
      // selectedCategory Рё filteredProducts Р±РѕР»РµРµ РЅРµ РёСЃРїРѕР»СЊР·СѓСЋС‚СЃСЏ, С„РёР»СЊС‚СЂР°С†РёСЏ РІС‹РїРѕР»РЅСЏРµС‚СЃСЏ РІ selectedVerticalProducts
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
      // Р¤СѓРЅРєС†РёРё РґРѕР¶РґСЏ РёР· СЃСѓС€РёРєРѕРІ Рё РїРёС†С†
      createFoodRain,
      startFoodRain,
      // РІРѕР·РІСЂР°С‰Р°РµРј С‚РµРєСѓС‰РёР№ СЃР»Р°Р№Рґ, С‡С‚РѕР±С‹ С€Р°Р±Р»РѕРЅ РјРѕРі Р±РµР·РѕРїР°СЃРЅРѕ РµРіРѕ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ
      currentSlide,
      // РёРЅРґРµРєСЃ С‚РµРєСѓС‰РµРіРѕ СЃР»Р°Р№РґР° РЅСѓР¶РµРЅ РґР»СЏ Р°РЅРёРјР°С†РёРё РїРµСЂРµС…РѕРґРѕРІ
      currentSlideIndex,
      // РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ С‚РѕРІР°СЂР°
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
 * РљРѕРјРїРѕРЅРµРЅС‚ СЃС‚СЂР°РЅРёС†С‹ РєРѕСЂР·РёРЅС‹.
 */
const CartView = {
  name: 'CartView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Р—Р°РіРѕР»РѕРІРѕРє -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <i class="fa-solid fa-shopping-cart text-orange-600 mr-4"></i>
            Р’Р°С€Р° РєРѕСЂР·РёРЅР°
          </h1>
          <p class="text-gray-600 text-lg">РџСЂРѕРІРµСЂСЊС‚Рµ Р·Р°РєР°Р· Рё РїРµСЂРµР№РґРёС‚Рµ Рє РѕС„РѕСЂРјР»РµРЅРёСЋ</p>
                  </div>

        <div v-if="items.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div class="text-gray-400 mb-6">
              <i class="fa-solid fa-shopping-cart text-6xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 mb-4">РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°</h3>
            <p class="text-gray-500 mb-6">Р”РѕР±Р°РІСЊС‚Рµ С‚РѕРІР°СЂС‹ РёР· РјРµРЅСЋ, С‡С‚РѕР±С‹ СЃРґРµР»Р°С‚СЊ Р·Р°РєР°Р·</p>
            <router-link 
              to="/" 
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <i class="fa-solid fa-arrow-left mr-2"></i>
              Р’РµСЂРЅСѓС‚СЊСЃСЏ РІ РјРµРЅСЋ
            </router-link>
          </div>
        </div>

        <div v-else class="grid lg:grid-cols-3 gap-8">
          <!-- Р›РµРІР°СЏ РєРѕР»РѕРЅРєР° - С‚РѕРІР°СЂС‹ -->
          <div class="lg:col-span-2 space-y-6">
            <!-- РЎРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-list mr-3"></i>
                  РўРѕРІР°СЂС‹ РІ РєРѕСЂР·РёРЅРµ ({{ items.length }})
                </h2>
              </div>
              
              <div class="divide-y divide-gray-200">
                <div v-for="item in items" :key="item.id" class="p-6 hover:bg-gray-50 transition">
                  <div class="flex items-center space-x-4">
                    <!-- РР·РѕР±СЂР°Р¶РµРЅРёРµ С‚РѕРІР°СЂР° -->
                    <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    
                    <!-- РРЅС„РѕСЂРјР°С†РёСЏ Рѕ С‚РѕРІР°СЂРµ -->
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                      <p class="text-gray-600">{{ formatPrice(item.price) }} Р·Р° С€С‚СѓРєСѓ</p>
                    </div>
                    
                    <!-- РЈРїСЂР°РІР»РµРЅРёРµ РєРѕР»РёС‡РµСЃС‚РІРѕРј -->
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
                    
                    <!-- РЎСѓРјРјР° -->
                    <div class="text-right">
                      <div class="text-xl font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
                    </div>
                    
                    <!-- РљРЅРѕРїРєР° СѓРґР°Р»РµРЅРёСЏ -->
                    <button 
                      @click="removeItem(item)" 
                      class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                      title="РЈРґР°Р»РёС‚СЊ С‚РѕРІР°СЂ"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ СѓСЃР»СѓРіРё -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-plus mr-3"></i>
                  Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ
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

            <!-- РљРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-users mr-3"></i>
                  РљРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ
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
                    <div class="text-sm text-gray-500">{{ persons === 1 ? 'РїРµСЂСЃРѕРЅР°' : persons < 5 ? 'РїРµСЂСЃРѕРЅС‹' : 'РїРµСЂСЃРѕРЅ' }}</div>
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

          <!-- РџСЂР°РІР°СЏ РєРѕР»РѕРЅРєР° - РёС‚РѕРіРѕ Рё РѕС„РѕСЂРјР»РµРЅРёРµ -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-calculator mr-3"></i>
                  РС‚РѕРіРѕ
                </h2>
              </div>
              
              <div class="p-6 space-y-4">
                <!-- Р”РµС‚Р°Р»РёР·Р°С†РёСЏ -->
                <div class="space-y-3">
                  <div class="flex justify-between text-gray-600">
                    <span>РўРѕРІР°СЂС‹ ({{ items.reduce((sum, item) => sum + item.quantity, 0) }} С€С‚.)</span>
                    <span>{{ formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0)) }}</span>
                  </div>
                  
                  <div v-if="extrasTotal > 0" class="flex justify-between text-gray-600">
                    <span>Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ</span>
                    <span>{{ formatPrice(extrasTotal) }}</span>
                  </div>
                  
                  <div class="border-t pt-3">
                    <div class="flex justify-between text-xl font-bold text-gray-900">
                      <span>РС‚РѕРіРѕ</span>
                      <span class="text-orange-600">{{ formatPrice(total + extrasTotal) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- РљРЅРѕРїРєР° РѕС„РѕСЂРјР»РµРЅРёСЏ -->
                <button 
                  @click="goToCheckout" 
                  class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <i class="fa-solid fa-credit-card"></i>
                  <span>РћС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р·</span>
                </button>
                
                <!-- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ -->
                <div class="text-center text-sm text-gray-500 space-y-2">
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-truck"></i>
                    <span>Р‘С‹СЃС‚СЂР°СЏ РґРѕСЃС‚Р°РІРєР°</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-shield-alt"></i>
                    <span>Р‘РµР·РѕРїР°СЃРЅР°СЏ РѕРїР»Р°С‚Р°</span>
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
    // Р—Р°РіСЂСѓР¶Р°РµРј SEO РґР°РЅРЅС‹Рµ
    const seoData = ref(null);
    
    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        seoData.value = response.data;
      } catch (e) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё SEO РґР°РЅРЅС‹С…:', e);
      }
    }
    
    // SEO РјРµС‚Р°-С‚РµРіРё РґР»СЏ СЃС‚СЂР°РЅРёС†С‹ РєРѕСЂР·РёРЅС‹ (СѓРїСЂРѕС‰РµРЅРЅР°СЏ РІРµСЂСЃРёСЏ)
    function updateCartPageTitle() {
      if (seoData.value) {
        const site = seoData.value.site || {};
        const pages = seoData.value.pages || {};
        const cart = pages.cart || {};
        const title = cart.title || 'РљРѕСЂР·РёРЅР° | РРЅС‚РµСЂРЅРµС‚вЂ‘РјР°РіР°Р·РёРЅ СЃСѓС€Рё Рё РїРёС†С†С‹ | РўРѕС‡РєР° СЃСѓС€Рё Рё РїРёС†С†С‹';
        document.title = title;
      }
    }
    
    onMounted(() => {
      fetchSEOData().then(() => {
        updateCartPageTitle();
      });
    });

    const items = computed(() => cart.items);
    // СѓРїСЂР°РІР»РµРЅРёРµ РєРѕР»РёС‡РµСЃС‚РІРѕРј С‚РѕРІР°СЂРѕРІ РІ СЃС‚СЂРѕРєРµ
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
    // С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ С†РµРЅС‹
    function formatPrice(price) {
      return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    }
    // РєРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ С…СЂР°РЅРёС‚СЃСЏ РІ РіР»РѕР±Р°Р»СЊРЅРѕРј СЃРѕСЃС‚РѕСЏРЅРёРё РєРѕСЂР·РёРЅС‹
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
    // СЃРїРёСЃРѕРє РґРѕРїРѕРІ (С„РёРєСЃРёСЂРѕРІР°РЅ) Рё РёС… РІС‹Р±РѕСЂ С…СЂР°РЅРёС‚СЃСЏ РІ РєРѕСЂР·РёРЅРµ
    const extras = [
      { name: 'РЎРѕРµРІС‹Р№ СЃРѕСѓСЃ', price: 50 },
      { name: 'РРјР±РёСЂСЊ', price: 50 },
      { name: 'Р’Р°СЃР°Р±Рё', price: 50 }
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
 * РљРѕРјРїРѕРЅРµРЅС‚ СЃРїРёСЃРєР° РЅРѕРІРѕСЃС‚РµР№.
 */
const NewsListView = {
  name: 'NewsListView',
  template: /* html */`
    <div>
      <h2 class="text-2xl font-bold mb-4">РќРѕРІРѕСЃС‚Рё</h2>
      <div v-if="loading" class="text-center py-8">Р—Р°РіСЂСѓР·РєР°...</div>
      <div v-else>
        <div v-if="news.length === 0" class="text-gray-600">РџРѕРєР° РЅРµС‚ РЅРѕРІРѕСЃС‚РµР№.</div>
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
              <router-link :to="'/news/' + item.id" class="text-blue-600 hover:underline text-sm mt-2 inline-block">Р§РёС‚Р°С‚СЊ РґР°Р»РµРµ</router-link>
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
        console.error('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РЅРѕРІРѕСЃС‚Рё', e);
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
 * РљРѕРјРїРѕРЅРµРЅС‚ РїСЂРѕСЃРјРѕС‚СЂР° РѕРґРЅРѕР№ РЅРѕРІРѕСЃС‚Рё.
 */
const NewsDetailView = {
  name: 'NewsDetailView',
  template: /* html */`
    <div>
      <button @click="$router.back()" class="mb-4 text-blue-600 hover:underline">в†ђ РќР°Р·Р°Рґ</button>
      <div v-if="loading" class="text-center py-8">Р—Р°РіСЂСѓР·РєР°...</div>
      <div v-else-if="!newsItem" class="text-gray-600">РќРѕРІРѕСЃС‚СЊ РЅРµ РЅР°Р№РґРµРЅР°.</div>
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
    // РСЃРїРѕР»СЊР·СѓРµРј useRoute РґР»СЏ РґРѕСЃС‚СѓРїР° Рє РїР°СЂР°РјРµС‚СЂР°Рј РјР°СЂС€СЂСѓС‚Р°. Р”РµСЃС‚СЂСѓРєС‚СѓСЂРёР·Р°С†РёСЏ
    // РїР°СЂР°РјРµС‚СЂРѕРІ РёР· РєРѕРЅС‚РµРєСЃС‚Р° setup РЅРµ СЂР°Р±РѕС‚Р°РµС‚, РїРѕСЌС‚РѕРјСѓ РёРјРїРѕСЂС‚РёСЂСѓРµРј useRoute.
    const route = useRoute();
    const newsItem = ref(null);
    const loading = ref(true);
    // Р—Р°РіСЂСѓР¶Р°РµРј РєРѕРЅРєСЂРµС‚РЅСѓСЋ РЅРѕРІРѕСЃС‚СЊ РїРѕ ID РёР· РїР°СЂР°РјРµС‚СЂРѕРІ РјР°СЂС€СЂСѓС‚Р°
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

// AdminProductsView moved to client/modules/admin.js

// AdminNewsView moved to client/modules/admin.js
  name: 'AdminNewsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Р—Р°РіРѕР»РѕРІРѕРє -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">РЈРїСЂР°РІР»РµРЅРёРµ РЅРѕРІРѕСЃС‚СЏРјРё</h1>
          <p class="text-gray-600">РЎРѕР·РґР°РІР°Р№С‚Рµ Рё СЂРµРґР°РєС‚РёСЂСѓР№С‚Рµ РЅРѕРІРѕСЃС‚Рё РґР»СЏ РІР°С€РµРіРѕ РјР°РіР°Р·РёРЅР°</p>
        </div>

        <!-- Р¤РѕСЂРјР° РґРѕР±Р°РІР»РµРЅРёСЏ/СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <i class="fa-solid fa-newspaper text-white text-xl"></i>
            </div>
          <div>
              <h2 class="text-2xl font-bold text-gray-900" v-text="editMode ? 'Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ РЅРѕРІРѕСЃС‚СЊ' : 'Р”РѕР±Р°РІРёС‚СЊ РЅРѕРІРѕСЃС‚СЊ'"></h2>
              <p class="text-gray-600" v-text="editMode ? 'Р’РЅРµСЃРёС‚Рµ РёР·РјРµРЅРµРЅРёСЏ РІ РЅРѕРІРѕСЃС‚СЊ' : 'РЎРѕР·РґР°Р№С‚Рµ РЅРѕРІСѓСЋ РЅРѕРІРѕСЃС‚СЊ РґР»СЏ РєР»РёРµРЅС‚РѕРІ'"></p>
          </div>
          </div>

          <form @submit.prevent="saveNews" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-heading mr-2 text-blue-500"></i>
                  Р—Р°РіРѕР»РѕРІРѕРє РЅРѕРІРѕСЃС‚Рё
                </label>
                <input 
                  v-model="form.title" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  placeholder="Р’РІРµРґРёС‚Рµ Р·Р°РіРѕР»РѕРІРѕРє РЅРѕРІРѕСЃС‚Рё"
                  required 
                />
          </div>
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-calendar mr-2 text-blue-500"></i>
                  Р”Р°С‚Р° РїСѓР±Р»РёРєР°С†РёРё
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
                URL РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
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
                РЎРѕРґРµСЂР¶Р°РЅРёРµ РЅРѕРІРѕСЃС‚Рё
              </label>
              <textarea 
                v-model="form.content" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                rows="6"
                placeholder="РќР°РїРёС€РёС‚Рµ СЃРѕРґРµСЂР¶Р°РЅРёРµ РЅРѕРІРѕСЃС‚Рё..."
                required
              ></textarea>
            </div>

            <div class="flex space-x-4 pt-4">
              <button 
                type="submit" 
                class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <i class="fa-solid fa-save"></i>
                <span>{{ editMode ? 'РЎРѕС…СЂР°РЅРёС‚СЊ РёР·РјРµРЅРµРЅРёСЏ' : 'РћРїСѓР±Р»РёРєРѕРІР°С‚СЊ РЅРѕРІРѕСЃС‚СЊ' }}</span>
              </button>
              <button 
                v-if="editMode" 
                @click="resetForm" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <i class="fa-solid fa-times"></i>
                <span>РћС‚РјРµРЅР°</span>
              </button>
          </div>
        </form>
      </div>

        <!-- РЎРїРёСЃРѕРє РЅРѕРІРѕСЃС‚РµР№ -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">РЎРїРёСЃРѕРє РЅРѕРІРѕСЃС‚РµР№</h3>
                <p class="text-gray-600 mt-1">{{ news.length }} РЅРѕРІРѕСЃС‚РµР№ РѕРїСѓР±Р»РёРєРѕРІР°РЅРѕ</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <i class="fa-solid fa-newspaper"></i>
                <span>Р’СЃРµ РЅРѕРІРѕСЃС‚Рё</span>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-8 py-4 text-left text-sm font-semibold text-gray-700">РќРѕРІРѕСЃС‚СЊ</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Р”Р°С‚Р°</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Р”РµР№СЃС‚РІРёСЏ</th>
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
                        title="Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ"
                      >
                        <i class="fa-solid fa-edit"></i>
                      </button>
                      <button 
                        @click="deleteItem(item)" 
                        class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                        title="РЈРґР°Р»РёС‚СЊ"
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
      if (confirm('РЈРґР°Р»РёС‚СЊ СЌС‚Сѓ РЅРѕРІРѕСЃС‚СЊ?')) {
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
 * РљРѕРјРїРѕРЅРµРЅС‚ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ РєРѕРЅРєСЂРµС‚РЅРѕРіРѕ Р·Р°РєР°Р·Р° РІ Р°РґРјРёРЅРєРµ.
 * РџРѕР·РІРѕР»СЏРµС‚ РёР·РјРµРЅСЏС‚СЊ СЃРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ, РєРѕР»РёС‡РµСЃС‚РІРѕ, РґРѕРїС‹ Рё РґР°РЅРЅС‹Рµ РєР»РёРµРЅС‚Р°.
 */
const AdminOrderEditView = {
  name: 'AdminOrderEditView',
  template: /* html */`
    <div>
      <h2 class="text-2xl font-bold mb-4">Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ Р·Р°РєР°Р·</h2>
      <div v-if="loading" class="text-center py-8">Р—Р°РіСЂСѓР·РєР°...</div>
      <div v-else-if="!order" class="text-gray-600">Р—Р°РєР°Р· РЅРµ РЅР°Р№РґРµРЅ.</div>
      <div v-else class="space-y-6">
        <!-- РЎРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ РІ Р·Р°РєР°Р·Рµ -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">РўРѕРІР°СЂС‹</h3>
          <div v-if="order.items.length === 0" class="text-gray-600 mb-3">РќРµС‚ С‚РѕРІР°СЂРѕРІ.</div>
          <div v-for="it in order.items" :key="it.id" class="flex items-center justify-between py-2 border-b last:border-b-0">
            <div class="flex items-center space-x-3">
              <img :src="it.image || findProductImage(it.id)" alt="" class="w-10 h-10 object-cover rounded" loading="lazy" />
              <span>{{ it.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="decreaseQty(it)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">-</button>
              <span>{{ it.quantity }}</span>
              <button @click="increaseQty(it)" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">+</button>
              <button @click="removeItem(it)" class="ml-2 text-red-600 hover:underline">РЈРґР°Р»РёС‚СЊ</button>
            </div>
          </div>
          <!-- Р”РѕР±Р°РІР»РµРЅРёРµ РЅРѕРІРѕРіРѕ С‚РѕРІР°СЂР° -->
          <div class="mt-4">
            <label class="block font-medium mb-1">Р”РѕР±Р°РІРёС‚СЊ С‚РѕРІР°СЂ</label>
            <select v-model="selectedProductId" class="w-full border rounded px-3 py-2">
              <option disabled value="">Р’С‹Р±РµСЂРёС‚Рµ С‚РѕРІР°СЂ</option>
              <option v-for="prod in availableProducts" :key="prod.id" :value="prod.id">{{ prod.name }} ({{ formatPrice(prod.price) }})</option>
            </select>
            <button @click="addItem" class="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" :disabled="!selectedProductId">Р”РѕР±Р°РІРёС‚СЊ</button>
          </div>
        </div>
        <!-- РџРµСЂСЃРѕРЅС‹ Рё РґРѕРїС‹ -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">РќР°СЃС‚СЂРѕР№РєРё</h3>
          <div class="flex items-center space-x-3 mb-3">
            <span class="font-medium">РљРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ:</span>
            <button @click="decreasePersons" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">-</button>
            <span>{{ order.persons }}</span>
            <button @click="increasePersons" class="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">+</button>
          </div>
          <div>
            <span class="font-medium">Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ:</span>
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
        <!-- Р’СЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Р’СЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="order.delivery_time" 
                  value="asap" 
                  class="mr-2"
                />
                РљР°Рє РјРѕР¶РЅРѕ СЃРєРѕСЂРµРµ
              </label>
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="order.delivery_time" 
                  value="scheduled" 
                  class="mr-2"
                />
                Р—Р°РїР»Р°РЅРёСЂРѕРІР°С‚СЊ РЅР° РІСЂРµРјСЏ
              </label>
            </div>
            <div v-if="order.delivery_time === 'scheduled'" class="mt-3">
              <label class="block font-medium mb-1">Р”Р°С‚Р° Рё РІСЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё</label>
              <input 
                v-model="order.scheduled_time" 
                type="datetime-local" 
                class="w-full border rounded px-3 py-2" 
              />
            </div>
          </div>
        </div>
        <!-- Р”Р°РЅРЅС‹Рµ РєР»РёРµРЅС‚Р° -->
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Р”Р°РЅРЅС‹Рµ РєР»РёРµРЅС‚Р°</h3>
          <div class="space-y-3">
            <div>
              <label class="block font-medium mb-1">РРјСЏ</label>
              <input v-model="order.customer.name" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Р“РѕСЂРѕРґ</label>
              <input v-model="order.customer.address.city" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">РЈР»РёС†Р°</label>
              <input v-model="order.customer.address.street" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Р”РѕРј / РєРІР°СЂС‚РёСЂР°</label>
              <input v-model="order.customer.address.apartment" class="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">РўРµР»РµС„РѕРЅ</label>
              <input v-model="order.customer.address.phone" class="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>
        <!-- РС‚РѕРіРё Рё РґРµР№СЃС‚РІРёСЏ -->
        <div class="bg-white p-4 rounded shadow flex justify-between items-center">
          <div class="text-lg font-semibold">РС‚РѕРіРѕ: {{ formatPrice(total) }}</div>
          <div class="space-x-3">
            <button @click="saveOrder" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">РЎРѕС…СЂР°РЅРёС‚СЊ</button>
            <button @click="cancelEdit" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">РћС‚РјРµРЅР°</button>
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
    // С„РёРєСЃРёСЂРѕРІР°РЅРЅС‹Р№ СЃРїРёСЃРѕРє РґРѕРїРѕРІ
    const extras = [
      { name: 'РЎРѕРµРІС‹Р№ СЃРѕСѓСЃ', price: 50 },
      { name: 'РРјР±РёСЂСЊ', price: 50 },
      { name: 'Р’Р°СЃР°Р±Рё', price: 50 }
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
          // РџСЂРµРѕР±СЂР°Р·СѓРµРј РґР°РЅРЅС‹Рµ РёР· С„РѕСЂРјР°С‚Р° СЃРµСЂРІРµСЂР° РІ С„РѕСЂРјР°С‚ С„СЂРѕРЅС‚РµРЅРґР°
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
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С…', e);
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
    // РґРѕСЃС‚СѓРїРЅС‹Рµ РґР»СЏ РґРѕР±Р°РІР»РµРЅРёСЏ РїСЂРѕРґСѓРєС‚С‹ (РЅРµ РІС…РѕРґСЏС‰РёРµ РІ С‚РµРєСѓС‰РёР№ Р·Р°РєР°Р·)
    const availableProducts = computed(() => {
      if (!order.value) return [];
      const existingIds = order.value.items.map(i => i.id);
      return products.value.filter(p => !existingIds.includes(p.id));
    });
    // РњРµС‚РѕРґС‹ РґР»СЏ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ
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
    // РІС‹С‡РёСЃР»СЏРµРј РёС‚РѕРіРѕРІСѓСЋ СЃСѓРјРјСѓ
    const total = computed(() => {
      if (!order.value) return 0;
      const itemsSum = order.value.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const extrasSum = extras.reduce((sum, ex, idx) => {
        const qty = order.value.extrasSelection ? order.value.extrasSelection[idx] : 0;
        return sum + ex.price * qty;
      }, 0);
      return itemsSum + extrasSum;
    });
    // РЎРѕС…СЂР°РЅРёС‚СЊ Р·Р°РєР°Р·
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
        alert('Р—Р°РєР°Р· РѕР±РЅРѕРІР»С‘РЅ');
        router.push('/admin/orders');
      } catch (e) {
        console.error('РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ Р·Р°РєР°Р·Р°', e);
        alert('РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕС…СЂР°РЅРёС‚СЊ Р·Р°РєР°Р·');
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
 * РљРѕРјРїРѕРЅРµРЅС‚ СѓРїСЂР°РІР»РµРЅРёСЏ РѕС‚Р·С‹РІР°РјРё РІ Р°РґРјРёРЅРєРµ.
 */
const AdminReviewsView = {
  name: 'AdminReviewsView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50">
      <!-- Р—Р°РіРѕР»РѕРІРѕРє СЃС‚СЂР°РЅРёС†С‹ -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">РЈРїСЂР°РІР»РµРЅРёРµ РѕС‚Р·С‹РІР°РјРё</h1>
                <p class="mt-2 text-gray-600">РџСЂРѕСЃРјРѕС‚СЂ Рё СѓРїСЂР°РІР»РµРЅРёРµ РѕС‚Р·С‹РІР°РјРё РєР»РёРµРЅС‚РѕРІ</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-500">
                  <i class="fa-solid fa-star mr-1"></i>
                  Р’СЃРµРіРѕ РѕС‚Р·С‹РІРѕРІ: {{ reviews.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- РЎС‚Р°С‚РёСЃС‚РёРєР° РѕС‚Р·С‹РІРѕРІ -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-star text-white text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">РЎСЂРµРґРЅРёР№ СЂРµР№С‚РёРЅРі</p>
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
                <p class="text-sm text-gray-600">РџРѕР»РѕР¶РёС‚РµР»СЊРЅС‹Рµ</p>
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
                <p class="text-sm text-gray-600">РћС‚СЂРёС†Р°С‚РµР»СЊРЅС‹Рµ</p>
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
                <p class="text-sm text-gray-600">Р’СЃРµРіРѕ РѕС‚Р·С‹РІРѕРІ</p>
                <p class="text-2xl font-bold text-gray-900">{{ reviews.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Р¤РёР»СЊС‚СЂС‹ -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Р¤РёР»СЊС‚СЂ РїРѕ СЂРµР№С‚РёРЅРіСѓ:</label>
              <select v-model="ratingFilter" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Р’СЃРµ РѕС‚Р·С‹РІС‹</option>
                <option value="5">5 Р·РІС‘Р·Рґ</option>
                <option value="4">4 Р·РІРµР·РґС‹</option>
                <option value="3">3 Р·РІРµР·РґС‹</option>
                <option value="2">2 Р·РІРµР·РґС‹</option>
                <option value="1">1 Р·РІРµР·РґР°</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">РЎРѕСЂС‚РёСЂРѕРІРєР°:</label>
              <select v-model="sortBy" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="date">РџРѕ РґР°С‚Рµ</option>
                <option value="rating">РџРѕ СЂРµР№С‚РёРЅРіСѓ</option>
                <option value="name">РџРѕ РёРјРµРЅРё</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="РџРѕРёСЃРє РїРѕ РёРјРµРЅРё РёР»Рё РєРѕРјРјРµРЅС‚Р°СЂРёСЋ..." 
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
              <i class="fa-solid fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- РЎРїРёСЃРѕРє РѕС‚Р·С‹РІРѕРІ -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">РЎРїРёСЃРѕРє РѕС‚Р·С‹РІРѕРІ</h3>
                <p class="text-gray-600 mt-1">{{ filteredReviews.length }} РѕС‚Р·С‹РІРѕРІ</p>
              </div>
            </div>
          </div>

          <div v-if="loading" class="text-center py-12">
            <div class="inline-flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>Р—Р°РіСЂСѓР·РєР° РѕС‚Р·С‹РІРѕРІ...</span>
            </div>
          </div>
          
          <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <i class="fa-solid fa-comments text-4xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-500 mb-2">РћС‚Р·С‹РІС‹ РѕС‚СЃСѓС‚СЃС‚РІСѓСЋС‚</h3>
            <p class="text-gray-400">РџРѕРєР° С‡С‚Рѕ РЅРёРєС‚Рѕ РЅРµ РѕСЃС‚Р°РІРёР» РѕС‚Р·С‹РІ</p>
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
                    <h4 class="font-semibold text-gray-900 mb-1">{{ review.name || 'РђРЅРѕРЅРёРјРЅС‹Р№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ' }}</h4>
                    <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
                  </div>

                  <div v-if="review.orderId" class="text-sm text-gray-500">
                    <i class="fa-solid fa-receipt mr-1"></i>
                    Р—Р°РєР°Р· #{{ review.orderId.slice(-6) }}
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button 
                    @click="deleteReview(review)" 
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                    title="РЈРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ"
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
        console.error('РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ РѕС‚Р·С‹РІС‹', e);
      } finally {
        loading.value = false;
      }
    }

    async function deleteReview(review) {
      if (!confirm('РЈРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ?')) return;
      try {
        await axios.delete(`/api/reviews/${review.id}`);
        await fetchReviews();
      } catch (e) {
        console.error('РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ', e);
        alert('РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ РѕС‚Р·С‹РІР°');
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

      // Р¤РёР»СЊС‚СЂ РїРѕ СЂРµР№С‚РёРЅРіСѓ
      if (ratingFilter.value) {
        filtered = filtered.filter(review => review.rating === parseInt(ratingFilter.value));
      }

      // РџРѕРёСЃРє
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(review => 
          (review.name && review.name.toLowerCase().includes(query)) ||
          review.comment.toLowerCase().includes(query)
        );
      }

      // РЎРѕСЂС‚РёСЂРѕРІРєР°
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

// AdminSEOView РїРµСЂРµРЅРµСЃРµРЅ РІ client/modules/admin.js
// AdminSEOView Р±СѓРґРµС‚ Р·Р°РјРµРЅРµРЅ РїРѕР»РЅРѕР№ РІРµСЂСЃРёРµР№

// AdminCategoryBlocksView РїРµСЂРµРЅРµСЃРµРЅ РІ client/modules/admin.js
const AdminCategoryBlocksView = {
  name: 'AdminCategoryBlocksView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50">
      <!-- Р—Р°РіРѕР»РѕРІРѕРє СЃС‚СЂР°РЅРёС†С‹ -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">РЈРїСЂР°РІР»РµРЅРёРµ Р±Р»РѕРєР°РјРё РєР°С‚РµРіРѕСЂРёР№</h1>
                <p class="mt-2 text-gray-600">РќР°СЃС‚СЂРѕР№РєР° Р±Р»РѕРєР° "РљР°С‚РµРіРѕСЂРёРё Рё Р±Р»СЋРґР°" РЅР° РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ</p>
              </div>
              <div class="flex items-center space-x-4">
                <button @click="showAddForm = true" 
                        class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                  <i class="fa-solid fa-plus"></i>
                  <span>Р”РѕР±Р°РІРёС‚СЊ Р±Р»РѕРє</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- РЈРІРµРґРѕРјР»РµРЅРёСЏ -->
        <div v-if="message" class="mb-6 p-4 rounded-xl" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ message }}
        </div>

        <!-- Р¤РѕСЂРјР° РґРѕР±Р°РІР»РµРЅРёСЏ/СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ -->
        <div v-if="showAddForm || editingBlock" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ editingBlock ? 'Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ Р±Р»РѕРє' : 'Р”РѕР±Р°РІРёС‚СЊ РЅРѕРІС‹Р№ Р±Р»РѕРє' }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">РќР°Р·РІР°РЅРёРµ РєР°С‚РµРіРѕСЂРёРё</label>
              <input v-model="form.name" type="text" 
                     class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">РџРѕСЂСЏРґРѕРє РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ</label>
              <input v-model.number="form.order" type="number" min="1" 
                     class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">РћРїРёСЃР°РЅРёРµ</label>
              <textarea v-model="form.description" rows="3"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL РёР·РѕР±СЂР°Р¶РµРЅРёСЏ</label>
              <input v-model="form.image" type="url" 
                     class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <p class="text-xs text-gray-500 mt-1">Р РµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ РєРІР°РґСЂР°С‚РЅРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ РґР»СЏ Р»СѓС‡С€РµРіРѕ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ</p>
            </div>
            
            <div class="md:col-span-2">
              <div class="flex items-center">
                <input v-model="form.enabled" type="checkbox" id="enabled" 
                       class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500">
                <label for="enabled" class="ml-2 text-sm font-medium text-gray-700">
                  РџРѕРєР°Р·С‹РІР°С‚СЊ РЅР° РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 mt-6">
            <button @click="saveBlock" :disabled="loading" 
                    class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
              <i class="fa-solid fa-save"></i>
              <span>{{ loading ? 'РЎРѕС…СЂР°РЅРµРЅРёРµ...' : 'РЎРѕС…СЂР°РЅРёС‚СЊ' }}</span>
            </button>
            <button @click="cancelEdit" 
                    class="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200">
              РћС‚РјРµРЅР°
            </button>
          </div>
        </div>

        <!-- РЎРїРёСЃРѕРє Р±Р»РѕРєРѕРІ -->
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
                  РЎРєСЂС‹С‚Рѕ
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
                  <span class="text-sm text-gray-500 mr-2">РџРѕРєР°Р·Р°С‚СЊ:</span>
                  <button @click="toggleEnabled(block)" 
                          :class="block.enabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'"
                          class="text-white px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200">
                    {{ block.enabled ? 'Р”Р°' : 'РќРµС‚' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- РџСѓСЃС‚РѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ -->
        <div v-if="blocks.length === 0" class="text-center py-12">
          <i class="fa-solid fa-images text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">РќРµС‚ Р±Р»РѕРєРѕРІ РєР°С‚РµРіРѕСЂРёР№</h3>
          <p class="text-gray-500 mb-6">Р”РѕР±Р°РІСЊС‚Рµ РїРµСЂРІС‹Р№ Р±Р»РѕРє РєР°С‚РµРіРѕСЂРёРё РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ РЅР° РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ</p>
          <button @click="showAddForm = true" 
                  class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
            Р”РѕР±Р°РІРёС‚СЊ Р±Р»РѕРє
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
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё Р±Р»РѕРєРѕРІ:', e);
        showMessage('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё Р±Р»РѕРєРѕРІ РєР°С‚РµРіРѕСЂРёР№', 'error');
      } finally {
        loading.value = false;
      }
    }

    async function saveBlock() {
      if (!form.name.trim() || !form.description.trim() || !form.image.trim()) {
        showMessage('Р—Р°РїРѕР»РЅРёС‚Рµ РІСЃРµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ', 'error');
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
        showMessage(editingBlock.value ? 'Р‘Р»РѕРє РѕР±РЅРѕРІР»РµРЅ!' : 'Р‘Р»РѕРє РґРѕР±Р°РІР»РµРЅ!', 'success');
      } catch (e) {
        console.error('РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ Р±Р»РѕРєР°:', e);
        showMessage('РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ Р±Р»РѕРєР°', 'error');
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
      if (!confirm(`РЈРґР°Р»РёС‚СЊ Р±Р»РѕРє "${block.name}"?`)) return;
      
      try {
        await axios.delete(`/api/category-blocks/${block.id}`);
        await fetchBlocks();
        showMessage('Р‘Р»РѕРє СѓРґР°Р»РµРЅ!', 'success');
      } catch (e) {
        console.error('РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ Р±Р»РѕРєР°:', e);
        showMessage('РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ Р±Р»РѕРєР°', 'error');
      }
    }

    async function toggleEnabled(block) {
      try {
        await axios.put(`/api/category-blocks/${block.id}`, {
          ...block,
          enabled: !block.enabled
        });
        await fetchBlocks();
        showMessage(`Р‘Р»РѕРє ${!block.enabled ? 'РїРѕРєР°Р·Р°РЅ' : 'СЃРєСЂС‹С‚'}!`, 'success');
      } catch (e) {
        console.error('РћС€РёР±РєР° РёР·РјРµРЅРµРЅРёСЏ СЃС‚Р°С‚СѓСЃР° Р±Р»РѕРєР°:', e);
        showMessage('РћС€РёР±РєР° РёР·РјРµРЅРµРЅРёСЏ СЃС‚Р°С‚СѓСЃР° Р±Р»РѕРєР°', 'error');
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

const AdminSEOView = {
  name: 'AdminSEOView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50">
      <!-- Р—Р°РіРѕР»РѕРІРѕРє СЃС‚СЂР°РЅРёС†С‹ -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">РЈРїСЂР°РІР»РµРЅРёРµ SEO</h1>
                <p class="mt-2 text-gray-600">РќР°СЃС‚СЂРѕР№РєР° РјРµС‚Р°-С‚РµРіРѕРІ, Open Graph, Twitter Cards Рё СЃС‚СЂСѓРєС‚СѓСЂРёСЂРѕРІР°РЅРЅС‹С… РґР°РЅРЅС‹С…</p>
              </div>
              <div class="flex items-center space-x-4">
                <button @click="saveSEO" :disabled="loading" 
                        class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                  <i class="fa-solid fa-save"></i>
                  <span>{{ loading ? 'РЎРѕС…СЂР°РЅРµРЅРёРµ...' : 'РЎРѕС…СЂР°РЅРёС‚СЊ' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- РЈРІРµРґРѕРјР»РµРЅРёСЏ -->
        <div v-if="message" class="mb-6 p-4 rounded-xl" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ message }}
        </div>

        <!-- РћСЃРЅРѕРІРЅС‹Рµ SEO РЅР°СЃС‚СЂРѕР№РєРё -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- РћР±С‰РёРµ РЅР°СЃС‚СЂРѕР№РєРё СЃР°Р№С‚Р° -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-globe mr-3 text-orange-500"></i>
              РћР±С‰РёРµ РЅР°СЃС‚СЂРѕР№РєРё СЃР°Р№С‚Р°
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Р—Р°РіРѕР»РѕРІРѕРє СЃР°Р№С‚Р°</label>
                <input v-model="seoData.site.title" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Р РµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ РґРѕ 60 СЃРёРјРІРѕР»РѕРІ</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РћРїРёСЃР°РЅРёРµ СЃР°Р№С‚Р°</label>
                <textarea v-model="seoData.site.description" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
                <p class="text-xs text-gray-500 mt-1">Р РµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ РґРѕ 160 СЃРёРјРІРѕР»РѕРІ</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РљР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР°</label>
                <input v-model="seoData.site.keywords" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Р§РµСЂРµР· Р·Р°РїСЏС‚СѓСЋ</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РђРІС‚РѕСЂ</label>
                <input v-model="seoData.site.author" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РљР°РЅРѕРЅРёС‡РµСЃРєРёР№ URL</label>
                <input v-model="seoData.site.canonical" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Open Graph РЅР°СЃС‚СЂРѕР№РєРё -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-brands fa-facebook mr-3 text-blue-600"></i>
              Open Graph (Facebook)
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OG Р—Р°РіРѕР»РѕРІРѕРє</label>
                <input v-model="seoData.site.ogTitle" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OG РћРїРёСЃР°РЅРёРµ</label>
                <textarea v-model="seoData.site.ogDescription" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OG РР·РѕР±СЂР°Р¶РµРЅРёРµ</label>
                <input v-model="seoData.site.ogImage" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Р РµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ 1200x630px</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РќР°Р·РІР°РЅРёРµ СЃР°Р№С‚Р°</label>
                <input v-model="seoData.site.ogSiteName" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Р›РѕРєР°Р»СЊ</label>
                <input v-model="seoData.site.ogLocale" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">РќР°РїСЂРёРјРµСЂ: ru_RU</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Twitter Cards Рё СЃС‚СЂСѓРєС‚СѓСЂРёСЂРѕРІР°РЅРЅС‹Рµ РґР°РЅРЅС‹Рµ -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <!-- Twitter Cards -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-brands fa-twitter mr-3 text-blue-400"></i>
              Twitter Cards
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РўРёРї РєР°СЂС‚РѕС‡РєРё</label>
                <select v-model="seoData.site.twitterCard" 
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter Р—Р°РіРѕР»РѕРІРѕРє</label>
                <input v-model="seoData.site.twitterTitle" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter РћРїРёСЃР°РЅРёРµ</label>
                <textarea v-model="seoData.site.twitterDescription" rows="3"
                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter РР·РѕР±СЂР°Р¶РµРЅРёРµ</label>
                <input v-model="seoData.site.twitterImage" type="url" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- РЎС‚СЂСѓРєС‚СѓСЂРёСЂРѕРІР°РЅРЅС‹Рµ РґР°РЅРЅС‹Рµ -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-code mr-3 text-green-500"></i>
              РЎС‚СЂСѓРєС‚СѓСЂРёСЂРѕРІР°РЅРЅС‹Рµ РґР°РЅРЅС‹Рµ
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РќР°Р·РІР°РЅРёРµ СЂРµСЃС‚РѕСЂР°РЅР°</label>
                <input v-model="seoData.site.structuredData.name" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РўРµР»РµС„РѕРЅ</label>
                <input v-model="seoData.site.structuredData.telephone" type="tel" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">РЎС‚СЂР°РЅР°</label>
                <input v-model="seoData.site.structuredData.address.addressCountry" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Р“РѕСЂРѕРґ</label>
                <input v-model="seoData.site.structuredData.address.addressLocality" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Р§Р°СЃС‹ СЂР°Р±РѕС‚С‹</label>
                <input v-model="seoData.site.structuredData.openingHours" type="text" 
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">РќР°РїСЂРёРјРµСЂ: Mo-Su 10:00-23:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- РќР°СЃС‚СЂРѕР№РєРё СЃС‚СЂР°РЅРёС† -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fa-solid fa-file-lines mr-3 text-purple-500"></i>
            РќР°СЃС‚СЂРѕР№РєРё СЃС‚СЂР°РЅРёС†
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Р—Р°РіРѕР»РѕРІРѕРє</label>
                  <input v-model="seoData.pages.home.title" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">РћРїРёСЃР°РЅРёРµ</label>
                  <textarea v-model="seoData.pages.home.description" rows="2"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">РљР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР°</label>
                  <input v-model="seoData.pages.home.keywords" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>
            </div>

            <!-- РљРѕСЂР·РёРЅР° -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">РљРѕСЂР·РёРЅР°</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Р—Р°РіРѕР»РѕРІРѕРє</label>
                  <input v-model="seoData.pages.cart.title" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">РћРїРёСЃР°РЅРёРµ</label>
                  <textarea v-model="seoData.pages.cart.description" rows="2"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">РљР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР°</label>
                  <input v-model="seoData.pages.cart.keywords" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>
            </div>

            <!-- РќРѕРІРѕСЃС‚Рё -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">РќРѕРІРѕСЃС‚Рё</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Р—Р°РіРѕР»РѕРІРѕРє</label>
                  <input v-model="seoData.pages.news.title" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">РћРїРёСЃР°РЅРёРµ</label>
                  <textarea v-model="seoData.pages.news.description" rows="2"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">РљР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР°</label>
                  <input v-model="seoData.pages.news.keywords" type="text" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sitemap Рё Robots.txt -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <!-- Sitemap РЅР°СЃС‚СЂРѕР№РєРё -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-sitemap mr-3 text-indigo-500"></i>
              Sitemap РЅР°СЃС‚СЂРѕР№РєРё
            </h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input v-model="seoData.sitemap.enabled" type="checkbox" id="sitemap-enabled" 
                       class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500">
                <label for="sitemap-enabled" class="ml-2 text-sm font-medium text-gray-700">
                  Р’РєР»СЋС‡РёС‚СЊ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєСѓСЋ РіРµРЅРµСЂР°С†РёСЋ sitemap.xml
                </label>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">РџСЂРёРѕСЂРёС‚РµС‚ РіР»Р°РІРЅРѕР№</label>
                  <input v-model.number="seoData.sitemap.priority.home" type="number" step="0.1" min="0" max="1" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Р§Р°СЃС‚РѕС‚Р° РѕР±РЅРѕРІР»РµРЅРёСЏ</label>
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
                <p class="text-sm text-gray-600 mb-2">Sitemap Р±СѓРґРµС‚ РґРѕСЃС‚СѓРїРµРЅ РїРѕ Р°РґСЂРµСЃСѓ:</p>
                <code class="text-sm bg-white px-2 py-1 rounded border">{{ seoData.site.canonical }}/sitemap.xml</code>
              </div>
            </div>
          </div>

          <!-- Robots.txt РЅР°СЃС‚СЂРѕР№РєРё -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fa-solid fa-robot mr-3 text-gray-500"></i>
              Robots.txt РЅР°СЃС‚СЂРѕР№РєРё
            </h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input v-model="seoData.robots.enabled" type="checkbox" id="robots-enabled" 
                       class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500">
                <label for="robots-enabled" class="ml-2 text-sm font-medium text-gray-700">
                  Р’РєР»СЋС‡РёС‚СЊ robots.txt
                </label>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">User-Agent</label>
                <input v-model="seoData.robots.userAgent" type="text" 
                       class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Р Р°Р·СЂРµС€РµРЅРЅС‹Рµ РїСѓС‚Рё</label>
                <textarea v-model="robotsAllowText" rows="3"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                <p class="text-xs text-gray-500 mt-1">РџРѕ РѕРґРЅРѕРјСѓ РїСѓС‚Рё РЅР° СЃС‚СЂРѕРєСѓ</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Р—Р°РїСЂРµС‰РµРЅРЅС‹Рµ РїСѓС‚Рё</label>
                <textarea v-model="robotsDisallowText" rows="3"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                <p class="text-xs text-gray-500 mt-1">РџРѕ РѕРґРЅРѕРјСѓ РїСѓС‚Рё РЅР° СЃС‚СЂРѕРєСѓ</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-2">Robots.txt Р±СѓРґРµС‚ РґРѕСЃС‚СѓРїРµРЅ РїРѕ Р°РґСЂРµСЃСѓ:</p>
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

    // Computed РґР»СЏ robots.txt С‚РµРєСЃС‚Р°
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
        
        // Р•СЃР»Рё СЃРµСЂРІРµСЂ РІРµСЂРЅСѓР» РґР°РЅРЅС‹Рµ, РѕР±РЅРѕРІР»СЏРµРј РІСЃСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ
        if (response.data) {
          // РћР±РЅРѕРІР»СЏРµРј РІСЃРµ СЃРµРєС†РёРё РґР°РЅРЅС‹С…
          if (response.data.site) {
            seoData.value.site = { 
              ...seoData.value.site, 
              ...response.data.site 
            };
            
            // РЈР±РµР¶РґР°РµРјСЃСЏ С‡С‚Рѕ РІСЃРµ РІР»РѕР¶РµРЅРЅС‹Рµ РѕР±СЉРµРєС‚С‹ СЃСѓС‰РµСЃС‚РІСѓСЋС‚
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
          
          // РћР±РЅРѕРІР»СЏРµРј РЅР°СЃС‚СЂРѕР№РєРё СЃС‚СЂР°РЅРёС†
          if (response.data.pages) {
            seoData.value.pages = { 
              ...seoData.value.pages, 
              ...response.data.pages 
            };
          }
          
          // РћР±РЅРѕРІР»СЏРµРј РЅР°СЃС‚СЂРѕР№РєРё sitemap
          if (response.data.sitemap) {
            seoData.value.sitemap = { 
              ...seoData.value.sitemap, 
              ...response.data.sitemap 
            };
          }
          
          // РћР±РЅРѕРІР»СЏРµРј РЅР°СЃС‚СЂРѕР№РєРё robots
          if (response.data.robots) {
            seoData.value.robots = { 
              ...seoData.value.robots, 
              ...response.data.robots 
            };
          }
        }
        
        console.log('Final SEO data:', seoData.value);
      } catch (e) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё SEO РґР°РЅРЅС‹С…:', e);
        showMessage('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё SEO РґР°РЅРЅС‹С…', 'error');
      }
    }

    async function saveSEO() {
      loading.value = true;
      try {
        await axios.put('/api/seo', seoData.value);
        showMessage('SEO РЅР°СЃС‚СЂРѕР№РєРё СѓСЃРїРµС€РЅРѕ СЃРѕС…СЂР°РЅРµРЅС‹!', 'success');
        // РџРµСЂРµР·Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ СЃ СЃРµСЂРІРµСЂР° РїРѕСЃР»Рµ СЃРѕС…СЂР°РЅРµРЅРёСЏ
        await fetchSEOData();
      } catch (e) {
        console.error('РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ SEO РґР°РЅРЅС‹С…:', e);
        showMessage('РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ SEO РґР°РЅРЅС‹С…', 'error');
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
 * РЎС‚СЂР°РЅРёС†Р° РІС…РѕРґР° РґР»СЏ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°. РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РІРІРѕРґРёС‚ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР° Рё РїР°СЂРѕР»СЊ.
 * РџРѕСЃР»Рµ СѓСЃРїРµС€РЅРѕР№ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё РІ Р»РѕРєР°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ СЃРѕС…СЂР°РЅСЏРµС‚СЃСЏ С‚РѕРєРµРЅ Рё СЂРѕР»СЊ,
 * Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РїРµСЂРµРЅР°РїСЂР°РІР»СЏРµС‚СЃСЏ РІ СЂР°Р·РґРµР» Р°РґРјРёРЅРёСЃС‚СЂРёСЂРѕРІР°РЅРёСЏ.
 */
const LoginView = {
  name: 'LoginView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Р›РѕРіРѕС‚РёРї Рё Р·Р°РіРѕР»РѕРІРѕРє -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-user text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ!</h2>
          <p class="text-gray-600">Р’РѕР№РґРёС‚Рµ РІ СЃРІРѕР№ Р°РєРєР°СѓРЅС‚ РёР»Рё Р·Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ</p>
        </div>

        <!-- РџРµСЂРµРєР»СЋС‡Р°С‚РµР»СЊ РІС…РѕРґР°/СЂРµРіРёСЃС‚СЂР°С†РёРё -->
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
              Р’С…РѕРґ
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
              Р РµРіРёСЃС‚СЂР°С†РёСЏ
            </button>
          </div>

          <!-- Р¤РѕСЂРјР° РІС…РѕРґР° -->
          <form v-if="isLogin" @submit.prevent="login" class="space-y-6">
        <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-phone mr-2 text-orange-500"></i>
                РўРµР»РµС„РѕРЅ
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
                РџР°СЂРѕР»СЊ
              </label>
              <input 
                type="password" 
                v-model="password" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Р’РІРµРґРёС‚Рµ РїР°СЂРѕР»СЊ" 
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
              <span>Р’РѕР№С‚Рё</span>
            </button>
      </form>

          <!-- Р¤РѕСЂРјР° СЂРµРіРёСЃС‚СЂР°С†РёРё -->
          <form v-else @submit.prevent="register" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-phone mr-2 text-orange-500"></i>
                РўРµР»РµС„РѕРЅ
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
              <span>Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ</span>
            </button>
          </form>

          <!-- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              <i class="fa-solid fa-shield-alt mr-1"></i>
              Р’Р°С€Рё РґР°РЅРЅС‹Рµ Р·Р°С‰РёС‰РµРЅС‹
            </p>
          </div>
        </div>

        <!-- РЎСЃС‹Р»РєР° РЅР° РіР»Р°РІРЅСѓСЋ -->
        <div class="text-center">
          <router-link to="/" class="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center space-x-2">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Р’РµСЂРЅСѓС‚СЊСЃСЏ РЅР° РіР»Р°РІРЅСѓСЋ</span>
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
        
        // РќРµР±РѕР»СЊС€Р°СЏ Р·Р°РґРµСЂР¶РєР° РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ СЃРѕСЃС‚РѕСЏРЅРёСЏ
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Р•СЃР»Рё Р°РґРјРёРЅ, РїРµСЂРµРЅР°РїСЂР°РІР»СЏРµРј РІ Р°РґРјРёРЅРєСѓ. РРЅР°С‡Рµ РЅР° РіР»Р°РІРЅСѓСЋ.
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
            error.value = 'РќРµРІРµСЂРЅС‹Р№ С‚РµР»РµС„РѕРЅ РёР»Рё РїР°СЂРѕР»СЊ';
          } else {
            error.value = 'РћС€РёР±РєР° РІС…РѕРґР°';
          }
      }
    }
    
    async function register() {
      regError.value = '';
      regSuccess.value = '';
      try {
        const res = await axios.post('/api/users', { phone: regPhone.value.trim() });
        regSuccess.value = `РђРєРєР°СѓРЅС‚ СЃРѕР·РґР°РЅ! Р’Р°С€ РїР°СЂРѕР»СЊ: ${res.data.password}`;
        regPhone.value = '';
      } catch (e) {
        if (e.response && e.response.status === 409) {
          regSuccess.value = `РђРєРєР°СѓРЅС‚ СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚! Р’Р°С€ РїР°СЂРѕР»СЊ: ${e.response.data.password}`;
        } else {
          regError.value = 'РћС€РёР±РєР° СЂРµРіРёСЃС‚СЂР°С†РёРё';
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
 * РљРѕРјРїРѕРЅРµРЅС‚ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°.
 * РџРѕР·РІРѕР»СЏРµС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ РІРІРµСЃС‚Рё Р¤РРћ Рё Р°РґСЂРµСЃ, РїСЂРѕСЃРјРѕС‚СЂРµС‚СЊ РёС‚РѕРі Р·Р°РєР°Р·Р°
 * Рё РѕС‚РїСЂР°РІРёС‚СЊ РёРЅС„РѕСЂРјР°С†РёСЋ РЅР° СЃРµСЂРІРµСЂ. РџРѕСЃР»Рµ РѕС‚РїСЂР°РІРєРё РєРѕСЂР·РёРЅР° РѕС‡РёС‰Р°РµС‚СЃСЏ.
 */
const CheckoutView = {
  name: 'CheckoutView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Р—Р°РіРѕР»РѕРІРѕРє -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <i class="fa-solid fa-credit-card text-orange-600 mr-4"></i>
            РћС„РѕСЂРјР»РµРЅРёРµ Р·Р°РєР°Р·Р°
          </h1>
          <p class="text-gray-600 text-lg">Р—Р°РїРѕР»РЅРёС‚Рµ РґР°РЅРЅС‹Рµ РґР»СЏ РґРѕСЃС‚Р°РІРєРё</p>
          </div>

        <div v-if="items.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div class="text-gray-400 mb-6">
              <i class="fa-solid fa-shopping-cart text-6xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 mb-4">РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°</h3>
            <p class="text-gray-500 mb-6">Р”РѕР±Р°РІСЊС‚Рµ С‚РѕРІР°СЂС‹ РІ РєРѕСЂР·РёРЅСѓ РґР»СЏ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°</p>
            <router-link 
              to="/" 
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <i class="fa-solid fa-arrow-left mr-2"></i>
              Р’РµСЂРЅСѓС‚СЊСЃСЏ РІ РјРµРЅСЋ
            </router-link>
          </div>
        </div>

        <div v-else class="grid lg:grid-cols-3 gap-8">
          <!-- Р›РµРІР°СЏ РєРѕР»РѕРЅРєР° - С„РѕСЂРјР° -->
          <div class="lg:col-span-2 space-y-6">
            <!-- РРЅС„РѕСЂРјР°С†РёСЏ Рѕ Р·Р°РєР°Р·Рµ -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-list mr-3"></i>
                  Р’Р°С€ Р·Р°РєР°Р·
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
                      <p class="text-sm text-gray-600">{{ formatPrice(item.price) }} Г— {{ item.quantity }}</p>
                    </div>
                    <div class="text-lg font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
                  </div>
                  
                  <!-- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ -->
                  <div v-if="extrasSelectedList.length > 0" class="border-t pt-4">
                    <h4 class="font-semibold text-gray-900 mb-3">Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ:</h4>
                    <div class="space-y-2">
                      <div v-for="ex in extrasSelectedList" :key="ex.name" class="flex justify-between text-sm">
                <span>{{ ex.name }} Г— {{ ex.quantity }}</span>
                        <span class="text-orange-600">{{ formatPrice(ex.price * ex.quantity) }}</span>
            </div>
          </div>
                  </div>
                  
                  <!-- РљРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ -->
                  <div class="border-t pt-4">
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-gray-900">РљРѕР»РёС‡РµСЃС‚РІРѕ РїРµСЂСЃРѕРЅ:</span>
                      <span class="text-orange-600 font-bold">{{ persons }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Р¤РѕСЂРјР° РґР°РЅРЅС‹С… РєР»РёРµРЅС‚Р° -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-user mr-3"></i>
                  Р”Р°РЅРЅС‹Рµ РґР»СЏ РґРѕСЃС‚Р°РІРєРё
                </h2>
              </div>
              
              <div class="p-6 space-y-6">
                <!-- РРјСЏ -->
            <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-user mr-2"></i>
                    Р’Р°С€Рµ РёРјСЏ (Р¤РРћ)
                  </label>
                  <input 
                    v-model="customerName" 
                    type="text" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                    placeholder="РРІР°РЅ РРІР°РЅРѕРІ" 
                    required 
                  />
            </div>

                <!-- РђРґСЂРµСЃ -->
                <div class="grid md:grid-cols-2 gap-4">
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-city mr-2"></i>
                      Р“РѕСЂРѕРґ
                    </label>
                    <input 
                      list="cities" 
                      v-model="customerCity" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="Р’С‹Р±РµСЂРёС‚Рµ РёР»Рё РІРІРµРґРёС‚Рµ РіРѕСЂРѕРґ" 
                      required 
                    />
              <datalist id="cities">
                <option value="РњРѕСЃРєРІР°"></option>
                <option value="РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі"></option>
                <option value="РљР°Р·Р°РЅСЊ"></option>
                <option value="РќРѕРІРѕСЃРёР±РёСЂСЃРє"></option>
                <option value="РЎРѕС‡Рё"></option>
                <option value="Р•РєР°С‚РµСЂРёРЅР±СѓСЂРі"></option>
              </datalist>
            </div>
                  
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-road mr-2"></i>
                      РЈР»РёС†Р°
                    </label>
                    <input 
                      list="streets" 
                      v-model="customerStreet" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="РЈР»РёС†Р°" 
                      required 
                    />
              <datalist id="streets">
                <option value="Р›РµРЅРёРЅР°"></option>
                <option value="РўРІРµСЂСЃРєР°СЏ"></option>
                <option value="РќРµРІСЃРєРёР№ РїСЂРѕСЃРїРµРєС‚"></option>
                <option value="РЎР°РґРѕРІР°СЏ"></option>
                <option value="РџСѓС€РєРёРЅСЃРєР°СЏ"></option>
              </datalist>
            </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-home mr-2"></i>
                      Р”РѕРј / РљРІР°СЂС‚РёСЂР°
                    </label>
                    <input 
                      v-model="customerApartment" 
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" 
                      placeholder="РќР°РїСЂРёРјРµСЂ, 10 РєРІ.5" 
                      required 
                    />
            </div>
                  
            <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-phone mr-2"></i>
                      РўРµР»РµС„РѕРЅ РґР»СЏ СЃРІСЏР·Рё
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

            <!-- Р’СЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-clock mr-3"></i>
                  Р’СЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё
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
                        РљР°Рє РјРѕР¶РЅРѕ СЃРєРѕСЂРµРµ
                      </div>
                      <div class="text-sm text-gray-600">Р”РѕСЃС‚Р°РІРёРј РІ С‚РµС‡РµРЅРёРµ 30-60 РјРёРЅСѓС‚</div>
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
                        Р—Р°РїР»Р°РЅРёСЂРѕРІР°С‚СЊ РЅР° РІСЂРµРјСЏ
                      </div>
                      <div class="text-sm text-gray-600">Р’С‹Р±РµСЂРёС‚Рµ СѓРґРѕР±РЅРѕРµ РІСЂРµРјСЏ</div>
                    </div>
                  </label>
                </div>
                
                <div v-if="deliveryTime === 'scheduled'" class="mt-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-calendar-alt mr-2"></i>
                    Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚Сѓ Рё РІСЂРµРјСЏ
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
                    РњРёРЅРёРјР°Р»СЊРЅРѕРµ РІСЂРµРјСЏ Р·Р°РєР°Р·Р°: 1 С‡Р°СЃ РѕС‚ С‚РµРєСѓС‰РµРіРѕ РІСЂРµРјРµРЅРё
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- РџСЂР°РІР°СЏ РєРѕР»РѕРЅРєР° - РёС‚РѕРіРѕ Рё РїРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-calculator mr-3"></i>
                  РС‚РѕРіРѕ Рє РѕРїР»Р°С‚Рµ
                </h2>
              </div>
              
              <div class="p-6 space-y-4">
                <!-- Р”РµС‚Р°Р»РёР·Р°С†РёСЏ -->
                <div class="space-y-3">
                  <div class="flex justify-between text-gray-600">
                    <span>РўРѕРІР°СЂС‹ ({{ items.reduce((sum, item) => sum + item.quantity, 0) }} С€С‚.)</span>
                    <span>{{ formatPrice(total) }}</span>
                  </div>
                  
                  <div v-if="extrasTotal > 0" class="flex justify-between text-gray-600">
                    <span>Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ</span>
                    <span>{{ formatPrice(extrasTotal) }}</span>
                  </div>
                  
                  <div class="border-t pt-3">
                    <div class="flex justify-between text-2xl font-bold text-gray-900">
                      <span>РС‚РѕРіРѕ</span>
                      <span class="text-orange-600">{{ formatPrice(total + extrasTotal) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- РљРЅРѕРїРєР° РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ -->
                <button 
                  @click="submitOrder" 
                  class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <i class="fa-solid fa-check-circle"></i>
                  <span>РџРѕРґС‚РІРµСЂРґРёС‚СЊ Р·Р°РєР°Р·</span>
                </button>
                
                <!-- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ -->
                <div class="text-center text-sm text-gray-500 space-y-2">
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-shield-alt text-green-500"></i>
                    <span>Р‘РµР·РѕРїР°СЃРЅР°СЏ РѕРїР»Р°С‚Р°</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-truck text-blue-500"></i>
                    <span>Р‘С‹СЃС‚СЂР°СЏ РґРѕСЃС‚Р°РІРєР°</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-undo text-purple-500"></i>
                    <span>Р’РѕР·РІСЂР°С‚ РІ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ</span>
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
    // Р—Р°РіСЂСѓР¶Р°РµРј SEO РґР°РЅРЅС‹Рµ
    const seoData = ref(null);
    
    async function fetchSEOData() {
      try {
        const response = await axios.get('/api/seo');
        seoData.value = response.data;
      } catch (e) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё SEO РґР°РЅРЅС‹С…:', e);
      }
    }
    
    // SEO РјРµС‚Р°-С‚РµРіРё РґР»СЏ СЃС‚СЂР°РЅРёС†С‹ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р° (СѓРїСЂРѕС‰РµРЅРЅР°СЏ РІРµСЂСЃРёСЏ)
    function updateCheckoutPageTitle() {
      document.title = 'РћС„РѕСЂРјР»РµРЅРёРµ Р·Р°РєР°Р·Р° | РРЅС‚РµСЂРЅРµС‚вЂ‘РјР°РіР°Р·РёРЅ СЃСѓС€Рё Рё РїРёС†С†С‹ | РўРѕС‡РєР° СЃСѓС€Рё Рё РїРёС†С†С‹';
    }
    
    onMounted(() => {
      updateCheckoutPageTitle();
    });

    const items = computed(() => cart.items);
    const persons = computed(() => cart.persons);
    // С‚Рµ Р¶Рµ РґРѕРїС‹, С‡С‚Рѕ РІ РєРѕСЂР·РёРЅРµ
    const extras = [
      { name: 'РЎРѕРµРІС‹Р№ СЃРѕСѓСЃ', price: 50 },
      { name: 'РРјР±РёСЂСЊ', price: 50 },
      { name: 'Р’Р°СЃР°Р±Рё', price: 50 }
    ];
    // Р’С‹Р±РѕСЂ РґРѕРїРѕРІ Р±РµСЂС‘Рј РЅР°РїСЂСЏРјСѓСЋ РёР· РєРѕСЂР·РёРЅС‹. РЎРѕР·РґР°С‘Рј СЃРїРёСЃРѕРє РІС‹Р±СЂР°РЅРЅС‹С… РґРѕРїРѕРІ РґР»СЏ СѓРґРѕР±СЃС‚РІР° РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ.
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
    
    // Р’СЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё - Р±РµСЂРµРј РёР· РіР»РѕР±Р°Р»СЊРЅРѕРіРѕ СЃРѕСЃС‚РѕСЏРЅРёСЏ РєРѕСЂР·РёРЅС‹
    const deliveryTime = computed({
      get() { return cart.deliveryTime; },
      set(val) { cart.deliveryTime = val; }
    });
    const scheduledTime = computed({
      get() { return cart.scheduledTime; },
      set(val) { cart.scheduledTime = val; }
    });
    
    // РњРёРЅРёРјР°Р»СЊРЅР°СЏ РґР°С‚Р° РґР»СЏ РІС‹Р±РѕСЂР° РІСЂРµРјРµРЅРё (С‚РµРєСѓС‰РµРµ РІСЂРµРјСЏ + 1 С‡Р°СЃ)
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
        alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РІСЃРµ РїРѕР»СЏ (Р¤РРћ, РіРѕСЂРѕРґ, СѓР»РёС†Р°, РґРѕРј/РєРІР°СЂС‚РёСЂР°, С‚РµР»РµС„РѕРЅ).');
        return;
      }
      
      // Р’Р°Р»РёРґР°С†РёСЏ РІСЂРµРјРµРЅРё РґРѕСЃС‚Р°РІРєРё
      if (deliveryTime.value === 'scheduled' && !scheduledTime.value) {
        alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІС‹Р±РµСЂРёС‚Рµ РІСЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё.');
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
        // РѕС‡РёС‰Р°РµРј РєРѕСЂР·РёРЅСѓ
        cart.items.splice(0, cart.items.length);
        cart.persons = 1;
        cart.extrasSelection = cart.extrasSelection.map(() => 0);
        cart.deliveryTime = 'asap';
        cart.scheduledTime = '';
        const orderId = response.data.id;
        // РїРµСЂРµРЅР°РїСЂР°РІР»СЏРµРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РЅР° СЃС‚СЂР°РЅРёС†Сѓ Р·Р°РІРµСЂС€РµРЅРёСЏ Р·Р°РєР°Р·Р°
        router.push({ path: '/thankyou', query: { orderId } });
      } catch (e) {
        console.error('РћС€РёР±РєР° РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°', e);
        alert('РќРµ СѓРґР°Р»РѕСЃСЊ РѕС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р·. РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·.');
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
 * РљРѕРјРїРѕРЅРµРЅС‚ СЃС‚СЂР°РЅРёС†С‹ Р±Р»Р°РіРѕРґР°СЂРЅРѕСЃС‚Рё РїРѕСЃР»Рµ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°.
 * РџРѕР·РІРѕР»СЏРµС‚ РїРµСЂРµР№С‚Рё РЅР° РіР»Р°РІРЅСѓСЋ РёР»Рё РѕСЃС‚Р°РІРёС‚СЊ РѕС‚Р·С‹РІ.
 */
const ThankYouView = {
  name: 'ThankYouView',
  template: /* html */`
    <section class="py-12" style="background-color:#ffebb7;">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow p-6 text-center">
        <h2 class="text-2xl font-bold mb-4 text-red-700">РЎРїР°СЃРёР±Рѕ Р·Р° РІР°С€ Р·Р°РєР°Р·!</h2>
        <p class="mb-6">Р’Р°С€ Р·Р°РєР°Р· СѓСЃРїРµС€РЅРѕ РїСЂРёРЅСЏС‚. РњС‹ С†РµРЅРёРј РІР°С€Рµ РґРѕРІРµСЂРёРµ.</p>
        <div class="space-y-4">
          <button @click="goHome" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition">Р’РµСЂРЅСѓС‚СЊСЃСЏ РЅР° РіР»Р°РІРЅСѓСЋ</button>
          <button @click="goReview" class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full transition">РћСЃС‚Р°РІРёС‚СЊ РѕС‚Р·С‹РІ</button>
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
 * РљРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ РѕСЃС‚Р°РІР»РµРЅРёСЏ РѕС‚Р·С‹РІР°.
 * РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РјРѕР¶РµС‚ СѓРєР°Р·Р°С‚СЊ РѕС†РµРЅРєСѓ, РєРѕРјРјРµРЅС‚Р°СЂРёР№, РёРјСЏ Рё С‚РµР»РµС„РѕРЅ.
 * РџСЂРё Р¶РµР»Р°РЅРёРё РјРѕР¶РЅРѕ СЃРѕР·РґР°С‚СЊ СѓС‡С‘С‚РЅСѓСЋ Р·Р°РїРёСЃСЊ, СѓРєР°Р·Р°РІ С‚РµР»РµС„РѕРЅ. РЎРіРµРЅРµСЂРёСЂРѕРІР°РЅРЅС‹Р№ РїР°СЂРѕР»СЊ РѕС‚РѕР±СЂР°Р¶Р°РµС‚СЃСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ.
 */
const ReviewView = {
  name: 'ReviewView',
  template: /* html */`
    <section class="py-12" style="background-color:#ffebb7;">
      <div class="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold mb-4 text-red-700">РћСЃС‚Р°РІРёС‚СЊ РѕС‚Р·С‹РІ</h2>
        <p class="mb-6 text-gray-700">РќР°Рј РІР°Р¶РЅРѕ РІР°С€Рµ РјРЅРµРЅРёРµ. РћС†РµРЅРёС‚Рµ РЅР°С€ СЃРµСЂРІРёСЃ Рё РїРѕРґРµР»РёС‚РµСЃСЊ РІРїРµС‡Р°С‚Р»РµРЅРёСЏРјРё.</p>
        <div class="space-y-4">
          <div>
            <label class="block font-medium mb-1">РћС†РµРЅРєР°</label>
            <select v-model.number="rating" class="w-full border rounded px-3 py-2">
              <option disabled value="0">Р’С‹Р±РµСЂРёС‚Рµ РѕС†РµРЅРєСѓ</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} в…</option>
            </select>
          </div>
          <div>
            <label class="block font-medium mb-1">РљРѕРјРјРµРЅС‚Р°СЂРёР№</label>
            <textarea v-model="comment" class="w-full border rounded px-3 py-2" rows="4" placeholder="РќР°РїРёС€РёС‚Рµ РІР°С€ РѕС‚Р·С‹РІ..." required></textarea>
          </div>
          <div>
            <label class="block font-medium mb-1">Р’Р°С€Рµ РёРјСЏ (РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ)</label>
            <input v-model="name" type="text" class="w-full border rounded px-3 py-2" placeholder="Р’Р°С€Рµ РёРјСЏ" />
          </div>
          <div>
            <label class="block font-medium mb-1">РўРµР»РµС„РѕРЅ (РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ)</label>
            <input v-model="phone" type="tel" class="w-full border rounded px-3 py-2" placeholder="8XXXXXXXXXX" />
          </div>
          <div class="flex items-center space-x-2">
            <input id="createAccount" type="checkbox" v-model="createAccount" class="h-4 w-4">
            <label for="createAccount" class="select-none">РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚ (СЃРіРµРЅРµСЂРёСЂСѓРµРј РїР°СЂРѕР»СЊ)</label>
          </div>
          <div v-if="generatedPassword" class="bg-green-50 border border-green-200 text-green-800 p-3 rounded text-sm">
            <p>РЈС‡С‘С‚РЅР°СЏ Р·Р°РїРёСЃСЊ СЃРѕР·РґР°РЅР°. Р’Р°С€ РїР°СЂРѕР»СЊ: <strong>{{ generatedPassword }}</strong></p>
            <p class="mt-1 text-gray-600">РЎРѕС…СЂР°РЅРёС‚Рµ РµРіРѕ. РќР° РїРѕС‡С‚Сѓ Р±СѓРґРµС‚ РІС‹СЃР»Р°РЅРѕ РїРёСЃСЊРјРѕ СЃ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёРµРј (РІ СЂРµР°Р»СЊРЅРѕРј РїСЂРёР»РѕР¶РµРЅРёРё).</p>
          </div>
          <button @click="submitReview" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition">РћС‚РїСЂР°РІРёС‚СЊ РѕС‚Р·С‹РІ</button>
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
        alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, СѓРєР°Р¶РёС‚Рµ РѕС†РµРЅРєСѓ Рё Р·Р°РїРѕР»РЅРёС‚Рµ РєРѕРјРјРµРЅС‚Р°СЂРёР№.');
        return;
      }
      let registeredPhone = '';
      // РµСЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ С…РѕС‡РµС‚ СЃРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚ Рё СѓРєР°Р·Р°Р» С‚РµР»РµС„РѕРЅ
      if (createAccount.value && phone.value.trim()) {
        try {
          const res = await axios.post('/api/users', { phone: phone.value.trim() });
          registeredPhone = res.data.phone;
          generatedPassword.value = res.data.password;
        } catch (e) {
          console.error('РћС€РёР±РєР° СЂРµРіРёСЃС‚СЂР°С†РёРё РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ', e);
          alert('РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ СѓС‡С‘С‚РЅСѓСЋ Р·Р°РїРёСЃСЊ. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.');
          return;
        }
      }
      // РѕС‚РїСЂР°РІР»СЏРµРј РѕС‚Р·С‹РІ
      try {
        await axios.post('/api/reviews', {
          rating: rating.value,
          comment: comment.value.trim(),
          name: name.value.trim(),
          phone: createAccount.value ? phone.value.trim() : '',
          orderId
        });
        alert('РЎРїР°СЃРёР±Рѕ Р·Р° РІР°С€ РѕС‚Р·С‹РІ!');
        router.push('/');
      } catch (e) {
        console.error('РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё РѕС‚Р·С‹РІР°', e);
        alert('РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ РѕС‚Р·С‹РІ. РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·.');
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
 * Р“Р»Р°РІРЅС‹Р№ РєРѕРјРїРѕРЅРµРЅС‚ Р°РґРјРёРЅРєРё, РѕС‚РѕР±СЂР°Р¶Р°РµС‚ СЃСЃС‹Р»РєРё РЅР° СЂР°Р·РґРµР»С‹ СѓРїСЂР°РІР»РµРЅРёСЏ.
 */
const AdminHomeView = {
  name: 'AdminHomeView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Р—Р°РіРѕР»РѕРІРѕРє -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">РџР°РЅРµР»СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°</h1>
          <p class="text-gray-600">РЈРїСЂР°РІР»РµРЅРёРµ РёРЅС‚РµСЂРЅРµС‚-РјР°РіР°Р·РёРЅРѕРј СЃСѓС€Рё</p>
        </div>
        
        <!-- РЎС‚Р°С‚РёСЃС‚РёРєР° -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <i class="fa-solid fa-box text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">РўРѕРІР°СЂС‹</p>
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
                <p class="text-sm font-medium text-gray-500">Р—Р°РєР°Р·С‹</p>
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
                <p class="text-sm font-medium text-gray-500">РќРѕРІРѕСЃС‚Рё</p>
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
                <p class="text-sm font-medium text-gray-500">РћС‚Р·С‹РІС‹</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.reviews }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- РњРµРЅСЋ СѓРїСЂР°РІР»РµРЅРёСЏ -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="/admin/products" class="group">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
                  <i class="fa-solid fa-box text-xl"></i>
                </div>
                <h3 class="ml-4 text-lg font-semibold text-gray-900">РўРѕРІР°СЂС‹</h3>
              </div>
              <p class="text-gray-600 mb-4">РЈРїСЂР°РІР»РµРЅРёРµ РєР°С‚Р°Р»РѕРіРѕРј С‚РѕРІР°СЂРѕРІ, РґРѕР±Р°РІР»РµРЅРёРµ, СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ Рё СѓРґР°Р»РµРЅРёРµ РїРѕР·РёС†РёР№</p>
              <div class="flex items-center text-blue-600 group-hover:text-blue-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
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
                <h3 class="ml-4 text-lg font-semibold text-gray-900">РљР°С‚РµРіРѕСЂРёРё</h3>
              </div>
              <p class="text-gray-600 mb-4">РЈРїСЂР°РІР»РµРЅРёРµ РєР°С‚РµРіРѕСЂРёСЏРјРё С‚РѕРІР°СЂРѕРІ, СЃРѕР·РґР°РЅРёРµ Рё СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ СЂР°Р·РґРµР»РѕРІ</p>
              <div class="flex items-center text-green-600 group-hover:text-green-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
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
                <h3 class="ml-4 text-lg font-semibold text-gray-900">РќРѕРІРѕСЃС‚Рё</h3>
              </div>
              <p class="text-gray-600 mb-4">РЎРѕР·РґР°РЅРёРµ Рё СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ РЅРѕРІРѕСЃС‚РµР№, РїСѓР±Р»РёРєР°С†РёСЏ РѕР±РЅРѕРІР»РµРЅРёР№</p>
              <div class="flex items-center text-yellow-600 group-hover:text-yellow-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
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
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Р—Р°РєР°Р·С‹</h3>
              </div>
              <p class="text-gray-600 mb-4">РџСЂРѕСЃРјРѕС‚СЂ Рё СѓРїСЂР°РІР»РµРЅРёРµ Р·Р°РєР°Р·Р°РјРё РєР»РёРµРЅС‚РѕРІ, РѕС‚СЃР»РµР¶РёРІР°РЅРёРµ СЃС‚Р°С‚СѓСЃРѕРІ</p>
              <div class="flex items-center text-red-600 group-hover:text-red-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
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
                <h3 class="ml-4 text-lg font-semibold text-gray-900">РћС‚Р·С‹РІС‹</h3>
              </div>
              <p class="text-gray-600 mb-4">РџСЂРѕСЃРјРѕС‚СЂ Рё СѓРїСЂР°РІР»РµРЅРёРµ РѕС‚Р·С‹РІР°РјРё РєР»РёРµРЅС‚РѕРІ, Р°РЅР°Р»РёР· СЂРµР№С‚РёРЅРіРѕРІ</p>
              <div class="flex items-center text-purple-600 group-hover:text-purple-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
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
              <p class="text-gray-600 mb-4">РЈРїСЂР°РІР»РµРЅРёРµ РјРµС‚Р°-С‚РµРіР°РјРё, Open Graph, Twitter Cards, sitemap Рё robots.txt</p>
              <div class="flex items-center text-indigo-600 group-hover:text-indigo-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
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
                <h3 class="ml-4 text-lg font-semibold text-gray-900">Р‘Р»РѕРєРё РєР°С‚РµРіРѕСЂРёР№</h3>
              </div>
              <p class="text-gray-600 mb-4">РЈРїСЂР°РІР»РµРЅРёРµ Р±Р»РѕРєРѕРј "РљР°С‚РµРіРѕСЂРёРё Рё Р±Р»СЋРґР°" РЅР° РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ</p>
              <div class="flex items-center text-pink-600 group-hover:text-pink-700">
                <span class="text-sm font-medium">РџРµСЂРµР№С‚Рё Рє СѓРїСЂР°РІР»РµРЅРёСЋ</span>
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  `,
  setup() {
    const stats = ref({
      products: 0,
      orders: 0,
      news: 0,
      reviews: 0
    });
    
    async function fetchStats() {
      try {
        const [productsRes, ordersRes, newsRes, reviewsRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders'),
          axios.get('/api/news'),
          axios.get('/api/reviews')
        ]);
        
        stats.value = {
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          news: newsRes.data.length,
          reviews: reviewsRes.data.length
        };
      } catch (e) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё СЃС‚Р°С‚РёСЃС‚РёРєРё', e);
      }
    }
    
    onMounted(fetchStats);
    
    return { stats };
  }
};

/**
 * РљРѕРјРїРѕРЅРµРЅС‚ СѓРїСЂР°РІР»РµРЅРёСЏ РєР°С‚РµРіРѕСЂРёСЏРјРё
 */
const AdminCategoriesView = {
  name: 'AdminCategoriesView',
  template: /* html */`
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Р—Р°РіРѕР»РѕРІРѕРє -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
    <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">РЈРїСЂР°РІР»РµРЅРёРµ РєР°С‚РµРіРѕСЂРёСЏРјРё</h1>
              <p class="text-gray-600">РЎРѕР·РґР°РЅРёРµ Рё СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ РєР°С‚РµРіРѕСЂРёР№ С‚РѕРІР°СЂРѕРІ</p>
    </div>
            <button @click="showAddForm = true" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition flex items-center">
              <i class="fa-solid fa-plus mr-2"></i>
              Р”РѕР±Р°РІРёС‚СЊ РєР°С‚РµРіРѕСЂРёСЋ
            </button>
          </div>
        </div>
        
        <!-- РЎРїРёСЃРѕРє РєР°С‚РµРіРѕСЂРёР№ -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">РЎРїРёСЃРѕРє РєР°С‚РµРіРѕСЂРёР№</h2>
          </div>
          
          <div v-if="loading" class="p-8 text-center">
            <i class="fa-solid fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="mt-2 text-gray-500">Р—Р°РіСЂСѓР·РєР°...</p>
          </div>
          
          <div v-else-if="categories.length === 0" class="p-8 text-center">
            <i class="fa-solid fa-tags text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">РљР°С‚РµРіРѕСЂРёРё РЅРµ РЅР°Р№РґРµРЅС‹</p>
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
        
        <!-- РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ РґРѕР±Р°РІР»РµРЅРёСЏ/СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ -->
        <div v-if="showAddForm || editingCategory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ editingCategory ? 'Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ РєР°С‚РµРіРѕСЂРёСЋ' : 'Р”РѕР±Р°РІРёС‚СЊ РєР°С‚РµРіРѕСЂРёСЋ' }}
              </h3>
            </div>
            
            <form @submit.prevent="saveCategory" class="p-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">РќР°Р·РІР°РЅРёРµ РєР°С‚РµРіРѕСЂРёРё</label>
                <input 
                  v-model="categoryForm.name" 
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РєР°С‚РµРіРѕСЂРёРё"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">РР·РѕР±СЂР°Р¶РµРЅРёРµ РєР°С‚РµРіРѕСЂРёРё</label>
                <input 
                  v-model="categoryForm.image" 
                  type="url" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="https://example.com/image.jpg"
                />
                <p class="text-xs text-gray-500 mt-1">URL РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ РІ РєР°СЂС‚РѕС‡РєР°С…</p>
              </div>
              
              <div v-if="categoryForm.image" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">РџСЂРµРґРІР°СЂРёС‚РµР»СЊРЅС‹Р№ РїСЂРѕСЃРјРѕС‚СЂ</label>
                <div class="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <img :src="categoryForm.image" alt="РџСЂРµРґРІР°СЂРёС‚РµР»СЊРЅС‹Р№ РїСЂРѕСЃРјРѕС‚СЂ" class="w-full h-full object-cover" />
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  type="button" 
                  @click="cancelEdit" 
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  РћС‚РјРµРЅР°
                </button>
                <button 
                  type="submit" 
                  class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  {{ editingCategory ? 'РЎРѕС…СЂР°РЅРёС‚СЊ' : 'Р”РѕР±Р°РІРёС‚СЊ' }}
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
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РєР°С‚РµРіРѕСЂРёР№', e);
        alert('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєР°С‚РµРіРѕСЂРёРё');
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
        alert(editingCategory.value ? 'РљР°С‚РµРіРѕСЂРёСЏ РѕР±РЅРѕРІР»РµРЅР°' : 'РљР°С‚РµРіРѕСЂРёСЏ РґРѕР±Р°РІР»РµРЅР°');
      } catch (e) {
        console.error('РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ РєР°С‚РµРіРѕСЂРёРё', e);
        alert('РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕС…СЂР°РЅРёС‚СЊ РєР°С‚РµРіРѕСЂРёСЋ');
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
      if (!confirm('Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ СѓРґР°Р»РёС‚СЊ СЌС‚Сѓ РєР°С‚РµРіРѕСЂРёСЋ?')) return;
      
      try {
        await axios.delete(`/api/categories/${id}`);
        await fetchCategories();
        alert('РљР°С‚РµРіРѕСЂРёСЏ СѓРґР°Р»РµРЅР°');
      } catch (e) {
        console.error('РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ РєР°С‚РµРіРѕСЂРёРё', e);
        alert('РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РєР°С‚РµРіРѕСЂРёСЋ');
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

// РћРїСЂРµРґРµР»СЏРµРј РјР°СЂС€СЂСѓС‚С‹ РґР»СЏ РїСЂРёР»РѕР¶РµРЅРёСЏ
const routes = [
  { path: '/', component: HomeView },
  // use modularized views while keeping originals defined for now
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

// Р“Р»РѕР±Р°Р»СЊРЅС‹Р№ РЅР°РІРёРіР°С†РёРѕРЅРЅС‹Р№ РѕС…СЂР°РЅРЅРёРє: Р·Р°РїСЂРµС‰Р°РµРј РґРѕСЃС‚СѓРї Рє /admin*
// РµСЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ СЏРІР»СЏРµС‚СЃСЏ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂРѕРј. Р’ С‚Р°РєРѕРј СЃР»СѓС‡Р°Рµ
// РїРµСЂРµРЅР°РїСЂР°РІР»СЏРµРј РЅР° СЃС‚СЂР°РЅРёС†Сѓ РІС…РѕРґР°.
router.beforeEach((to, from, next) => {
  console.log('Router guard:', { to: to.path, from: from.path });
  
  if (to.path.startsWith('/admin')) {
    // РџСЂРѕРІРµСЂСЏРµРј С‚РѕРєРµРЅ Рё СЂРѕР»СЊ
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Admin access check:', { token: !!token, role, authRole: auth.role });
    
    if (token && role === 'admin') {
      // РћР±РЅРѕРІР»СЏРµРј РіР»РѕР±Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ РµСЃР»Рё РЅСѓР¶РЅРѕ
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
 * РљРѕСЂРЅРµРІРѕР№ РєРѕРјРїРѕРЅРµРЅС‚ РїСЂРёР»РѕР¶РµРЅРёСЏ. РЎРѕРґРµСЂР¶РёС‚ РЅР°РІРёРіР°С†РёСЋ Рё РѕС‚РѕР±СЂР°Р¶Р°РµС‚ С‚РµРєСѓС‰РёР№ РјР°СЂС€СЂСѓС‚.
 */
const App = {
  name: 'App',
  template: /* html */`
    <div class="relative min-h-screen flex flex-col">
      <!-- РђРЅРёРјР°С†РёСЏ Р·Р°РіСЂСѓР·РєРё -->
      <LoadingSpinner v-if="globalLoading.isLoading" />
      
      <header class="bg-white shadow mb-6">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <router-link to="/" class="flex items-center">
              <img src="/assets/logo.png" alt="Logo" class="h-10 w-auto" />
            </router-link>
            <router-link to="/" class="text-gray-600 hover:text-gray-900">РњРµРЅСЋ</router-link>
            <router-link to="/news" class="text-gray-600 hover:text-gray-900">РќРѕРІРѕСЃС‚Рё</router-link>
          </div>
          <div class="flex items-center space-x-6">
            <router-link to="/cart" class="relative text-gray-600 hover:text-gray-900 hidden md:inline-block">
              <i class="fa-solid fa-shopping-cart text-xl"></i>
              <span v-if="cartCount" class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">{{ cartCount }}</span>
            </router-link>
            <div v-if="isAdmin" class="flex items-center space-x-4">
              <router-link to="/admin" class="text-gray-600 hover:text-gray-900">Admin</router-link>
              <button @click="logout" class="text-red-600 hover:text-red-800 text-sm">Р’С‹Р№С‚Рё</button>
            </div>
            <router-link v-else to="/login" class="text-gray-600 hover:text-gray-900">Р’РѕР№С‚Рё</router-link>
          </div>
        </div>
      </header>
      <main class="flex-grow max-w-7xl mx-auto px-4">
        <router-view></router-view>
      </main>
      <!-- РџР»Р°РІР°СЋС‰Р°СЏ РєРЅРѕРїРєР° РєРѕСЂР·РёРЅС‹ Рё РїСЂРµРІСЊСЋ СЃРѕРґРµСЂР¶РёРјРѕРіРѕ -->
      <div v-if="cartCount > 0" class="fixed bottom-6 right-6 z-50">
        <div class="relative">
          <!-- РђРЅРёРјРёСЂРѕРІР°РЅРЅР°СЏ РєРЅРѕРїРєР° РєРѕСЂР·РёРЅС‹ -->
          <button
            @click="goToCart"
            @mouseenter="showCartPreview" @mouseleave="hideCartPreview"
            class="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-3xl group"
          >
            <!-- РРєРѕРЅРєР° РєРѕСЂР·РёРЅС‹ СЃ Р°РЅРёРјР°С†РёРµР№ -->
            <div class="relative">
              <i class="fa-solid fa-shopping-cart text-2xl group-hover:animate-bounce"></i>
              <!-- РџСѓР»СЊСЃРёСЂСѓСЋС‰РёР№ СЌС„С„РµРєС‚ -->
              <div class="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></div>
            </div>
            
            <!-- РЎС‡РµС‚С‡РёРє С‚РѕРІР°СЂРѕРІ СЃ Р°РЅРёРјР°С†РёРµР№ -->
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
              {{ cartCount }}
            </span>
            
            <!-- Р­С„С„РµРєС‚ "РґРѕР±Р°РІР»РµРЅРѕ" -->
            <div v-if="justAdded" class="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              +1
            </div>
          </button>
          
          <!-- РЈР»СѓС‡С€РµРЅРЅРѕРµ РїСЂРµРІСЊСЋ РєРѕСЂР·РёРЅС‹ -->
          <div
            v-if="showPreview"
            @mouseenter="showCartPreview" @mouseleave="hideCartPreview"
            class="absolute bottom-full right-0 mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn"
          >
            <!-- Р—Р°РіРѕР»РѕРІРѕРє РїСЂРµРІСЊСЋ -->
            <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-lg flex items-center">
                  <i class="fa-solid fa-shopping-cart mr-2"></i>
                  РљРѕСЂР·РёРЅР°
                </h4>
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {{ cartCount }} {{ cartCount === 1 ? 'С‚РѕРІР°СЂ' : cartCount < 5 ? 'С‚РѕРІР°СЂР°' : 'С‚РѕРІР°СЂРѕРІ' }}
                </span>
              </div>
            </div>
            
            <!-- РЎРїРёСЃРѕРє С‚РѕРІР°СЂРѕРІ -->
            <div class="max-h-64 overflow-y-auto">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition">
                <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
          </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900 text-sm">{{ item.name }}</div>
                  <div class="text-gray-500 text-xs">Г— {{ item.quantity }}</div>
                </div>
                <div class="font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
              </div>
            </div>
            
            <!-- РС‚РѕРіРѕ Рё РєРЅРѕРїРєР° -->
            <div class="p-4 bg-gray-50">
              <div class="flex justify-between items-center mb-3">
                <span class="font-bold text-gray-900">РС‚РѕРіРѕ:</span>
                <span class="text-2xl font-bold text-orange-600">{{ formatPrice(cartTotal) }}</span>
              </div>
              <button 
                @click="goToCart"
                class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <i class="fa-solid fa-credit-card"></i>
                <span>РћС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р·</span>
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
    // СЃРѕСЃС‚РѕСЏРЅРёРµ РїСЂРµРІСЊСЋ РєРѕСЂР·РёРЅС‹
    const showPreview = ref(false);
    function showCartPreview() {
      showPreview.value = true;
    }
    function hideCartPreview() {
      showPreview.value = false;
    }
    const cartItems = computed(() => cart.items);
    const cartTotal = computed(() => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    
    // Р­С„С„РµРєС‚ "РґРѕР±Р°РІР»РµРЅРѕ" РґР»СЏ РїР»Р°РІР°СЋС‰РµР№ РєРѕСЂР·РёРЅС‹
    const justAdded = ref(false);
    let justAddedTimeout = null;
    
    // РЎР»РµРґРёРј Р·Р° РёР·РјРµРЅРµРЅРёСЏРјРё РІ РєРѕСЂР·РёРЅРµ РґР»СЏ РїРѕРєР°Р·Р° СЌС„С„РµРєС‚Р°
    watch(cartCount, (newCount, oldCount) => {
      if (newCount > oldCount) {
        justAdded.value = true;
        if (justAddedTimeout) clearTimeout(justAddedTimeout);
        justAddedTimeout = setTimeout(() => {
          justAdded.value = false;
        }, 2000);
      }
    });
    
    // Р’С‹С‡РёСЃР»СЏРµРј, СЏРІР»СЏРµС‚СЃСЏ Р»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂРѕРј
    const isAdmin = computed(() => auth.role === 'admin');
    
    // Р¤СѓРЅРєС†РёСЏ РІС‹С…РѕРґР° РёР· Р°РєРєР°СѓРЅС‚Р°
    function logout() {
      auth.token = '';
      auth.role = '';
      router.push('/');
    }
    
    // Р¤СѓРЅРєС†РёСЏ С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёСЏ С†РµРЅС‹
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

// РЎРѕР·РґР°С‘Рј Рё РјРѕРЅС‚РёСЂСѓРµРј РїСЂРёР»РѕР¶РµРЅРёРµ
// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ Р°РґРјРёРЅСЃРєРёС… РєРѕРјРїРѕРЅРµРЅС‚РѕРІ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё РјРѕРґСѓР»РµР№
function updateAdminComponents() {
  if (window.AdminOrdersView) {
    app.component('AdminOrdersView', window.AdminOrdersView);
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

// РћР±РЅРѕРІР»СЏРµРј РєРѕРјРїРѕРЅРµРЅС‚С‹ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё РјРѕРґСѓР»РµР№
setTimeout(updateAdminComponents, 100);

// Р”РµР»Р°РµРј С„СѓРЅРєС†РёСЋ РѕР±РЅРѕРІР»РµРЅРёСЏ РіР»РѕР±Р°Р»СЊРЅРѕ РґРѕСЃС‚СѓРїРЅРѕР№
window.updateAdminComponents = updateAdminComponents;

// Р—Р°РІРµСЂС€Р°РµРј Р·Р°РіСЂСѓР·РєСѓ РїРѕСЃР»Рµ РёРЅРёС†РёР°Р»РёР·Р°С†РёРё РїСЂРёР»РѕР¶РµРЅРёСЏ
document.addEventListener('DOMContentLoaded', () => {
  // РќРµР±РѕР»СЊС€Р°СЏ Р·Р°РґРµСЂР¶РєР° РґР»СЏ РґРµРјРѕРЅСЃС‚СЂР°С†РёРё Р°РЅРёРјР°С†РёРё
  setTimeout(() => {
    globalLoading.progress = 100;
  }, 1500);
});
