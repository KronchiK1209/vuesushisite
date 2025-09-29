// Админ-модуль: Настройки сайта и визуальный конструктор главной страницы
(function(){
  const { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } = Vue;

  const builder = window.SiteBuilder;
  if (!builder) {
    console.error('SiteBuilder core module is not loaded. AdminSiteSettingsView не может инициализироваться.');
    return;
  }
  const { elementRegistry, blockRegistry, deepClone, generateId, normalizeElement, createBlockInstance } = builder;

  const styleHelpers = builder.styles || window.SiteBuilderStyles;
  if (!styleHelpers) {
    console.error('SiteBuilder style helpers module is not loaded. AdminSiteSettingsView не может инициализироваться.');
    return;
  }

  const {
    heroImageProps,
    sectionBackgroundStyle,
    sectionOverlayStyle,
    blockButtonWrapperStyle,
    blockButtonClass,
    blockButtonStyle,
    categoriesSectionStyle,
    categoriesOverlayStyle,
    categoriesHeaderStyle,
    categoriesHeadingStyle,
    categoriesSubheadingStyle,
    categoriesDescriptionStyle,
    categoriesGridStyle,
    categoriesCardStyle,
    categoriesIconWrapperStyle,
    categoriesCardTitleStyle,
    categoriesCardDescriptionStyle,
    menuSectionStyle,
    menuOverlayStyle,
    menuHeaderStyle,
    menuHeadingStyle,
    menuDescriptionStyle,
    menuFilterSurfaceStyle,
    menuTabsWrapperStyle,
    menuActiveTabStyle,
    menuTabStyle,
    menuGridStyle,
    menuCardStyle,
    menuCardImageStyle,
    menuCardTitleStyle,
    menuCardDescriptionStyle,
    menuPriceStyle,
    menuTagStyle,
    deliverySectionStyle,
    deliveryOverlayStyle,
    deliveryTextColumnStyle,
    deliveryHeadingStyle,
    deliveryDescriptionStyle,
    deliveryFeatureIconStyle,
    deliveryFeatureTextStyle,
    deliveryContactsStyle,
    deliveryTrackingCardStyle,
    deliveryTrackingBarStyle,
    deliveryTrackingTitleStyle,
    deliveryTrackingDescriptionStyle,
    deliveryTrackingProgressStyle,
    reviewsSectionStyle,
    reviewsOverlayStyle,
    reviewsHeaderStyle,
    reviewsHeadingStyle,
    reviewsDescriptionStyle,
    reviewsGridStyle,
    reviewsCardStyle,
    reviewsAvatarStyle,
    reviewsCardTitleStyle,
    reviewsCardSubtitleStyle,
    reviewsRatingStyle,
    reviewsQuoteStyle,
    mapSectionStyle,
    mapOverlayStyle,
    mapFrameStyle,
    mapIframeStyle,
    mapInfoCardStyle,
    mapHeadingStyle,
    mapDescriptionStyle,
    mapContactRowStyle,
    mapContactIconStyle,
    heroWrapperStyle,
    heroBackgroundStyle,
    heroOverlayStyle,
    heroContainerClasses,
    heroContainerStyle,
    heroContentColumnClasses,
    heroContentStyle,
    heroMediaWrapperClasses,
    heroFeatureIconWrapperStyle,
    asCssSize,
    parseCssNumber,
    clampNumber
  } = styleHelpers;

window.AdminSiteSettingsView = {
    name: 'AdminSiteSettingsView',
    template: /* html */`
      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-[1400px] mx-auto px-4 space-y-8">
          <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                </span>
                <span>Конструктор главной страницы</span>
              </h1>
              <p class="text-gray-600 mt-2 max-w-3xl">
                Управляйте секциями как в Wix: добавляйте блоки, настраивайте элементы и сохраняйте изменения одним кликом.
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <span v-if="saved" class="inline-flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <i class="fa-solid fa-circle-check mr-2"></i>
                Сохранено
              </span>
              <span v-if="error" class="inline-flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <i class="fa-solid fa-circle-exclamation mr-2"></i>
                {{ error }}
              </span>
              <button
                @click="saveSettings"
                :disabled="loading"
                class="inline-flex items-center px-5 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 to-red-500 shadow hover:from-orange-600 hover:to-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <i v-if="loading" class="fa-solid fa-circle-notch animate-spin mr-2"></i>
                <i v-else class="fa-solid fa-floppy-disk mr-2"></i>
                {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </div>
          </header>

          <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
            <aside class="space-y-6">
              <section class="bg-white rounded-2xl shadow p-6 space-y-5">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <i class="fa-solid fa-gear text-orange-500"></i>
                  <span>Основные настройки</span>
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Название сайта</label>
                    <input
                      v-model="form.site_title"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Точка суши и пиццы"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Логотип</label>
                      <div class="space-y-2">
                        <div class="w-24 h-24 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                          <img v-if="form.logo" :src="form.logo" alt="Логотип" class="object-contain max-h-24" />
                          <i v-else class="fa-solid fa-image text-gray-300 text-2xl"></i>
                        </div>
                        <input type="file" accept="image/*" @change="onFileSelected($event, 'logo')" class="block w-full text-xs text-gray-500" />
                        <input
                          v-model="form.logo"
                          type="text"
                          class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                      <div class="space-y-2">
                        <div class="w-16 h-16 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                          <img v-if="form.favicon" :src="form.favicon" alt="Favicon" class="object-cover w-full h-full" />
                          <i v-else class="fa-solid fa-star text-gray-300"></i>
                        </div>
                        <input type="file" accept="image/*" @change="onFileSelected($event, 'favicon')" class="block w-full text-xs text-gray-500" />
                        <input
                          v-model="form.favicon"
                          type="text"
                          class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Цвет фона сайта</label>
                    <div class="flex items-center space-x-3">
                      <input
                        v-model="form.background_color"
                        type="color"
                        class="w-12 h-12 rounded-lg border border-gray-200"
                      />
                      <input
                        v-model="form.background_color"
                        type="text"
                        class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="#f9f4e5"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-white rounded-2xl shadow p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <i class="fa-solid fa-layer-group text-orange-500"></i>
                    <span>Палитра блоков</span>
                  </h2>
                  <span class="text-xs text-gray-400">Перетащите или кликните, чтобы добавить</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="block in palette"
                    :key="block.type"
                    @click="addBlock(block.type)"
                    draggable="true"
                    @dragstart="onPaletteDragStart($event, block.type)"
                    class="p-3 border border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition group text-left"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 text-orange-600">
                          <i :class="block.icon"></i>
                        </span>
                        <div>
                          <div class="font-semibold text-sm text-gray-900">{{ block.name }}</div>
                          <div class="text-xs text-gray-500">{{ block.description }}</div>
                        </div>
                      </div>
                      <i class="fa-solid fa-plus text-gray-400 group-hover:text-orange-500"></i>
                    </div>
                  </button>
                </div>
              </section>

              <section class="bg-white rounded-2xl shadow p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <i class="fa-solid fa-timeline text-orange-500"></i>
                    <span>Структура страницы</span>
                  </h2>
                  <button class="text-xs text-orange-600 hover:text-orange-700" @click="resetToDefault">
                    <i class="fa-solid fa-rotate"></i>
                    Сбросить
                  </button>
                </div>

                <div v-if="!pageBlocks.length" class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                  Добавьте первый блок из палитры
                </div>

                <ul v-else class="space-y-2">
                  <li
                    v-for="(block, index) in pageBlocks"
                    :key="block.id"
                    class="group border border-gray-200 rounded-xl p-3 transition bg-white shadow-sm hover:border-orange-400"
                    :class="{ 'ring-2 ring-orange-500': block.id === selectedBlockId }"
                    draggable="true"
                    @dragstart="onBlockDragStart($event, block.id)"
                    @dragend="onBlockDragEnd"
                  >
                    <div class="flex items-start justify-between">
                      <button class="flex-1 text-left" @click="selectBlock(block.id)">
                        <div class="flex items-center space-x-2">
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600">
                            <i :class="block.icon"></i>
                          </span>
                          <div>
                            <div class="font-semibold text-gray-900 text-sm">{{ block.name }}</div>
                            <div class="text-xs text-gray-500">{{ block.type }}</div>
                          </div>
                        </div>
                      </button>
                      <div class="flex items-center space-x-2 text-gray-400">
                        <button @click="moveBlock(index, -1)" :disabled="index === 0" class="p-1 hover:text-gray-600 disabled:opacity-30"><i class="fa-solid fa-arrow-up"></i></button>
                        <button @click="moveBlock(index, 1)" :disabled="index === pageBlocks.length - 1" class="p-1 hover:text-gray-600 disabled:opacity-30"><i class="fa-solid fa-arrow-down"></i></button>
                        <button @click="duplicateBlock(block.id)" class="p-1 hover:text-gray-600"><i class="fa-solid fa-clone"></i></button>
                        <button @click="toggleBlockHidden(block.id)" :class="['p-1', block.meta.hidden ? 'text-amber-500' : 'hover:text-gray-600']"><i :class="block.meta.hidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i></button>
                        <button @click="removeBlock(block.id)" class="p-1 text-red-400 hover:text-red-600"><i class="fa-solid fa-trash"></i></button>
                        <span class="cursor-grab p-1 text-gray-300 group-hover:text-gray-500"><i class="fa-solid fa-grip-vertical"></i></span>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            </aside>

            <main class="bg-white rounded-2xl shadow p-6 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-semibold text-gray-700">Холст</span>
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        v-for="device in devices"
                        :key="device.value"
                        @click="setDevice(device.value)"
                        :class="[
                          'px-3 py-2 text-sm flex items-center space-x-1 transition',
                          canvas.device === device.value ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                        ]"
                      >
                        <i :class="device.icon"></i>
                        <span>{{ device.label }}</span>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-semibold text-gray-700">Режим</span>
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        @click="setCanvasMode('preview')"
                        :class="[
                          'px-3 py-2 text-sm transition',
                          canvas.mode === 'preview' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                        ]"
                      >
                        Превью
                      </button>
                      <button
                        @click="setCanvasMode('full')"
                        :class="[
                          'px-3 py-2 text-sm transition',
                          canvas.mode === 'full' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                        ]"
                      >
                        Полная страница
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Масштаб</span>
                    <button
                      @click="changeZoom(-0.1)"
                      :disabled="canvas.mode === 'full'"
                      class="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    ><i class="fa-solid fa-minus"></i></button>
                    <span class="w-14 text-center font-semibold">{{ Math.round(canvas.zoom * 100) }}%</span>
                    <button
                      @click="changeZoom(0.1)"
                      :disabled="canvas.mode === 'full'"
                      class="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    ><i class="fa-solid fa-plus"></i></button>
                  </div>
                  <label class="inline-flex items-center space-x-2 text-sm text-gray-600">
                    <input type="checkbox" v-model="canvas.showGrid" class="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                    <span>Сетка</span>
                  </label>
                  <label class="inline-flex items-center space-x-2 text-sm text-gray-600">
                    <input type="checkbox" v-model="canvas.showOverlays" class="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                    <span>Границы блоков</span>
                  </label>
                </div>
              </div>

              <div
                ref="canvasViewportRef"
                class="relative border border-gray-200 rounded-2xl bg-gray-50"
                :class="canvas.mode === 'full' ? 'overflow-auto max-h-[calc(100vh-320px)]' : 'overflow-hidden'"
                @scroll="onCanvasScroll"
              >
                <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[length:16px_16px]" v-if="canvas.showGrid"></div>
                <div
                  v-if="canvas.showOverlays && selectionOverlay.visible"
                  class="absolute z-20 pointer-events-none"
                  :style="selectionOverlayStyle"
                >
                  <div class="absolute inset-0 border-2 border-orange-400 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"></div>
                  <div
                    class="absolute left-0 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow"
                    :class="selectionOverlay.badgeBelow ? 'top-full mt-2' : '-top-8'"
                  >
                    {{ selectionOverlay.label }}
                    <span class="uppercase tracking-wider text-white/70 ml-2">{{ selectionOverlay.type === 'element' ? 'Элемент' : 'Блок' }}</span>
                  </div>
                </div>
                <div
                  class="relative origin-top transition-all duration-300 ease-out"
                  ref="canvasInnerRef"
                  :style="canvasStyle"
                  @click="handleCanvasClick"
                >
                  <div class="bg-white min-h-[640px]" :style="{ backgroundColor: form.background_color || '#ffffff' }">
                    <div
                      v-if="!pageBlocks.length"
                      class="flex items-center justify-center h-[480px] text-gray-400 text-sm border-2 border-dashed border-gray-300 m-8 rounded-2xl"
                    >
                      Добавьте блоки, чтобы начать конструирование
                    </div>

                    <template v-else>
                      <div
                        v-for="(block, index) in pageBlocks"
                        :key="block.id"
                        class="relative"
                        @dragover.prevent="onDropZoneDragOver(index)"
                        @drop.prevent="onDropZoneDrop(index, $event)"
                      >
                        <div
                          class="absolute inset-x-0 -top-3 flex justify-center opacity-0 pointer-events-none transition"
                          :class="{ 'opacity-100 pointer-events-auto': dropIndex === index }"
                        >
                          <div class="px-3 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full shadow">Поставить сюда</div>
                        </div>

                        <section
                          @click="handleBlockClick(block.id, $event)"
                          :class="[
                            blockWrapperClasses(block),
                            block.meta.hidden ? 'opacity-60' : 'opacity-100'
                          ]"
                          :ref="el => registerBlockRef(block.id, el)"
                          :data-block-id="block.id"
                        >
                          <div
                            v-if="canvas.showOverlays"
                            class="absolute inset-0 border-2 border-dashed"
                            :class="block.id === selectedBlockId ? 'border-orange-500' : 'border-transparent'"
                          ></div>

                          <template v-if="block.type === 'hero'">
                            <div
                              class="relative overflow-hidden rounded-3xl text-white shadow-xl"
                              :style="heroWrapperStyle(block)"
                            >
                              <div class="absolute inset-0" :style="heroBackgroundStyle(block)"></div>
                              <div class="absolute inset-0" :style="heroOverlayStyle(block)"></div>
                              <div :class="heroContainerClasses(block)" :style="heroContainerStyle(block)">
                                <div
                                  :class="heroContentColumnClasses(block)"
                                  :style="heroContentStyle(block)"
                                >
                                  <div
                                    v-if="!block.data.elements || !block.data.elements.length"
                                    class="border border-dashed border-white/40 rounded-2xl px-4 py-6 text-sm text-white/70 text-center"
                                  >
                                    Добавьте элементы через инспектор или перетащите их сюда.
                                  </div>
                                  <template v-else>
                                    <div
                                      v-for="(element, elementIndex) in block.data.elements"
                                      :key="element.id"
                                      :class="block.data.layout === 'freeform' ? '' : 'space-y-2'"
                                    >
                                      <div
                                        v-if="block.data.layout !== 'freeform'"
                                        class="flex justify-center h-8 transition"
                                        @dragover.prevent="onHeroElementDragOver(block.id, elementIndex)"
                                        @dragenter.prevent="onHeroElementDragOver(block.id, elementIndex)"
                                        @dragleave="onHeroElementDragLeave(block.id, elementIndex)"
                                        @drop.prevent="onHeroElementDrop(block.id, elementIndex)"
                                        :class="heroDropWrapperClass(block.id, elementIndex)"
                                      >
                                        <div
                                          class="px-3 py-1 text-[11px] font-medium rounded-full border border-dashed backdrop-blur"
                                          :class="heroDropLabelClass(block.id, elementIndex)"
                                        >
                                          Переместить сюда
                                        </div>
                                      </div>
                                      <div
                                        :class="heroElementWrapperClasses(block, element)"
                                        :style="heroElementWrapperStyle(block, element)"
                                        :draggable="heroElementDraggable(block, element)"
                                        @dragstart="onHeroElementDragStart(block.id, element.id, $event)"
                                        @dragend="onHeroElementDragEnd"
                                        @pointerdown="onHeroElementPointerDown(block.id, element.id, $event)"
                                        @click="handleElementClick(block.id, element.id, $event)"
                                        :ref="el => registerElementRef(block.id, element.id, el)"
                                        :data-element-id="element.id"
                                        :data-block-id="block.id"
                                      >
                                        <div
                                          v-if="canvas.showOverlays"
                                          class="absolute inset-0 rounded-2xl border border-dashed border-white/30 pointer-events-none"
                                          :class="isElementSelected(element) && selectedBlockId === block.id ? 'border-orange-300' : ''"
                                        ></div>
                                        <div
                                          v-if="heroElementDraggable(block, element)"
                                          class="absolute -left-5 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col items-center space-y-1 text-white/70"
                                        >
                                          <span class="cursor-grab text-xs"><i class="fa-solid fa-grip-vertical"></i></span>
                                        </div>
                                        <div class="absolute top-2 right-2 text-[11px] uppercase tracking-wider text-white/80 bg-black/30 px-2 py-1 rounded-full">{{ elementRegistry[element.type]?.label || element.type }}</div>
                                        <component
                                          :is="renderHeroElement(element)"
                                          v-bind="heroElementProps(block, element)"
                                        >
                                          <template v-if="element.type === 'button'">
                                            <span>{{ element.data.text }}</span>
                                            <i class="fa-solid fa-arrow-right ml-2"></i>
                                          </template>
                                          <template v-else-if="element.type === 'image'">
                                            <img
                                              :src="heroImageProps(element).src"
                                              :alt="heroImageProps(element).alt"
                                              class="object-cover"
                                              :style="heroImageProps(element).style"
                                            />
                                          </template>
                                          <template v-else-if="element.type === 'feature'">
                                            <span
                                              class="inline-flex items-center justify-center h-12 w-12 text-lg"
                                              :style="heroFeatureIconWrapperStyle(element)"
                                            >
                                              <i :class="element.data.icon || 'fa-solid fa-check'"></i>
                                            </span>
                                            <span>{{ element.data.text }}</span>
                                          </template>
                                          <template v-else-if="element.type === 'spacer'"></template>
                                          <template v-else>{{ element.data.text }}</template>
                                        </component>
                                      </div>
                                    </div>
                                    <div
                                      v-if="block.data.layout !== 'freeform'"
                                      class="flex justify-center h-8 transition mt-2"
                                      @dragover.prevent="onHeroElementDragOver(block.id, block.data.elements.length)"
                                      @dragenter.prevent="onHeroElementDragOver(block.id, block.data.elements.length)"
                                      @dragleave="onHeroElementDragLeave(block.id, block.data.elements.length)"
                                      @drop.prevent="onHeroElementDrop(block.id, block.data.elements.length)"
                                      :class="heroDropWrapperClass(block.id, block.data.elements.length)"
                                    >
                                      <div
                                        class="px-3 py-1 text-[11px] font-medium rounded-full border border-dashed backdrop-blur"
                                        :class="heroDropLabelClass(block.id, block.data.elements.length)"
                                      >
                                        Конец блока
                                      </div>
                                    </div>
                                  </template>
                                </div>
                                <div v-if="block.data.showRightImage" :class="heroMediaWrapperClasses(block)">
                                  <div class="relative">
                                    <img :src="block.data.previewImage" alt="preview" class="w-80 h-80 object-cover rounded-3xl shadow-2xl" />
                                    <div class="absolute inset-0 rounded-3xl ring-4 ring-white/20"></div>
                                  </div>
                                </div>
                              </div>
                              <svg v-if="block.data.waveEnabled" class="w-full" height="80" viewBox="0 0 1440 80" preserveAspectRatio="none">
                                <path :fill="block.data.waveColor || '#f9f4e5'" d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32V80H0Z"></path>
                              </svg>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'categories'">
                            <div class="relative overflow-hidden" :style="categoriesSectionStyle(block)">
                              <div
                                v-if="categoriesOverlayStyle(block)"
                                class="absolute inset-0 pointer-events-none"
                                :style="categoriesOverlayStyle(block)"
                              ></div>
                              <div class="relative space-y-10">
                                <div :style="categoriesHeaderStyle(block)" class="space-y-3">
                                  <h2 class="font-bold" :style="categoriesHeadingStyle(block)">{{ block.data.heading }}</h2>
                                  <p class="font-semibold" :style="categoriesSubheadingStyle(block)">{{ block.data.subheading }}</p>
                                  <p :style="categoriesDescriptionStyle(block)">{{ block.data.description }}</p>
                                </div>
                                <div class="grid" :style="categoriesGridStyle(block)">
                                  <div v-for="n in 4" :key="n" :style="categoriesCardStyle(block)" class="transition">
                                    <div :style="categoriesIconWrapperStyle(block)" class="mb-4">
                                      <i class="fa-solid fa-bowl-food"></i>
                                    </div>
                                    <h3 class="font-semibold text-lg text-center" :style="categoriesCardTitleStyle(block)">
                                      Категория {{ n }}
                                    </h3>
                                    <p class="mt-2 text-sm text-center" :style="categoriesCardDescriptionStyle(block)">
                                      Управляется в разделе категорий
                                    </p>
                                  </div>
                                </div>
                                <div v-if="block.data.buttonVisible" :style="blockButtonWrapperStyle(block.data)">
                                  <button
                                    :class="blockButtonClass(block.data)"
                                    :style="blockButtonStyle(block.data, { background: '#f97316', textColor: '#ffffff', secondaryBackground: '#ffffff', secondaryText: '#111827', shadow: block.data.buttonShadow || '0 16px 40px rgba(15,23,42,0.18)' })"
                                  >
                                    <span>{{ block.data.buttonText || 'Все категории' }}</span>
                                    <i class="fa-solid fa-arrow-right-long" v-if="block.data.buttonStyle !== 'link'"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'menu'">
                            <div class="relative overflow-hidden" :style="menuSectionStyle(block)">
                              <div
                                v-if="menuOverlayStyle(block)"
                                class="absolute inset-0 pointer-events-none"
                                :style="menuOverlayStyle(block)"
                              ></div>
                              <div class="relative space-y-10">
                                <div :style="menuHeaderStyle(block)" class="space-y-3">
                                  <h2 class="font-bold" :style="menuHeadingStyle(block)">{{ block.data.heading }}</h2>
                                  <p :style="menuDescriptionStyle(block)">{{ block.data.description }}</p>
                                </div>
                                <div
                                  v-if="block.data.showSearch || block.data.showFilters || block.data.showCategoryTabs"
                                  class="space-y-4"
                                >
                                  <div v-if="block.data.showSearch" class="flex items-center" :style="menuFilterSurfaceStyle(block)">
                                    <i class="fa-solid fa-magnifying-glass opacity-70 mr-3"></i>
                                    <span class="text-sm opacity-80">Поиск будет доступен посетителям</span>
                                  </div>
                                  <div v-if="block.data.showCategoryTabs" class="flex flex-wrap gap-2" :style="menuTabsWrapperStyle(block)">
                                    <span class="px-4 py-2 rounded-full text-sm font-medium" :style="menuActiveTabStyle(block)">
                                      Суши
                                    </span>
                                    <span class="px-4 py-2 rounded-full text-sm" :style="menuTabStyle(block)">Роллы</span>
                                    <span class="px-4 py-2 rounded-full text-sm" :style="menuTabStyle(block)">Сеты</span>
                                  </div>
                                  <div v-if="block.data.showFilters" class="flex items-center gap-2" :style="menuFilterSurfaceStyle(block)">
                                    <i class="fa-solid fa-sliders opacity-70"></i>
                                    <span class="text-sm opacity-80">Фильтры включены</span>
                                  </div>
                                </div>
                                <div class="grid" :style="menuGridStyle(block)">
                                  <div
                                    v-for="n in Math.max(3, Number(block.data.cardsPerRow) || 3)"
                                    :key="n"
                                    :style="menuCardStyle(block)"
                                    class="transition"
                                  >
                                    <div :style="menuCardImageStyle(block)">
                                      <div class="w-full h-full flex items-center justify-center text-3xl text-orange-500">
                                        🍣
                                      </div>
                                    </div>
                                    <div class="mt-4 font-semibold" :style="menuCardTitleStyle(block)">
                                      Популярное блюдо {{ n }}
                                    </div>
                                    <p class="mt-2 text-sm" :style="menuCardDescriptionStyle(block)">
                                      Описание и цена берутся из каталога
                                    </p>
                                    <div class="mt-4 flex items-center justify-between text-sm">
                                      <span :style="menuPriceStyle(block)">450 ₽</span>
                                      <span
                                        v-if="block.data.highlightHits"
                                        class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                        :style="menuTagStyle(block)"
                                      >
                                        <i class="fa-solid fa-star"></i>
                                        <span>Хит</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="block.data.buttonVisible" :style="blockButtonWrapperStyle(block.data)">
                                  <button
                                    :class="blockButtonClass(block.data)"
                                    :style="blockButtonStyle(block.data, { background: '#f97316', textColor: '#ffffff', secondaryBackground: '#ffffff', secondaryText: '#111827', shadow: block.data.buttonShadow || '0 16px 40px rgba(249,115,22,0.35)' })"
                                  >
                                    <span>{{ block.data.buttonText || 'Открыть меню' }}</span>
                                    <i class="fa-solid fa-arrow-right-long" v-if="block.data.buttonStyle !== 'link'"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'delivery'">
                            <div class="relative overflow-hidden" :style="deliverySectionStyle(block)">
                              <div
                                v-if="deliveryOverlayStyle(block)"
                                class="absolute inset-0 pointer-events-none"
                                :style="deliveryOverlayStyle(block)"
                              ></div>
                              <div class="relative" :class="deliveryLayoutClass(block)">
                                <div class="space-y-4" :style="deliveryTextColumnStyle(block)">
                                  <h2 class="font-bold" :style="deliveryHeadingStyle(block)">{{ block.data.heading }}</h2>
                                  <p :style="deliveryDescriptionStyle(block)">{{ block.data.description }}</p>
                                  <ul class="space-y-3">
                                    <li v-for="feature in block.data.features" :key="feature" class="flex items-start gap-3">
                                      <span :style="deliveryFeatureIconStyle(block)"><i class="fa-solid fa-check"></i></span>
                                      <span :style="deliveryFeatureTextStyle(block)">{{ feature }}</span>
                                    </li>
                                  </ul>
                                  <div class="flex flex-wrap gap-4 text-sm pt-4" :style="deliveryContactsStyle(block)">
                                    <span class="inline-flex items-center gap-2"><i class="fa-solid fa-phone"></i><span>{{ block.data.contactPhone }}</span></span>
                                    <span class="inline-flex items-center gap-2"><i class="fa-solid fa-box"></i><span>Мин. заказ {{ block.data.minOrder }} ₽</span></span>
                                  </div>
                                  <div v-if="block.data.buttonVisible" :style="blockButtonWrapperStyle(block.data)">
                                    <button
                                      :class="blockButtonClass(block.data)"
                                      :style="blockButtonStyle(block.data, { background: '#111827', textColor: '#ffffff', secondaryBackground: '#ffffff', secondaryText: '#111827', shadow: block.data.buttonShadow || '0 16px 36px rgba(15,23,42,0.18)' })"
                                    >
                                      <span>{{ block.data.buttonText || 'Условия доставки' }}</span>
                                      <i class="fa-solid fa-arrow-right-long" v-if="block.data.buttonStyle !== 'link'"></i>
                                    </button>
                                  </div>
                                </div>
                                <div v-if="block.data.showTrackingCard" :style="deliveryTrackingCardStyle(block)">
                                  <div :style="deliveryTrackingBarStyle(block)"></div>
                                  <div class="p-6 space-y-4">
                                    <h3 class="font-semibold" :style="deliveryTrackingTitleStyle(block)">{{ block.data.trackingTitle }}</h3>
                                    <div class="space-y-2">
                                      <div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div class="h-full" :style="deliveryTrackingProgressStyle(block)"></div>
                                      </div>
                                      <p class="text-xs" :style="deliveryTrackingDescriptionStyle(block)">{{ block.data.trackingDescription }}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'reviews'">
                            <div class="relative overflow-hidden" :style="reviewsSectionStyle(block)">
                              <div
                                v-if="reviewsOverlayStyle(block)"
                                class="absolute inset-0 pointer-events-none"
                                :style="reviewsOverlayStyle(block)"
                              ></div>
                              <div class="relative space-y-10">
                                <div :style="reviewsHeaderStyle(block)" class="space-y-3">
                                  <h2 class="font-bold" :style="reviewsHeadingStyle(block)">{{ block.data.heading }}</h2>
                                  <p :style="reviewsDescriptionStyle(block)">{{ block.data.description }}</p>
                                </div>
                                <div class="grid" :style="reviewsGridStyle(block)">
                                  <div v-for="n in 3" :key="n" :style="reviewsCardStyle(block)">
                                    <div class="flex items-center gap-3">
                                      <div :style="reviewsAvatarStyle(block)">К{{ n }}</div>
                                      <div>
                                        <div class="font-semibold" :style="reviewsCardTitleStyle(block)">Клиент {{ n }}</div>
                                        <div class="text-xs" :style="reviewsCardSubtitleStyle(block)">Постоянный клиент</div>
                                      </div>
                                    </div>
                                    <div class="flex space-x-1 text-sm mt-3" :style="reviewsRatingStyle(block)">
                                      <i v-for="star in 5" :key="star" class="fa-solid fa-star"></i>
                                    </div>
                                    <p class="mt-3 text-sm" :style="reviewsQuoteStyle(block)">
                                      «Каждый заказ приезжает горячим. Любим за сервис и бонусы»
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'map'">
                            <div class="relative overflow-hidden" :style="mapSectionStyle(block)">
                              <div
                                v-if="mapOverlayStyle(block)"
                                class="absolute inset-0 pointer-events-none"
                                :style="mapOverlayStyle(block)"
                              ></div>
                              <div class="relative grid lg:grid-cols-3 gap-8">
                                <div class="lg:col-span-2">
                                  <div :style="mapFrameStyle(block)">
                                    <iframe
                                      :src="block.data.iframeSrc"
                                      allowfullscreen
                                      loading="lazy"
                                      :style="mapIframeStyle(block)"
                                    ></iframe>
                                  </div>
                                </div>
                                <div class="space-y-4" :style="mapInfoCardStyle(block)">
                                  <h2 class="font-bold" :style="mapHeadingStyle(block)">{{ block.data.heading }}</h2>
                                  <p :style="mapDescriptionStyle(block)">{{ block.data.description }}</p>
                                  <div class="space-y-3 text-sm">
                                    <div class="flex items-center gap-2" :style="mapContactRowStyle(block)">
                                      <i class="fa-solid fa-location-dot" :style="mapContactIconStyle(block)"></i>
                                      <span>{{ block.data.address }}</span>
                                    </div>
                                    <div class="flex items-center gap-2" :style="mapContactRowStyle(block)">
                                      <i class="fa-solid fa-clock" :style="mapContactIconStyle(block)"></i>
                                      <span>{{ block.data.workHours }}</span>
                                    </div>
                                    <div class="flex items-center gap-2" :style="mapContactRowStyle(block)">
                                      <i class="fa-solid fa-phone" :style="mapContactIconStyle(block)"></i>
                                      <span>{{ block.data.phone }}</span>
                                    </div>
                                  </div>
                                  <div v-if="block.data.buttonVisible" :style="blockButtonWrapperStyle(block.data)">
                                    <button
                                      :class="blockButtonClass(block.data)"
                                      :style="blockButtonStyle(block.data, { background: '#f97316', textColor: '#ffffff', secondaryBackground: '#ffffff', secondaryText: '#111827', shadow: block.data.buttonShadow || '0 18px 40px rgba(249,115,22,0.35)' })"
                                    >
                                      <span>{{ block.data.buttonText || 'Позвонить нам' }}</span>
                                      <i class="fa-solid fa-phone"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </section>
                      </div>

                      <div
                        class="h-12 flex items-center justify-center text-xs text-gray-400"
                        @dragover.prevent="onDropZoneDragOver(pageBlocks.length)"
                        @drop.prevent="onDropZoneDrop(pageBlocks.length, $event)"
                      >
                        <div
                          class="px-3 py-1 rounded-full border border-dashed border-gray-300"
                          :class="{ 'border-blue-400 text-blue-500 bg-blue-50': dropIndex === pageBlocks.length }"
                        >
                          Перетащите блок сюда
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </main>

            <aside class="bg-white rounded-2xl shadow p-6 space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <i class="fa-solid fa-sliders text-orange-500"></i>
                  <span>Инспектор</span>
                </h2>
                <span v-if="selectedBlock" class="text-xs text-gray-400 uppercase tracking-wide">{{ selectedBlock.type }}</span>
              </div>

              <div v-if="!selectedBlock" class="text-sm text-gray-500 space-y-3">
                <p>Выберите блок на холсте или в списке, чтобы настроить его параметры.</p>
                <p>В инспекторе доступны контент, стили, элементы и действия блока.</p>
              </div>

              <div v-else class="space-y-6">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-gray-900">{{ selectedBlock.name }}</div>
                    <div class="flex items-center space-x-2 text-gray-400">
                      <button @click="duplicateBlock(selectedBlock.id)" class="hover:text-gray-700"><i class="fa-solid fa-copy"></i></button>
                      <button @click="toggleBlockHidden(selectedBlock.id)" :class="selectedBlock.meta.hidden ? 'text-amber-500' : 'hover:text-gray-700'"><i :class="selectedBlock.meta.hidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i></button>
                      <button @click="removeBlock(selectedBlock.id)" class="text-red-400 hover:text-red-600"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500">ID блока: {{ selectedBlock.id }}</p>
                </div>

                <div v-for="section in inspectorSections" :key="section.label" class="space-y-3">
                  <h3 class="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <i class="fa-solid fa-circle text-[8px] text-orange-400"></i>
                    <span>{{ section.label }}</span>
                  </h3>
                  <div class="space-y-3">
                    <div v-for="field in section.fields" :key="field.key" class="space-y-1">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ field.label }}</label>
                      <template v-if="field.type === 'text'">
                        <input
                          :value="getFieldValue(selectedBlock, field)"
                          @input="updateBlockField(field, $event.target.value)"
                          :placeholder="field.placeholder || ''"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </template>
                      <template v-else-if="field.type === 'textarea'">
                        <textarea
                          :value="getFieldValue(selectedBlock, field)"
                          @input="updateBlockField(field, $event.target.value)"
                          :rows="field.rows || 3"
                          :placeholder="field.placeholder || ''"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                      </template>
                      <template v-else-if="field.type === 'select'">
                        <select
                          :value="getFieldValue(selectedBlock, field)"
                          @change="updateBlockField(field, $event.target.value)"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
                        </select>
                      </template>
                      <template v-else-if="field.type === 'toggle'">
                        <label class="inline-flex items-center space-x-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            :checked="Boolean(getFieldValue(selectedBlock, field))"
                            @change="updateBlockField(field, $event.target.checked)"
                            class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span>{{ field.help || 'Включить' }}</span>
                        </label>
                      </template>
                      <template v-else-if="field.type === 'color'">
                        <div class="flex items-center space-x-3">
                          <input
                            type="color"
                            :value="getFieldValue(selectedBlock, field) || '#ffffff'"
                            @input="updateBlockField(field, $event.target.value)"
                            class="w-12 h-12 rounded-lg border border-gray-200"
                          />
                          <input
                            type="text"
                            :value="getFieldValue(selectedBlock, field)"
                            @input="updateBlockField(field, $event.target.value)"
                            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="#ffffff"
                          />
                        </div>
                      </template>
                      <template v-else-if="field.type === 'list'">
                        <textarea
                          :value="getFieldValue(selectedBlock, field)"
                          @input="updateBlockField(field, $event.target.value)"
                          :rows="field.rows || 4"
                          :placeholder="field.placeholder || 'Каждый пункт с новой строки'"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                      </template>
                      <template v-else-if="field.type === 'image'">
                        <div class="space-y-2">
                          <div class="h-36 rounded-xl border border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                            <img v-if="getFieldValue(selectedBlock, field)" :src="getFieldValue(selectedBlock, field)" class="object-cover w-full h-full" />
                            <i v-else class="fa-solid fa-image text-2xl text-gray-300"></i>
                          </div>
                          <input type="file" accept="image/*" @change="onBlockFileSelected(field, $event)" class="block w-full text-xs text-gray-500" />
                          <input
                            type="text"
                            :value="getFieldValue(selectedBlock, field)"
                            @input="updateBlockField(field, $event.target.value)"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="https://..."
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <div v-if="selectedBlockDefinition && selectedBlockDefinition.elements" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <i class="fa-solid fa-pen-ruler text-orange-400"></i>
                      <span>Элементы блока</span>
                    </h3>
                    <div class="relative">
                      <button @click="toggleElementPalette" class="text-xs text-orange-600 hover:text-orange-700">
                        <i class="fa-solid fa-plus mr-1"></i>
                        Добавить
                      </button>
                      <div v-if="elementPaletteOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                        <button
                          v-for="element in elementPalette"
                          :key="element.type"
                          @click="addElement(selectedBlock.id, element.type)"
                          class="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 flex items-center space-x-2"
                        >
                          <i :class="element.icon" class="text-orange-500"></i>
                          <span>{{ element.label }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="!selectedBlock.data.elements || !selectedBlock.data.elements.length" class="text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3">
                    Используйте «Добавить», чтобы создать заголовки, текст или кнопки внутри блока.
                  </div>

                  <ul v-else class="space-y-2">
                    <li
                      v-for="(element, index) in selectedBlock.data.elements"
                      :key="element.id"
                      class="border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between text-sm"
                      :class="{ 'border-orange-400 bg-orange-50': isElementSelected(element) }"
                    >
                      <button class="flex items-center space-x-2 flex-1 text-left" @click="selectElement(selectedBlock.id, element.id)">
                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600">
                          <i :class="elementRegistry[element.type]?.icon || 'fa-solid fa-cube'"></i>
                        </span>
                        <div>
                          <div class="font-semibold text-gray-900 capitalize">{{ element.type }}</div>
                          <div class="text-xs text-gray-500 truncate max-w-[160px]">{{ element.data?.text || element.data?.src || 'Без текста' }}</div>
                        </div>
                      </button>
                      <div class="flex items-center space-x-2 text-gray-400">
                        <button @click="moveElement(selectedBlock.id, index, -1)" :disabled="index === 0" class="p-1 hover:text-gray-600 disabled:opacity-30"><i class="fa-solid fa-arrow-up"></i></button>
                        <button @click="moveElement(selectedBlock.id, index, 1)" :disabled="index === selectedBlock.data.elements.length - 1" class="p-1 hover:text-gray-600 disabled:opacity-30"><i class="fa-solid fa-arrow-down"></i></button>
                        <button @click="removeElement(selectedBlock.id, index)" class="p-1 text-red-400 hover:text-red-600"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </li>
                  </ul>
                </div>

                <div v-if="currentElement" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <i class="fa-solid fa-sliders text-orange-400"></i>
                      <span>Настройки элемента</span>
                    </h3>
                    <span class="text-xs text-gray-400 uppercase tracking-wide">{{ currentElement.type }}</span>
                  </div>
                  <div class="space-y-3">
                    <div v-for="field in currentElementDefinition.fields" :key="field.key" class="space-y-1">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ field.label }}</label>
                      <template v-if="field.type === 'text'">
                        <input
                          :value="getElementFieldValue(currentElement, field)"
                          @input="updateElementField(field, $event.target.value)"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </template>
                      <template v-else-if="field.type === 'textarea'">
                        <textarea
                          :value="getElementFieldValue(currentElement, field)"
                          @input="updateElementField(field, $event.target.value)"
                          :rows="field.rows || 3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                      </template>
                      <template v-else-if="field.type === 'select'">
                        <select
                          :value="getElementFieldValue(currentElement, field)"
                          @change="updateElementField(field, $event.target.value)"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
                        </select>
                      </template>
                      <template v-else-if="field.type === 'color'">
                        <div class="flex items-center space-x-3">
                          <input
                            type="color"
                            :value="getElementFieldValue(currentElement, field) || '#ffffff'"
                            @input="updateElementField(field, $event.target.value)"
                            class="w-12 h-12 rounded-lg border border-gray-200"
                          />
                          <input
                            type="text"
                            :value="getElementFieldValue(currentElement, field)"
                            @input="updateElementField(field, $event.target.value)"
                            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="#ffffff"
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `,
    setup() {
      const loading = ref(false);
      const error = ref('');
      const saved = ref(false);
      const form = reactive({
        site_title: 'Точка суши и пиццы',
        logo: '',
        favicon: '',
        background_color: '#f9f4e5',
        home_blocks: {}
      });

      const pageBlocks = ref([]);
      const selectedBlockId = ref(null);
      const currentElementId = ref(null);
      const elementPaletteOpen = ref(false);
      const dropIndex = ref(null);
      const draggingBlockId = ref(null);
      const heroDrag = reactive({
        sourceBlockId: null,
        elementId: null,
        dropIndex: null,
        targetBlockId: null
      });
      const freeformDrag = reactive({
        active: false,
        blockId: null,
        elementId: null,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        containerWidth: 0,
        containerHeight: 0,
        elementWidth: 0,
        elementHeight: 0
      });

      const canvasViewportRef = ref(null);
      const canvasInnerRef = ref(null);
      const blockRefs = new Map();
      const elementRefs = new Map();

      const selectionOverlay = reactive({
        visible: false,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        label: '',
        type: 'block',
        badgeBelow: false
      });

      const canvas = reactive({
        device: 'desktop',
        zoom: 1,
        mode: 'full',
        showGrid: false,
        showOverlays: true
      });

      const devices = [
        { value: 'desktop', label: 'Desktop', icon: 'fa-solid fa-display', width: 1200 },
        { value: 'tablet', label: 'Tablet', icon: 'fa-solid fa-tablet-screen-button', width: 900 },
        { value: 'mobile', label: 'Mobile', icon: 'fa-solid fa-mobile-screen-button', width: 420 }
      ];

      const paletteDescriptions = {
        hero: 'Первый экран с кнопкой действия',
        categories: 'Секция с категориями каталога',
        menu: 'Витрина товаров и фильтры',
        delivery: 'Условия и преимущества доставки',
        reviews: 'Отзывы клиентов',
        map: 'Карта, адрес и контакты'
      };

      const palette = computed(() =>
        Object.entries(blockRegistry).map(([type, config]) => ({
          type,
          name: config.name,
          icon: config.icon,
          description: paletteDescriptions[type] || 'Контентный блок'
        }))
      );

      const canvasWidth = computed(() => {
        const device = devices.find(d => d.value === canvas.device);
        return device ? device.width : 1200;
      });

      const canvasStyle = computed(() => {
        const width = canvasWidth.value;
        if (canvas.mode === 'full') {
          return {
            transform: 'scale(1)',
            width: '100%',
            maxWidth: width + 'px',
            margin: '0 auto'
          };
        }
        return {
          transform: `scale(${canvas.zoom})`,
          width: width + 'px',
          margin: '0 auto'
        };
      });

      const selectedBlock = computed(() => pageBlocks.value.find(block => block.id === selectedBlockId.value) || null);
      const selectedBlockDefinition = computed(() => selectedBlock.value ? blockRegistry[selectedBlock.value.type] : null);
      const inspectorSections = computed(() => selectedBlockDefinition.value?.inspector || []);

      const elementPalette = computed(() => {
        if (!selectedBlockDefinition.value || !selectedBlockDefinition.value.elements) {
          return [];
        }
        return selectedBlockDefinition.value.elements
          .map(type => ({
            type,
            label: elementRegistry[type]?.label || type,
            icon: elementRegistry[type]?.icon || 'fa-solid fa-cube'
          }));
      });

      const currentElement = computed(() => {
        if (!selectedBlock.value || !currentElementId.value) return null;
        return selectedBlock.value.data?.elements?.find(el => el.id === currentElementId.value) || null;
      });

      const currentElementDefinition = computed(() => currentElement.value ? (elementRegistry[currentElement.value.type] || { fields: [] }) : { fields: [] });

      const selectionOverlayStyle = computed(() => ({
        top: selectionOverlay.top + 'px',
        left: selectionOverlay.left + 'px',
        width: selectionOverlay.width + 'px',
        height: selectionOverlay.height + 'px'
      }));

      function blockWrapperClasses(block) {
        return [
          'relative transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden',
          'shadow-lg mb-6'
        ];
      }

      function renderHeroElement(element) {
        switch (element.type) {
          case 'heading':
            return element.data.level || 'h2';
          case 'subheading':
            return 'p';
          case 'paragraph':
            return 'p';
          case 'button':
            return 'button';
          case 'image':
          case 'spacer':
            return 'div';
          case 'feature':
            return 'div';
          default:
            return 'div';
        }
      }

      function heroElementProps(block, element) {
        const data = element.data || {};
        const classes = [];
        const style = {};
        const events = {};
        const freePositioned = elementUsesFreePosition(block, element);

        if (['heading', 'subheading', 'paragraph', 'feature'].includes(element.type)) {
          classes.push(data.fontSize || (element.type === 'heading' ? 'text-4xl' : element.type === 'subheading' ? 'text-xl' : 'text-base'));
          style.fontWeight = data.fontWeight || (element.type === 'heading' ? '700' : element.type === 'feature' ? '600' : '500');
          if (data.fontFamily) style.fontFamily = data.fontFamily;
          if (data.lineHeight) style.lineHeight = data.lineHeight;
          if (data.letterSpacing) style.letterSpacing = asCssSize(data.letterSpacing, '0px');
          if (data.textTransform && data.textTransform !== 'none') style.textTransform = data.textTransform;
          if (data.maxWidth) style.maxWidth = asCssSize(data.maxWidth, '640px');
          if (data.align === 'center') classes.push('text-center');
          else if (data.align === 'right') classes.push('text-right');
          else classes.push('text-left');
          style.color = data.color || (element.type === 'subheading' ? '#fbbf24' : '#ffffff');
          style.marginTop = freePositioned ? '0px' : asCssSize(data.marginTop, '0px');
          const marginFallback = element.type === 'subheading' ? '12px' : element.type === 'feature' ? '8px' : '16px';
          style.marginBottom = freePositioned ? '0px' : asCssSize(data.marginBottom, marginFallback);
          if (data.backgroundColor) {
            style.backgroundColor = data.backgroundColor;
            style.display = element.type === 'feature' ? 'inline-flex' : 'inline-block';
            style.padding = `${asCssSize(data.paddingY, '0px')} ${asCssSize(data.paddingX, '0px')}`;
            style.borderRadius = asCssSize(data.borderRadius, '0px');
          }
          if (data.textShadow) {
            style.textShadow = data.textShadow;
          }
          if (element.type === 'feature') {
            classes.push('flex items-center space-x-3');
          }
        }

        if (element.type === 'button') {
          classes.push('inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40');
          if (!freePositioned) {
            if (data.align === 'center') classes.push('mx-auto');
            else if (data.align === 'right') classes.push('ml-auto');
          }
          style.marginTop = freePositioned ? '0px' : asCssSize(data.marginTop, '0px');
          style.marginBottom = freePositioned ? '0px' : asCssSize(data.marginBottom, '0px');
          style.paddingLeft = asCssSize(data.paddingX, '28px');
          style.paddingRight = asCssSize(data.paddingX, '28px');
          style.paddingTop = asCssSize(data.paddingY, '14px');
          style.paddingBottom = asCssSize(data.paddingY, '14px');
          style.borderRadius = asCssSize(data.borderRadius, '9999px');
          style.borderWidth = asCssSize(data.borderWidth, data.style === 'secondary' ? '2px' : '0px');
          style.borderStyle = 'solid';
          style.borderColor = data.borderColor || '#ffffff';
          style.backgroundColor = data.backgroundColor || (data.style === 'secondary' ? 'transparent' : '#ffffff');
          style.color = data.textColor || (data.style === 'secondary' ? '#ffffff' : '#dc2626');
          style.boxShadow = data.boxShadow || '0 15px 40px rgba(255,255,255,0.18)';
          style.fontSize = asCssSize(data.fontSize, '16px');
          style.fontFamily = data.fontFamily || 'inherit';
          style.fontWeight = data.fontWeight || '600';
          style.transition = 'all 0.25s ease';
          if (data.width) {
            style.width = asCssSize(data.width, 'auto');
          }

          const hoverBackground = data.hoverBackgroundColor || (data.style === 'secondary' ? '#ffffff' : '#f3f4f6');
          const hoverColor = data.hoverTextColor || (data.style === 'secondary' ? (data.textColor || '#1f2937') : '#b91c1c');
          events.onMouseenter = (event) => {
            event.target.dataset.prevBg = event.target.style.backgroundColor;
            event.target.dataset.prevColor = event.target.style.color;
            event.target.style.backgroundColor = hoverBackground;
            event.target.style.color = hoverColor;
          };
          events.onMouseleave = (event) => {
            if (event.target.dataset.prevBg) {
              event.target.style.backgroundColor = event.target.dataset.prevBg;
            }
            if (event.target.dataset.prevColor) {
              event.target.style.color = event.target.dataset.prevColor;
            }
          };
        }

        if (element.type === 'image') {
          if (!freePositioned) {
            if (data.align === 'center') classes.push('text-center');
            else if (data.align === 'right') classes.push('text-right');
            else classes.push('text-left');
          }
          style.marginTop = freePositioned ? '0px' : asCssSize(data.marginTop, '0px');
          style.marginBottom = freePositioned ? '0px' : asCssSize(data.marginBottom, '16px');
          if (!freePositioned) {
            if (data.align === 'center') {
              style.display = 'flex';
              style.justifyContent = 'center';
            } else if (data.align === 'right') {
              style.display = 'flex';
              style.justifyContent = 'flex-end';
            }
          }
        }

        if (element.type === 'spacer') {
          style.height = asCssSize(data.height, '24px');
          classes.push('w-full');
          if (freePositioned) {
            style.marginTop = '0px';
            style.marginBottom = '0px';
          }
        }

        if (element.type === 'feature') {
          classes.push('flex items-center space-x-3');
        }

        return {
          class: classes.join(' '),
          style,
          ...events
        };
      }




































      function deliveryLayoutClass(block) {
        const layout = block?.data?.layout || 'two-column';
        if (layout === 'stacked') {
          return 'flex flex-col gap-10';
        }
        return 'grid lg:grid-cols-2 gap-10 items-start';
      }

































      function setDevice(device) {
        canvas.device = device;
        if (canvas.mode !== 'preview') {
          return;
        }
        if (device === 'mobile') {
          canvas.zoom = 0.9;
        } else if (device === 'tablet') {
          canvas.zoom = 0.95;
        } else {
          canvas.zoom = 0.85;
        }
      }

      function changeZoom(delta) {
        if (canvas.mode === 'full') {
          return;
        }
        const next = Math.min(1.4, Math.max(0.4, canvas.zoom + delta));
        canvas.zoom = Number(next.toFixed(2));
      }

      function setCanvasMode(mode) {
        if (!['preview', 'full'].includes(mode)) return;
        canvas.mode = mode;
        if (mode === 'full') {
          canvas.zoom = 1;
        } else {
          setDevice(canvas.device);
        }
      }

      function selectBlock(blockId) {
        selectedBlockId.value = blockId;
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block) {
          currentElementId.value = null;
          return;
        }
        if (!block.data?.elements?.length) {
          currentElementId.value = null;
        } else {
          const has = block.data.elements.some(el => el.id === currentElementId.value);
          if (!has) currentElementId.value = block.data.elements[0].id;
        }
        elementPaletteOpen.value = false;
      }

      function addBlock(type) {
        const instance = createBlockInstance(type);
        if (!instance) return;
        pageBlocks.value.push(instance);
        selectedBlockId.value = instance.id;
      }

      function addBlockAtIndex(type, index) {
        const instance = createBlockInstance(type);
        if (!instance) return;
        pageBlocks.value.splice(index, 0, instance);
        selectedBlockId.value = instance.id;
      }

      function moveBlock(index, offset) {
        const targetIndex = index + offset;
        if (targetIndex < 0 || targetIndex >= pageBlocks.value.length) return;
        const [block] = pageBlocks.value.splice(index, 1);
        pageBlocks.value.splice(targetIndex, 0, block);
      }

      function duplicateBlock(blockId) {
        const originalIndex = pageBlocks.value.findIndex(block => block.id === blockId);
        if (originalIndex === -1) return;
        const copy = deepClone(pageBlocks.value[originalIndex]);
        const instance = createBlockInstance(copy.type, { ...copy, id: generateId('blockCopy') });
        pageBlocks.value.splice(originalIndex + 1, 0, instance);
        selectedBlockId.value = instance.id;
      }

      function removeBlock(blockId) {
        const index = pageBlocks.value.findIndex(block => block.id === blockId);
        if (index === -1) return;
        pageBlocks.value.splice(index, 1);
        if (pageBlocks.value.length === 0) {
          selectedBlockId.value = null;
          currentElementId.value = null;
          return;
        }
        if (selectedBlockId.value === blockId) {
          const nextIndex = Math.max(0, index - 1);
          selectedBlockId.value = pageBlocks.value[nextIndex].id;
        }
      }

      function toggleBlockHidden(blockId) {
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block) return;
        block.meta.hidden = !block.meta.hidden;
      }

      function resetToDefault() {
        pageBlocks.value = ['hero', 'categories', 'menu', 'delivery', 'reviews', 'map']
          .map(type => createBlockInstance(type))
          .filter(Boolean);
        if (pageBlocks.value.length) {
          selectedBlockId.value = pageBlocks.value[0].id;
        }
      }
      function onPaletteDragStart(event, blockType) {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('application/x-block-type', blockType);
        dropIndex.value = pageBlocks.value.length;
      }

      function onBlockDragStart(event, blockId) {
        draggingBlockId.value = blockId;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('application/x-block-id', blockId);
      }

      function onBlockDragEnd() {
        draggingBlockId.value = null;
        dropIndex.value = null;
      }

      function onDropZoneDragOver(index) {
        dropIndex.value = index;
      }

      function onDropZoneDrop(index, event) {
        const blockType = event.dataTransfer.getData('application/x-block-type');
        if (blockType) {
          addBlockAtIndex(blockType, index);
          dropIndex.value = null;
          return;
        }

        const blockId = event.dataTransfer.getData('application/x-block-id') || draggingBlockId.value;
        if (!blockId) {
          dropIndex.value = null;
          return;
        }

        const currentIndex = pageBlocks.value.findIndex(block => block.id === blockId);
        if (currentIndex === -1) {
          dropIndex.value = null;
          return;
        }

        const [block] = pageBlocks.value.splice(currentIndex, 1);
        let targetIndex = index;
        if (currentIndex < index) {
          targetIndex -= 1;
        }
        pageBlocks.value.splice(Math.max(0, targetIndex), 0, block);
        dropIndex.value = null;
      }

      function toggleElementPalette() {
        elementPaletteOpen.value = !elementPaletteOpen.value;
      }

      function heroDropIsActive(blockId, index) {
        if (!heroDrag.elementId) {
          return false;
        }
        const block = getBlockById(blockId);
        if (!block || isFreeformBlock(block)) {
          return false;
        }
        return heroDrag.targetBlockId === blockId && heroDrag.dropIndex === index;
      }

      function heroDropWrapperClass(blockId, index) {
        const block = getBlockById(blockId);
        if (!heroDrag.elementId || isFreeformBlock(block)) {
          return 'opacity-0 pointer-events-auto';
        }
        return heroDropIsActive(blockId, index)
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-60 pointer-events-auto';
      }

      function heroDropLabelClass(blockId, index) {
        return heroDropIsActive(blockId, index)
          ? 'border-orange-400 text-orange-200 bg-orange-500/20'
          : 'border-white/40 text-white/70 bg-black/20';
      }

      function heroElementWrapperClasses(block, element) {
        const classes = ['relative group transition'];
        const isSelected = selectedBlockId.value === block?.id && isElementSelected(element);
        if (isSelected) {
          classes.push('ring-2 ring-orange-300 shadow-lg backdrop-blur-sm');
        } else {
          classes.push('ring-1 ring-transparent');
        }
        if (elementUsesFreePosition(block, element)) {
          classes.push('cursor-move select-none pointer-events-auto');
        } else {
          classes.push('rounded-2xl px-2 py-1 hover:bg-white/10 hover:bg-opacity-30 hover:ring-white/40');
        }
        return classes.join(' ');
      }

      function heroElementWrapperStyle(block, element) {
        const style = {};
        if (!block || !element) {
          return style;
        }
        const data = element.data || {};
        if (elementUsesFreePosition(block, element)) {
          style.position = 'absolute';
          style.left = asCssSize(data.positionX, '0px');
          style.top = asCssSize(data.positionY, '0px');
          style.zIndex = parseCssNumber(data.zIndex, 10);
          style.userSelect = 'none';
          if (data.width) {
            style.width = asCssSize(data.width, 'auto');
          }
          if (data.maxWidth) {
            style.maxWidth = asCssSize(data.maxWidth, 'auto');
          }
        } else {
          style.position = 'relative';
        }
        return style;
      }

      function heroElementDraggable(block, element) {
        if (!block || !element) {
          return false;
        }
        if (isFreeformBlock(block)) {
          return false;
        }
        return element.data?.positionMode !== 'free';
      }

      function handleElementClick(blockId, elementId, event = null) {
        if (event) {
          event.stopPropagation();
        }
        selectBlock(blockId);
        currentElementId.value = elementId;
        elementPaletteOpen.value = false;
        nextTick(scheduleSelectionOverlay);
      }

      function handleBlockClick(blockId, event = null) {
        if (event && event.target && event.target.closest('[data-element-id]')) {
          return;
        }
        selectBlock(blockId);
        nextTick(scheduleSelectionOverlay);
      }

      function handleCanvasClick(event) {
        if (event.target && event.target.closest('[data-block-id]')) {
          return;
        }
        selectedBlockId.value = null;
        currentElementId.value = null;
        elementPaletteOpen.value = false;
        selectionOverlay.visible = false;
      }

      function onHeroElementPointerDown(blockId, elementId, event) {
        if (!event || event.button !== 0) {
          return;
        }
        const block = getBlockById(blockId);
        const element = block?.data?.elements?.find(el => el.id === elementId) || null;
        if (!block || !element || !elementUsesFreePosition(block, element)) {
          return;
        }
        const wrapper = elementRefs.get(getElementKey(blockId, elementId));
        if (!wrapper) {
          return;
        }
        const container = wrapper.offsetParent;
        if (!container) {
          return;
        }
        freeformDrag.active = true;
        freeformDrag.blockId = blockId;
        freeformDrag.elementId = elementId;
        freeformDrag.startX = event.clientX;
        freeformDrag.startY = event.clientY;
        freeformDrag.originX = parseCssNumber(element.data.positionX, wrapper.offsetLeft);
        freeformDrag.originY = parseCssNumber(element.data.positionY, wrapper.offsetTop);
        freeformDrag.containerWidth = container.clientWidth;
        freeformDrag.containerHeight = container.clientHeight;
        freeformDrag.elementWidth = wrapper.clientWidth;
        freeformDrag.elementHeight = wrapper.clientHeight;
        selectBlock(blockId);
        currentElementId.value = elementId;
        elementPaletteOpen.value = false;
        window.addEventListener('pointermove', onFreeformPointerMove);
        window.addEventListener('pointerup', onFreeformPointerUp);
        event.stopPropagation();
        event.preventDefault();
      }

      function onFreeformPointerMove(event) {
        if (!freeformDrag.active) {
          return;
        }
        const block = getBlockById(freeformDrag.blockId);
        const element = block?.data?.elements?.find(el => el.id === freeformDrag.elementId) || null;
        if (!block || !element || !elementUsesFreePosition(block, element)) {
          onFreeformPointerUp();
          return;
        }
        const zoom = canvas.mode === 'full' ? 1 : canvas.zoom;
        const deltaX = (event.clientX - freeformDrag.startX) / zoom;
        const deltaY = (event.clientY - freeformDrag.startY) / zoom;
        const maxX = Math.max(0, freeformDrag.containerWidth - freeformDrag.elementWidth);
        const maxY = Math.max(0, freeformDrag.containerHeight - freeformDrag.elementHeight);
        const nextX = clampNumber(freeformDrag.originX + deltaX, 0, maxX || 0);
        const nextY = clampNumber(freeformDrag.originY + deltaY, 0, maxY || 0);
        element.data.positionX = `${Math.round(nextX)}px`;
        element.data.positionY = `${Math.round(nextY)}px`;
        scheduleSelectionOverlay();
      }

      function onFreeformPointerUp() {
        if (!freeformDrag.active) {
          return;
        }
        freeformDrag.active = false;
        freeformDrag.blockId = null;
        freeformDrag.elementId = null;
        window.removeEventListener('pointermove', onFreeformPointerMove);
        window.removeEventListener('pointerup', onFreeformPointerUp);
        nextTick(scheduleSelectionOverlay);
      }




      function getElementKey(blockId, elementId) {
        return `${blockId}:${elementId}`;
      }

      function registerBlockRef(blockId, el) {
        if (el) {
          blockRefs.set(blockId, el);
        } else {
          blockRefs.delete(blockId);
        }
        scheduleSelectionOverlay();
      }

      function registerElementRef(blockId, elementId, el) {
        const key = getElementKey(blockId, elementId);
        if (el) {
          elementRefs.set(key, el);
        } else {
          elementRefs.delete(key);
        }
        scheduleSelectionOverlay();
      }

      function getBlockById(blockId) {
        return pageBlocks.value.find(block => block.id === blockId) || null;
      }

      function isFreeformBlock(block) {
        return Boolean(block?.data?.layout === 'freeform');
      }

      function elementUsesFreePosition(block, element) {
        return isFreeformBlock(block) && element?.data?.positionMode === 'free';
      }

      let overlayRaf = null;

      function scheduleSelectionOverlay() {
        if (overlayRaf) {
          cancelAnimationFrame(overlayRaf);
        }
        overlayRaf = requestAnimationFrame(() => {
          overlayRaf = null;
          updateSelectionOverlay();
        });
      }

      function updateSelectionOverlay() {
        if (!canvas.showOverlays) {
          selectionOverlay.visible = false;
          return;
        }
        const viewportEl = canvasViewportRef.value;
        if (!viewportEl) {
          selectionOverlay.visible = false;
          return;
        }
        let targetEl = null;
        if (currentElementId.value && selectedBlockId.value) {
          targetEl = elementRefs.get(getElementKey(selectedBlockId.value, currentElementId.value)) || null;
        }
        if (!targetEl && selectedBlockId.value) {
          targetEl = blockRefs.get(selectedBlockId.value) || null;
        }
        if (!targetEl) {
          selectionOverlay.visible = false;
          return;
        }

        const viewportRect = viewportEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const top = targetRect.top - viewportRect.top + viewportEl.scrollTop;
        const left = targetRect.left - viewportRect.left + viewportEl.scrollLeft;

        selectionOverlay.top = top;
        selectionOverlay.left = left;
        selectionOverlay.width = targetRect.width;
        selectionOverlay.height = targetRect.height;
        selectionOverlay.visible = true;
        selectionOverlay.type = currentElementId.value ? 'element' : 'block';
        selectionOverlay.label = currentElementId.value
          ? (elementRegistry[currentElement.value?.type]?.label || currentElement.value?.type || 'Элемент')
          : (selectedBlock.value?.name || selectedBlock.value?.type || 'Блок');
        selectionOverlay.badgeBelow = top < 32;
      }

      function onCanvasScroll() {
        if (!canvas.showOverlays) return;
        scheduleSelectionOverlay();
      }










      function handleWindowResize() {
        scheduleSelectionOverlay();
      }

      function handleDocumentScroll() {
        scheduleSelectionOverlay();
      }

      function onHeroElementDragStart(blockId, elementId, event = null) {
        const block = getBlockById(blockId);
        const element = block?.data?.elements?.find(el => el.id === elementId) || null;
        if (!block || !element || isFreeformBlock(block) || element.data?.positionMode === 'free') {
          if (event?.preventDefault) {
            event.preventDefault();
          }
          return;
        }
        heroDrag.sourceBlockId = blockId;
        heroDrag.elementId = elementId;
        heroDrag.dropIndex = null;
        heroDrag.targetBlockId = blockId;
        if (event?.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('application/x-hero-element', elementId);
        }
      }

      function onHeroElementDragEnd() {
        heroDrag.sourceBlockId = null;
        heroDrag.elementId = null;
        heroDrag.dropIndex = null;
        heroDrag.targetBlockId = null;
      }

      function onHeroElementDragOver(blockId, index) {
        if (!heroDrag.elementId) return;
        const block = getBlockById(blockId);
        if (isFreeformBlock(block)) return;
        heroDrag.targetBlockId = blockId;
        heroDrag.dropIndex = index;
      }

      function onHeroElementDragLeave(blockId, index) {
        if (!heroDrag.elementId) return;
        const block = getBlockById(blockId);
        if (isFreeformBlock(block)) return;
        if (heroDrag.targetBlockId === blockId && heroDrag.dropIndex === index) {
          heroDrag.dropIndex = null;
        }
      }

      function onHeroElementDrop(blockId, index) {
        if (!heroDrag.elementId) return;
        const sourceBlock = pageBlocks.value.find(b => b.id === heroDrag.sourceBlockId);
        const targetBlock = pageBlocks.value.find(b => b.id === blockId);
        if (!sourceBlock || !targetBlock || targetBlock.type !== 'hero' || isFreeformBlock(targetBlock)) {
          onHeroElementDragEnd();
          return;
        }

        const sourceElements = Array.isArray(sourceBlock.data.elements) ? sourceBlock.data.elements : [];
        const targetElements = Array.isArray(targetBlock.data.elements) ? targetBlock.data.elements : [];
        const sourceIndex = sourceElements.findIndex(el => el.id === heroDrag.elementId);
        if (sourceIndex === -1) {
          onHeroElementDragEnd();
          return;
        }

        if (sourceElements[sourceIndex]?.data?.positionMode === 'free') {
          onHeroElementDragEnd();
          return;
        }

        const [element] = sourceElements.splice(sourceIndex, 1);
        let insertionIndex = index;
        if (sourceBlock.id === targetBlock.id && sourceIndex < index) {
          insertionIndex -= 1;
        }
        if (insertionIndex < 0) insertionIndex = 0;
        if (insertionIndex > targetElements.length) insertionIndex = targetElements.length;

        targetElements.splice(insertionIndex, 0, element);
        selectedBlockId.value = targetBlock.id;
        currentElementId.value = element.id;
        onHeroElementDragEnd();
        scheduleSelectionOverlay();
      }

      function selectElement(blockId, elementId) {
        selectBlock(blockId);
        currentElementId.value = elementId;
        elementPaletteOpen.value = false;
      }

      function isElementSelected(element) {
        return currentElementId.value === element.id;
      }

      function addElement(blockId, type) {
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block) return;
        const definition = elementRegistry[type];
        if (!definition) return;
        if (!Array.isArray(block.data.elements)) {
          block.data.elements = [];
        }
        const element = normalizeElement({ type, data: definition.defaultData ? definition.defaultData() : {} });
        block.data.elements.push(element);
        currentElementId.value = element.id;
        elementPaletteOpen.value = false;
      }

      function removeElement(blockId, index) {
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block || !Array.isArray(block.data.elements)) return;
        const [removed] = block.data.elements.splice(index, 1);
        if (removed && removed.id === currentElementId.value) {
          currentElementId.value = null;
        }
      }

      function moveElement(blockId, index, offset) {
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block || !Array.isArray(block.data.elements)) return;
        const targetIndex = index + offset;
        if (targetIndex < 0 || targetIndex >= block.data.elements.length) return;
        const [element] = block.data.elements.splice(index, 1);
        block.data.elements.splice(targetIndex, 0, element);
      }

      function getFieldValue(block, field) {
        if (!block || !block.data) return '';
        const value = block.data[field.key];
        if (field.type === 'list') {
          return Array.isArray(value) ? value.join('\n') : '';
        }
        return value ?? '';
      }

      function updateBlockField(field, rawValue) {
        const block = selectedBlock.value;
        if (!block) return;
        const value = field.type === 'list'
          ? String(rawValue || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean)
          : rawValue;
        block.data[field.key] = value;
      }

      function getElementFieldValue(element, field) {
        if (!element || !element.data) return '';
        return element.data[field.key] ?? '';
      }

      function updateElementField(field, value) {
        const element = currentElement.value;
        if (!element) return;
        element.data[field.key] = value;
      }

      function onBlockFileSelected(field, event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          updateBlockField(field, reader.result);
        };
        reader.readAsDataURL(file);
      }

      function onFileSelected(event, key) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          form[key] = reader.result;
        };
        reader.readAsDataURL(file);
      }
      let isHydrating = false;

      function syncBlocksToForm() {
        if (isHydrating) return;
        const keyed = {};
        pageBlocks.value.forEach(block => {
          keyed[block.type] = deepClone(block.data);
        });
        keyed.page = pageBlocks.value.map(block => ({
          id: block.id,
          type: block.type,
          data: deepClone(block.data),
          hidden: !!block.meta.hidden
        }));
        form.home_blocks = keyed;
      }

      function hydrateBlocksFromForm() {
        isHydrating = true;
        try {
          const homeBlocks = form.home_blocks || {};
          const linear = Array.isArray(homeBlocks.page) ? homeBlocks.page : [];
          const nextBlocks = [];

          if (linear.length) {
            linear.forEach(entry => {
              if (!entry || !entry.type) return;
              const instance = createBlockInstance(entry.type, entry);
              if (instance) nextBlocks.push(instance);
            });
          } else {
            Object.keys(homeBlocks).forEach(type => {
              if (type === 'page') return;
              const instance = createBlockInstance(type, { data: homeBlocks[type] });
              if (instance) nextBlocks.push(instance);
            });
          }

          pageBlocks.value = nextBlocks.length ? nextBlocks : [];
          if (!pageBlocks.value.length) {
            resetToDefault();
          }
          if (pageBlocks.value.length && !selectedBlockId.value) {
            selectedBlockId.value = pageBlocks.value[0].id;
          }
        } finally {
          isHydrating = false;
          syncBlocksToForm();
        }
      }

      async function loadSettings() {
        loading.value = true;
        error.value = '';
        try {
          const response = await axios.get('/api/admin/site-settings');
          const data = response.data || {};
          form.site_title = data.site_title || 'Точка суши и пиццы';
          form.logo = data.logo || '';
          form.favicon = data.favicon || '';
          form.background_color = data.background_color || '#f9f4e5';
          form.home_blocks = deepClone(data.home_blocks || {});
          hydrateBlocksFromForm();
        } catch (e) {
          console.error('Ошибка загрузки настроек', e);
          error.value = e?.response?.data?.error || 'Не удалось загрузить настройки';
          resetToDefault();
        } finally {
          loading.value = false;
        }
      }

      async function saveSettings() {
        loading.value = true;
        error.value = '';
        saved.value = false;
        try {
          syncBlocksToForm();
          const payload = deepClone(form);
          const response = await axios.put('/api/admin/site-settings', payload);
          form.home_blocks = deepClone(response.data?.home_blocks || form.home_blocks);
          hydrateBlocksFromForm();
          saved.value = true;
          setTimeout(() => { saved.value = false; }, 2500);
        } catch (e) {
          console.error('Ошибка сохранения настроек', e);
          error.value = e?.response?.data?.error || 'Не удалось сохранить настройки';
        } finally {
          loading.value = false;
        }
      }

      watch(pageBlocks, (blocks) => {
        if (!isHydrating) {
          syncBlocksToForm();
        }
        if (!blocks.length) {
          selectedBlockId.value = null;
          currentElementId.value = null;
          scheduleSelectionOverlay();
          return;
        }
        if (!blocks.some(block => block.id === selectedBlockId.value)) {
          selectedBlockId.value = blocks[0].id;
        }
        nextTick(scheduleSelectionOverlay);
      }, { deep: true });

      watch(selectedBlockId, (nextId, prevId) => {
        if (nextId === prevId) return;
        const block = pageBlocks.value.find(b => b.id === nextId);
        if (!block || !Array.isArray(block.data?.elements) || !block.data.elements.length) {
          currentElementId.value = null;
          return;
        }
        const has = block.data.elements.some(el => el.id === currentElementId.value);
        if (!has) {
          currentElementId.value = block.data.elements[0].id;
        }
        nextTick(scheduleSelectionOverlay);
      });

      watch(currentElementId, () => {
        nextTick(scheduleSelectionOverlay);
      });

      watch(() => canvas.zoom, () => {
        scheduleSelectionOverlay();
      });

      watch(() => canvas.mode, () => {
        nextTick(scheduleSelectionOverlay);
      });

      watch(() => canvas.showOverlays, (value) => {
        if (value) {
          scheduleSelectionOverlay();
        } else {
          selectionOverlay.visible = false;
        }
      });

      watch(() => canvas.device, () => {
        nextTick(scheduleSelectionOverlay);
      });

      onMounted(async () => {
        window.addEventListener('resize', handleWindowResize);
        document.addEventListener('scroll', handleDocumentScroll, true);
        await loadSettings();
        nextTick(scheduleSelectionOverlay);
      });

      onUnmounted(() => {
        window.removeEventListener('resize', handleWindowResize);
        document.removeEventListener('scroll', handleDocumentScroll, true);
        window.removeEventListener('pointermove', onFreeformPointerMove);
        window.removeEventListener('pointerup', onFreeformPointerUp);
      });

      return {
        loading,
        error,
        saved,
        form,
        pageBlocks,
        palette,
        devices,
        canvas,
        canvasWidth,
        canvasStyle,
        canvasViewportRef,
        canvasInnerRef,
        dropIndex,
        selectedBlockId,
        selectedBlock,
        selectedBlockDefinition,
        inspectorSections,
        elementPalette,
        elementPaletteOpen,
        currentElement,
        currentElementDefinition,
        elementRegistry,
        selectionOverlay,
        selectionOverlayStyle,
        saveSettings,
        loadSettings,
        addBlock,
        addBlockAtIndex,
        moveBlock,
        duplicateBlock,
        removeBlock,
        toggleBlockHidden,
        resetToDefault,
        selectBlock,
        setDevice,
        setCanvasMode,
        changeZoom,
        onPaletteDragStart,
        onBlockDragStart,
        onBlockDragEnd,
        onDropZoneDragOver,
        onDropZoneDrop,
        blockWrapperClasses,
        renderHeroElement,
        heroElementProps,
        heroImageProps,
        heroElementWrapperClasses,
        heroElementWrapperStyle,
        heroElementDraggable,
        heroDropWrapperClass,
        heroDropLabelClass,
        onHeroElementDragStart,
        onHeroElementDragEnd,
        onHeroElementPointerDown,
        onHeroElementDragOver,
        onHeroElementDragLeave,
        onHeroElementDrop,
        handleBlockClick,
        handleElementClick,
        handleCanvasClick,
        selectElement,
        isElementSelected,
        addElement,
        removeElement,
        moveElement,
        toggleElementPalette,
        getFieldValue,
        updateBlockField,
        onBlockFileSelected,
        onFileSelected,
        getElementFieldValue,
        updateElementField,
        registerBlockRef,
        registerElementRef,
        onCanvasScroll,
        heroWrapperStyle,
        heroBackgroundStyle,
        heroOverlayStyle,
        heroContainerClasses,
        heroContainerStyle,
        heroContentColumnClasses,
        heroContentStyle,
        heroMediaWrapperClasses,
        heroFeatureIconWrapperStyle,
        sectionBackgroundStyle,
        sectionOverlayStyle,
        blockButtonWrapperStyle,
        blockButtonClass,
        blockButtonStyle,
        categoriesSectionStyle,
        categoriesOverlayStyle,
        categoriesHeaderStyle,
        categoriesHeadingStyle,
        categoriesSubheadingStyle,
        categoriesDescriptionStyle,
        categoriesGridStyle,
        categoriesCardStyle,
        categoriesIconWrapperStyle,
        categoriesCardTitleStyle,
        categoriesCardDescriptionStyle,
        menuSectionStyle,
        menuOverlayStyle,
        menuHeaderStyle,
        menuHeadingStyle,
        menuDescriptionStyle,
        menuFilterSurfaceStyle,
        menuTabsWrapperStyle,
        menuActiveTabStyle,
        menuTabStyle,
        menuGridStyle,
        menuCardStyle,
        menuCardImageStyle,
        menuCardTitleStyle,
        menuCardDescriptionStyle,
        menuPriceStyle,
        menuTagStyle,
        deliverySectionStyle,
        deliveryOverlayStyle,
        deliveryLayoutClass,
        deliveryTextColumnStyle,
        deliveryHeadingStyle,
        deliveryDescriptionStyle,
        deliveryFeatureIconStyle,
        deliveryFeatureTextStyle,
        deliveryContactsStyle,
        deliveryTrackingCardStyle,
        deliveryTrackingBarStyle,
        deliveryTrackingTitleStyle,
        deliveryTrackingDescriptionStyle,
        deliveryTrackingProgressStyle,
        reviewsSectionStyle,
        reviewsOverlayStyle,
        reviewsHeaderStyle,
        reviewsHeadingStyle,
        reviewsDescriptionStyle,
        reviewsGridStyle,
        reviewsCardStyle,
        reviewsAvatarStyle,
        reviewsCardTitleStyle,
        reviewsCardSubtitleStyle,
        reviewsRatingStyle,
        reviewsQuoteStyle,
        mapSectionStyle,
        mapOverlayStyle,
        mapFrameStyle,
        mapIframeStyle,
        mapInfoCardStyle,
        mapHeadingStyle,
        mapDescriptionStyle,
        mapContactRowStyle,
        mapContactIconStyle
      };
    }
  };
})();
