// Home view extracted from main.js (template and setup kept intact as much as possible)
// Assumes global Vue, VueRouter, axios, and shared globals (cart, auth, addToCart) are available

// Присваиваем экспорты в window для совместимости с браузером
window.HomeView = {
  name: 'HomeView',
  /* NOTE: Template is large; for maintainability we keep behavior identical */
  template: /* html */`
    <div>
      <template v-if="page && page.length > 0">
        <template v-for="(block, idx) in page" :key="block.id || (block.type + '-' + idx)">
          <!-- hero -->
          <section v-if="block.type === 'hero'" :style="{ backgroundColor: siteBackgroundColor }" class="relative text-white overflow-hidden">
            <img :src="block.data?.backgroundImage || heroBackgroundImage" class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="" />
            <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <!-- Динамические элементы Hero -->
                <div v-if="block.data.elements && block.data.elements.length > 0" class="space-y-4">
                  <div v-for="(element, elementIndex) in block.data.elements" :key="element.id">
                    <!-- Heading element -->
                    <component 
                      v-if="element.type === 'heading'" 
                      :is="element.data.level || 'h2'"
                      class="font-bold"
                      :class="[
                        element.data.fontSize || 'text-3xl',
                        element.data.align === 'center' ? 'text-center' : 
                        element.data.align === 'right' ? 'text-right' : 'text-left'
                      ]"
                      :style="{
                        color: element.data.color || '#ffffff',
                        marginTop: element.data.marginTop || '0px',
                        marginBottom: element.data.marginBottom || '16px'
                      }"
                    >
                      {{ element.data.text || 'Новый заголовок' }}
                    </component>

                    <!-- Subheading element -->
                    <h3 
                      v-else-if="element.type === 'subheading'" 
                      class=""
                      :class="[
                        element.data.fontSize || 'text-xl',
                        element.data.align === 'center' ? 'text-center' : 
                        element.data.align === 'right' ? 'text-right' : 'text-left'
                      ]"
                      :style="{
                        color: element.data.color || '#fbbf24',
                        marginTop: element.data.marginTop || '0px',
                        marginBottom: element.data.marginBottom || '12px'
                      }"
                    >
                      {{ element.data.text || 'Новый подзаголовок' }}
                    </h3>

                    <!-- Paragraph element -->
                    <p 
                      v-else-if="element.type === 'paragraph'" 
                      class=""
                      :class="[
                        element.data.fontSize || 'text-base',
                        element.data.align === 'center' ? 'text-center' : 
                        element.data.align === 'right' ? 'text-right' : 'text-left'
                      ]"
                      :style="{
                        color: element.data.color || '#ffffff',
                        marginTop: element.data.marginTop || '0px',
                        marginBottom: element.data.marginBottom || '16px'
                      }"
                    >
                      {{ element.data.text || 'Новый абзац текста' }}
                    </p>

                    <!-- Button element -->
                    <button 
                      v-else-if="element.type === 'button'"
                      @click="scrollToMenu"
                      :class="[
                        'px-6 py-3 rounded-full font-semibold transition flex items-center space-x-2',
                        element.data.style === 'secondary' 
                          ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600' 
                          : 'bg-white text-red-600 hover:bg-gray-100',
                        element.data.align === 'center' ? 'mx-auto' : 
                        element.data.align === 'right' ? 'ml-auto' : 'mr-auto'
                      ]"
                      :style="{
                        marginTop: element.data.marginTop || '0px',
                        marginBottom: element.data.marginBottom || '0px'
                      }"
                    >
                      <span>{{ element.data.text || 'Новая кнопка' }}</span>
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>

                    <!-- Image element -->
                    <div 
                      v-else-if="element.type === 'image'" 
                      class=""
                      :class="[
                        element.data.align === 'center' ? 'text-center' : 
                        element.data.align === 'right' ? 'text-right' : 'text-left'
                      ]"
                      :style="{
                        marginTop: element.data.marginTop || '0px',
                        marginBottom: element.data.marginBottom || '16px'
                      }"
                    >
                      <img 
                        :src="element.data.src || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" 
                        alt="Element image" 
                        class="object-cover rounded-lg"
                        :style="{
                          width: element.data.width || '200px',
                          height: element.data.height || '150px'
                        }"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Fallback если нет элементов -->
                <div v-else class="text-center text-white">
                  <p class="text-yellow-200 uppercase tracking-wider mb-3">{{ (block.data?.heading ?? heroText.heading) || 'Быстро и вкусно' }}</p>
                  <h1 class="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{{ (block.data?.subheading ?? heroText.subheading) || 'Попробуйте наши особые суши' }}</h1>
                  <p class="text-lg mb-6 max-w-md">{{ (block.data?.description ?? heroText.description) || 'Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.' }}</p>
                  <button @click="scrollToMenu" class="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center space-x-2">
                    <span>{{ (block.data?.buttonText ?? heroText.buttonText) || 'Начать заказ' }}</span>
                    <i class="fa-solid fa-arrow-down"></i>
                  </button>
                </div>
              </div>
              <div class="relative hidden md:block">
                <transition name="pixel-fade" mode="out-in">
                  <img :key="currentSlideIndex" :src="(currentSlide && currentSlide.image) || heroImage || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" alt="Слайд" class="w-full h-80 object-cover rounded-lg shadow-lg" />
                </transition>
              </div>
            </div>
            <svg class="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-32" preserveAspectRatio="none" viewBox="0 0 1440 100">
              <path fill="#f9f4e5" d="M0 50 Q 360 80 720 50 T 1440 50 V100 H0 Z"></path>
            </svg>
          </section>

          <!-- categories -->
          <section v-else-if="block.type === 'categories'" class="py-12" style="background-color:#f9f4e5;">
            <h2 class="text-3xl font-bold mb-8 text-center text-black">
              <span class="text-orange-600">{{ (block.data?.heading ?? categoriesText.heading) || 'Категории' }}</span>
              и
              <span class="text-red-600">{{ (block.data?.subheading ?? categoriesText.subheading) || 'блюда' }}</span>,
              {{ (block.data?.description ?? categoriesText.description) || 'которых вы не найдёте нигде' }}
            </h2>
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <div v-for="(cat, index) in categoryBlocks" :key="cat.id" class="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" :style="{ animationDelay: (index * 0.2) + 's' }">
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

          <!-- menu -->
          <section v-else-if="block.type === 'menu'" class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
            <div class="max-w-7xl mx-auto px-4">
              <div class="text-center mb-12">
                <div class="inline-flex items-center space-x-2 mb-4">
                  <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
                  <h2 ref="menuSection" class="text-4xl font-bold text-gray-900">Наше меню</h2>
                  <div class="w-8 h-1 bg-red-500 rounded-full"></div>
                </div>
                <p class="text-gray-600 text-lg max-w-2xl mx-auto">{{ (block.data?.description ?? menuText.subheading) || 'Выберите категорию и наслаждайтесь нашими изысканными блюдами' }}</p>
              </div>
              <!-- sidebar + grid остаются неизменными ниже -->
              <div class="grid lg:grid-cols-4 gap-8">
                <div class="lg:col-span-1">
                  <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                    <div class="mb-6">
                      <label class="block text-sm font-semibold text-gray-700 mb-2"><i class="fa-solid fa-search mr-2 text-orange-500"></i>Поиск по меню</label>
                      <div class="relative"><input v-model="searchQuery" type="text" placeholder="Введите название блюда..." class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" /><i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i></div>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center"><i class="fa-solid fa-tags mr-2 text-orange-500"></i>Категории</h3>
                      <div class="space-y-2">
                        <button @click="selectedVertical = 'Хиты'" :class="['w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group', selectedVertical === 'Хиты' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105' : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 hover:from-yellow-100 hover:to-orange-100 hover:shadow-md']"><span class="font-medium flex items-center"><i class="fa-solid fa-star mr-2 text-yellow-500"></i>Хиты</span><i v-if="selectedVertical === 'Хиты'" class="fa-solid fa-check text-sm"></i><i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i></button>
                        <button v-for="cat in verticalCategories" :key="cat" @click="selectedVertical = cat" :class="['w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group', selectedVertical === cat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105' : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md']"><span class="font-medium">{{ cat }}</span><i v-if="selectedVertical === cat" class="fa-solid fa-check text-sm"></i><i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lg:col-span-3">
                  <div class="mb-6"><h3 class="text-2xl font-bold text-gray-900 mb-2 flex items-center"><i v-if="selectedVertical === 'Хиты'" class="fa-solid fa-star text-yellow-500 mr-3"></i>{{ selectedVertical }}</h3><p class="text-gray-600">{{ selectedVerticalProducts?.length || 0 }} {{ selectedVertical === 'Хиты' ? 'хитов продаж' : 'блюд в этой категории' }}</p></div>
                  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <transition-group name="fade" tag="div" class="contents">
                      <div v-for="product in (selectedVerticalProducts || [])" :key="product.id" class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full" @click="openProductModal(product)">
                        <div class="relative h-48 overflow-hidden"><img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div><div class="absolute top-4 right-4 flex flex-col space-y-2"><div v-if="product.hit" class="bg-yellow-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg"><i class="fa-solid fa-star text-white text-sm"></i></div><div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1"><span class="text-orange-600 font-bold text-sm">{{ formatPrice(product.price) }}</span></div></div></div>
                        <div class="p-6 flex flex-col flex-grow"><h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">{{ product.name }}</h4><p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description }}</p><button @click.stop.prevent="add(product)" class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"><i class="fa-solid fa-plus"></i><span>Заказать</span></button></div>
                      </div>
                    </transition-group>
                  </div>
                  <div v-if="(selectedVerticalProducts || []).length === 0" class="text-center py-12"><i class="fa-solid fa-search text-4xl text-gray-300 mb-4"></i><h3 class="text-xl font-semibold text-gray-500 mb-2">Товары не найдены</h3><p class="text-gray-400">Попробуйте изменить поисковый запрос или выбрать другую категорию</p></div>
                </div>
              </div>
            </div>
          </section>

          <!-- map -->
          <section v-else-if="block.type === 'map'" class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
            <div class="max-w-7xl mx-auto px-4">
              <div class="text-center mb-10"><div class="inline-flex items-center space-x-2 mb-3"><div class="w-8 h-1 bg-orange-500 rounded-full"></div><h2 class="text-3xl font-bold text-gray-900">{{ block.data?.heading || 'Зоны доставки' }}</h2><div class="w-8 h-1 bg-red-500 rounded-full"></div></div><p class="text-gray-600 max-w-2xl mx-auto">{{ block.data?.description || 'Схема доставки и самовывоза. Нажимайте на зоны для подробностей.' }}</p></div>
              <div class="grid lg:grid-cols-3 gap-8 items-start">
                <div class="lg:col-span-2"><div class="w-full rounded-2xl shadow-lg overflow-hidden bg-white"><iframe :src="block.data?.iframeSrc || mapIframeSrc" frameborder="0" allowfullscreen="true" width="100%" height="720" style="display:block"></iframe></div></div>
                <div class="bg-white rounded-2xl shadow-lg p-6"><h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center"><i class="fa-solid fa-truck-fast text-orange-500 mr-2"></i>Условия доставки</h3><div class="mb-5"><h4 class="text-sm font-semibold text-gray-700 mb-2">Обозначения зон на карте</h4><ul class="space-y-2 text-sm"><li class="flex items-center"><span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span><span class="text-gray-700">Синяя — бесплатно от 1500 ₽</span></li><li class="flex items-center"><span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span><span class="text-gray-700">Красная — бесплатно от 1000 ₽</span></li><li class="flex items-center"><span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span><span class="text-gray-700">Золотая — бесплатно от 1300 ₽</span></li><li class="flex items-center"><span class="w-3 h-3 rounded-full bg-purple-500 mr-2"></span><span class="text-gray-700">Сиреневая — бесплатно от 2000 ₽</span></li></ul></div></div>
              </div>
            </div>
          </section>

          <!-- reviews -->
          <section v-else-if="block.type === 'reviews'" class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
            <div class="max-w-7xl mx-auto px-4">
              <div class="text-center mb-10"><div class="inline-flex items-center space-x-2 mb-3"><div class="w-8 h-1 bg-orange-500 rounded-full"></div><h2 class="text-3xl font-bold text-gray-900">{{ (block.data?.heading ?? reviewsText.heading) || 'Отзывы клиентов' }}</h2><div class="w-8 h-1 bg-red-500 rounded-full"></div></div><p class="text-gray-600 max-w-2xl mx-auto">{{ (block.data?.description ?? reviewsText.description) || 'Мы гордимся каждым словом — спасибо за доверие!' }}</p></div>
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="t in visibleTestimonials" :key="t.name + t.quote + (t.createdAt || '')" class="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div class="flex items-center mb-4"><div class="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-orange-200"><img :src="t.image" alt="" class="w-full h-full object-cover" loading="lazy" /></div><div><h3 class="font-semibold text-gray-900">{{ t.name }}</h3><p class="text-xs text-gray-500">{{ t.role }}</p></div></div>
                  <div class="text-orange-400 flex space-x-1 mb-2"><i v-for="n in 5" :key="n" :class="['fa', n <= t.rating ? 'fa-solid fa-star' : 'fa-regular fa-star']"></i></div>
                  <p class="text-gray-700 flex-grow">{{ t.quote }}</p>
                  <div class="mt-4 flex items-center justify-between text-sm text-gray-500"><span v-if="t.createdAt"><i class="fa-solid fa-calendar mr-1"></i>{{ new Date(t.createdAt).toLocaleDateString('ru-RU') }}</span><span class="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-700">Проверенный отзыв</span></div>
                </div>
              </div>
            </div>
          </section>

          <!-- delivery -->
          <section v-else-if="block.type === 'delivery'" class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
            <div class="max-w-7xl mx-auto px-4">
              <div class="text-center mb-10">
                <div class="inline-flex items-center space-x-2 mb-3">
                  <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
                  <h2 class="text-3xl font-bold text-gray-900">{{ (block.data?.heading ?? deliveryText.heading) || 'Быстрая доставка' }}</h2>
                  <div class="w-8 h-1 bg-red-500 rounded-full"></div>
                </div>
                <p class="text-gray-600 max-w-2xl mx-auto">{{ (block.data?.description ?? deliveryText.description) || 'Доставляем свежие суши и пиццу прямо к вашей двери за 30 минут' }}</p>
              </div>
              <div class="grid lg:grid-cols-3 gap-8 items-start">
                <div class="lg:col-span-2">
                  <div class="w-full rounded-2xl shadow-lg overflow-hidden bg-white">
                    <iframe :src="block.data?.iframeSrc || mapIframeSrc" frameborder="0" allowfullscreen="true" width="100%" height="720" style="display:block"></iframe>
                  </div>
                </div>
                <div class="bg-white rounded-2xl shadow-lg p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fa-solid fa-truck-fast text-orange-500 mr-2"></i>
                    Условия доставки
                  </h3>
                  <div class="mb-5">
                    <h4 class="text-sm font-semibold text-gray-700 mb-2">Обозначения зон на карте</h4>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-center">
                        <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        <span class="text-gray-700">Синяя — бесплатно от 1500 ₽</span>
                      </li>
                      <li class="flex items-center">
                        <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        <span class="text-gray-700">Красная — бесплатно от 1000 ₽</span>
                      </li>
                      <li class="flex items-center">
                        <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                        <span class="text-gray-700">Золотая — бесплатно от 1300 ₽</span>
                      </li>
                      <li class="flex items-center">
                        <span class="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                        <span class="text-gray-700">Сиреневая — бесплатно от 2000 ₽</span>
                      </li>
                    </ul>
                  </div>
                  <div class="space-y-3">
                    <div v-for="feature in (block.data?.features ?? deliveryText.features ?? ['Бесплатная доставка от 1500₽', 'Доставка за 30 минут', 'Свежие ингредиенты', 'Горячие блюда'])" :key="feature" class="flex items-center text-gray-700">
                      <i class="fa-solid fa-check text-green-500 mr-2"></i>
                      <span class="text-sm">{{ feature }}</span>
                    </div>
                  </div>
                  <div class="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-orange-700 mb-1">30 мин</div>
                      <div class="text-sm text-orange-600">Среднее время доставки</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>
        
        <!-- Фиксированный блок доставки, если не настроен в конструкторе -->
        <section v-if="!page.some(block => block.type === 'delivery')" class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-10">
              <div class="inline-flex items-center space-x-2 mb-3">
                <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
                <h2 class="text-3xl font-bold text-gray-900">{{ deliveryText.heading || 'Быстрая доставка' }}</h2>
                <div class="w-8 h-1 bg-red-500 rounded-full"></div>
              </div>
              <p class="text-gray-600 max-w-2xl mx-auto">{{ deliveryText.description || 'Доставляем свежие суши и пиццу прямо к вашей двери за 30 минут' }}</p>
            </div>
            <div class="grid lg:grid-cols-3 gap-8 items-start">
              <div class="lg:col-span-2">
                <div class="w-full rounded-2xl shadow-lg overflow-hidden bg-white">
                  <iframe :src="mapIframeSrc" frameborder="0" allowfullscreen="true" width="100%" height="720" style="display:block"></iframe>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <i class="fa-solid fa-truck-fast text-orange-500 mr-2"></i>
                  Условия доставки
                </h3>
                <div class="mb-5">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Обозначения зон на карте</h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-center">
                      <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span class="text-gray-700">Синяя — бесплатно от 1500 ₽</span>
                    </li>
                    <li class="flex items-center">
                      <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span class="text-gray-700">Красная — бесплатно от 1000 ₽</span>
                    </li>
                    <li class="flex items-center">
                      <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                      <span class="text-gray-700">Золотая — бесплатно от 1300 ₽</span>
                    </li>
                    <li class="flex items-center">
                      <span class="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                      <span class="text-gray-700">Сиреневая — бесплатно от 2000 ₽</span>
                    </li>
                  </ul>
                </div>
                <div class="space-y-3">
                  <div v-for="feature in (deliveryText.features || ['Бесплатная доставка от 1500₽', 'Доставка за 30 минут', 'Свежие ингредиенты', 'Горячие блюда'])" :key="feature" class="flex items-center text-gray-700">
                    <i class="fa-solid fa-check text-green-500 mr-2"></i>
                    <span class="text-sm">{{ feature }}</span>
                  </div>
                </div>
                <div class="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-orange-700 mb-1">30 мин</div>
                    <div class="text-sm text-orange-600">Среднее время доставки</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-else>
      <section :style="{ backgroundColor: siteBackgroundColor }" class="relative text-white overflow-hidden">
        <img :src="heroBackgroundImage" class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="" />
        <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <!-- Статический Hero блок с элементами по умолчанию -->
            <div class="space-y-4">
              <!-- Заголовок -->
              <p class="text-yellow-200 uppercase tracking-wider mb-3 text-sm">{{ heroText.heading || 'Быстро и вкусно' }}</p>
              
              <!-- Подзаголовок -->
              <h1 class="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">{{ heroText.subheading || 'Попробуйте наши особые суши' }}</h1>
              
              <!-- Описание -->
              <p class="text-lg mb-6 max-w-md text-white">{{ heroText.description || 'Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.' }}</p>
              
              <!-- Кнопка -->
              <button @click="scrollToMenu" class="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center space-x-2">
                <span>{{ heroText.buttonText || 'Начать заказ' }}</span>
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              
              <!-- Дополнительные элементы -->
              <div class="flex space-x-8 mt-8 text-sm text-white">
                <div class="flex items-center space-x-2"><i class="fa-solid fa-truck-fast"></i><span>Доставка</span></div>
                <div class="flex items-center space-x-2"><i class="fa-solid fa-box-open"></i><span>Самовывоз</span></div>
                <div class="flex items-center space-x-2"><i class="fa-solid fa-chair"></i><span>В ресторане</span></div>
              </div>
            </div>
          </div>
          <div class="relative hidden md:block">
            <transition name="pixel-fade" mode="out-in">
              <img :key="currentSlideIndex" :src="(currentSlide && currentSlide.image) || heroImage || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" alt="Слайд" class="w-full h-80 object-cover rounded-lg shadow-lg" />
            </transition>
            <div class="absolute top-4 right-4">
              <div class="relative">
                <i class="fa-solid fa-star text-yellow-400 text-4xl"></i>
                <span class="absolute inset-0 flex items-center justify-center text-red-700 text-xs font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>
        <svg class="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-32" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <path fill="#f9f4e5" d="M0 50 Q 360 80 720 50 T 1440 50 V100 H0 Z"></path>
        </svg>
      </section>
      <section class="py-12" style="background-color:#f9f4e5;">
        <h2 class="text-3xl font-bold mb-8 text-center text-black">
          <span class="text-orange-600">{{ categoriesText.heading || 'Категории' }}</span> и
          <span class="text-red-600">{{ categoriesText.subheading || 'блюда' }}</span>, {{ categoriesText.description || 'которых вы не найдёте нигде' }}
        </h2>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <div v-for="(cat, index) in categoryBlocks" :key="cat.id" class="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" :style="{ animationDelay: (index * 0.2) + 's' }">
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
      <section class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12">
            <div class="inline-flex items-center space-x-2 mb-4">
              <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
              <h2 ref="menuSection" class="text-4xl font-bold text-gray-900">Наше меню</h2>
              <div class="w-8 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">Выберите категорию и наслаждайтесь нашими изысканными блюдами</p>
          </div>
          <div class="grid lg:grid-cols-4 gap-8">
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fa-solid fa-search mr-2 text-orange-500"></i>
                    Поиск по меню
                  </label>
                  <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Введите название блюда..." class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                    <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fa-solid fa-tags mr-2 text-orange-500"></i>
                    Категории
                  </h3>
                  <div class="space-y-2">
                    <button @click="selectedVertical = 'Хиты'" :class="['w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group', selectedVertical === 'Хиты' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105' : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 hover:from-yellow-100 hover:to-orange-100 hover:shadow-md']">
                      <span class="font-medium flex items-center">
                        <i class="fa-solid fa-star mr-2 text-yellow-500"></i>
                        Хиты
                      </span>
                      <i v-if="selectedVertical === 'Хиты'" class="fa-solid fa-check text-sm"></i>
                      <i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i>
                    </button>
                    <button v-for="cat in verticalCategories" :key="cat" @click="selectedVertical = cat" :class="['w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group', selectedVertical === cat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105' : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md']">
                      <span class="font-medium">{{ cat }}</span>
                      <i v-if="selectedVertical === cat" class="fa-solid fa-check text-sm"></i>
                      <i v-else class="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition"></i>
                    </button>
                  </div>
                </div>
                <div class="mt-8 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                  <div class="flex items-center text-orange-700 mb-2">
                    <i class="fa-solid fa-star mr-2"></i>
                    <span class="font-semibold">Популярное</span>
                  </div>
                  <p class="text-sm text-orange-600">{{ menuText.subheading || 'Попробуйте наши хиты продаж!' }}</p>
                </div>
              </div>
            </div>
            <div class="lg:col-span-3">
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
              <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <transition-group name="fade" tag="div" class="contents">
                  <div v-for="product in (selectedVerticalProducts || [])" :key="product.id" class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full" @click="openProductModal(product)">
                    <div class="relative h-48 overflow-hidden">
                      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div class="absolute top-4 right-4 flex flex-col space-y-2">
                        <div v-if="product.hit" class="bg-yellow-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <i class="fa-solid fa-star text-white text-sm"></i>
                        </div>
                        <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span class="text-orange-600 font-bold text-sm">{{ formatPrice(product.price) }}</span>
                        </div>
                      </div>
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <i class="fa-solid fa-eye text-orange-600 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                      <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">{{ product.name }}</h4>
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
                      <button @click.stop.prevent="add(product)" class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"><i class="fa-solid fa-plus"></i><span>Заказать</span></button>
                    </div>
                  </div>
                </transition-group>
              </div>
              <div v-if="(selectedVerticalProducts || []).length === 0" class="text-center py-12">
                <i class="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-500 mb-2">Товары не найдены</h3>
                <p class="text-gray-400">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="py-12" style="background-color:#f9f4e5;">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Это вкусно!</h2>
            <p class="text-gray-600">Наша статистика и популярные категории</p>
          </div>
          <div class="relative cursor-grab select-none" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseLeave" :class="{ 'cursor-grabbing': isDragging }">
            <div class="overflow-hidden">
              <div class="flex transition-transform duration-1000 ease-out" :style="{ transform: 'translateX(' + carouselPosition + '%)', transition: isDragging ? 'none' : 'transform 1s ease-out' }">
                <div v-for="(card, index) in infiniteStatsCards" :key="card.name + '-' + index" class="w-1/4 flex-shrink-0 px-2">
                  <div :class="['rounded-xl p-6 flex flex-col items-center justify-center shadow-lg text-center h-full min-h-[200px] carousel-card', card.isMain ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white' : 'bg-white']">
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
          <div class="flex justify-center mt-6">
            <button @click="toggleAutoRotate" :class="['px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl', isAutoRotating ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
              <i :class="isAutoRotating ? 'fa-solid fa-pause' : 'fa-solid fa-play'" class="mr-2"></i>
              {{ isAutoRotating ? 'Пауза автопрокрутки' : 'Запустить автопрокрутку' }}
            </button>
          </div>
          <div class="text-center mt-2">
            <p class="text-sm text-gray-500">
              <i class="fa-solid fa-infinity mr-1"></i>
              Перетащите мышью для прокрутки • Бесконечное циклическое движение
            </p>
          </div>
        </div>
      </section>
      <section class="py-12" style="background-color:#ffebb7;">
        <div class="max-w-6xl mx-auto mb-6">
          <h2 class="text-2xl font-bold">Самое популярное</h2>
        </div>
        <div class="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="product in popularProducts" :key="product.id" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1 h-full">
            <div class="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4">
              <img :src="product.image" alt="" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="flex flex-col items-center flex-grow w-full">
              <h3 class="font-semibold text-lg mb-2 text-center text-red-700">{{ product.name }}</h3>
              <p class="text-sm text-gray-600 mb-4 text-center flex-grow">{{ product.description }}</p>
            </div>
            <div class="w-full flex flex-col items-center mt-auto">
              <p class="text-red-600 font-bold text-lg mb-2">{{ formatPrice(product.price) }}</p>
              <button @click.stop.prevent="add(product)" class="w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition text-center">Заказать</button>
            </div>
          </div>
        </div>
      </section>
      <!-- Блок карты доставки: между Самое популярное и Отзывы -->
      <section class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-10">
            <div class="inline-flex items-center space-x-2 mb-3">
              <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">Зоны доставки</h2>
              <div class="w-8 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-600 max-w-2xl mx-auto">Схема доставки и самовывоза. Нажимайте на зоны для подробностей.</p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8 items-start">
            <div class="lg:col-span-2">
              <div class="w-full rounded-2xl shadow-lg overflow-hidden bg-white">
                <iframe 
                  src="https://yandex.ru/map-widget/v1/?lang=ru_RU&amp;scroll=true&amp;source=constructor-api&amp;um=constructor%3A1569f1da7d596921cd82db1f441ffc63d2a386db371645fede23dbc26dc86a74" 
                  frameborder="0" 
                  allowfullscreen="true" 
                  width="100%" 
                  height="720"
                  style="display:block"
                ></iframe>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-truck-fast text-orange-500 mr-2"></i>
                Условия доставки
              </h3>
              <div class="mb-5">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Обозначения зон на карте</h4>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-center"><span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span><span class="text-gray-700">Синяя — бесплатно от 1500 ₽</span></li>
                  <li class="flex items-center"><span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span><span class="text-gray-700">Красная — бесплатно от 1000 ₽</span></li>
                  <li class="flex items-center"><span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span><span class="text-gray-700">Золотая — бесплатно от 1300 ₽</span></li>
                  <li class="flex items-center"><span class="w-3 h-3 rounded-full bg-purple-500 mr-2"></span><span class="text-gray-700">Сиреневая — бесплатно от 2000 ₽</span></li>
                </ul>
              </div>
              
              <div class="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-100 to-red-100">
                <div class="flex items-center text-orange-700"><i class="fa-solid fa-store mr-2"></i><span>Самовывоз: д. Кузнецово, Удачный переулок, 1</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Модалка товара -->
      <transition name="fade">
        <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeProductModal"></div>
          <div class="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-slideIn">
            <div class="grid md:grid-cols-2">
              <div class="relative">
                <img :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full h-72 md:h-full object-cover" />
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-orange-600 font-semibold shadow">{{ formatPrice(selectedProduct.price || 0) }}</div>
              </div>
              <div class="p-6 md:p-8">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-2xl font-extrabold text-gray-900 leading-tight">{{ selectedProduct.name }}</h3>
                  <button @click="closeProductModal" class="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <p class="text-gray-600 mb-6" v-if="selectedProduct.description">{{ selectedProduct.description }}</p>
                <div class="space-y-3">
                  <button @click="addToCartFromModal" class="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow">
                    <i class="fa-solid fa-cart-plus mr-2"></i>
                    Добавить в корзину
                  </button>
                  <button @click="addToCartAndGoToCheckout" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl">
                    <i class="fa-solid fa-bolt mr-2"></i>
                    Оформить сейчас
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Плавающая мини-корзина: модуль с поповером, fallback на старую кнопку -->
      <transition name="fade">
        <component :is="FloatingCartComp" v-if="FloatingCartComp" />
        <button v-else-if="cartCount > 0" @click="goCart" class="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center space-x-3">
          <div class="relative">
            <i class="fa-solid fa-shopping-basket text-lg"></i>
            <span class="absolute -top-2 -right-2 bg-white text-orange-600 text-[11px] font-bold rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center">{{ cartCount }}</span>
          </div>
          <span class="font-semibold">{{ cartTotal }}</span>
        </button>
      </transition>
      <section class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-10">
            <div class="inline-flex items-center space-x-2 mb-3">
              <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">{{ reviewsText.heading || 'Отзывы клиентов' }}</h2>
              <div class="w-8 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-600 max-w-2xl mx-auto">{{ reviewsText.description || 'Мы гордимся каждым словом — спасибо за доверие!' }}</p>
          </div>
          <div 
            class="relative group"
            @mouseenter="stopReviewAuto"
            @mouseleave="startReviewAuto"
          >
            <button @click="prevReview" class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow hover:shadow-md border border-gray-200 items-center justify-center text-gray-600 group-hover:flex"><i class="fa-solid fa-chevron-left"></i></button>
            <button @click="nextReview" class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow hover:shadow-md border border-gray-200 items-center justify-center text-gray-600 group-hover:flex"><i class="fa-solid fa-chevron-right"></i></button>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="t in visibleTestimonials" :key="t.name + t.quote + (t.createdAt || '')" 
                   class="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-orange-200">
                    <img :src="t.image" alt="" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ t.name }}</h3>
                    <p class="text-xs text-gray-500">{{ t.role }}</p>
                  </div>
                </div>
                <div class="text-orange-400 flex space-x-1 mb-2">
                  <i v-for="n in 5" :key="n" :class="['fa', n <= t.rating ? 'fa-solid fa-star' : 'fa-regular fa-star']"></i>
                </div>
                <p class="text-gray-700 flex-grow">{{ t.quote }}</p>
                <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span v-if="t.createdAt"><i class="fa-solid fa-calendar mr-1"></i>{{ new Date(t.createdAt).toLocaleDateString('ru-RU') }}</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-700">Проверенный отзыв</span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-center space-x-3">
              <button @click="prevReview" class="px-3 py-2 bg-white border border-gray-200 rounded-full shadow hover:shadow-md text-gray-700 text-sm"><i class="fa-solid fa-chevron-left mr-2"></i>Назад</button>
              <button @click="nextReview" class="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow text-sm">Далее<i class="fa-solid fa-chevron-right ml-2"></i></button>
              <button @click="isReviewAuto ? stopReviewAuto() : startReviewAuto()" :class="['px-3 py-2 rounded-full text-sm', isReviewAuto ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-200']">
                <i :class="isReviewAuto ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Блок доставки с картой -->
      <section class="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-10">
            <div class="inline-flex items-center space-x-2 mb-3">
              <div class="w-8 h-1 bg-orange-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">{{ deliveryText.heading || 'Быстрая доставка' }}</h2>
              <div class="w-8 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-600 max-w-2xl mx-auto">{{ deliveryText.description || 'Доставляем свежие суши и пиццу прямо к вашей двери за 30 минут' }}</p>
          </div>
          <div class="grid lg:grid-cols-3 gap-8 items-start">
            <div class="lg:col-span-2">
              <div class="w-full rounded-2xl shadow-lg overflow-hidden bg-white">
                <iframe :src="mapIframeSrc" frameborder="0" allowfullscreen="true" width="100%" height="720" style="display:block"></iframe>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fa-solid fa-truck-fast text-orange-500 mr-2"></i>
                Условия доставки
              </h3>
              <div class="mb-5">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Обозначения зон на карте</h4>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-center">
                    <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span class="text-gray-700">Синяя — бесплатно от 1500 ₽</span>
                  </li>
                  <li class="flex items-center">
                    <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span class="text-gray-700">Красная — бесплатно от 1000 ₽</span>
                  </li>
                  <li class="flex items-center">
                    <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                    <span class="text-gray-700">Золотая — бесплатно от 1300 ₽</span>
                  </li>
                  <li class="flex items-center">
                    <span class="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    <span class="text-gray-700">Сиреневая — бесплатно от 2000 ₽</span>
                  </li>
                </ul>
              </div>
              <div class="space-y-3">
                <div v-for="feature in (deliveryText.features || ['Бесплатная доставка от 1500₽', 'Доставка за 30 минут', 'Свежие ингредиенты', 'Горячие блюда'])" :key="feature" class="flex items-center text-gray-700">
                  <i class="fa-solid fa-check text-green-500 mr-2"></i>
                  <span class="text-sm">{{ feature }}</span>
                </div>
              </div>
              <div class="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-700 mb-1">30 мин</div>
                  <div class="text-sm text-orange-600">Среднее время доставки</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  setup() {
    const { ref, computed, onMounted, onUnmounted, watch } = Vue;
    const { useRouter } = VueRouter;
    const router = useRouter();
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
    const cartState = window.cart || { items: [] };
    const categoryBlocks = ref([]);
    const selectedVertical = ref(null);
    const bestsellerContainer = ref(null);
    const FloatingCartComp = ref(window.FloatingCart || null);
    onMounted(() => { if (!FloatingCartComp.value && window.FloatingCart) FloatingCartComp.value = window.FloatingCart; });

    // Тексты блоков из настроек сайта
    const heroText = ref({});
    const categoriesText = ref({});
    const menuText = ref({});
    const deliveryText = ref({});
    const reviewsText = ref({});
    const heroBackgroundImage = ref('./banner.png');
    const siteBackgroundColor = ref('#dc2626');
    console.log('Hero background image path:', heroBackgroundImage.value);
    
    // Функция для проверки и загрузки изображения
    function checkAndLoadImage(imagePath) {
      return new Promise((resolve) => {
        const testImage = new Image();
        testImage.onload = () => {
          console.log('Banner image loaded successfully:', imagePath);
          resolve(imagePath);
        };
        testImage.onerror = () => {
          console.error('Banner image failed to load:', imagePath);
          console.log('Switching to fallback image');
          resolve('https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d');
        };
        testImage.src = imagePath;
      });
    }
    // Конфиг страницы конструктора
    const page = ref([]);
    const mapIframeSrc = 'https://yandex.ru/map-widget/v1/?lang=ru_RU&scroll=true&source=constructor-api&um=constructor%3A1569f1da7d596921cd82db1f441ffc63d2a386db371645fede23dbc26dc86a74';

    async function fetchSEOData() {
      try { const response = await axios.get('/api/seo'); seoData.value = response.data; } catch (e) { console.error('Ошибка загрузки SEO данных:', e); }
    }

    async function fetchSiteSettings() {
      try {
        const response = await axios.get('/api/site-settings');
        const data = response.data || {};
        const blocks = data.home_blocks || {};
        
        heroText.value = blocks.hero || {};
        categoriesText.value = blocks.categories || {};
        menuText.value = blocks.menu || {};
        deliveryText.value = blocks.delivery || {};
        reviewsText.value = blocks.reviews || {};
        
        // Загружаем цвет фона сайта
        if (data.background_color) {
          siteBackgroundColor.value = data.background_color;
        }
        
        if (blocks.hero?.backgroundImage) {
          // Проверяем и загружаем изображение из админки
          const validImagePath = await checkAndLoadImage(blocks.hero.backgroundImage);
          heroBackgroundImage.value = validImagePath;
        } else {
          // Используем дефолтный баннер
          const validImagePath = await checkAndLoadImage('./banner.png');
          heroBackgroundImage.value = validImagePath;
        }
        // Новый формат: линейная страница
        if (Array.isArray(blocks.page)) {
          page.value = blocks.page
            .filter(b => b && b.type && !b.hidden)
            .map(block => {
            // Добавляем элементы по умолчанию для Hero блока, если их нет
            if (block.type === 'hero' && (!block.data?.elements || !Array.isArray(block.data.elements) || block.data.elements.length === 0)) {
              const defaultElements = [
                {
                  id: 'hero-heading-1',
                  type: 'heading',
                  data: {
                    text: block.data?.heading || 'Быстро и вкусно',
                    level: 'h1',
                    color: '#ffffff',
                    fontSize: 'text-4xl',
                    align: 'left',
                    marginTop: '0px',
                    marginBottom: '16px'
                  }
                },
                {
                  id: 'hero-subheading-1',
                  type: 'subheading',
                  data: {
                    text: block.data?.subheading || 'Попробуйте наши особые суши',
                    color: '#fbbf24',
                    fontSize: 'text-xl',
                    align: 'left',
                    marginTop: '0px',
                    marginBottom: '12px'
                  }
                },
                {
                  id: 'hero-paragraph-1',
                  type: 'paragraph',
                  data: {
                    text: block.data?.description || 'Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.',
                    color: '#ffffff',
                    fontSize: 'text-base',
                    align: 'left',
                    marginTop: '0px',
                    marginBottom: '16px'
                  }
                },
                {
                  id: 'hero-button-1',
                  type: 'button',
                  data: {
                    text: block.data?.buttonText || 'Заказать сейчас',
                    style: 'primary',
                    action: 'scroll',
                    color: '#ffffff',
                    fontSize: 'text-base',
                    align: 'left',
                    marginTop: '0px',
                    marginBottom: '0px'
                  }
                }
              ];
              
              return {
                ...block,
                data: {
                  ...block.data,
                  elements: defaultElements
                }
              };
            }
            return block;
          });
        } else {
          page.value = [];
        }
      } catch (e) {
        console.error('Ошибка загрузки настроек сайта:', e);
      }
    }

    function updatePageTitle() {
      if (seoData.value) {
        const site = seoData.value.site || {}; const pages = seoData.value.pages || {}; const home = pages.home || {};
        const title = home.title || site.title || 'Интернет‑магазин суши и пиццы | Доставка суши и пиццы | Точка суши и пиццы';
        document.title = title;
      }
    }

    async function fetchProducts() {
      try { const res = await axios.get('/api/products'); products.value = res.data; heroSlides.value = products.value.map(p => ({ heading: p.name, subheading: p.description, image: p.image })); }
      catch (e) { console.error('Не удалось загрузить список товаров', e); }
      finally { loading.value = false; }
    }

    async function fetchCategories() {
      try { const res = await axios.get('/api/categories'); categoriesData.value = res.data; categories.value = ['Все', ...res.data.map(cat => cat.name)]; }
      catch (e) { console.error('Не удалось загрузить список категорий', e); categories.value = ['Все', 'Роллы', 'Пицца', 'Салаты', 'Напитки']; categoriesData.value = []; }
    }

    const foodEmojis = ['🍣', '🍱', '🍙', '🍘', '🍥', '🍜', '🍲', '🍕', '🍝', '🍛', '🥟', '🍤', '🍢', '🍡', '🥢'];
    const foodTypes = ['sushi', 'pizza'];
    const foodSizes = ['small', 'medium', 'large'];
    function createFoodRain() {
      const rainContainer = document.getElementById('food-rain'); if (!rainContainer) return; rainContainer.innerHTML = '';
      for (let i = 0; i < 50; i++) { const foodItem = document.createElement('div'); const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)]; const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)]; const randomSize = foodSizes[Math.floor(Math.random() * foodSizes.length)]; foodItem.textContent = randomEmoji; foodItem.className = `food-item ${randomType}-item ${randomSize}`; foodItem.style.left = Math.random() * 100 + '%'; foodItem.style.animationDelay = Math.random() * 5 + 's'; const duration = 3 + Math.random() * 3; foodItem.style.animationDuration = duration + 's'; rainContainer.appendChild(foodItem); }
    }
    function startFoodRain() { createFoodRain(); setInterval(() => { createFoodRain(); }, 10000); }

    onMounted(() => {
      fetchSEOData().then(updatePageTitle);
      fetchCategoryBlocks();
      fetchProducts();
      fetchCategories();
      setTimeout(() => { startCardRotation(); startAutoRotate(); }, 2000);
      setTimeout(() => { startFoodRain(); }, 1000);
      // Карта загружается через iframe конструктора Яндекс.Карт
    });
    onUnmounted(() => { stopCardRotation(); stopAutoRotate(); });

    async function fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
        reviews.value = Array.isArray(res.data) ? res.data : [];
      } catch (e) {
        console.error('Не удалось загрузить отзывы', e);
        reviews.value = [];
      }
    }
    onMounted(() => {
      fetchReviews();
      fetchSiteSettings();
    });

    function add(product) { if (window.addToCart) window.addToCart(product); }
    function formatPrice(price) { return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }); }
    const uniqueCategories = computed(() => { const set = new Set(); products.value.forEach(p => { if (p.category_name) set.add(p.category_name); }); return ['Все', ...Array.from(set)]; });
    const filteredProducts = computed(() => { return products.value.filter(p => { const matchesCategory = selectedCategory.value === 'Все' || p.category_name === selectedCategory.value; const q = searchQuery.value.toLowerCase(); const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q); return matchesCategory && matchesSearch; }); });
    const heroImage = computed(() => { const setProduct = products.value.find(p => p.category_name === 'Сеты'); return setProduct ? setProduct.image : ''; });
    const currentSlide = computed(() => heroSlides.value[currentSlideIndex.value] || {});
    onMounted(() => { setInterval(() => { if (heroSlides.value.length > 0) { currentSlideIndex.value = (currentSlideIndex.value + 1) % heroSlides.value.length; } }, 7000); });
    function scrollToMenu() { if (menuSection.value) { menuSection.value.scrollIntoView({ behavior: 'smooth' }); } }
    function openProductModal(product) { selectedProduct.value = product; showProductModal.value = true; }
    function closeProductModal() { showProductModal.value = false; selectedProduct.value = {}; }
    function addToCartFromModal() { if (window.addToCart) window.addToCart(selectedProduct.value); closeProductModal(); }
    function addToCartAndGoToCheckout() { if (window.addToCart) window.addToCart(selectedProduct.value); closeProductModal(); router.push('/checkout'); }
    function goCart() { router.push('/cart'); }
    async function fetchCategoryBlocks() {
      try {
        const response = await axios.get('/api/category-blocks');
        categoryBlocks.value = (response.data || [])
          .map(b => ({ id: b.id, name: b.title || b.name, title: b.title || b.name, description: b.description, image: b.image, order: b.order_index ?? b.order ?? 0, enabled: !!b.enabled }))
          .filter(b => b.enabled)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      }
      catch (e) {
        console.error('Ошибка загрузки блоков категорий:', e);
        categoryBlocks.value = [
          { id: 'fallback-1', name: 'Роллы', description: 'Большой выбор традиционных и авторских роллов', image: 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10' },
          { id: 'fallback-2', name: 'Суши', description: 'Классические нигири с нежнейшей рыбой', image: 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91' },
          { id: 'fallback-3', name: 'Сеты', description: 'Сеты для дружеских компаний и семейных вечеров', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754' }
        ];
      }
    }
    const statsCards = [ { title: '5+ лет', subtitle: 'опыта доставки', color: 'bg-blue-600' }, { title: '10+ товаров', subtitle: 'в меню', color: 'bg-green-600' }, { title: '1000+ заказов', subtitle: 'выполнено', color: 'bg-orange-500' } ];
    // Отзывы (только одобренные приходят с сервера)
    const computedTestimonials = computed(() => {
      return reviews.value.map(r => ({
        name: r.name || 'Аноним',
        role: r.phone ? `Пользователь ${r.phone}` : 'Гость',
        quote: r.comment || '',
        image: Math.random() > 0.5 ? '/testimonial1.png' : '/testimonial2.png',
        rating: r.rating || 0,
        createdAt: r.createdAt
      }));
    });

    // Карусель отзывов: показываем 1/2/3 карточки, авто‑прокрутка, пауза по наведению
    const reviewIndex = ref(0);
    const isReviewAuto = ref(true);
    let reviewAutoTimer = null;
    const visibleTestimonials = computed(() => {
      const arr = computedTestimonials.value;
      const visibleCount = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1);
      if (arr.length <= visibleCount) return arr;
      const out = [];
      for (let i = 0; i < visibleCount; i++) {
        out.push(arr[(reviewIndex.value + i) % arr.length]);
      }
      return out;
    });
    function nextReview() {
      const len = computedTestimonials.value.length;
      if (len === 0) return;
      reviewIndex.value = (reviewIndex.value + 1) % len;
    }
    function prevReview() {
      const len = computedTestimonials.value.length;
      if (len === 0) return;
      reviewIndex.value = (reviewIndex.value - 1 + len) % len;
    }
    function startReviewAuto() {
      stopReviewAuto();
      isReviewAuto.value = true;
      reviewAutoTimer = setInterval(() => { nextReview(); }, 4000);
    }
    function stopReviewAuto() {
      isReviewAuto.value = false;
      if (reviewAutoTimer) { clearInterval(reviewAutoTimer); reviewAutoTimer = null; }
    }
    onMounted(() => { startReviewAuto(); window.addEventListener('resize', onResizeReviews); });
    onUnmounted(() => { stopReviewAuto(); window.removeEventListener('resize', onResizeReviews); });
    function onResizeReviews() { /* триггерим пересчёт */ reviewIndex.value = reviewIndex.value; }
    const popularProducts = computed(() => { const arr = products.value.slice().filter(p => p.available !== false); arr.sort((a, b) => { const ap = a.purchases || 0; const bp = b.purchases || 0; return bp - ap; }); return arr.slice(0, 3); });
    const verticalCategories = computed(() => categories.value.filter(cat => cat !== 'Все'));
    watch(verticalCategories, (newCategories) => { if (newCategories.length > 0 && !selectedVertical.value) { selectedVertical.value = newCategories[0]; } }, { immediate: true });
    const selectedVerticalItem = computed(() => { const cat = selectedVertical.value || (verticalCategories.value.length > 0 ? verticalCategories.value[0] : null); if (!cat) return null; return products.value.find(p => p.category_name === cat) || null; });
    const selectedVerticalProducts = computed(() => { const q = searchQuery.value.toLowerCase().trim(); if (q) { return products.value.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q))); } if (selectedVertical.value === 'Хиты') { return products.value.filter(p => p.hit === true); } const cat = selectedVertical.value || (verticalCategories.value.length > 0 ? verticalCategories.value[0] : null); if (!cat) return []; return products.value.filter(p => p.category_name === cat); });
    const allStatsCards = computed(() => { return categories.value.filter(cat => cat !== 'Все').map(cat => { const count = products.value.filter(p => p.category_name === cat).length; const categoryData = categoriesData.value.find(c => c.name === cat); return { name: cat, count: `${count}+`, description: 'товаров', image: categoryData ? categoryData.image : 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10' }; }); });
    const currentCardIndex = ref(0);
    const statsCardsMenu = computed(() => { const cards = allStatsCards.value; if (cards.length <= 3) { return cards; } const startIndex = currentCardIndex.value; const endIndex = Math.min(startIndex + 3, cards.length); let result = cards.slice(startIndex, endIndex); if (result.length < 3 && cards.length > 3) { const remaining = 3 - result.length; result = result.concat(cards.slice(0, remaining)); } return result; });
    const visibleStatsCards = computed(() => { const cards = allStatsCards.value; const startIndex = currentCardIndex.value; const endIndex = Math.min(startIndex + 3, cards.length); return cards.slice(startIndex, endIndex); });
    let cardRotationInterval = null;
    function startCardRotation() { if (allStatsCards.value.length > 3) { cardRotationInterval = setInterval(() => { currentCardIndex.value = (currentCardIndex.value + 1) % allStatsCards.value.length; }, 5000); } }
    function stopCardRotation() { if (cardRotationInterval) { clearInterval(cardRotationInterval); cardRotationInterval = null; } }
    const carouselPosition = ref(0);
    const isDragging = ref(false);
    const startX = ref(0);
    const isAutoRotating = ref(true);
    const infiniteStatsCards = computed(() => { const cards = allStatsCards.value; if (cards.length === 0) return []; const mainCard = { name: 'Это вкусно!', count: '12k', description: 'Ежедневно обслуживаем клиентов', image: 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10', isMain: true }; const copies = []; for (let i = 0; i < 20; i++) { copies.push(mainCard, ...cards); } return copies; });
    let lastTime = 0; const scrollSpeed = 25; const scrollInterval = 2000;
    function startAutoRotate() { isAutoRotating.value = true; function animate(currentTime) { if (!isAutoRotating.value) return; if (currentTime - lastTime >= scrollInterval) { carouselPosition.value -= 25; lastTime = currentTime; } requestAnimationFrame(animate); } requestAnimationFrame(animate); }
    function stopAutoRotate() { isAutoRotating.value = false; }
    function toggleAutoRotate() { if (isAutoRotating.value) { stopAutoRotate(); } else { startAutoRotate(); } }
    // Карта встроена через iframe (конструктор Яндекс.Карт)
    function onMouseDown(event) { isDragging.value = true; startX.value = event.clientX; }
    function onMouseMove(event) { if (!isDragging.value) return; const deltaX = event.clientX - startX.value; const sensitivity = 0.2; carouselPosition.value += deltaX * sensitivity; startX.value = event.clientX; }
    function onMouseUp() { if (!isDragging.value) return; isDragging.value = false; const cardWidth = 25; const targetPosition = Math.round(carouselPosition.value / cardWidth) * cardWidth; const startPosition = carouselPosition.value; const duration = 300; const startTime = Date.now(); function animate() { const elapsed = Date.now() - startTime; const progress = Math.min(elapsed / duration, 1); const easeProgress = 1 - Math.pow(1 - progress, 3); carouselPosition.value = startPosition + (targetPosition - startPosition) * easeProgress; if (progress < 1) { requestAnimationFrame(animate); } } requestAnimationFrame(animate); }
    function onMouseLeave() { if (isDragging.value) { onMouseUp(); } }
    function scrollBestseller(direction) { const container = bestsellerContainer.value; if (!container) return; const scrollAmount = 300; if (direction === 'left') container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); else container.scrollBy({ left: scrollAmount, behavior: 'smooth' }); }

    const cartCount = computed(() => (cartState.items || []).reduce((s, it) => s + (it.quantity || 0), 0));
    const cartTotal = computed(() => formatPrice((cartState.items || []).reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0)));
    
    return { products, loading, add, formatPrice, searchQuery, categories, categoriesData, categoryBlocks, statsCards, computedTestimonials, visibleTestimonials, nextReview, prevReview, startReviewAuto, stopReviewAuto, isReviewAuto, popularProducts, bestsellerContainer, scrollBestseller, heroImage, menuSection, scrollToMenu, verticalCategories, selectedVertical, selectedVerticalItem, selectedVerticalProducts, statsCardsMenu, allStatsCards, infiniteStatsCards, carouselPosition, isDragging, isAutoRotating, toggleAutoRotate, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, createFoodRain, startFoodRain, currentSlide, currentSlideIndex, showProductModal, selectedProduct, openProductModal, closeProductModal, addToCartFromModal, addToCartAndGoToCheckout, cartCount, cartTotal, goCart, FloatingCartComp, heroText, categoriesText, menuText, deliveryText, reviewsText, heroBackgroundImage, siteBackgroundColor, page, mapIframeSrc };
  }
};


