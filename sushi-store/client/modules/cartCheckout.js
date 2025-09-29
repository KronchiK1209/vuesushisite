// Cart and Checkout views extracted from main.js
// Assumes global Vue, VueRouter, axios, and shared states cart, auth, and helpers are available.

// Присваиваем экспорты в window для совместимости с браузером
window.CartView = {
  name: 'CartView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
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
          <div class="lg:col-span-2 space-y-6">
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
                    <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                      <p class="text-gray-600">{{ formatPrice(item.price) }} за штуку</p>
                    </div>
                    <div class="flex items-center space-x-3">
                      <button @click="decrease(item)" class="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                        <i class="fa-solid fa-minus text-gray-600"></i>
                      </button>
                      <span class="text-xl font-bold text-gray-900 min-w-[2rem] text-center">{{ item.quantity }}</span>
                      <button @click="increase(item)" class="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-orange-600">{{ formatPrice(item.price * item.quantity) }}</div>
                    </div>
                    <button @click="removeItem(item)" class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition" title="Удалить товар">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
                    <button @click="decreaseExtra(idx)" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                      <i class="fa-solid fa-minus text-gray-600 text-sm"></i>
                    </button>
                    <span class="text-lg font-bold text-gray-900 min-w-[1.5rem] text-center">{{ extrasSelection[idx] }}</span>
                    <button @click="increaseExtra(idx)" class="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition">
                      <i class="fa-solid fa-plus text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-users mr-3"></i>
                  Количество персон
                </h2>
              </div>
              <div class="p-6">
                <div class="flex items-center justify-center space-x-4">
                  <button @click="decreasePersons" class="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
                    <i class="fa-solid fa-minus text-gray-600"></i>
                  </button>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-gray-900">{{ persons }}</div>
                    <div class="text-sm text-gray-500">{{ persons === 1 ? 'персона' : persons < 5 ? 'персоны' : 'персон' }}</div>
                  </div>
                  <button @click="increasePersons" class="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div class="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-calculator mr-3"></i>
                  Итого
                </h2>
              </div>
              <div class="p-6 space-y-4">
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
                <button @click="goToCheckout" class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3">
                  <i class="fa-solid fa-credit-card"></i>
                  <span>Оформить заказ</span>
                </button>
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
    const { ref, computed, onMounted } = Vue;
    const { useRouter } = VueRouter;
    const items = computed(() => cart.items);
    function increase(item) { item.quantity++; }
    function decrease(item) { if (item.quantity > 1) item.quantity--; else removeItem(item); }
    function removeItem(item) { const index = cart.items.indexOf(item); if (index >= 0) cart.items.splice(index, 1); }
    function formatPrice(price) { return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }); }
    const persons = computed({ get() { return cart.persons; }, set(val) { cart.persons = val; } });
    function increasePersons() { cart.persons++; }
    function decreasePersons() { if (cart.persons > 1) cart.persons--; }
    const extras = [ { name: 'Соевый соус', price: 50 }, { name: 'Имбирь', price: 50 }, { name: 'Васаби', price: 50 } ];
    const extrasSelection = computed({ get() { return cart.extrasSelection; }, set(val) { cart.extrasSelection = val; } });
    function increaseExtra(index) { cart.extrasSelection[index]++; }
    function decreaseExtra(index) { if (cart.extrasSelection[index] > 0) cart.extrasSelection[index]--; }
    const extrasTotal = computed(() => extras.reduce((sum, extra, idx) => sum + extra.price * cart.extrasSelection[idx], 0));
    const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const router = useRouter();
    function goToCheckout() { router.push('/checkout'); }
    onMounted(() => { document.title = 'Корзина | Интернет‑магазин суши и пиццы | Точка суши и пиццы'; });
    return { items, total, increase, decrease, removeItem, formatPrice, persons, increasePersons, decreasePersons, extras, extrasSelection, increaseExtra, decreaseExtra, extrasTotal, goToCheckout };
  }
};

window.CheckoutView = {
  name: 'CheckoutView',
  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
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
          <div class="lg:col-span-2 space-y-6">
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
                  <div v-if="extrasSelectedList.length > 0" class="border-t pt-4">
                    <h4 class="font-semibold text-gray-900 mb-3">Дополнительно:</h4>
                    <div class="space-y-2">
                      <div v-for="ex in extrasSelectedList" :key="ex.name" class="flex justify-between text-sm">
                        <span>{{ ex.name }} × {{ ex.quantity }}</span>
                        <span class="text-orange-600">{{ formatPrice(ex.price * ex.quantity) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="border-t pt-4">
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-gray-900">Количество персон:</span>
                      <span class="text-orange-600 font-bold">{{ persons }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-user mr-3"></i>
                  Данные для доставки
                </h2>
              </div>
              <div class="p-6 space-y-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-user mr-2"></i>
                    Ваше имя (ФИО)
                  </label>
                  <input v-model="customerName" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" placeholder="Иван Иванов" required />
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-city mr-2"></i>
                      Город
                    </label>
                    <input list="cities" v-model="customerCity" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" placeholder="Выберите или введите город" required />
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
                    <input list="streets" v-model="customerStreet" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" placeholder="Улица" required />
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
                    <input v-model="customerApartment" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" placeholder="Например, 10 кв.5" required />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      <i class="fa-solid fa-phone mr-2"></i>
                      Телефон для связи
                    </label>
                    <input v-model="customerPhone" type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" placeholder="8XXXXXXXXXX" required />
                  </div>
                </div>
            </div>
          </div>

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
                  <input type="radio" v-model="deliveryTime" value="asap" class="h-5 w-5 text-orange-600 focus:ring-orange-500" />
                  <div class="ml-4">
                    <div class="font-semibold text-gray-900 flex items-center">
                      <i class="fa-solid fa-bolt text-yellow-500 mr-2"></i>
                      Как можно скорее
                    </div>
                    <div class="text-sm text-gray-600">Доставим в течение 30-60 минут</div>
                  </div>
                </label>
                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition" :class="{ 'border-orange-500 bg-orange-50': deliveryTime === 'scheduled' }">
                  <input type="radio" v-model="deliveryTime" value="scheduled" class="h-5 w-5 text-orange-600 focus:ring-orange-500" />
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
                <input type="datetime-local" v-model="scheduledTime" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" :min="minDateTime" required />
                <p class="text-sm text-gray-500 mt-2">
                  <i class="fa-solid fa-info-circle mr-1"></i>
                  Минимальное время заказа: 1 час от текущего времени
                </p>
              </div>
            </div>
          </div>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div class="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <h2 class="text-xl font-bold flex items-center">
                  <i class="fa-solid fa-calculator mr-3"></i>
                  Итого к оплате
                </h2>
              </div>
              <div class="p-6 space-y-4">
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
                <button @click="submitOrder" class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3">
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Подтвердить заказ</span>
                </button>
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
    const { ref, computed, onMounted } = Vue;
    const { useRouter } = VueRouter;
    const items = computed(() => cart.items);
    const persons = computed(() => cart.persons);
    const extras = [ { name: 'Соевый соус', price: 50 }, { name: 'Имбирь', price: 50 }, { name: 'Васаби', price: 50 } ];
    const extrasSelection = computed(() => cart.extrasSelection);
    const extrasSelectedList = computed(() => extras.map((extra, idx) => ({ ...extra, quantity: cart.extrasSelection[idx] })).filter(item => item.quantity > 0));
    const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const extrasTotal = computed(() => extras.reduce((sum, extra, idx) => sum + extra.price * cart.extrasSelection[idx], 0));
    const customerName = ref('');
    const customerCity = ref('');
    const customerStreet = ref('');
    const customerApartment = ref('');
    const customerPhone = ref('');
    const deliveryTime = computed({ get() { return cart.deliveryTime; }, set(val) { cart.deliveryTime = val; } });
    const scheduledTime = computed({ get() { return cart.scheduledTime; }, set(val) { cart.scheduledTime = val; } });
    const minDateTime = computed(() => { const now = new Date(); now.setHours(now.getHours() + 1); return now.toISOString().slice(0, 16); });
    const router = useRouter();
    function formatPrice(price) { return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }); }
    async function submitOrder() {
      if (!customerName.value.trim() || !customerCity.value.trim() || !customerStreet.value.trim() || !customerApartment.value.trim() || !customerPhone.value.trim()) {
        alert('Пожалуйста, заполните все поля (ФИО, город, улица, дом/квартира, телефон).');
        return;
      }
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
        items: cart.items.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price }))
      };
      try {
        const response = await axios.post('/api/orders', order);
        cart.items.splice(0, cart.items.length);
        cart.persons = 1;
        cart.extrasSelection = cart.extrasSelection.map(() => 0);
        cart.deliveryTime = 'asap';
        cart.scheduledTime = '';
        const orderId = response.data.id;
        router.push({ path: '/thankyou', query: { orderId } });
      } catch (e) {
        console.error('Ошибка оформления заказа', e);
        alert('Не удалось оформить заказ. Попробуйте ещё раз.');
      }
    }
    onMounted(() => { document.title = 'Оформление заказа | Интернет‑магазин суши и пиццы | Точка суши и пиццы'; });
    return { items, persons, extras, extrasSelection, extrasSelectedList, total, extrasTotal, formatPrice, customerName, customerCity, customerStreet, customerApartment, customerPhone, deliveryTime, scheduledTime, minDateTime, submitOrder };
  }
};



