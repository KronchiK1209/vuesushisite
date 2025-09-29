// Floating cart module: renders a floating cart button with badge in the bottom-right
// Exports component via window for browser compatibility

(function () {
  const { ref, computed, onMounted, onUnmounted } = Vue;

  window.FloatingCart = {
    name: 'FloatingCart',
    template: /* html */`
      <div 
        class="fixed right-4 bottom-4 z-[999]"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
      >
        <button 
          @click="goToCart"
          class="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl rounded-full px-5 py-4 flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <i class="fa-solid fa-shopping-basket text-xl"></i>
          <div class="flex flex-col items-start leading-tight">
            <span class="text-xs opacity-90">Корзина</span>
            <span class="text-sm font-bold" v-text="totalFormatted"></span>
          </div>
          <span 
            v-if="count > 0"
            class="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full h-6 min-w-[24px] px-1 flex items-center justify-center shadow-md"
            v-text="count"
          ></span>
        </button>

        <!-- Поповер превью корзины -->
        <div 
          v-show="opened && count > 0"
          class="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn"
        >
          <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div class="font-semibold text-gray-900 flex items-center">
              <i class="fa-solid fa-bag-shopping text-orange-500 mr-2"></i>
              Ваша корзина
            </div>
            <div class="text-xs text-gray-500">{{ count }} поз.</div>
          </div>
          <div class="max-h-72 overflow-auto">
            <div v-for="it in items" :key="it.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
              <div class="flex items-center space-x-3">
                <img :src="it.image" alt="" class="w-10 h-10 object-cover rounded-lg border border-gray-200" loading="lazy" />
                <div>
                  <div class="text-sm font-medium text-gray-900 truncate max-w-[160px]">{{ it.name }}</div>
                  <div class="text-xs text-gray-500">Цена: {{ formatPriceSafe(it.price) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-700">× {{ it.quantity }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ formatPriceSafe(it.price * it.quantity) }}</div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-600">Итого</span>
              <span class="text-sm font-bold text-orange-600">{{ totalFormatted }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button @click="goToCart" class="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition">
                Оформить
              </button>
              <button @click="opened=false" class="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 transition">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    setup() {
      // Lazily bind to global cart when it appears
      const cartRef = ref(window.cart && window.cart.items ? window.cart : { items: [] });
      let intervalId = null;
      let hideTimer = null;
      const opened = ref(false);
      const router = VueRouter.useRouter();

      onMounted(() => {
        intervalId = setInterval(() => {
          if (window.cart && window.cart.items && cartRef.value !== window.cart) {
            cartRef.value = window.cart;
          }
        }, 150);
      });

      onUnmounted(() => {
        if (intervalId) try { clearInterval(intervalId); } catch (_) {}
        if (hideTimer) try { clearTimeout(hideTimer); } catch (_) {}
      });

      const count = computed(() => {
        const c = cartRef.value && Array.isArray(cartRef.value.items)
          ? cartRef.value.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0)
          : 0;
        return c;
      });

      const items = computed(() => {
        return cartRef.value && Array.isArray(cartRef.value.items) ? cartRef.value.items : [];
      });

      const total = computed(() => {
        const t = cartRef.value && Array.isArray(cartRef.value.items)
          ? cartRef.value.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)
          : 0;
        return t;
      });

      function formatPrice(p) {
        try { return Number(p).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }); } catch (_) { return p + ' ₽'; }
      }

      function formatPriceSafe(p) { return formatPrice(Number(p) || 0); }

      const totalFormatted = computed(() => formatPrice(total.value));

      function goToCart() { try { router.push('/cart'); } catch (_) {} }

      function onEnter() {
        if (count.value > 0) {
          if (hideTimer) { try { clearTimeout(hideTimer); } catch (_) {} hideTimer = null; }
          opened.value = true;
        }
      }

      function onLeave() {
        if (hideTimer) { try { clearTimeout(hideTimer); } catch (_) {} }
        hideTimer = setTimeout(() => { opened.value = false; }, 150);
      }

      return { count, items, totalFormatted, goToCart, onEnter, onLeave, opened, formatPriceSafe };
    }
  };
})();


