// Админ-модуль: Настройки сайта (логотип, фавикон, название, тексты блоков)
(function(){
  const { ref, onMounted, computed, watch } = Vue;

  window.AdminSiteSettingsView = {
    name: 'AdminSiteSettingsView',
    template: /* html */`
      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Настройки сайта</h1>
            <p class="mt-2 text-gray-600">Управление основными настройками сайта и текстами блоков</p>
          </div>

           <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
             <!-- Основные настройки -->
             <div class="xl:col-span-1 space-y-6">
              <!-- Базовые настройки -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i class="fa-solid fa-cog text-orange-500 mr-2"></i>
                  Основные настройки
                </h2>
                
                <div class="space-y-4">
                  <!-- Название сайта -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <i class="fa-solid fa-heading mr-1 text-orange-500"></i>
                      Название сайта
                    </label>
                    <input
                      v-model="form.site_title"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                      placeholder="Введите название сайта"
                    />
                  </div>

                  <!-- Логотип -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <i class="fa-solid fa-image mr-1 text-orange-500"></i>
                      Логотип
                    </label>
                    <div class="space-y-2">
                      <input
                        v-model="form.logo"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                        placeholder="URL логотипа"
                      />
                      <input
                        @change="onLogoFileSelected"
                        type="file"
                        accept="image/*"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                      />
                      <div v-if="logoPreview" class="mt-2">
                        <img :src="logoPreview" alt="Логотип" class="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      </div>
                    </div>
                  </div>

                  <!-- Фавикон -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <i class="fa-solid fa-star mr-1 text-orange-500"></i>
                      Фавикон
                    </label>
                    <div class="space-y-2">
                      <input
                        v-model="form.favicon"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                        placeholder="URL фавикона"
                      />
                      <input
                        @change="onFaviconFileSelected"
                        type="file"
                        accept="image/*"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                      />
                      <div v-if="faviconPreview" class="mt-2">
                        <img :src="faviconPreview" alt="Фавикон" class="w-6 h-6 object-cover rounded border border-gray-200" />
                      </div>
                    </div>
                  </div>

                  <!-- Цвет фона сайта -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <i class="fa-solid fa-palette mr-1 text-orange-500"></i>
                      Цвет фона сайта
                    </label>
                    <div class="space-y-2">
                      <input
                        v-model="form.background_color"
                        type="color"
                        class="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition cursor-pointer"
                      />
                      <input
                        v-model="form.background_color"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                        placeholder="#dc2626"
                      />
                      <div class="text-xs text-gray-500">
                        Выберите цвет фона для всего сайта
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Конструктор блоков -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i class="fa-solid fa-puzzle-piece text-orange-500 mr-2"></i>
                  Конструктор блоков
                </h2>
                
                <!-- Переключатель режимов -->
                <div class="flex mb-4 bg-gray-100 rounded-lg p-1">
                  <button
                    @click="editMode = 'visual'"
                    :class="[
                      'flex-1 px-3 py-2 text-sm font-medium rounded-md transition',
                      editMode === 'visual' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <i class="fa-solid fa-eye mr-1"></i>
                    Визуальный
                  </button>
                  <button
                    @click="editMode = 'text'"
                    :class="[
                      'flex-1 px-3 py-2 text-sm font-medium rounded-md transition',
                      editMode === 'text' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <i class="fa-solid fa-edit mr-1"></i>
                    Текстовый
                  </button>
                </div>

                <!-- Визуальный режим -->
                <div v-if="editMode === 'visual'" class="space-y-4">
                  <!-- Палитра блоков -->
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Доступные блоки</h3>
                    <div class="grid grid-cols-2 gap-2">
                      <div
                        v-for="(block, key) in availableBlocks"
                        :key="key"
                        :draggable="true"
                        @dragstart="onPaletteDragStart($event, key)"
                        @dragend="onPaletteDragEnd"
                        @click="addBlock(key)"
                        class="p-2 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition text-center"
                      >
                        <i :class="block.icon" class="text-orange-500 mb-1"></i>
                        <div class="text-xs text-gray-600">{{ block.name }}</div>
                        <i class="fa-solid fa-grip-vertical text-gray-400 text-xs mt-1"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Палитра элементов -->
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Элементы для блоков</h3>
                    <div class="grid grid-cols-2 gap-2">
                      <div
                        v-for="(element, type) in elementTypes"
                        :key="type"
                        @click="selectedElementType = type"
                        :class="[
                          'p-2 border rounded-lg cursor-pointer transition text-center',
                          selectedElementType === type 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                        ]"
                      >
                        <i :class="element.icon" class="text-green-500 mb-1"></i>
                        <div class="text-xs text-gray-600">{{ element.name }}</div>
                      </div>
                    </div>
                    <div v-if="selectedElementType" class="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <p class="text-xs text-green-700">
                        Выбран: <strong>{{ elementTypes[selectedElementType].name }}</strong>
                      </p>
                      <p class="text-xs text-green-600 mt-1">
                        Кликните на блок в превью, чтобы добавить элемент
                      </p>
                    </div>
                  </div>

                  <!-- Рабочее пространство -->
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Рабочее пространство</h3>
                    <div 
                      class="min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
                      @drop="onDrop"
                      @dragover.prevent
                      @dragenter.prevent
                    >
                      <div
                        v-for="(block, index) in pageBlocks"
                        :key="block.id"
                        :draggable="true"
                        @dragstart="onDragStart($event, index)"
                        @click="selectBlock(index)"
                        :class="[
                          'p-3 border rounded-lg cursor-move transition',
                          selectedBlockIndex === index
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        ]"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <i :class="block.icon" class="text-orange-500 mr-2"></i>
                            <span class="text-sm font-medium">{{ block.name }}</span>
                          </div>
                          <div class="flex items-center space-x-1">
                            <button
                              @click.stop="moveBlockUp(index)"
                              :disabled="index === 0"
                              class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <i class="fa-solid fa-arrow-up text-xs"></i>
                            </button>
                            <button
                              @click.stop="moveBlockDown(index)"
                              :disabled="index === pageBlocks.length - 1"
                              class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <i class="fa-solid fa-arrow-down text-xs"></i>
                            </button>
                            <button
                              @click.stop="removeBlock(index)"
                              class="p-1 text-red-400 hover:text-red-600"
                            >
                              <i class="fa-solid fa-trash text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <!-- Превью содержимого блока -->
                        <div class="mt-2 text-xs text-gray-500">
                          <div v-if="block.type === 'hero'">
                            <div class="font-medium">{{ block.data?.heading || 'Заголовок' }}</div>
                            <div>{{ block.data?.subheading || 'Подзаголовок' }}</div>
                          </div>
                          <div v-else-if="block.type === 'categories'">
                            <div class="font-medium">{{ block.data?.heading || 'Категории' }}</div>
                            <div>{{ block.data?.subheading || 'Подзаголовок' }}</div>
                          </div>
                          <div v-else-if="block.type === 'menu'">
                            <div class="font-medium">{{ block.data?.heading || 'Меню' }}</div>
                            <div>{{ block.data?.subheading || 'Популярные блюда' }}</div>
                          </div>
                          <div v-else-if="block.type === 'delivery'">
                            <div class="font-medium">{{ block.data?.heading || 'Доставка' }}</div>
                            <div>{{ block.data?.subheading || 'Быстрая доставка' }}</div>
                          </div>
                          <div v-else-if="block.type === 'reviews'">
                            <div class="font-medium">{{ block.data?.heading || 'Отзывы' }}</div>
                            <div>{{ block.data?.subheading || 'Отзывы клиентов' }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Пустое состояние -->
                      <div v-if="pageBlocks.length === 0" class="text-center py-8 text-gray-400">
                        <i class="fa-solid fa-plus-circle text-2xl mb-2"></i>
                        <div class="text-sm">Перетащите блоки сюда или нажмите на блок выше</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Текстовый режим -->
                <div v-else class="space-y-2">
                  <button
                    v-for="(block, key) in blocks"
                    :key="key"
                    @click="activeBlock = key"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-lg transition flex items-center',
                      activeBlock === key 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'hover:bg-gray-100 text-gray-700'
                    ]"
                  >
                    <i :class="block.icon" class="mr-2 text-sm"></i>
                    <span class="text-sm font-medium">{{ block.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Редактор блока / Визуальный конструктор -->
            <div class="xl:col-span-2">
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                    <i v-if="editMode === 'visual'" class="fa-solid fa-eye text-orange-500 mr-2"></i>
                    <i v-else :class="blocks[activeBlock]?.icon" class="text-orange-500 mr-2"></i>
                    {{ editMode === 'visual' ? 'Визуальный конструктор' : blocks[activeBlock]?.name }}
                  </h2>
                  <div class="flex items-center space-x-3">
                    <button
                      @click="togglePreview"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center text-sm"
                    >
                      <i class="fa-solid fa-eye mr-2"></i>
                      {{ showPreview ? 'Скрыть превью' : 'Показать превью' }}
                    </button>
                    <button
                      @click="saveSettings"
                      :disabled="loading"
                      class="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition flex items-center text-sm"
                    >
                      <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-2"></i>
                      <i v-else class="fa-solid fa-save mr-2"></i>
                      {{ loading ? 'Сохранение...' : 'Сохранить' }}
                    </button>
                  </div>
                </div>

                <!-- Визуальный конструктор -->
                <div v-if="editMode === 'visual'" class="space-y-6">
                  <!-- Панель инструментов -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-4">
                      <span class="text-sm font-medium text-gray-700">Масштаб:</span>
                      <div class="flex items-center space-x-2">
                        <button @click="zoomOut" class="p-1 text-gray-600 hover:text-gray-800">
                          <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="text-sm font-medium w-12 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
                        <button @click="zoomIn" class="p-1 text-gray-600 hover:text-gray-800">
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="deviceView = 'desktop'"
                        :class="['px-3 py-1 text-sm rounded', deviceView === 'desktop' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100']"
                      >
                        <i class="fa-solid fa-desktop mr-1"></i>
                        Desktop
                      </button>
                      <button
                        @click="deviceView = 'tablet'"
                        :class="['px-3 py-1 text-sm rounded', deviceView === 'tablet' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100']"
                      >
                        <i class="fa-solid fa-tablet mr-1"></i>
                        Tablet
                      </button>
                      <button
                        @click="deviceView = 'mobile'"
                        :class="['px-3 py-1 text-sm rounded', deviceView === 'mobile' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100']"
                      >
                        <i class="fa-solid fa-mobile mr-1"></i>
                        Mobile
                      </button>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="canvasMode = 'preview'"
                        :class="['px-3 py-1 text-sm rounded', canvasMode === 'preview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100']"
                      >
                        <i class="fa-solid fa-magnifying-glass mr-1"></i>
                        Превью
                      </button>
                      <button
                        @click="canvasMode = 'fullscreen'"
                        :class="['px-3 py-1 text-sm rounded', canvasMode === 'fullscreen' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100']"
                      >
                        <i class="fa-solid fa-up-right-and-down-left-from-center mr-1"></i>
                        Полностранично
                      </button>
                    </div>
      </div>

      <!-- Интерактивное рабочее пространство -->
      <div class="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <div class="bg-gray-100 px-4 py-2 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
                      <div class="text-sm text-gray-600">
                        {{ getDeviceWidth() }}px
                      </div>
                    </div>
                    
                    <!-- Контейнер конструктора -->
      <div
        class="bg-gray-50"
        :class="canvasMode === 'fullscreen' ? 'overflow-visible' : 'overflow-auto'"
        :style="canvasStyle"
      >
                      <!-- Интерактивная страница -->
                      <div class="bg-white min-h-full relative">
                        <!-- Drag & Drop зоны между блоками -->
                        <div 
                          v-for="(block, index) in pageBlocks" 
                          :key="block.id"
                          class="relative"
                          @click="selectedElementType && addElementToBlock(index, selectedElementType)"
                          :class="[
                            selectedElementType ? 'cursor-pointer hover:ring-4 hover:ring-green-500 hover:ring-opacity-30' : ''
                          ]"
                        >
                          <!-- Зона добавления блока сверху -->
                          <div 
                            v-if="index === 0"
                            @dragover.prevent
                            @drop="onDropZone($event, index)"
                            class="h-8 border-2 border-dashed border-transparent hover:border-blue-400 transition-colors flex items-center justify-center"
                          >
                            <span class="text-xs text-gray-400">Перетащите блок сюда</span>
                          </div>

                          <!-- Блок с интерактивностью -->
                          <div 
                            :draggable="true"
                            @dragstart="onBlockDragStart($event, index)"
                            @dragend="onBlockDragEnd"
                            @click="selectBlock(index)"
                            :class="[
                              'cursor-move transition-all',
                              selectedBlockIndex === index ? 'ring-4 ring-blue-500 ring-opacity-50' : 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-30'
                            ]"
                          >
                            <!-- Hero блок -->
                            <div 
                              v-if="block.type === 'hero'"
                              class="relative text-white overflow-hidden"
                              :style="{ 
                                backgroundColor: form.background_color || '#dc2626',
                                backgroundImage: block.data?.backgroundImage ? 'url(' + block.data.backgroundImage + ')' : 'none', 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center' 
                              }"
                            >
                              <div class="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
                                <div class="text-center md:text-left">
                                  <!-- Динамические элементы Hero -->
                                  <div class="space-y-4 relative">
                                    <!-- Визуальная сетка для drag & drop -->
                                    <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px); background-size: 20px 20px;"></div>

                                    <template v-if="block.data.elements && block.data.elements.length > 0">
                                      <div
                                        class="h-2 bg-transparent hover:bg-orange-200 transition-colors rounded"
                                        @dragover="onElementDragOver($event)"
                                        @drop="onElementDrop($event, index, 0)"
                                      ></div>

                                      <template v-for="(element, elementIndex) in block.data.elements" :key="element.id">
                                        <div
                                          :draggable="true"
                                          @dragstart="onElementDragStart($event, index, elementIndex)"
                                          @dragend="onElementDragEnd($event)"
                                          @dragover="onElementDragOver($event)"
                                          @drop="onElementDrop($event, index, elementIndex)"
                                          @click.stop="selectElement(index, elementIndex)"
                                          :class="[
                                            'cursor-move border-2 border-dashed border-transparent hover:border-orange-300 rounded p-2 transition relative z-10',
                                            selectedElement?.blockIndex === index && selectedElement?.elementIndex === elementIndex
                                              ? 'border-orange-500 bg-orange-50'
                                              : ''
                                          ]"
                                        >
                                      <!-- Heading element -->
                                      <component
                                        v-if="element.type === 'heading'"
                                        :is="element.data.level || 'h2'"
                                        class="font-bold mb-2"
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
                                        class="mb-2"
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
                                        class="mb-2"
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

                                      <!-- Feature element -->
                                      <div v-else-if="element.type === 'feature'" class="flex items-center space-x-2 text-white mb-2">
                                        <i class="fa-solid fa-check text-green-400"></i>
                                        <span>{{ element.data.text || 'Новая особенность' }}</span>
                                      </div>

                                      <!-- Button element -->
                                      <button 
                                        v-else-if="element.type === 'button'"
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
                                        class="mb-2"
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

                                      <!-- Unknown element type -->
                                      <div v-else class="text-white text-sm bg-red-500 bg-opacity-50 p-2 rounded">
                                        Неизвестный тип элемента: {{ element.type }}
                                      </div>
                                        </div>

                                        <!-- Drop zone после элемента -->
                                        <div
                                          class="h-2 bg-transparent hover:bg-orange-200 transition-colors rounded"
                                          @dragover="onElementDragOver($event)"
                                          @drop="onElementDrop($event, index, elementIndex + 1)"
                                        ></div>
                                      </template>
                                    </template>
                                    <template v-else>
                                      <div
                                        class="h-24 flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-lg text-center text-white bg-white/5"
                                        @dragover="onElementDragOver($event)"
                                        @drop="onElementDrop($event, index, 0)"
                                      >
                                        <i class="fa-solid fa-plus mb-2"></i>
                                        <p class="text-sm opacity-80">Перетащите элемент в этот блок</p>
                                        <p class="text-xs opacity-60">Или выберите тип элемента в палитре справа</p>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                                <div class="relative hidden md:block">
                                  <transition name="pixel-fade" mode="out-in">
                                    <img :key="block.data?.previewImage || 'hero-image'" :src="block.data?.previewImage || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10'" alt="Слайд" class="w-full h-80 object-cover rounded-lg shadow-lg" />
                                  </transition>
                                  <div class="absolute top-4 right-4">
                                    <div class="relative">
                                      <i class="fa-solid fa-star text-yellow-400 text-4xl"></i>
                                      <span class="absolute inset-0 flex items-center justify-center text-red-700 text-xs font-bold">10%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- Контролы hero -->
                              <div class="absolute top-2 left-2 flex space-x-1">
                                <label class="bg-white text-gray-700 p-1 rounded text-xs cursor-pointer hover:bg-gray-100">
                                  <i class="fa-solid fa-image"></i>
                                  <input type="file" accept="image/*" class="hidden" @change="onHeroBgFile($event, index)" />
                                </label>
                                <label class="bg-white text-gray-700 p-1 rounded text-xs cursor-pointer hover:bg-gray-100">
                                  <i class="fa-solid fa-photo-film"></i>
                                  <input type="file" accept="image/*" class="hidden" @change="onHeroPreviewFile($event, index)" />
                                </label>
                                <button @click.stop="toggleHeroImageSide(index)" class="bg-white text-gray-700 p-1 rounded text-xs hover:bg-gray-100" title="Поменять сторону изображения">
                                  <i class="fa-solid fa-arrows-left-right"></i>
                                </button>
                                <button @click.stop="toggleHeroShowImage(index)" class="bg-white text-gray-700 p-1 rounded text-xs hover:bg-gray-100" title="Показать/скрыть изображение">
                                  <i class="fa-solid" :class="block.data?.showRightImage ? 'fa-eye' : 'fa-eye-slash'"></i>
                                </button>
                                <button @click.stop="toggleHeroWave(index)" class="bg-white text-gray-700 p-1 rounded text-xs hover:bg-gray-100" title="Волна внизу">
                                  <i class="fa-solid fa-water"></i>
                                </button>
                              </div>
                              <div class="absolute top-2 right-2 flex space-x-1">
                                <button @click.stop="setHeroButtonStyle(index, 'primary')" :class="['p-1 rounded text-xs', block.data?.buttonStyle==='primary' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100']">Primary</button>
                                <button @click.stop="setHeroButtonStyle(index, 'secondary')" :class="['p-1 rounded text-xs', block.data?.buttonStyle==='secondary' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100']">Secondary</button>
                                <button @click.stop="setHeroButtonAction(index, 'scroll')" :class="['p-1 rounded text-xs', block.data?.buttonAction==='scroll' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100']">Scroll</button>
                                <button @click.stop="setHeroButtonAction(index, 'link')" :class="['p-1 rounded text-xs', block.data?.buttonAction==='link' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100']">Link</button>
                              </div>
                              <svg v-if="block.data?.waveEnabled !== false" class="absolute bottom-0 left-0 w-full h-20 md:h-24 lg:h-32" preserveAspectRatio="none" viewBox="0 0 1440 100">
                                <path :fill="block.data?.waveColor || '#f9f4e5'" d="M0 50 Q 360 80 720 50 T 1440 50 V100 H0 Z"></path>
                              </svg>
                            </div>

                            <!-- Категории блок -->
                            <div 
                              v-else-if="block.type === 'categories'"
                              class="relative py-16 px-6 bg-gray-50"
                            >
                              <div class="max-w-6xl mx-auto text-center">
                                <!-- Заголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'heading'" class="mb-4">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-900 px-3 py-2 rounded text-3xl font-bold w-full max-w-2xl mx-auto"
                                    placeholder="Введите заголовок"
                                  />
                                </div>
                                <h2 
                                  v-else
                                  @click="startInlineEdit(index, 'heading', $event)"
                                  class="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.heading || 'Категории и блюда' }}
                                </h2>

                                <!-- Подзаголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'subheading'" class="mb-8">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-600 px-3 py-2 rounded text-xl w-full max-w-2xl mx-auto"
                                    placeholder="Введите подзаголовок"
                                  />
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'subheading', $event)"
                                  class="text-xl text-gray-600 mb-8 cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.subheading || 'которые вы нигде не найдете' }}
                                </p>

                                <!-- Описание -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'description'" class="mb-4">
                                  <textarea 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-500 px-3 py-2 rounded w-full max-w-2xl mx-auto resize-none"
                                    placeholder="Введите описание"
                                    rows="2"
                                  ></textarea>
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'description', $event)"
                                  class="text-gray-500 max-w-2xl mx-auto cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.description || 'Уникальные рецепты от наших шеф-поваров' }}
                                </p>
                              </div>
                              <!-- Панель управления блоком -->
                              <div class="absolute top-2 left-2 flex space-x-1">
                                <button @click.stop="moveBlockUp(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-up"></i>
                                </button>
                                <button @click.stop="moveBlockDown(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-down"></i>
                                </button>
                                <button @click.stop="removeBlock(index)" class="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </div>
                              
                              <!-- Кнопка добавления элемента -->
                              <div class="absolute top-2 right-2">
                                <button 
                                  @click.stop="openElementPalette(index)" 
                                  class="bg-green-500 text-white p-1 rounded text-xs hover:bg-green-600 transition"
                                  title="Добавить элемент"
                                >
                                  <i class="fa-solid fa-plus"></i>
                                </button>
                              </div>
                              <!-- Индикатор редактирования -->
                              <div v-if="selectedBlockIndex === index" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                <i class="fa-solid fa-edit mr-1"></i>
                                Редактируется
                              </div>
                            </div>

                            <!-- Меню блок -->
                            <div 
                              v-else-if="block.type === 'menu'"
                              class="relative py-16 px-6"
                            >
                              <div class="max-w-6xl mx-auto text-center">
                                <!-- Заголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'heading'" class="mb-4">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-900 px-3 py-2 rounded text-3xl font-bold w-full max-w-2xl mx-auto"
                                    placeholder="Введите заголовок"
                                  />
                                </div>
                                <h2 
                                  v-else
                                  @click="startInlineEdit(index, 'heading', $event)"
                                  class="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.heading || 'Популярные блюда' }}
                                </h2>

                                <!-- Подзаголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'subheading'" class="mb-8">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-600 px-3 py-2 rounded text-xl w-full max-w-2xl mx-auto"
                                    placeholder="Введите подзаголовок"
                                  />
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'subheading', $event)"
                                  class="text-xl text-gray-600 mb-8 cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.subheading || 'Попробуйте наши хиты' }}
                                </p>

                                <!-- Описание -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'description'" class="mb-4">
                                  <textarea 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-500 px-3 py-2 rounded w-full max-w-2xl mx-auto resize-none"
                                    placeholder="Введите описание"
                                    rows="2"
                                  ></textarea>
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'description', $event)"
                                  class="text-gray-500 max-w-2xl mx-auto cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.description || 'Самые любимые блюда наших клиентов' }}
                                </p>
                              </div>
                              <!-- Панель управления блоком -->
                              <div class="absolute top-2 left-2 flex space-x-1">
                                <button @click.stop="moveBlockUp(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-up"></i>
                                </button>
                                <button @click.stop="moveBlockDown(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-down"></i>
                                </button>
                                <button @click.stop="removeBlock(index)" class="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </div>
                              
                              <!-- Кнопка добавления элемента -->
                              <div class="absolute top-2 right-2">
                                <button 
                                  @click.stop="openElementPalette(index)" 
                                  class="bg-green-500 text-white p-1 rounded text-xs hover:bg-green-600 transition"
                                  title="Добавить элемент"
                                >
                                  <i class="fa-solid fa-plus"></i>
                                </button>
                              </div>
                              <!-- Индикатор редактирования -->
                              <div v-if="selectedBlockIndex === index" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                <i class="fa-solid fa-edit mr-1"></i>
                                Редактируется
                              </div>
                            </div>

                            <!-- Доставка блок -->
                            <div 
                              v-else-if="block.type === 'delivery'"
                              class="relative py-16 px-6 bg-orange-50"
                            >
                              <div class="max-w-6xl mx-auto text-center">
                                <!-- Заголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'heading'" class="mb-4">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-900 px-3 py-2 rounded text-3xl font-bold w-full max-w-2xl mx-auto"
                                    placeholder="Введите заголовок"
                                  />
                                </div>
                                <h2 
                                  v-else
                                  @click="startInlineEdit(index, 'heading', $event)"
                                  class="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:bg-orange-100 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.heading || 'Быстрая доставка' }}
                                </h2>

                                <!-- Подзаголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'subheading'" class="mb-8">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-600 px-3 py-2 rounded text-xl w-full max-w-2xl mx-auto"
                                    placeholder="Введите подзаголовок"
                                  />
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'subheading', $event)"
                                  class="text-xl text-gray-600 mb-8 cursor-pointer hover:bg-orange-100 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.subheading || 'Доставляем за 30 минут' }}
                                </p>

                                <!-- Описание -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'description'" class="mb-8">
                                  <textarea 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-500 px-3 py-2 rounded w-full max-w-2xl mx-auto resize-none"
                                    placeholder="Введите описание"
                                    rows="2"
                                  ></textarea>
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'description', $event)"
                                  class="text-gray-500 max-w-2xl mx-auto mb-8 cursor-pointer hover:bg-orange-100 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.description || 'Свежие суши и пицца прямо к вашей двери' }}
                                </p>

                                <!-- Особенности доставки -->
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                  <div v-for="(feature, featureIndex) in block.data?.features || []" :key="featureIndex" class="bg-white p-4 rounded-lg shadow-sm">
                                    <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'feature_' + featureIndex">
                                      <input 
                                        v-model="inlineEditValue"
                                        @keydown="handleInlineEditKeydown"
                                        @blur="saveInlineEdit"
                                        class="inline-edit-input bg-white text-gray-700 px-2 py-1 rounded text-sm w-full"
                                        placeholder="Особенность доставки"
                                      />
                                    </div>
                                    <p 
                                      v-else
                                      @click="startInlineEdit(index, 'feature_' + featureIndex, $event)"
                                      class="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition"
                                    >
                                      {{ feature }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <!-- Панель управления блоком -->
                              <div class="absolute top-2 left-2 flex space-x-1">
                                <button @click.stop="moveBlockUp(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-up"></i>
                                </button>
                                <button @click.stop="moveBlockDown(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-down"></i>
                                </button>
                                <button @click.stop="removeBlock(index)" class="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </div>
                              
                              <!-- Кнопка добавления элемента -->
                              <div class="absolute top-2 right-2">
                                <button 
                                  @click.stop="openElementPalette(index)" 
                                  class="bg-green-500 text-white p-1 rounded text-xs hover:bg-green-600 transition"
                                  title="Добавить элемент"
                                >
                                  <i class="fa-solid fa-plus"></i>
                                </button>
                              </div>
                              <!-- Индикатор редактирования -->
                              <div v-if="selectedBlockIndex === index" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                <i class="fa-solid fa-edit mr-1"></i>
                                Редактируется
                              </div>
                            </div>

                            <!-- Отзывы блок -->
                            <div 
                              v-else-if="block.type === 'reviews'"
                              class="relative py-16 px-6 bg-gray-50"
                            >
                              <div class="max-w-6xl mx-auto text-center">
                                <!-- Заголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'heading'" class="mb-4">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-900 px-3 py-2 rounded text-3xl font-bold w-full max-w-2xl mx-auto"
                                    placeholder="Введите заголовок"
                                  />
                                </div>
                                <h2 
                                  v-else
                                  @click="startInlineEdit(index, 'heading', $event)"
                                  class="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.heading || 'Отзывы наших клиентов' }}
                                </h2>

                                <!-- Подзаголовок -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'subheading'" class="mb-8">
                                  <input 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-600 px-3 py-2 rounded text-xl w-full max-w-2xl mx-auto"
                                    placeholder="Введите подзаголовок"
                                  />
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'subheading', $event)"
                                  class="text-xl text-gray-600 mb-8 cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.subheading || 'Что говорят о нас' }}
                                </p>

                                <!-- Описание -->
                                <div v-if="editingElement?.blockIndex === index && editingElement?.field === 'description'" class="mb-4">
                                  <textarea 
                                    v-model="inlineEditValue"
                                    @keydown="handleInlineEditKeydown"
                                    @blur="saveInlineEdit"
                                    class="inline-edit-input bg-white text-gray-500 px-3 py-2 rounded w-full max-w-2xl mx-auto resize-none"
                                    placeholder="Введите описание"
                                    rows="2"
                                  ></textarea>
                                </div>
                                <p 
                                  v-else
                                  @click="startInlineEdit(index, 'description', $event)"
                                  class="text-gray-500 max-w-2xl mx-auto cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition"
                                >
                                  {{ block.data?.description || 'Более 1000 довольных клиентов' }}
                                </p>
                              </div>
                              <!-- Панель управления блоком -->
                              <div class="absolute top-2 left-2 flex space-x-1">
                                <button @click.stop="moveBlockUp(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-up"></i>
                                </button>
                                <button @click.stop="moveBlockDown(index)" class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600">
                                  <i class="fa-solid fa-arrow-down"></i>
                                </button>
                                <button @click.stop="removeBlock(index)" class="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </div>
                              
                              <!-- Кнопка добавления элемента -->
                              <div class="absolute top-2 right-2">
                                <button 
                                  @click.stop="openElementPalette(index)" 
                                  class="bg-green-500 text-white p-1 rounded text-xs hover:bg-green-600 transition"
                                  title="Добавить элемент"
                                >
                                  <i class="fa-solid fa-plus"></i>
                                </button>
                              </div>
                              <!-- Индикатор редактирования -->
                              <div v-if="selectedBlockIndex === index" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                <i class="fa-solid fa-edit mr-1"></i>
                                Редактируется
                              </div>
                            </div>
                          </div>

                          <!-- Зона добавления блока снизу -->
                          <div 
                            @dragover.prevent
                            @drop="onDropZone($event, index + 1)"
                            class="h-8 border-2 border-dashed border-transparent hover:border-blue-400 transition-colors flex items-center justify-center"
                          >
                            <span class="text-xs text-gray-400">Перетащите блок сюда</span>
                          </div>
                        </div>

                        <!-- Пустое состояние -->
                        <div 
                          v-if="pageBlocks.length === 0" 
                          @dragover.prevent
                          @drop="onDropZone($event, 0)"
                          class="flex items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                        >
                          <div class="text-center">
                            <i class="fa-solid fa-plus-circle text-4xl mb-4"></i>
                            <p>Перетащите блоки из палитры сюда</p>
                            <p class="text-sm text-gray-400 mt-2">или кликните на блок в палитре</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Текстовый редактор -->
                <div v-else>

                <!-- Hero блок -->
                <div v-if="activeBlock === 'hero'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      v-model="heroHeading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="БЫСТРО И ВКУСНО"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
                    <input
                      v-model="heroSubheading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Попробуйте наши особые суши"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                    <textarea
                      v-model="heroDescription"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Самые свежие роллы и нигири для любого настроения..."
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Текст кнопки</label>
                    <input
                      v-model="heroButtonText"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Заказать сейчас"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Фоновое изображение</label>
                    <input
                      v-model="heroBackgroundImage"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="https://example.com/hero-bg.jpg"
                    />
                  </div>
                </div>

                <!-- Категории блок -->
                <div v-if="activeBlock === 'categories'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      v-model="categoriesHeading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Категории и блюда"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
                    <input
                      v-model="categoriesSubheading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="которые вы нигде не найдете"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                    <textarea
                      v-model="categoriesDescription"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Уникальные рецепты от наших шеф-поваров"
                    ></textarea>
                  </div>
                </div>

                <!-- Меню блок -->
                <div v-if="activeBlock === 'menu'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      v-model="menuHeading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Популярные блюда"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
                    <input
                      v-model="menuSubheading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Попробуйте наши хиты"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                    <textarea
                      v-model="menuDescription"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Самые любимые блюда наших клиентов"
                    ></textarea>
                  </div>
                </div>

                <!-- Доставка блок -->
                <div v-if="activeBlock === 'delivery'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      v-model="deliveryHeading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Быстрая доставка"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
                    <input
                      v-model="deliverySubheading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Доставляем за 30 минут"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                    <textarea
                      v-model="deliveryDescription"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Свежие суши и пицца прямо к вашей двери"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Особенности (по одной на строку)</label>
                    <textarea
                      v-model="deliveryFeaturesText"
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Бесплатная доставка от 1500₽&#10;Доставка за 30 минут&#10;Свежие ингредиенты&#10;Горячие блюда"
                    ></textarea>
                  </div>
                </div>

                <!-- Отзывы блок -->
                <div v-if="activeBlock === 'reviews'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      v-model="reviewsHeading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Отзывы наших клиентов"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
                    <input
                      v-model="reviewsSubheading"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Что говорят о нас"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                    <textarea
                      v-model="reviewsDescription"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Более 1000 довольных клиентов"
                    ></textarea>
                  </div>
                </div>
              </div>
             </div>
           </div>

           <!-- Боковой инспектор -->
           <div class="xl:col-span-1">
             <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
               <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                 <i class="fa-solid fa-sliders mr-2 text-orange-500"></i>
                 Инспектор
               </h3>

               <div v-if="selectedBlockIndex >= 0">
                 <div class="text-sm text-gray-500 mb-3">
                   Блок: {{ pageBlocks[selectedBlockIndex]?.name }} ({{ pageBlocks[selectedBlockIndex]?.type }})
                 </div>

                 <div v-if="selectedElement && (selectedElement.elementIndex !== undefined && selectedElement.elementIndex !== null) && pageBlocks[selectedElement.blockIndex] && pageBlocks[selectedElement.blockIndex].data && pageBlocks[selectedElement.blockIndex].data.elements && pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex]">
                   <div class="mb-3 text-sm font-medium text-gray-900">Элемент: {{ pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type }}</div>
                   <div class="space-y-4">
                     <template v-if="['heading','subheading','paragraph','feature'].includes(pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type)">
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Текст</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.text" @input="syncBlocksToForm()" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                     </template>
                     <template v-if="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type === 'heading'">
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Уровень</label>
                         <select v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.level" @change="syncBlocksToForm()" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option value="h1">H1</option>
                           <option value="h2">H2</option>
                           <option value="h3">H3</option>
                         </select>
                       </div>
                     </template>
                     <template v-if="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type === 'button'">
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Текст кнопки</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.text" @input="syncBlocksToForm()" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Стиль</label>
                         <select v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.style" @change="syncBlocksToForm()" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option value="primary">primary</option>
                           <option value="secondary">secondary</option>
                         </select>
                       </div>
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Действие</label>
                         <select v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.action" @change="syncBlocksToForm()" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option value="scroll">scroll</option>
                           <option value="link">link</option>
                         </select>
                       </div>
                       <div v-if="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.action === 'link'">
                         <label class="block text-xs font-medium text-gray-700 mb-1">URL</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.href" @input="syncBlocksToForm()" type="text" placeholder="https://..." class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                     </template>
                     <template v-if="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type === 'image'">
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Ссылка на изображение</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.src" @input="syncBlocksToForm()" type="text" placeholder="https://..." class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Ширина</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.width" @input="syncBlocksToForm()" type="text" placeholder="200px или 50%" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Высота</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.height" @input="syncBlocksToForm()" type="text" placeholder="150px или auto" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                     </template>

                     <div class="border-t pt-4">
                       <h4 class="text-sm font-medium text-gray-700 mb-3">Стили</h4>

                       <div v-if="['heading','subheading','paragraph','feature','button'].includes(pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type)">
                         <label class="block text-xs font-medium text-gray-700 mb-1">Цвет текста</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.color" @input="syncBlocksToForm()" type="color" class="w-full h-8 border border-gray-200 rounded" />
                       </div>

                       <div v-if="['heading','subheading','paragraph','feature'].includes(pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].type)">
                         <label class="block text-xs font-medium text-gray-700 mb-1">Размер шрифта</label>
                         <select v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.fontSize" @change="syncBlocksToForm()" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option value="text-xs">Очень маленький (12px)</option>
                           <option value="text-sm">Маленький (14px)</option>
                           <option value="text-base">Обычный (16px)</option>
                           <option value="text-lg">Большой (18px)</option>
                           <option value="text-xl">Очень большой (20px)</option>
                           <option value="text-2xl">Огромный (24px)</option>
                           <option value="text-3xl">Гигантский (30px)</option>
                         </select>
                       </div>

                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Выравнивание</label>
                         <select v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.align" @change="syncBlocksToForm()" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option value="left">По левому краю</option>
                           <option value="center">По центру</option>
                           <option value="right">По правому краю</option>
                           <option value="justify">По ширине</option>
                         </select>
                       </div>

                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Отступ сверху</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.marginTop" @input="syncBlocksToForm()" type="text" placeholder="0px, 1rem, 2em" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                       <div>
                         <label class="block text-xs font-medium text-gray-700 mb-1">Отступ снизу</label>
                         <input v-model="pageBlocks[selectedElement.blockIndex].data.elements[selectedElement.elementIndex].data.marginBottom" @input="syncBlocksToForm()" type="text" placeholder="0px, 1rem, 2em" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                       </div>
                     </div>
                   </div>
                   <div class="mt-3 text-xs text-gray-500">Подсказка: клик по элементу в превью выделяет его для редактирования.</div>
                 </div>

                 <div v-else>
                   <template v-if="getInspectorSections(inspectorBlockType).length">
                     <div class="space-y-6">
                       <div
                         v-for="section in getInspectorSections(inspectorBlockType)"
                         :key="section.title"
                         class="border-b border-gray-100 pb-5 last:pb-0 last:border-b-0"
                       >
                         <div class="flex items-start justify-between">
                           <div>
                             <h4 class="text-sm font-semibold text-gray-800">{{ section.title }}</h4>
                             <p v-if="section.description" class="text-xs text-gray-500 mt-1">{{ section.description }}</p>
                           </div>
                           <span v-if="section.badge" class="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{{ section.badge }}</span>
                         </div>
                         <div class="space-y-4 mt-4">
                           <template v-for="field in section.fields" :key="field.key">
                             <div v-if="shouldShowField(inspectorBlockType, field)" class="space-y-1">
                               <label class="block text-xs font-medium text-gray-700">{{ field.label }}</label>
                               <template v-if="field.type === 'textarea'">
                                 <textarea
                                   v-model="resolveBlockFieldModel(inspectorBlockType, field)"
                                   :rows="field.rows || 3"
                                   class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                                   :placeholder="field.placeholder || ''"
                                 ></textarea>
                               </template>
                               <template v-else-if="field.type === 'select'">
                                 <select
                                   v-model="resolveBlockFieldModel(inspectorBlockType, field)"
                                   class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                 >
                                   <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
                                 </select>
                               </template>
                               <template v-else-if="field.type === 'checkbox'">
                                 <label class="inline-flex items-center space-x-2 text-xs text-gray-600">
                                   <input
                                     type="checkbox"
                                     class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                     v-model="resolveBlockFieldModel(inspectorBlockType, field)"
                                   />
                                   <span>{{ field.help || 'Активно' }}</span>
                                 </label>
                               </template>
                               <template v-else-if="field.type === 'color'">
                                 <input
                                   type="color"
                                   class="w-16 h-10 border border-gray-300 rounded-md"
                                   v-model="resolveBlockFieldModel(inspectorBlockType, field)"
                                 />
                               </template>
                               <template v-else>
                                 <input
                                   :type="field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'"
                                   v-model="resolveBlockFieldModel(inspectorBlockType, field)"
                                   class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                   :placeholder="field.placeholder || ''"
                                 />
                               </template>
                               <p v-if="field.help && field.type !== 'checkbox'" class="text-xs text-gray-500">{{ field.help }}</p>
                             </div>
                           </template>
                         </div>
                       </div>
                     </div>
                   </template>
                   <div v-else class="bg-orange-50 border border-orange-200 text-orange-700 text-xs p-3 rounded-lg">
                     <p class="font-medium">Советы по работе с конструктором</p>
                     <ul class="list-disc list-inside mt-2 space-y-1">
                       <li>Клик по тексту на холсте открывает inline-редактор</li>
                       <li>Выберите элемент, чтобы менять его стили и параметры</li>
                       <li>Используйте стрелки на превью для перестановки блоков</li>
                     </ul>
                   </div>
                 </div>
               </div>
               <div v-else class="text-sm text-gray-500">
                 Выберите блок на холсте, чтобы увидеть его параметры.
               </div>
             </div>
           </div>

           <!-- Уведомления -->
          <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center">
            <i class="fa-solid fa-exclamation-triangle mr-2"></i>
            {{ error }}
          </div>
          <div v-if="saved" class="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center">
            <i class="fa-solid fa-check-circle mr-2"></i>
            Настройки успешно сохранены!
          </div>
        </div>
      </div>
    `,
    setup() {
      const form = ref({
        site_title: 'Точка суши и пиццы',
        logo: '',
        favicon: '',
        background_color: '#dc2626',
        home_blocks: {}
      });

      const activeBlock = ref('hero');
      const loading = ref(false);
      const error = ref('');
      const saved = ref(false);
      const logoPreview = ref('');
      const faviconPreview = ref('');
      
      // Конструктор блоков
      const editMode = ref('visual'); // 'visual' или 'text'
      const pageBlocks = ref([]);
      const selectedBlockIndex = ref(-1);
      const draggedIndex = ref(-1);
      
      // Визуальный конструктор
      const showPreview = ref(false);
      const zoomLevel = ref(0.8);
      const deviceView = ref('desktop'); // 'desktop', 'tablet', 'mobile'
      const selectedBlockType = ref('');
      const editingElement = ref(null); // { blockIndex, field, element }
      const inlineEditValue = ref('');
      const showElementPalette = ref(false);
      const selectedElementType = ref('');
      const draggedElement = ref(null);
      const hoveredBlock = ref(-1);
      const selectedElement = ref(null); // { blockIndex, elementIndex }
      const inspectorBlockType = computed(() => {
        if (selectedBlockIndex.value >= 0) {
          return pageBlocks.value[selectedBlockIndex.value]?.type || '';
        }
        return '';
      });
      const canvasMode = ref('preview');

      const blocks = {
        hero: { name: 'Hero блок', icon: 'fa-solid fa-fire' },
        categories: { name: 'Категории', icon: 'fa-solid fa-tags' },
        menu: { name: 'Меню', icon: 'fa-solid fa-utensils' },
        map: { name: 'Карта', icon: 'fa-solid fa-map-location-dot' },
        delivery: { name: 'Доставка', icon: 'fa-solid fa-truck' },
        reviews: { name: 'Отзывы', icon: 'fa-solid fa-star' }
      };

      // Палитра элементов для добавления в блоки
      const elementTypes = {
        heading: { name: 'Заголовок', icon: 'fa-solid fa-heading', type: 'text' },
        subheading: { name: 'Подзаголовок', icon: 'fa-solid fa-text-width', type: 'text' },
        paragraph: { name: 'Текст', icon: 'fa-solid fa-paragraph', type: 'text' },
        button: { name: 'Кнопка', icon: 'fa-solid fa-hand-pointer', type: 'button' },
        image: { name: 'Изображение', icon: 'fa-solid fa-image', type: 'media' },
        feature: { name: 'Особенность', icon: 'fa-solid fa-check-circle', type: 'feature' },
        spacer: { name: 'Отступ', icon: 'fa-solid fa-arrows-alt-v', type: 'layout' }
      };

      const availableBlocks = {
        hero: { name: 'Hero', icon: 'fa-solid fa-fire' },
        categories: { name: 'Категории', icon: 'fa-solid fa-tags' },
        menu: { name: 'Меню', icon: 'fa-solid fa-utensils' },
        map: { name: 'Карта', icon: 'fa-solid fa-map-location-dot' },
        delivery: { name: 'Доставка', icon: 'fa-solid fa-truck' },
        reviews: { name: 'Отзывы', icon: 'fa-solid fa-star' }
      };

      const blockInspectorBlueprints = {
        hero: {
          sections: [
            {
              title: 'Контент',
              description: 'Заголовки и текстовые элементы hero-блока',
              fields: [
                { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'БЫСТРО И ВКУСНО' },
                { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'Попробуйте наши особые суши' },
                { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Самые свежие роллы и нигири для любого настроения.' },
                { key: 'buttonText', label: 'Текст кнопки', type: 'text', placeholder: 'Заказать сейчас' },
                {
                  key: 'buttonAction',
                  label: 'Действие кнопки',
                  type: 'select',
                  default: 'scroll',
                  options: [
                    { value: 'scroll', label: 'Прокрутка к секции' },
                    { value: 'link', label: 'Открыть ссылку' }
                  ]
                },
                {
                  key: 'buttonLink',
                  label: 'Ссылка кнопки',
                  type: 'url',
                  placeholder: 'https://example.com',
                  help: 'Используется, когда действие кнопки — ссылка',
                  showWhen(data) {
                    return (data?.buttonAction || 'scroll') === 'link';
                  }
                }
              ]
            },
            {
              title: 'Оформление',
              description: 'Настройки внешнего вида hero-блока',
              fields: [
                {
                  key: 'backgroundImage',
                  label: 'Фоновое изображение',
                  type: 'url',
                  placeholder: 'https://images.unsplash.com/...',
                  help: 'Можно также загрузить изображение прямо в превью блока'
                },
                {
                  key: 'showRightImage',
                  label: 'Показывать правую картинку',
                  type: 'checkbox',
                  default: true,
                  help: 'Управляет отображением дополнительного изображения'
                },
                {
                  key: 'imageSide',
                  label: 'Расположение изображения',
                  type: 'select',
                  default: 'right',
                  options: [
                    { value: 'right', label: 'Справа' },
                    { value: 'left', label: 'Слева' }
                  ]
                },
                {
                  key: 'buttonStyle',
                  label: 'Стиль кнопки',
                  type: 'select',
                  default: 'primary',
                  options: [
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' }
                  ]
                },
                {
                  key: 'waveEnabled',
                  label: 'Показывать волну внизу',
                  type: 'checkbox',
                  default: true
                },
                {
                  key: 'waveColor',
                  label: 'Цвет волны',
                  type: 'color',
                  default: '#f9f4e5',
                  showWhen(data) {
                    return data?.waveEnabled !== false;
                  }
                }
              ]
            }
          ]
        },
        categories: {
          sections: [
            {
              title: 'Контент',
              fields: [
                { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Категории и блюда' },
                { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'которые вы нигде не найдете' },
                { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Уникальные рецепты от наших шеф-поваров' }
              ]
            }
          ]
        },
        menu: {
          sections: [
            {
              title: 'Контент',
              fields: [
                { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Популярные блюда' },
                { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'Попробуйте наши хиты' },
                { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Самые любимые блюда наших клиентов' }
              ]
            }
          ]
        },
        delivery: {
          sections: [
            {
              title: 'Контент',
              fields: [
                { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Быстрая доставка' },
                { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'Доставляем за 30 минут' },
                { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Свежие суши и пицца прямо к вашей двери' },
                {
                  key: 'features',
                  label: 'Преимущества (по одному на строку)',
                  type: 'textarea',
                  rows: 4,
                  modelKey: 'deliveryFeaturesText',
                  placeholder: 'Бесплатная доставка от 1500₽\nДоставка за 30 минут\nСвежие ингредиенты'
                }
              ]
            }
          ]
        },
        reviews: {
          sections: [
            {
              title: 'Контент',
              fields: [
                { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Отзывы наших клиентов' },
                { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'Что говорят о нас' },
                { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Более 1000 довольных клиентов' }
              ]
            }
          ]
        },
        map: {
          sections: [
            {
              title: 'Контент',
              fields: [
                { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Мы рядом' },
                { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'Загляните к нам' },
                { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Укажите краткую информацию о заведении' },
                { key: 'address', label: 'Адрес', type: 'text', placeholder: 'Москва, ул. Примерная, 10' },
                {
                  key: 'iframe',
                  label: 'Код карты (iframe)',
                  type: 'textarea',
                  rows: 4,
                  placeholder: '<iframe src="https://maps.google.com/..." />',
                  help: 'Вставьте сюда iframe для встроенной карты'
                }
              ]
            }
          ]
        }
      };

      const blockFieldModelCache = {};
      const emptyFieldModel = computed({
        get: () => '',
        set: () => {}
      });

      // Computed для работы с features доставки как с текстом
      const deliveryFeaturesText = computed({
        get() {
          const raw = getBlockData('delivery', 'features');
          if (Array.isArray(raw)) {
            return raw.join('\n');
          }
          if (typeof raw === 'string') {
            return raw;
          }
          return '';
        },
        set(value) {
          const normalized = (value || '')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
          setBlockData('delivery', 'features', normalized);
        }
      });

      // Универсальная функция для работы с данными блоков
      function getBlockDataObject(blockType) {
        if (editMode.value === 'visual' && selectedBlockIndex.value >= 0) {
          const block = pageBlocks.value[selectedBlockIndex.value];
          if (block && block.type === blockType) {
            return block.data || {};
          }
        }
        return form.value.home_blocks[blockType] || {};
      }

      function getBlockData(blockType, field) {
        const data = getBlockDataObject(blockType);
        const value = data ? data[field] : undefined;
        return value === undefined || value === null ? '' : value;
      }

      function setBlockData(blockType, field, value) {
        if (editMode.value === 'visual' && selectedBlockIndex.value >= 0) {
          const block = pageBlocks.value[selectedBlockIndex.value];
          if (block && block.type === blockType) {
            if (!block.data) block.data = {};
            block.data[field] = value;
            syncBlocksToForm();
            return;
          }
        }

        if (!form.value.home_blocks[blockType]) {
          form.value.home_blocks[blockType] = {};
        }
        form.value.home_blocks[blockType][field] = value;
      }

      function getInspectorSections(blockType) {
        return blockInspectorBlueprints[blockType]?.sections || [];
      }

      const customFieldModels = {
        deliveryFeaturesText
      };

      function shouldShowField(blockType, field) {
        if (typeof field.showWhen !== 'function') {
          return true;
        }
        try {
          const data = getBlockDataObject(blockType);
          return field.showWhen(data || {});
        } catch (e) {
          console.warn('showWhen evaluation error', e);
          return true;
        }
      }

      function resolveBlockFieldModel(blockType, field) {
        if (!blockType) {
          return emptyFieldModel;
        }

        if (!blockInspectorBlueprints[blockType]) {
          return emptyFieldModel;
        }

        if (field.modelKey && customFieldModels[field.modelKey]) {
          return customFieldModels[field.modelKey];
        }

        if (!blockFieldModelCache[blockType]) {
          blockFieldModelCache[blockType] = {};
        }

        if (!blockFieldModelCache[blockType][field.key]) {
          blockFieldModelCache[blockType][field.key] = computed({
            get() {
              const current = getBlockData(blockType, field.key);
              if ((current === '' || current === undefined || current === null) && field.default !== undefined) {
                return field.default;
              }

              if (field.type === 'checkbox') {
                if (current === '') {
                  return !!field.default;
                }
                return Boolean(current);
              }

              return current;
            },
            set(newValue) {
              let normalized = newValue;
              if (field.type === 'checkbox') {
                normalized = !!newValue;
              } else if (field.type === 'number') {
                normalized = newValue === '' || newValue === null ? null : Number(newValue);
              }
              setBlockData(blockType, field.key, normalized);
            }
          });
        }

        return blockFieldModelCache[blockType][field.key];
      }

      // Computed свойства для безопасного доступа к полям блоков
      const heroHeading = computed({
        get() { return getBlockData('hero', 'heading'); },
        set(value) { setBlockData('hero', 'heading', value); }
      });
      
      const heroSubheading = computed({
        get() { return getBlockData('hero', 'subheading'); },
        set(value) { setBlockData('hero', 'subheading', value); }
      });
      
      const heroDescription = computed({
        get() { return getBlockData('hero', 'description'); },
        set(value) { setBlockData('hero', 'description', value); }
      });
      
      const heroButtonText = computed({
        get() { return getBlockData('hero', 'buttonText'); },
        set(value) { setBlockData('hero', 'buttonText', value); }
      });
      
      const heroBackgroundImage = computed({
        get() { return getBlockData('hero', 'backgroundImage'); },
        set(value) { setBlockData('hero', 'backgroundImage', value); }
      });

      // Категории
      const categoriesHeading = computed({
        get() { return getBlockData('categories', 'heading'); },
        set(value) { setBlockData('categories', 'heading', value); }
      });
      
      const categoriesSubheading = computed({
        get() { return getBlockData('categories', 'subheading'); },
        set(value) { setBlockData('categories', 'subheading', value); }
      });
      
      const categoriesDescription = computed({
        get() { return getBlockData('categories', 'description'); },
        set(value) { setBlockData('categories', 'description', value); }
      });

      // Меню
      const menuHeading = computed({
        get() { return getBlockData('menu', 'heading'); },
        set(value) { setBlockData('menu', 'heading', value); }
      });
      
      const menuSubheading = computed({
        get() { return getBlockData('menu', 'subheading'); },
        set(value) { setBlockData('menu', 'subheading', value); }
      });
      
      const menuDescription = computed({
        get() { return getBlockData('menu', 'description'); },
        set(value) { setBlockData('menu', 'description', value); }
      });

      // Доставка
      const deliveryHeading = computed({
        get() { return getBlockData('delivery', 'heading'); },
        set(value) { setBlockData('delivery', 'heading', value); }
      });
      
      const deliverySubheading = computed({
        get() { return getBlockData('delivery', 'subheading'); },
        set(value) { setBlockData('delivery', 'subheading', value); }
      });
      
      const deliveryDescription = computed({
        get() { return getBlockData('delivery', 'description'); },
        set(value) { setBlockData('delivery', 'description', value); }
      });

      // Отзывы
      const reviewsHeading = computed({
        get() { return getBlockData('reviews', 'heading'); },
        set(value) { setBlockData('reviews', 'heading', value); }
      });
      
      const reviewsSubheading = computed({
        get() { return getBlockData('reviews', 'subheading'); },
        set(value) { setBlockData('reviews', 'subheading', value); }
      });
      
      const reviewsDescription = computed({
        get() { return getBlockData('reviews', 'description'); },
        set(value) { setBlockData('reviews', 'description', value); }
      });

      // Методы конструктора блоков
      function generateBlockId() {
        return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }

      function addBlock(blockType) {
        const blockTemplate = availableBlocks[blockType];
        if (!blockTemplate) return;

        const newBlock = {
          id: generateBlockId(),
          type: blockType,
          name: blockTemplate.name,
          icon: blockTemplate.icon,
          data: getDefaultBlockData(blockType)
        };

        pageBlocks.value.push(newBlock);
        selectedBlockIndex.value = pageBlocks.value.length - 1;
      }

      function getDefaultBlockData(blockType) {
        const defaults = {
          hero: {
            heading: "БЫСТРО И ВКУСНО",
            subheading: "Попробуйте наши особые суши",
            description: "Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.",
            buttonText: "Заказать сейчас",
            backgroundImage: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d",
            previewImage: "https://images.unsplash.com/photo-1607301405418-780ee5e6dd10",
            showRightImage: true,
            imageSide: 'right', // 'left' | 'right'
            waveEnabled: true,
            waveColor: '#f9f4e5',
            buttonStyle: 'primary', // primary | secondary
            buttonAction: 'scroll', // scroll | link
            elements: [
              {
                id: 'hero-heading-1',
                type: 'heading',
                data: {
                  text: 'БЫСТРО И ВКУСНО',
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
                  text: 'Попробуйте наши особые суши',
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
                  text: 'Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.',
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
                  text: 'Заказать сейчас',
                  style: 'primary',
                  action: 'scroll',
                  color: '#ffffff',
                  fontSize: 'text-base',
                  align: 'left',
                  marginTop: '0px',
                  marginBottom: '0px'
                }
              }
            ]
          },
          categories: {
            heading: "Категории и блюда",
            subheading: "которые вы нигде не найдете",
            description: "Уникальные рецепты от наших шеф-поваров"
          },
          menu: {
            heading: "Популярные блюда",
            subheading: "Попробуйте наши хиты",
            description: "Самые любимые блюда наших клиентов"
          },
          delivery: {
            heading: "Быстрая доставка",
            subheading: "Доставляем за 30 минут",
            description: "Свежие суши и пицца прямо к вашей двери",
            features: [
              "Бесплатная доставка от 1500₽",
              "Доставка за 30 минут",
              "Свежие ингредиенты",
              "Горячие блюда"
            ]
          },
          reviews: {
            heading: "Отзывы наших клиентов",
            subheading: "Что говорят о нас",
            description: "Более 1000 довольных клиентов"
          },
          map: {
            heading: "Мы рядом",
            subheading: "Загляните к нам",
            description: "Мы находимся в самом центре города",
            address: "Москва, ул. Примерная, 10",
            iframe: ""
          }
        };
        return defaults[blockType] || {};
      }

      // Helpers: file -> base64
      function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      async function onHeroBgFile(e, index) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const dataUrl = await readFileAsDataUrl(file);
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        if (!block.data) block.data = {};
        block.data.backgroundImage = dataUrl;
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      async function onHeroPreviewFile(e, index) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const dataUrl = await readFileAsDataUrl(file);
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        if (!block.data) block.data = {};
        block.data.previewImage = dataUrl;
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function toggleHeroImageSide(index) {
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        block.data.imageSide = block.data.imageSide === 'left' ? 'right' : 'left';
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function toggleHeroShowImage(index) {
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        block.data.showRightImage = !block.data.showRightImage;
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function toggleHeroWave(index) {
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        block.data.waveEnabled = !block.data.waveEnabled;
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function setHeroWaveColor(index, color) {
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        block.data.waveColor = color || '#f9f4e5';
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function setHeroButtonStyle(index, style) {
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        block.data.buttonStyle = style;
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function setHeroButtonAction(index, action) {
        const block = pageBlocks.value[index];
        if (!block || block.type !== 'hero') return;
        block.data.buttonAction = action;
        if (editMode.value === 'visual') { syncBlocksToForm(); }
      }

      function removeBlock(index) {
        if (index >= 0 && index < pageBlocks.value.length) {
          pageBlocks.value.splice(index, 1);
          if (pageBlocks.value.length === 0) {
            selectedBlockIndex.value = -1;
            selectedBlockType.value = '';
          } else {
            const nextIndex = Math.min(Math.max(selectedBlockIndex.value - (selectedBlockIndex.value >= index ? 1 : 0), 0), pageBlocks.value.length - 1);
            selectedBlockIndex.value = nextIndex;
            selectedBlockType.value = pageBlocks.value[nextIndex].type;
            activeBlock.value = pageBlocks.value[nextIndex].type;
          }
          selectedElement.value = null;
        }
      }

      function selectBlock(index) {
        selectedBlockIndex.value = index;
        selectedElement.value = null; // Очищаем выбранный элемент
        if (index >= 0 && index < pageBlocks.value.length) {
          const block = pageBlocks.value[index];
          activeBlock.value = block.type;
          selectedBlockType.value = block.type;
        }
      }

      function moveBlockUp(index) {
        if (index > 0) {
          const block = pageBlocks.value.splice(index, 1)[0];
          pageBlocks.value.splice(index - 1, 0, block);
          selectedBlockIndex.value = index - 1;
          selectedBlockType.value = block.type;
          activeBlock.value = block.type;
        }
      }

      function moveBlockDown(index) {
        if (index < pageBlocks.value.length - 1) {
          const block = pageBlocks.value.splice(index, 1)[0];
          pageBlocks.value.splice(index + 1, 0, block);
          selectedBlockIndex.value = index + 1;
          selectedBlockType.value = block.type;
          activeBlock.value = block.type;
        }
      }

      function onDragStart(event, index) {
        draggedIndex.value = index;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', event.target.outerHTML);
      }

      function onDrop(event) {
        event.preventDefault();
        const dropIndex = getDropIndex(event);
        
        if (draggedIndex.value !== -1 && dropIndex !== -1 && draggedIndex.value !== dropIndex) {
          const draggedBlock = pageBlocks.value.splice(draggedIndex.value, 1)[0];
          pageBlocks.value.splice(dropIndex, 0, draggedBlock);
          selectedBlockIndex.value = dropIndex;
        }
        
        draggedIndex.value = -1;
      }

      function getDropIndex(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const y = event.clientY - rect.top;
        const blockHeight = 80; // Примерная высота блока
        return Math.floor(y / blockHeight);
      }

      function syncBlocksToForm() {
        // Синхронизируем блоки из конструктора в форму (ключевые поля по типу)
        const blocksData = {};
        pageBlocks.value.forEach(block => {
          blocksData[block.type] = block.data;
        });
        form.value.home_blocks = blocksData;
        // Также сохраняем линейный конфиг страницы с порядком блоков (для рендера на главной)
        form.value.home_blocks.page = pageBlocks.value.map(b => ({
          id: b.id,
          type: b.type,
          data: b.data || {},
          elements: (b.data && Array.isArray(b.data.elements)) ? b.data.elements : []
        }));
      }

      function syncFormToBlocks() {
        // Синхронизируем данные из формы в блоки конструктора
        const existingBlocks = [...pageBlocks.value];
        pageBlocks.value = [];

        const hb = form.value.home_blocks || {};
        // Если есть home_blocks.page (линейный конфиг), используем его (сохраняя визуальные метаданные)
        if (Array.isArray(hb.page) && hb.page.length > 0) {
          hb.page.forEach(p => {
            const blockTemplate = availableBlocks[p.type];
            if (!blockTemplate) return;
            const existingBlock = existingBlocks.find(b => b.id === p.id) || existingBlocks.find(b => b.type === p.type);
            const blockData = p.data || {};
            // Добавляем элементы по умолчанию для Hero блока, если их нет
            if (p.type === 'hero' && (!blockData.elements || !Array.isArray(blockData.elements) || blockData.elements.length === 0)) {
              const defaultHeroData = getDefaultBlockData('hero');
              blockData.elements = defaultHeroData.elements || [];
            }
            
            pageBlocks.value.push({
              id: p.id || existingBlock?.id || generateBlockId(),
              type: p.type,
              name: blockTemplate.name,
              icon: blockTemplate.icon,
              data: blockData
            });
          });
          return;
        }

        // Иначе восстанавливаем по ключам блоков (старый формат)
        Object.keys(hb).forEach(blockType => {
          if (blockType === 'page') return;
          const existingBlock = existingBlocks.find(b => b.type === blockType);
          const blockTemplate = availableBlocks[blockType];
          if (blockTemplate) {
            const blockData = hb[blockType] || {};
            // Добавляем элементы по умолчанию для Hero блока, если их нет
            if (blockType === 'hero' && (!blockData.elements || !Array.isArray(blockData.elements) || blockData.elements.length === 0)) {
              const defaultHeroData = getDefaultBlockData('hero');
              blockData.elements = defaultHeroData.elements || [];
            }
            
            const newBlock = {
              id: existingBlock?.id || generateBlockId(),
              type: blockType,
              name: blockTemplate.name,
              icon: blockTemplate.icon,
              data: blockData
            };
            pageBlocks.value.push(newBlock);
          }
        });
      }

      // Методы визуального конструктора
      function hasBlock(blockType) {
        return pageBlocks.value.some(block => block.type === blockType);
      }

      function togglePreview() {
        showPreview.value = !showPreview.value;
      }

      function zoomIn() {
        zoomLevel.value = Math.min(zoomLevel.value + 0.1, 1.5);
      }

      function zoomOut() {
        zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.3);
      }

      function getDeviceWidth() {
        const widths = {
          desktop: 1200,
          tablet: 768,
          mobile: 375
        };
        return widths[deviceView.value] || 1200;
      }

      const canvasStyle = computed(() => {
        if (canvasMode.value === 'fullscreen') {
          return {
            minHeight: '700px',
            width: '100%',
            maxWidth: getDeviceWidth() + 'px',
            transform: 'none',
            transformOrigin: 'top left',
            margin: '0 auto',
            padding: '24px 0'
          };
        }

        return {
          height: '600px',
          transform: `scale(${zoomLevel.value})`,
          transformOrigin: 'top left',
          width: getDeviceWidth() + 'px',
          margin: '0 auto'
        };
      });

      function selectBlockByType(blockType) {
        selectedBlockType.value = blockType;
        activeBlock.value = blockType;
        // Находим индекс блока в pageBlocks
        const index = pageBlocks.value.findIndex(block => block.type === blockType);
        if (index >= 0) {
          selectedBlockIndex.value = index;
        }
      }

      // Drag & Drop методы для блоков
      function onBlockDragStart(event, index) {
        // Проверяем, что это не перетаскивание элемента
        if (event.target.closest('.space-y-4')) {
          return; // Это элемент, не блок
        }
        
        draggedIndex.value = index;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', JSON.stringify({ blockIndex: index, type: 'block' }));
        event.target.style.opacity = '0.5';
      }

      function onBlockDragEnd(event) {
        event.target.style.opacity = '1';
        draggedIndex.value = -1;
      }

      function onDropBetween(targetIndex) {
        if (draggedIndex.value === -1) return;
        
        const draggedBlock = pageBlocks.value[draggedIndex.value];
        pageBlocks.value.splice(draggedIndex.value, 1);
        
        // Корректируем индекс если удалили блок выше целевого
        const newIndex = draggedIndex.value < targetIndex ? targetIndex - 1 : targetIndex;
        pageBlocks.value.splice(newIndex, 0, draggedBlock);
        
        selectedBlockIndex.value = newIndex;
        draggedIndex.value = -1;
        
        // Синхронизируем изменения
        if (editMode.value === 'visual') {
          syncBlocksToForm();
        }
      }

      // Drag & Drop из палитры
      function onPaletteDragStart(event, blockType) {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', blockType);
        event.target.style.opacity = '0.5';
      }

      function onPaletteDragEnd(event) {
        event.target.style.opacity = '1';
      }

      // Универсальная зона drop
      function onDropZone(event, targetIndex) {
        event.preventDefault();
        
        // Проверяем, что перетаскивается из палитры
        const blockType = event.dataTransfer.getData('text/plain');
        if (blockType && availableBlocks[blockType]) {
          // Создаем новый блок
          const newBlock = {
            id: generateBlockId(),
            type: blockType,
            name: availableBlocks[blockType].name,
            icon: availableBlocks[blockType].icon,
            data: getDefaultBlockData(blockType)
          };
          
          // Вставляем блок в нужную позицию
          pageBlocks.value.splice(targetIndex, 0, newBlock);
          selectedBlockIndex.value = targetIndex;
          
          // Синхронизируем изменения
          if (editMode.value === 'visual') {
            syncBlocksToForm();
          }
          return;
        }
        
        // Если это перетаскивание существующего блока
        if (draggedIndex.value !== -1) {
          onDropBetween(targetIndex);
        }
      }

      // Inline редактирование элементов
      function startInlineEdit(blockIndex, field, event) {
        event.preventDefault();
        event.stopPropagation();
        
        const block = pageBlocks.value[blockIndex];
        if (!block) return;
        
        // Запоминаем выбор поля блока для инспектора
        selectedElement.value = { blockIndex, field };
        
        editingElement.value = { blockIndex, field };
        
        // Обрабатываем особенности доставки
        if (field.startsWith('feature_')) {
          const featureIndex = parseInt(field.split('_')[1]);
          inlineEditValue.value = block.data?.features?.[featureIndex] || '';
        } else {
          inlineEditValue.value = block.data?.[field] || '';
        }
        
        // Фокусируемся на input после следующего рендера
        setTimeout(() => {
          const input = document.querySelector('.inline-edit-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
      }

      function saveInlineEdit() {
        if (!editingElement.value) return;
        
        const { blockIndex, field } = editingElement.value;
        const block = pageBlocks.value[blockIndex];
        
        if (block && block.data) {
          // Обрабатываем особенности доставки
          if (field.startsWith('feature_')) {
            const featureIndex = parseInt(field.split('_')[1]);
            if (!block.data.features) block.data.features = [];
            block.data.features[featureIndex] = inlineEditValue.value;
          } else {
            block.data[field] = inlineEditValue.value;
          }
          
          // Синхронизируем изменения
          if (editMode.value === 'visual') {
            syncBlocksToForm();
          }
        }
        
        editingElement.value = null;
        inlineEditValue.value = '';
      }

      function cancelInlineEdit() {
        editingElement.value = null;
        inlineEditValue.value = '';
      }

      function handleInlineEditKeydown(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (editingElement.value?.elementIndex !== undefined) {
            saveElementEdit();
          } else {
            saveInlineEdit();
          }
        } else if (event.key === 'Escape') {
          event.preventDefault();
          cancelInlineEdit();
        }
      }

      // Методы для работы с элементами в блоках
      function openElementPalette(blockIndex) {
        showElementPalette.value = true;
        hoveredBlock.value = blockIndex;
      }

      function closeElementPalette() {
        showElementPalette.value = false;
        hoveredBlock.value = -1;
        selectedElementType.value = '';
      }

      function addElementToBlock(blockIndex, elementType) {
        const block = pageBlocks.value[blockIndex];
        if (!block || !block.data) return;

        const elementData = getDefaultElementData(elementType);
        
        // Добавляем элемент в блок
        if (!block.data.elements) {
          block.data.elements = [];
        }
        
        block.data.elements.push({
          id: generateElementId(),
          type: elementType,
          data: elementData
        });

        // Синхронизируем изменения
        if (editMode.value === 'visual') {
          syncBlocksToForm();
        }

        closeElementPalette();
      }

      function getDefaultElementData(elementType) {
        const defaults = {
          heading: { 
            text: 'Новый заголовок', 
            level: 'h2', 
            color: '#1f2937',
            fontSize: 'text-2xl',
            align: 'left',
            marginTop: '0px',
            marginBottom: '16px'
          },
          subheading: { 
            text: 'Новый подзаголовок', 
            color: '#6b7280',
            fontSize: 'text-lg',
            align: 'left',
            marginTop: '0px',
            marginBottom: '12px'
          },
          paragraph: { 
            text: 'Новый текст параграфа', 
            color: '#6b7280',
            fontSize: 'text-base',
            align: 'left',
            marginTop: '0px',
            marginBottom: '16px'
          },
          button: { 
            text: 'Новая кнопка', 
            style: 'primary', 
            action: 'scroll',
            color: '#ffffff',
            fontSize: 'text-base',
            align: 'left',
            marginTop: '0px',
            marginBottom: '0px'
          },
          image: { 
            src: '', 
            alt: 'Новое изображение', 
            width: '100%',
            height: 'auto',
            align: 'left',
            marginTop: '0px',
            marginBottom: '16px'
          },
          feature: { 
            text: 'Новая особенность', 
            icon: 'fa-solid fa-check',
            color: '#1f2937',
            fontSize: 'text-base',
            align: 'left',
            marginTop: '0px',
            marginBottom: '8px'
          },
          spacer: { 
            height: '20px',
            marginTop: '0px',
            marginBottom: '0px'
          }
        };
        return defaults[elementType] || {};
      }

      function generateElementId() {
        return 'element_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }

      function removeElementFromBlock(blockIndex, elementIndex) {
        const block = pageBlocks.value[blockIndex];
        if (!block || !block.data || !block.data.elements) return;

        block.data.elements.splice(elementIndex, 1);

        // Синхронизируем изменения
        if (editMode.value === 'visual') {
          syncBlocksToForm();
        }
      }

      function moveElementUp(blockIndex, elementIndex) {
        const block = pageBlocks.value[blockIndex];
        if (!block || !block.data || !block.data.elements || elementIndex <= 0) return;

        const elements = block.data.elements;
        [elements[elementIndex], elements[elementIndex - 1]] = [elements[elementIndex - 1], elements[elementIndex]];

        // Синхронизируем изменения
        if (editMode.value === 'visual') {
          syncBlocksToForm();
        }
      }

      function moveElementDown(blockIndex, elementIndex) {
        const block = pageBlocks.value[blockIndex];
        if (!block || !block.data || !block.data.elements || elementIndex >= block.data.elements.length - 1) return;

        const elements = block.data.elements;
        [elements[elementIndex], elements[elementIndex + 1]] = [elements[elementIndex + 1], elements[elementIndex]];

        // Синхронизируем изменения
        if (editMode.value === 'visual') {
          syncBlocksToForm();
        }
      }

      function startElementEdit(blockIndex, elementIndex, field, event) {
        event.preventDefault();
        event.stopPropagation();
        
        const block = pageBlocks.value[blockIndex];
        if (!block || !block.data || !block.data.elements) return;
        
        const element = block.data.elements[elementIndex];
        if (!element) return;
        
        selectedElement.value = { blockIndex, elementIndex };
        editingElement.value = { blockIndex, elementIndex, field };
        inlineEditValue.value = element.data?.[field] || '';
        
        // Фокусируемся на input после следующего рендера
        setTimeout(() => {
          const input = document.querySelector('.inline-edit-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
      }

      function saveElementEdit() {
        if (!editingElement.value || editingElement.value.elementIndex === undefined) return;
        
        const { blockIndex, elementIndex, field } = editingElement.value;
        const block = pageBlocks.value[blockIndex];
        
        if (block && block.data && block.data.elements && block.data.elements[elementIndex]) {
          if (!block.data.elements[elementIndex].data) {
            block.data.elements[elementIndex].data = {};
          }
          block.data.elements[elementIndex].data[field] = inlineEditValue.value;
          
          // Синхронизируем изменения
          if (editMode.value === 'visual') {
            syncBlocksToForm();
          }
        }
        
        editingElement.value = null;
        inlineEditValue.value = '';
      }

      async function fetchSettings() {
        try {
          const res = await axios.get('/api/admin/site-settings');
          const data = res.data || {};
          
          // Инициализируем дефолтную структуру
          const defaultBlocks = {
          hero: {
            heading: "БЫСТРО И ВКУСНО",
            subheading: "Попробуйте наши особые суши",
            description: "Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.",
            buttonText: "Заказать сейчас",
            backgroundImage: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d",
            elements: [
              {
                id: 'hero-heading-1',
                type: 'heading',
                data: {
                  text: 'БЫСТРО И ВКУСНО',
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
                  text: 'Попробуйте наши особые суши',
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
                  text: 'Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.',
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
                  text: 'Заказать сейчас',
                  style: 'primary',
                  action: 'scroll',
                  color: '#ffffff',
                  fontSize: 'text-base',
                  align: 'left',
                  marginTop: '0px',
                  marginBottom: '0px'
                }
              }
            ]
          },
            categories: {
              heading: "Категории и блюда",
              subheading: "которые вы нигде не найдете",
              description: "Уникальные рецепты от наших шеф-поваров"
            },
            menu: {
              heading: "Популярные блюда",
              subheading: "Попробуйте наши хиты",
              description: "Самые любимые блюда наших клиентов"
            },
            delivery: {
              heading: "Быстрая доставка",
              subheading: "Доставляем за 30 минут",
              description: "Свежие суши и пицца прямо к вашей двери",
              features: [
                "Бесплатная доставка от 1500₽",
                "Доставка за 30 минут",
                "Свежие ингредиенты",
                "Горячие блюда"
              ]
            },
            reviews: {
              heading: "Отзывы наших клиентов",
              subheading: "Что говорят о нас",
              description: "Более 1000 довольных клиентов"
            },
            map: {
              heading: "Мы рядом",
              subheading: "Загляните к нам",
              description: "Мы находимся в самом центре города",
              address: "Москва, ул. Примерная, 10",
              iframe: ''
            }
          };
          
          form.value = {
            site_title: data.site_title || 'Точка суши и пиццы',
            logo: data.logo || '',
            favicon: data.favicon || '',
            home_blocks: { ...defaultBlocks, ...(data.home_blocks || {}) }
          };

          // Обновляем превью
          if (form.value.logo) logoPreview.value = form.value.logo;
          if (form.value.favicon) faviconPreview.value = form.value.favicon;
          
          // Синхронизируем данные с конструктором блоков
          syncFormToBlocks();
        } catch (e) {
          console.error('Ошибка загрузки настроек:', e);
          error.value = 'Ошибка загрузки настроек';
        }
      }

      async function saveSettings() {
        loading.value = true;
        error.value = '';
        saved.value = false;

        try {
          // Синхронизируем данные из конструктора в форму перед сохранением
          if (editMode.value === 'visual') {
            syncBlocksToForm();
          }
          
          const res = await axios.put('/api/admin/site-settings', form.value);
          form.value = res.data || form.value;
          saved.value = true;
          setTimeout(() => { saved.value = false; }, 3000);
        } catch (e) {
          console.error('Ошибка сохранения:', e);
          error.value = e.response?.data?.error || 'Ошибка сохранения настроек';
        } finally {
          loading.value = false;
        }
      }

      function onLogoFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            form.value.logo = e.target.result;
            logoPreview.value = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }

      function onFaviconFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            form.value.favicon = e.target.result;
            faviconPreview.value = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }

      // Watchers для синхронизации данных между конструктором и формой
      watch(() => pageBlocks.value, () => {
        if (editMode.value === 'visual') {
          syncBlocksToForm();
        }

        const blocksSnapshot = pageBlocks.value;
        if (selectedBlockIndex.value >= blocksSnapshot.length) {
          selectedBlockIndex.value = blocksSnapshot.length ? blocksSnapshot.length - 1 : -1;
        }

        if (selectedElement.value) {
          const { blockIndex, elementIndex, field } = selectedElement.value;
          const targetBlock = blocksSnapshot[blockIndex];

          if (!targetBlock) {
            selectedElement.value = null;
            return;
          }

          if (elementIndex !== undefined && elementIndex !== null) {
            const elements = targetBlock.data?.elements;
            if (!Array.isArray(elements) || elementIndex < 0 || elementIndex >= elements.length) {
              selectedElement.value = null;
            }
          } else if (field && !targetBlock.data) {
            selectedElement.value = null;
          }
        }
      }, { deep: true });

      watch(() => form.value.home_blocks, () => {
        if (editMode.value === 'text') {
          syncFormToBlocks();
        }
      }, { deep: true });

      onMounted(async () => {
        await fetchSettings();
        // Инициализируем pageBlocks по умолчанию если нет данных
        if (pageBlocks.value.length === 0) {
          pageBlocks.value = [
            {
              id: generateBlockId(),
              type: 'hero',
              name: 'Hero блок',
              icon: 'fa-solid fa-star',
              data: {
                heading: 'Добро пожаловать в Точку суши и пиццы',
                subheading: 'Лучшие суши и пицца в городе',
                description: 'Свежие ингредиенты, быстрая доставка, отличный вкус',
                buttonText: 'Заказать сейчас',
                backgroundImage: '',
                previewImage: '',
                imageSide: 'right',
                showRightImage: true,
                waveEnabled: true,
                waveColor: '#ff6b35',
                buttonStyle: 'primary',
                buttonAction: 'scroll',
                elements: [
                  {
                    id: 'hero-heading-1',
                    type: 'heading',
                    data: {
                      text: 'Добро пожаловать в Точку суши и пиццы',
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
                      text: 'Лучшие суши и пицца в городе',
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
                      text: 'Свежие ингредиенты, быстрая доставка, отличный вкус',
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
                      text: 'Заказать сейчас',
                      style: 'primary',
                      action: 'scroll',
                      color: '#ffffff',
                      fontSize: 'text-base',
                      align: 'left',
                      marginTop: '0px',
                      marginBottom: '0px'
                    }
                  }
                ]
              }
            }
          ];
        }
      });

      function selectElement(blockIndex, elementIndex) {
        selectedElement.value = { blockIndex, elementIndex };
        selectedBlockIndex.value = blockIndex;
        const block = pageBlocks.value[blockIndex];
        if (block) {
          selectedBlockType.value = block.type;
          activeBlock.value = block.type;
        }
      }

      function selectBlockField(blockIndex, field) {
        selectedBlockIndex.value = blockIndex;
        selectedElement.value = { blockIndex, field };
        const block = pageBlocks.value[blockIndex];
        if (block) {
          selectedBlockType.value = block.type;
          activeBlock.value = block.type;
        }
      }

      // Drag & Drop для элементов внутри блоков
      function onElementDragStart(event, blockIndex, elementIndex) {
        event.stopPropagation(); // Останавливаем всплытие к блоку
        event.dataTransfer.setData('text/plain', JSON.stringify({ blockIndex, elementIndex, type: 'element' }));
        event.dataTransfer.effectAllowed = 'move';
        event.target.style.opacity = '0.5';
        console.log('Element drag start:', blockIndex, elementIndex);
      }

      function onElementDragEnd(event) {
        event.stopPropagation(); // Останавливаем всплытие к блоку
        event.target.style.opacity = '1';
      }

      function onElementDragOver(event) {
        event.stopPropagation(); // Останавливаем всплытие к блоку
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        console.log('Element drag over');
      }

      function onElementDrop(event, targetBlockIndex, targetElementIndex) {
        event.stopPropagation();
        event.preventDefault();

        try {
          const dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

          if (!dragData || dragData.type !== 'element') {
            return;
          }

          const sourceBlockIndex = dragData.blockIndex;
          const sourceElementIndex = dragData.elementIndex;

          const blocksSnapshot = pageBlocks.value;
          const sourceBlock = blocksSnapshot[sourceBlockIndex];
          const targetBlock = blocksSnapshot[targetBlockIndex];

          if (!sourceBlock || !targetBlock) {
            return;
          }

          if (!Array.isArray(sourceBlock.data?.elements)) {
            sourceBlock.data.elements = [];
          }
          if (!Array.isArray(targetBlock.data?.elements)) {
            targetBlock.data.elements = [];
          }

          if (sourceElementIndex < 0 || sourceElementIndex >= sourceBlock.data.elements.length) {
            return;
          }

          const [movedElement] = sourceBlock.data.elements.splice(sourceElementIndex, 1);
          if (!movedElement) {
            return;
          }

          let insertIndex = typeof targetElementIndex === 'number' ? targetElementIndex : targetBlock.data.elements.length;

          if (targetBlockIndex === sourceBlockIndex && sourceElementIndex < insertIndex) {
            insertIndex -= 1;
          }

          insertIndex = Math.max(0, Math.min(insertIndex, targetBlock.data.elements.length));
          targetBlock.data.elements.splice(insertIndex, 0, movedElement);

          syncBlocksToForm();

          selectedBlockIndex.value = targetBlockIndex;
          selectedBlockType.value = targetBlock.type;
          activeBlock.value = targetBlock.type;
          selectedElement.value = { blockIndex: targetBlockIndex, elementIndex: insertIndex };
        } catch (error) {
          console.error('Error during element drag & drop:', error);
        }
      }

      return {
        form,
        activeBlock,
        loading,
        error,
        saved,
        logoPreview,
        faviconPreview,
        blocks,
        deliveryFeaturesText,
        // Конструктор блоков
        editMode,
        pageBlocks,
        selectedBlockIndex,
        availableBlocks,
        // Визуальный конструктор
        showPreview,
        zoomLevel,
        deviceView,
        canvasMode,
        canvasStyle,
        selectedBlockType,
        editingElement,
        inlineEditValue,
        showElementPalette,
        selectedElementType,
        draggedElement,
        hoveredBlock,
        elementTypes,
        selectedElement,
        inspectorBlockType,
        getInspectorSections,
        resolveBlockFieldModel,
        shouldShowField,
        // Hero computed
        heroHeading,
        heroSubheading,
        heroDescription,
        heroButtonText,
        heroBackgroundImage,
        // Categories computed
        categoriesHeading,
        categoriesSubheading,
        categoriesDescription,
        // Menu computed
        menuHeading,
        menuSubheading,
        menuDescription,
        // Delivery computed
        deliveryHeading,
        deliverySubheading,
        deliveryDescription,
        // Reviews computed
        reviewsHeading,
        reviewsSubheading,
        reviewsDescription,
        // Methods
        fetchSettings,
        saveSettings,
        onLogoFileSelected,
        onFaviconFileSelected,
        // Конструктор методы
        addBlock,
        removeBlock,
        selectBlock,
        moveBlockUp,
        moveBlockDown,
        onDragStart,
        onDrop,
        syncBlocksToForm,
        syncFormToBlocks,
        getBlockData,
        setBlockData,
        // Визуальный конструктор методы
        hasBlock,
        togglePreview,
        zoomIn,
        zoomOut,
        getDeviceWidth,
        selectBlockByType,
        // Drag & Drop методы
        onBlockDragStart,
        onBlockDragEnd,
        onDropBetween,
        onPaletteDragStart,
        onPaletteDragEnd,
        onDropZone,
        // Inline редактирование
        startInlineEdit,
        saveInlineEdit,
        cancelInlineEdit,
        handleInlineEditKeydown,
        // Методы для работы с элементами
        openElementPalette,
        closeElementPalette,
        addElementToBlock,
        removeElementFromBlock,
        moveElementUp,
        moveElementDown,
        startElementEdit,
        saveElementEdit,
        // Hero controls
        onHeroBgFile,
        onHeroPreviewFile,
        toggleHeroImageSide,
        toggleHeroShowImage,
        toggleHeroWave,
        setHeroWaveColor,
        setHeroButtonStyle,
        setHeroButtonAction,
        selectElement,
        selectBlockField,
        onElementDragStart,
        onElementDragEnd,
        onElementDragOver,
        onElementDrop
      };
    }
  };
})();