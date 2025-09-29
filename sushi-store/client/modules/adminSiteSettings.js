// Админ-модуль: Настройки сайта и визуальный конструктор главной страницы
(function(){
  const { ref, reactive, computed, watch, onMounted, onUnmounted } = Vue;

  const elementRegistry = {
    heading: {
      label: 'Заголовок',
      icon: 'fa-solid fa-heading',
      defaultData: () => ({
        text: 'Новый заголовок',
        level: 'h2',
        fontSize: 'text-4xl',
        customFontSize: '',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '0em',
        color: '#111827',
        align: 'left',
        maxWidth: '520px',
        backgroundColor: 'transparent',
        paddingX: '0px',
        paddingY: '0px',
        shadow: 'none',
        marginTop: '0px',
        marginBottom: '16px',
        width: 'auto',
        positionX: 18,
        positionY: 28,
        zIndex: 5
      }),
      fields: [
        { key: 'text', label: 'Текст', type: 'text', placeholder: 'Введите заголовок' },
        {
          key: 'level',
          label: 'Уровень',
          type: 'select',
          options: [
            { value: 'h1', label: 'H1' },
            { value: 'h2', label: 'H2' },
            { value: 'h3', label: 'H3' }
          ]
        },
        {
          key: 'fontSize',
          label: 'Размер (Tailwind)',
          type: 'select',
          options: [
            { value: 'text-3xl', label: 'Очень крупный (3xl)' },
            { value: 'text-4xl', label: 'Заголовок (4xl)' },
            { value: 'text-5xl', label: 'Героический (5xl)' }
          ]
        },
        { key: 'customFontSize', label: 'Своя величина', type: 'text', placeholder: '48px' },
        {
          key: 'color',
          label: 'Цвет текста',
          type: 'color'
        },
        {
          key: 'align',
          label: 'Выравнивание',
          type: 'select',
          options: [
            { value: 'left', label: 'Слева' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'Справа' }
          ]
        },
        {
          key: 'fontWeight',
          label: 'Жирность',
          type: 'select',
          options: [
            { value: '400', label: 'Обычный' },
            { value: '500', label: 'Полужирный' },
            { value: '600', label: 'Жирный' },
            { value: '700', label: 'Сверхжирный' }
          ]
        },
        { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.2' },
        { key: 'letterSpacing', label: 'Межбуквенный интервал', type: 'text', placeholder: '0em' },
        { key: 'maxWidth', label: 'Макс. ширина', type: 'text', placeholder: '520px' },
        { key: 'backgroundColor', label: 'Цвет подложки', type: 'color' },
        { key: 'paddingX', label: 'Гор. отступ', type: 'text', placeholder: '0px' },
        { key: 'paddingY', label: 'Верт. отступ', type: 'text', placeholder: '0px' },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' },
        { key: 'width', label: 'Ширина', type: 'text', placeholder: 'auto' },
        {
          key: 'shadow',
          label: 'Тень',
          type: 'select',
          options: [
            { value: 'none', label: 'Без тени' },
            { value: 'soft', label: 'Мягкая' },
            { value: 'strong', label: 'Объёмная' }
          ]
        },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '5' }
      ]
    },
    subheading: {
      label: 'Подзаголовок',
      icon: 'fa-solid fa-text-height',
      defaultData: () => ({
        text: 'Новый подзаголовок',
        fontSize: 'text-xl',
        customFontSize: '',
        fontWeight: '600',
        lineHeight: '1.3',
        letterSpacing: '0em',
        color: '#f97316',
        align: 'left',
        maxWidth: '520px',
        backgroundColor: 'transparent',
        paddingX: '0px',
        paddingY: '0px',
        shadow: 'none',
        marginTop: '0px',
        marginBottom: '12px',
        width: 'auto',
        positionX: 20,
        positionY: 38,
        zIndex: 4
      }),
      fields: [
        { key: 'text', label: 'Текст', type: 'text', placeholder: 'Введите подзаголовок' },
        {
          key: 'fontSize',
          label: 'Размер (Tailwind)',
          type: 'select',
          options: [
            { value: 'text-lg', label: 'Крупный' },
            { value: 'text-xl', label: 'Очень крупный' },
            { value: 'text-2xl', label: 'Заголовочный' }
          ]
        },
        { key: 'customFontSize', label: 'Своя величина', type: 'text', placeholder: '28px' },
        {
          key: 'color',
          label: 'Цвет текста',
          type: 'color'
        },
        {
          key: 'align',
          label: 'Выравнивание',
          type: 'select',
          options: [
            { value: 'left', label: 'Слева' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'Справа' }
          ]
        },
        {
          key: 'fontWeight',
          label: 'Жирность',
          type: 'select',
          options: [
            { value: '400', label: 'Обычный' },
            { value: '500', label: 'Полужирный' },
            { value: '600', label: 'Жирный' }
          ]
        },
        { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.3' },
        { key: 'letterSpacing', label: 'Межбуквенный интервал', type: 'text', placeholder: '0em' },
        { key: 'maxWidth', label: 'Макс. ширина', type: 'text', placeholder: '520px' },
        { key: 'backgroundColor', label: 'Цвет подложки', type: 'color' },
        { key: 'paddingX', label: 'Гор. отступ', type: 'text', placeholder: '0px' },
        { key: 'paddingY', label: 'Верт. отступ', type: 'text', placeholder: '0px' },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '12px' },
        { key: 'width', label: 'Ширина', type: 'text', placeholder: 'auto' },
        {
          key: 'shadow',
          label: 'Тень',
          type: 'select',
          options: [
            { value: 'none', label: 'Без тени' },
            { value: 'soft', label: 'Мягкая' },
            { value: 'strong', label: 'Объёмная' }
          ]
        },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '4' }
      ]
    },
    paragraph: {
      label: 'Текст',
      icon: 'fa-solid fa-paragraph',
      defaultData: () => ({
        text: 'Добавьте описание секции или товара',
        fontSize: 'text-base',
        customFontSize: '',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0em',
        color: '#4b5563',
        align: 'left',
        maxWidth: '560px',
        backgroundColor: 'transparent',
        paddingX: '0px',
        paddingY: '0px',
        shadow: 'none',
        marginTop: '0px',
        marginBottom: '16px',
        width: 'auto',
        positionX: 22,
        positionY: 50,
        zIndex: 3
      }),
      fields: [
        { key: 'text', label: 'Текст', type: 'textarea', rows: 3, placeholder: 'Расскажите подробнее' },
        {
          key: 'fontSize',
          label: 'Размер (Tailwind)',
          type: 'select',
          options: [
            { value: 'text-sm', label: 'Маленький' },
            { value: 'text-base', label: 'Стандартный' },
            { value: 'text-lg', label: 'Крупный' }
          ]
        },
        { key: 'customFontSize', label: 'Своя величина', type: 'text', placeholder: '18px' },
        {
          key: 'color',
          label: 'Цвет текста',
          type: 'color'
        },
        {
          key: 'align',
          label: 'Выравнивание',
          type: 'select',
          options: [
            { value: 'left', label: 'Слева' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'Справа' }
          ]
        },
        {
          key: 'fontWeight',
          label: 'Жирность',
          type: 'select',
          options: [
            { value: '400', label: 'Стандарт' },
            { value: '500', label: 'Полужирный' }
          ]
        },
        { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.5' },
        { key: 'letterSpacing', label: 'Межбуквенный интервал', type: 'text', placeholder: '0em' },
        { key: 'maxWidth', label: 'Макс. ширина', type: 'text', placeholder: '560px' },
        { key: 'backgroundColor', label: 'Цвет подложки', type: 'color' },
        { key: 'paddingX', label: 'Гор. отступ', type: 'text', placeholder: '0px' },
        { key: 'paddingY', label: 'Верт. отступ', type: 'text', placeholder: '0px' },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' },
        { key: 'width', label: 'Ширина', type: 'text', placeholder: 'auto' },
        {
          key: 'shadow',
          label: 'Тень',
          type: 'select',
          options: [
            { value: 'none', label: 'Без тени' },
            { value: 'soft', label: 'Мягкая' },
            { value: 'strong', label: 'Объёмная' }
          ]
        },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '3' }
      ]
    },
    button: {
      label: 'Кнопка',
      icon: 'fa-solid fa-hand-pointer',
      defaultData: () => ({
        text: 'Новая кнопка',
        style: 'primary',
        action: 'scrollMenu',
        href: '',
        align: 'left',
        marginTop: '0px',
        marginBottom: '0px',
        textColor: '#111827',
        backgroundColor: '#ffffff',
        borderColor: 'transparent',
        paddingX: '24px',
        paddingY: '14px',
        borderRadius: '9999px',
        fontWeight: '600',
        shadow: 'soft',
        width: 'auto',
        positionX: 22,
        positionY: 64,
        zIndex: 6
      }),
      fields: [
        { key: 'text', label: 'Текст кнопки', type: 'text', placeholder: 'Например, Заказать' },
        {
          key: 'style',
          label: 'Стиль',
          type: 'select',
          options: [
            { value: 'primary', label: 'Заливка' },
            { value: 'secondary', label: 'Контур' }
          ]
        },
        {
          key: 'action',
          label: 'Действие',
          type: 'select',
          options: [
            { value: 'scrollMenu', label: 'Прокрутка к меню' },
            { value: 'openCart', label: 'Открыть корзину' },
            { value: 'link', label: 'Ссылка' }
          ]
        },
        { key: 'href', label: 'Ссылка', type: 'text', placeholder: 'https://...' },
        {
          key: 'align',
          label: 'Выравнивание',
          type: 'select',
          options: [
            { value: 'left', label: 'Слева' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'Справа' }
          ]
        },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '0px' },
        { key: 'textColor', label: 'Цвет текста', type: 'color' },
        { key: 'backgroundColor', label: 'Цвет фона', type: 'color' },
        { key: 'borderColor', label: 'Цвет обводки', type: 'color' },
        { key: 'paddingX', label: 'Гор. отступ', type: 'text', placeholder: '24px' },
        { key: 'paddingY', label: 'Верт. отступ', type: 'text', placeholder: '14px' },
        { key: 'borderRadius', label: 'Радиус скругления', type: 'text', placeholder: '9999px' },
        {
          key: 'fontWeight',
          label: 'Жирность',
          type: 'select',
          options: [
            { value: '500', label: 'Полужирный' },
            { value: '600', label: 'Жирный' },
            { value: '700', label: 'Экстра жирный' }
          ]
        },
        {
          key: 'shadow',
          label: 'Тень',
          type: 'select',
          options: [
            { value: 'none', label: 'Без тени' },
            { value: 'soft', label: 'Мягкая' },
            { value: 'strong', label: 'Объёмная' }
          ]
        },
        { key: 'width', label: 'Ширина', type: 'text', placeholder: 'auto' },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '6' }
      ]
    },
    image: {
      label: 'Изображение',
      icon: 'fa-solid fa-image',
      defaultData: () => ({
        src: '',
        alt: 'Изображение',
        width: '320px',
        height: 'auto',
        align: 'left',
        borderRadius: '16px',
        marginTop: '0px',
        marginBottom: '16px',
        objectFit: 'cover',
        shadow: 'soft',
        borderWidth: '0px',
        borderColor: 'transparent',
        positionX: 70,
        positionY: 48,
        zIndex: 2
      }),
      fields: [
        { key: 'src', label: 'URL изображения', type: 'text', placeholder: 'https://...' },
        { key: 'alt', label: 'Alt текст', type: 'text', placeholder: 'Подпись' },
        { key: 'width', label: 'Ширина', type: 'text', placeholder: '320px' },
        { key: 'height', label: 'Высота', type: 'text', placeholder: 'auto' },
        {
          key: 'align',
          label: 'Выравнивание',
          type: 'select',
          options: [
            { value: 'left', label: 'Слева' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'Справа' }
          ]
        },
        { key: 'borderRadius', label: 'Скругление', type: 'text', placeholder: '16px' },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' },
        {
          key: 'objectFit',
          label: 'Режим обрезки',
          type: 'select',
          options: [
            { value: 'cover', label: 'Заполнить' },
            { value: 'contain', label: 'Вписать' }
          ]
        },
        { key: 'shadow', label: 'Тень', type: 'select', options: [
          { value: 'none', label: 'Без тени' },
          { value: 'soft', label: 'Мягкая' },
          { value: 'strong', label: 'Объёмная' }
        ] },
        { key: 'borderWidth', label: 'Толщина рамки', type: 'text', placeholder: '0px' },
        { key: 'borderColor', label: 'Цвет рамки', type: 'color' },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '2' }
      ]
    },
    feature: {
      label: 'Преимущество',
      icon: 'fa-solid fa-star',
      defaultData: () => ({
        text: 'Новое преимущество',
        icon: 'fa-solid fa-check',
        color: '#111827',
        fontSize: 'text-base',
        align: 'left',
        iconColor: '#ffffff',
        iconBackground: '#f97316',
        badgeShape: 'circle',
        fontWeight: '500',
        marginTop: '0px',
        marginBottom: '8px',
        positionX: 24,
        positionY: 74,
        zIndex: 3
      }),
      fields: [
        { key: 'text', label: 'Текст', type: 'text', placeholder: 'Например, Бесплатная доставка' },
        { key: 'icon', label: 'Иконка FontAwesome', type: 'text', placeholder: 'fa-solid fa-check' },
        {
          key: 'color',
          label: 'Цвет текста',
          type: 'color'
        },
        {
          key: 'fontSize',
          label: 'Размер',
          type: 'select',
          options: [
            { value: 'text-sm', label: 'Маленький' },
            { value: 'text-base', label: 'Стандартный' },
            { value: 'text-lg', label: 'Крупный' }
          ]
        },
        {
          key: 'fontWeight',
          label: 'Жирность',
          type: 'select',
          options: [
            { value: '400', label: 'Обычный' },
            { value: '500', label: 'Полужирный' },
            { value: '600', label: 'Жирный' }
          ]
        },
        {
          key: 'align',
          label: 'Выравнивание',
          type: 'select',
          options: [
            { value: 'left', label: 'Слева' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'Справа' }
          ]
        },
        { key: 'iconColor', label: 'Цвет иконки', type: 'color' },
        { key: 'iconBackground', label: 'Фон иконки', type: 'color' },
        {
          key: 'badgeShape',
          label: 'Форма бейджа',
          type: 'select',
          options: [
            { value: 'circle', label: 'Круг' },
            { value: 'rounded', label: 'Скругленный квадрат' },
            { value: 'pill', label: 'Пилюля' }
          ]
        },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '8px' },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '3' }
      ]
    },
    spacer: {
      label: 'Отступ',
      icon: 'fa-solid fa-ruler-vertical',
      defaultData: () => ({
        height: '24px',
        marginTop: '0px',
        marginBottom: '0px',
        positionX: 50,
        positionY: 50,
        width: '100%',
        zIndex: 1
      }),
      fields: [
        { key: 'height', label: 'Высота', type: 'text', placeholder: '24px' },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '0px' },
        { key: 'width', label: 'Ширина', type: 'text', placeholder: '100%' },
        { key: 'positionX', label: 'Позиция X (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'positionY', label: 'Позиция Y (%)', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'zIndex', label: 'Слой', type: 'number', placeholder: '1' }
      ]
    }
  };

  const elementShadowStyles = {
    none: 'none',
    soft: '0 18px 45px rgba(15, 23, 42, 0.18)',
    strong: '0 28px 60px rgba(15, 23, 42, 0.28)'
  };

  const heroBlockElementBindings = {
    heading: { elementType: 'heading', elementField: 'text' },
    subheading: { elementType: 'subheading', elementField: 'text' },
    description: { elementType: 'paragraph', elementField: 'text' },
    buttonText: { elementType: 'button', elementField: 'text' },
    buttonStyle: { elementType: 'button', elementField: 'style' },
    buttonAction: { elementType: 'button', elementField: 'action' },
    buttonLink: { elementType: 'button', elementField: 'href' }
  };

  const heroElementBlockBindings = {
    heading: { text: 'heading' },
    subheading: { text: 'subheading' },
    paragraph: { text: 'description' },
    button: { text: 'buttonText', style: 'buttonStyle', action: 'buttonAction', href: 'buttonLink' }
  };

  const heroFreeformDefaults = {
    heading: { positionX: 12, positionY: 26, zIndex: 6 },
    subheading: { positionX: 14, positionY: 38, zIndex: 5 },
    paragraph: { positionX: 16, positionY: 50, zIndex: 4 },
    button: { positionX: 18, positionY: 63, zIndex: 7 },
    image: { positionX: 64, positionY: 44, zIndex: 3 },
    feature: { positionX: 22, positionY: 76, zIndex: 4 },
    spacer: { positionX: 52, positionY: 52, zIndex: 2 },
    __fallback: { positionX: 30, positionY: 50, zIndex: 1 }
  };

  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);

  function ensureHeroBlockConsistency(block) {
    if (!block || block.type !== 'hero') {
      return;
    }
    const data = block.data || (block.data = {});
    const elements = Array.isArray(data.elements) ? data.elements : [];
    elements.forEach(element => {
      if (!element || typeof element !== 'object') return;
      if (!element.data || typeof element.data !== 'object') {
        element.data = {};
      }
    });

    Object.entries(heroBlockElementBindings).forEach(([blockKey, binding]) => {
      const element = elements.find(el => el.type === binding.elementType);
      if (!element) return;
      const elementData = element.data || (element.data = {});
      const elementHasValue = hasOwn(elementData, binding.elementField);
      const blockHasValue = hasOwn(data, blockKey);
      const defaultData = elementRegistry[binding.elementType]?.defaultData?.() || {};
      let nextValue;
      if (elementHasValue) {
        nextValue = elementData[binding.elementField];
      } else if (blockHasValue) {
        nextValue = data[blockKey];
      } else if (hasOwn(defaultData, binding.elementField)) {
        nextValue = defaultData[binding.elementField];
      } else {
        nextValue = '';
      }
      elementData[binding.elementField] = nextValue;
      data[blockKey] = nextValue;
    });
  }

  function applyHeroBlockFieldToElement(block, fieldKey, value) {
    if (!block || block.type !== 'hero') {
      return;
    }
    const binding = heroBlockElementBindings[fieldKey];
    if (!binding) {
      return;
    }
    const elements = Array.isArray(block.data?.elements) ? block.data.elements : [];
    const element = elements.find(el => el.type === binding.elementType);
    if (!element) {
      return;
    }
    if (!element.data || typeof element.data !== 'object') {
      element.data = {};
    }
    element.data[binding.elementField] = value;
  }

  function applyHeroElementFieldToBlock(block, element, fieldKey, value) {
    if (!block || block.type !== 'hero' || !element) {
      return;
    }
    const mapping = heroElementBlockBindings[element.type];
    if (!mapping) {
      return;
    }
    const blockKey = mapping[fieldKey];
    if (!blockKey) {
      return;
    }
    if (!block.data || typeof block.data !== 'object') {
      block.data = {};
    }
    block.data[blockKey] = value;
  }

  function ensureHeroFreeformDefaults(block) {
    if (!block || block.type !== 'hero') {
      return;
    }
    const data = block.data || {};
    if ((data.layoutMode || 'stacked') !== 'free') {
      return;
    }
    const elements = Array.isArray(data.elements) ? data.elements : [];
    let highestZ = 0;
    elements.forEach(el => {
      const z = Number(el?.data?.zIndex);
      if (Number.isFinite(z)) {
        highestZ = Math.max(highestZ, z);
      }
    });
    let zCursor = highestZ;
    elements.forEach((element, index) => {
      if (!element || typeof element !== 'object') return;
      if (!element.data || typeof element.data !== 'object') {
        element.data = {};
      }
      const defaults = heroFreeformDefaults[element.type] || heroFreeformDefaults.__fallback;
      if (!hasOwn(element.data, 'positionX')) {
        element.data.positionX = defaults.positionX ?? Math.min(12 + index * 10, 90);
      }
      if (!hasOwn(element.data, 'positionY')) {
        element.data.positionY = defaults.positionY ?? Math.min(18 + index * 12, 90);
      }
      if (!hasOwn(element.data, 'zIndex')) {
        zCursor += 1;
        element.data.zIndex = defaults.zIndex ?? zCursor;
      }
    });
  }

  function reconcileHeroBlockAfterElementRemoval(block, removedType) {
    if (!block || block.type !== 'hero') {
      return;
    }
    const elements = Array.isArray(block.data?.elements) ? block.data.elements : [];
    Object.entries(heroBlockElementBindings).forEach(([blockKey, binding]) => {
      if (binding.elementType !== removedType) {
        return;
      }
      const fallback = elements.find(el => el.type === removedType);
      if (fallback && fallback.data && hasOwn(fallback.data, binding.elementField)) {
        block.data[blockKey] = fallback.data[binding.elementField];
      } else if (block.data && hasOwn(block.data, blockKey)) {
        delete block.data[blockKey];
      }
    });
  }

  function prepareHeroBlock(block) {
    ensureHeroBlockConsistency(block);
    ensureHeroFreeformDefaults(block);
  }

  const blockRegistry = {
    hero: {
      name: 'Hero-блок',
      icon: 'fa-solid fa-fire',
      defaultData: () => ({
        heading: 'Быстро и вкусно',
        subheading: 'Попробуйте наши фирменные суши',
        description: 'Свежие роллы, пицца и десерты с доставкой за 30 минут.',
        buttonText: 'Выбрать блюда',
        buttonStyle: 'primary',
        buttonAction: 'scrollMenu',
        buttonLink: '',
        layoutMode: 'stacked',
        canvasHeight: 680,
        canvasPadding: '96px 72px',
        contentWidth: '560px',
        stackGap: '24px',
        contentAlign: 'left',
        canvasBackground: 'transparent',
        backgroundImage: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d',
        previewImage: 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10',
        imageSide: 'right',
        showRightImage: true,
        waveEnabled: true,
        waveColor: '#f9f4e5',
        overlayColor: 'rgba(17, 24, 39, 0.55)',
        elements: [
          {
            type: 'heading',
            data: {
              text: 'Быстро и вкусно',
              level: 'h1',
              fontSize: 'text-5xl',
              color: '#ffffff',
              align: 'left',
              marginTop: '0px',
              marginBottom: '16px'
            }
          },
          {
            type: 'subheading',
            data: {
              text: 'Попробуйте фирменные роллы сегодня',
              fontSize: 'text-2xl',
              color: '#fbbf24',
              align: 'left',
              marginTop: '0px',
              marginBottom: '12px'
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'Комбинируйте суши, пиццу и десерты. Мы доставим всё тёплым и свежим.',
              fontSize: 'text-lg',
              color: '#f9fafb',
              align: 'left',
              marginTop: '0px',
              marginBottom: '20px'
            }
          },
          {
            type: 'button',
            data: {
              text: 'Собрать заказ',
              style: 'primary',
              action: 'scrollMenu',
              align: 'left',
              marginTop: '0px',
              marginBottom: '0px'
            }
          }
        ]
      }),
      inspector: [
        {
          label: 'Полотно',
          fields: [
            {
              key: 'layoutMode',
              label: 'Режим компоновки',
              type: 'select',
              options: [
                { value: 'stacked', label: 'Колонка' },
                { value: 'free', label: 'Свободное размещение' }
              ]
            },
            { key: 'canvasHeight', label: 'Высота полотна (px)', type: 'text', placeholder: '680' },
            { key: 'canvasPadding', label: 'Внутренние отступы', type: 'text', placeholder: '96px 72px' },
            { key: 'contentWidth', label: 'Ширина контента', type: 'text', placeholder: '560px' },
            { key: 'stackGap', label: 'Интервал между элементами', type: 'text', placeholder: '24px' },
            {
              key: 'contentAlign',
              label: 'Выравнивание контента',
              type: 'select',
              options: [
                { value: 'left', label: 'Слева' },
                { value: 'center', label: 'По центру' },
                { value: 'right', label: 'Справа' }
              ]
            },
            { key: 'canvasBackground', label: 'Цвет полотна', type: 'color' }
          ]
        },
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Быстро и вкусно' },
            { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'Попробуйте наши фирменные суши' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Коротко о предложении' }
          ]
        },
        {
          label: 'Кнопка',
          fields: [
            { key: 'buttonText', label: 'Текст кнопки', type: 'text', placeholder: 'Выбрать блюда' },
            {
              key: 'buttonStyle',
              label: 'Стиль кнопки',
              type: 'select',
              options: [
                { value: 'primary', label: 'Основная' },
                { value: 'secondary', label: 'Вторичная' }
              ]
            },
            {
              key: 'buttonAction',
              label: 'Действие',
              type: 'select',
              options: [
                { value: 'scrollMenu', label: 'Прокрутка к меню' },
                { value: 'openCart', label: 'Открыть корзину' },
                { value: 'link', label: 'Перейти по ссылке' }
              ]
            },
            { key: 'buttonLink', label: 'Ссылка (для действия "Ссылка")', type: 'text', placeholder: 'https://...' }
          ]
        },
        {
          label: 'Оформление',
          fields: [
            { key: 'backgroundImage', label: 'Фоновое изображение', type: 'image' },
            { key: 'previewImage', label: 'Изображение справа', type: 'image' },
            {
              key: 'imageSide',
              label: 'Расположение изображения',
              type: 'select',
              options: [
                { value: 'left', label: 'Слева' },
                { value: 'right', label: 'Справа' }
              ]
            },
            { key: 'showRightImage', label: 'Показывать изображение', type: 'toggle' },
            { key: 'waveEnabled', label: 'Декоративная волна', type: 'toggle' },
            { key: 'waveColor', label: 'Цвет волны', type: 'color' },
            { key: 'overlayColor', label: 'Цвет наложения', type: 'color' }
          ]
        }
      ],
      elements: ['heading', 'subheading', 'paragraph', 'button', 'image', 'feature', 'spacer']
    },
    categories: {
      name: 'Категории',
      icon: 'fa-solid fa-tags',
      defaultData: () => ({
        heading: 'Категории и блюда',
        subheading: 'которые вы нигде не найдете',
        description: 'Уникальные подборки от наших шефов',
        backgroundColor: '#f9f4e5',
        accentColor: '#f97316',
        cardStyle: 'rounded'
      }),
      inspector: [
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Категории и блюда' },
            { key: 'subheading', label: 'Подзаголовок', type: 'text', placeholder: 'которые вы нигде не найдете' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Опишите секцию' }
          ]
        },
        {
          label: 'Оформление',
          fields: [
            { key: 'backgroundColor', label: 'Фон блока', type: 'color' },
            { key: 'accentColor', label: 'Акцентный цвет', type: 'color' },
            {
              key: 'cardStyle',
              label: 'Стиль карточек',
              type: 'select',
              options: [
                { value: 'rounded', label: 'Скруглённые' },
                { value: 'flat', label: 'Плоские' },
                { value: 'glass', label: 'Стекло' }
              ]
            }
          ]
        }
      ]
    },
    menu: {
      name: 'Меню',
      icon: 'fa-solid fa-utensils',
      defaultData: () => ({
        heading: 'Популярные блюда',
        description: 'Выберите категорию и сформируйте свой сет',
        showSearch: true,
        highlightHits: true
      }),
      inspector: [
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Популярные блюда' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Выберите категорию и сформируйте свой сет' }
          ]
        },
        {
          label: 'Функции',
          fields: [
            { key: 'showSearch', label: 'Показывать поиск', type: 'toggle' },
            { key: 'highlightHits', label: 'Подсвечивать хиты', type: 'toggle' }
          ]
        }
      ]
    },
    delivery: {
      name: 'Доставка',
      icon: 'fa-solid fa-truck-fast',
      defaultData: () => ({
        heading: 'Быстрая доставка',
        description: 'Привезём заказ за 30 минут или подарим ролл',
        features: [
          'Бесплатная доставка от 1500 ₽',
          'Прозрачный трекинг курьера',
          'Термосумки для горячих блюд'
        ],
        backgroundColor: '#fff7ed',
        contactPhone: '+7 (900) 000-00-00',
        minOrder: '1500'
      }),
      inspector: [
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Быстрая доставка' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Расскажите об условиях доставки' }
          ]
        },
        {
          label: 'Преимущества',
          fields: [
            { key: 'features', label: 'Список преимуществ', type: 'list', placeholder: 'Каждое с новой строки' }
          ]
        },
        {
          label: 'Дополнительно',
          fields: [
            { key: 'contactPhone', label: 'Телефон курьера', type: 'text', placeholder: '+7 (900) 000-00-00' },
            { key: 'minOrder', label: 'Минимальный заказ', type: 'text', placeholder: '1500' },
            { key: 'backgroundColor', label: 'Цвет фона', type: 'color' }
          ]
        }
      ]
    },
    reviews: {
      name: 'Отзывы',
      icon: 'fa-solid fa-comments',
      defaultData: () => ({
        heading: 'Отзывы наших гостей',
        description: 'Более 1000 довольных клиентов в этом месяце',
        autoPlay: true,
        layout: 'grid'
      }),
      inspector: [
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Отзывы наших гостей' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Более 1000 довольных клиентов' }
          ]
        },
        {
          label: 'Настройки',
          fields: [
            { key: 'autoPlay', label: 'Автопрокрутка', type: 'toggle' },
            {
              key: 'layout',
              label: 'Макет',
              type: 'select',
              options: [
                { value: 'grid', label: 'Сетка' },
                { value: 'carousel', label: 'Карусель' }
              ]
            }
          ]
        }
      ]
    },
    map: {
      name: 'Карта и контакты',
      icon: 'fa-solid fa-map-location-dot',
      defaultData: () => ({
        heading: 'Зоны доставки',
        description: 'Нажмите на нужный район, чтобы узнать условия доставки',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?lang=ru_RU&scroll=true&source=constructor-api&um=constructor%3A1569f1da7d596921cd82db1f441ffc63d2a386db371645fede23dbc26dc86a74',
        address: 'г. Санкт-Петербург, ул. Суши, 5',
        workHours: 'Ежедневно 10:00 — 23:00',
        phone: '+7 (812) 000-00-00'
      }),
      inspector: [
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Зоны доставки' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Опишите как работает доставка' }
          ]
        },
        {
          label: 'Контакты',
          fields: [
            { key: 'address', label: 'Адрес', type: 'text', placeholder: 'г. Санкт-Петербург...' },
            { key: 'phone', label: 'Телефон', type: 'text', placeholder: '+7 (...)' },
            { key: 'workHours', label: 'Время работы', type: 'text', placeholder: '10:00 — 23:00' }
          ]
        },
        {
          label: 'Карта',
          fields: [
            { key: 'iframeSrc', label: 'Ссылка на карту (iframe)', type: 'textarea', rows: 2 }
          ]
        }
      ]
    }
  };

  const deepClone = (value) => JSON.parse(JSON.stringify(value));

  function generateId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
  }

  function normalizeElement(elementLike) {
    if (!elementLike) {
      return null;
    }
    const type = elementLike.type || 'paragraph';
    const definition = elementRegistry[type];
    if (!definition) {
      return null;
    }
    const base = definition.defaultData ? definition.defaultData() : {};
    const incoming = elementLike.data || {};
    return {
      id: elementLike.id || generateId('element'),
      type,
      data: { ...base, ...incoming }
    };
  }

  function createBlockInstance(type, source = {}) {
    const definition = blockRegistry[type];
    if (!definition) {
      return null;
    }
    const defaults = definition.defaultData ? definition.defaultData() : {};
    const data = source.data || source || {};
    const merged = { ...defaults, ...data };

    if (definition.elements) {
      const elements = Array.isArray(data.elements) ? data.elements : defaults.elements;
      merged.elements = Array.isArray(elements)
        ? elements.map(el => normalizeElement(el)).filter(Boolean)
        : [];
    }

    const instance = {
      id: source.id || generateId('block'),
      type,
      name: definition.name,
      icon: definition.icon,
      data: merged,
      meta: {
        hidden: !!(source.hidden || (source.meta && source.meta.hidden))
      }
    };

    if (instance.type === 'hero') {
      prepareHeroBlock(instance);
    }

    return instance;
  }

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
                class="relative border border-gray-200 rounded-2xl bg-gray-50"
                :class="canvas.mode === 'full' ? 'overflow-auto max-h-[calc(100vh-320px)]' : 'overflow-hidden'"
              >
                <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[length:16px_16px]" v-if="canvas.showGrid"></div>
                <div
                  class="relative origin-top transition-all duration-300 ease-out"
                  :style="canvasStyle"
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
                          @click.stop="selectBlock(block.id)"
                          :class="[
                            blockWrapperClasses(block),
                            block.meta.hidden ? 'opacity-60' : 'opacity-100'
                          ]"
                        >
                          <div
                            v-if="canvas.showOverlays"
                            class="absolute inset-0 border-2 border-dashed"
                            :class="block.id === selectedBlockId ? 'border-orange-500' : 'border-transparent'"
                          ></div>

                          <template v-if="block.type === 'hero'">
                            <div
                              class="relative overflow-hidden rounded-3xl text-white"
                              :style="{ backgroundColor: block.data.canvasBackground || 'transparent' }"
                            >
                              <img
                                :src="block.data.backgroundImage"
                                alt="hero bg"
                                class="absolute inset-0 w-full h-full object-cover"
                              />
                              <div class="absolute inset-0" :style="{ background: block.data.overlayColor || 'rgba(17,24,39,0.6)' }"></div>
                              <div
                                class="relative w-full"
                                :class="isHeroLayoutFree(block) ? 'min-h-[480px]' : 'grid lg:grid-cols-2 gap-12'"
                                :style="heroCanvasSurfaceStyle(block)"
                                :ref="el => setHeroCanvasRef(block.id, el)"
                              >
                                <template v-if="isHeroLayoutFree(block)">
                                  <div
                                    v-if="!block.data.elements || !block.data.elements.length"
                                    class="absolute inset-0 flex items-center justify-center text-sm text-white/70 pointer-events-none"
                                  >
                                    Добавьте элементы через инспектор и перетащите их на холст.
                                  </div>
                                  <div
                                    v-if="canvas.showOverlays"
                                    class="absolute inset-0 border border-dashed border-white/30 rounded-[32px] pointer-events-none"
                                  ></div>
                                  <div
                                    v-for="element in block.data.elements"
                                    :key="element.id"
                                    :class="heroElementWrapperClasses(block, element)"
                                    :style="heroElementWrapperStyle(block, element)"
                                    @pointerdown="onHeroFreeformPointerDown(block.id, element, $event)"
                                    @click.stop="selectElement(block.id, element.id)"
                                  >
                                    <div
                                      v-if="canvas.showOverlays"
                                      class="absolute inset-0 rounded-2xl border border-dashed pointer-events-none"
                                      :class="isElementSelected(element) && selectedBlockId === block.id ? 'border-orange-300' : 'border-white/30'"
                                    ></div>
                                    <div class="absolute top-2 right-2 text-[11px] uppercase tracking-wider text-white/80 bg-black/30 px-2 py-1 rounded-full">
                                      {{ elementRegistry[element.type]?.label || element.type }}
                                    </div>
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
                                          class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold"
                                          :style="{
                                            backgroundColor: element.data.iconBackground || '#f97316',
                                            color: element.data.iconColor || '#ffffff',
                                            borderRadius: element.data.badgeShape === 'rounded' ? '16px' : element.data.badgeShape === 'pill' ? '9999px' : '9999px'
                                          }"
                                        >
                                          <i :class="element.data.icon || 'fa-solid fa-check'"></i>
                                        </span>
                                        <span>{{ element.data.text }}</span>
                                      </template>
                                      <template v-else-if="element.type === 'spacer'"></template>
                                      <template v-else>{{ element.data.text }}</template>
                                    </component>
                                  </div>
                                </template>
                                <template v-else>
                                  <div
                                    class="relative flex flex-col"
                                    :class="heroStackContentClasses(block)"
                                    :style="heroStackColumnStyle(block)"
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
                                        class="relative"
                                      >
                                        <div
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
                                          draggable="true"
                                          @dragstart="onHeroElementDragStart(block.id, element.id, $event)"
                                          @dragend="onHeroElementDragEnd"
                                          @click.stop="selectElement(block.id, element.id)"
                                        >
                                          <div
                                            v-if="canvas.showOverlays"
                                            class="absolute inset-0 rounded-2xl border border-dashed pointer-events-none"
                                            :class="isElementSelected(element) && selectedBlockId === block.id ? 'border-orange-300' : 'border-white/30'"
                                          ></div>
                                          <div class="absolute top-2 right-2 text-[11px] uppercase tracking-wider text-white/80 bg-black/30 px-2 py-1 rounded-full">
                                            {{ elementRegistry[element.type]?.label || element.type }}
                                          </div>
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
                                                class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold"
                                                :style="{
                                                  backgroundColor: element.data.iconBackground || '#f97316',
                                                  color: element.data.iconColor || '#ffffff',
                                                  borderRadius: element.data.badgeShape === 'rounded' ? '16px' : element.data.badgeShape === 'pill' ? '9999px' : '9999px'
                                                }"
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
                                  <div class="hidden lg:flex items-center justify-center">
                                    <div v-if="block.data.showRightImage" class="relative">
                                      <img :src="block.data.previewImage" alt="preview" class="w-80 h-80 object-cover rounded-3xl shadow-2xl" />
                                      <div class="absolute inset-0 rounded-3xl ring-4 ring-white/20"></div>
                                    </div>
                                  </div>
                                </template>
                              </div>
                              <svg v-if="block.data.waveEnabled" class="w-full" height="80" viewBox="0 0 1440 80" preserveAspectRatio="none">
                                <path :fill="block.data.waveColor || '#f9f4e5'" d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32V80H0Z"></path>
                              </svg>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'categories'">
                            <div class="py-14 px-10" :style="{ backgroundColor: block.data.backgroundColor || '#f9f4e5' }">
                              <div class="text-center max-w-3xl mx-auto">
                                <h2 class="text-3xl font-bold text-gray-900">{{ block.data.heading }}</h2>
                                <p class="text-orange-600 font-semibold mt-1">{{ block.data.subheading }}</p>
                                <p class="text-gray-600 mt-3">{{ block.data.description }}</p>
                              </div>
                              <div class="grid sm:grid-cols-2 gap-6 mt-10">
                                <div v-for="n in 4" :key="n" class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                                  <div class="w-20 h-20 rounded-full bg-orange-100 mx-auto mb-4"></div>
                                  <h3 class="font-semibold text-lg text-gray-900 text-center">Категория {{ n }}</h3>
                                  <p class="text-sm text-gray-500 text-center">Управляется в админке категорий</p>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'menu'">
                            <div class="py-16 px-10 bg-gradient-to-br from-orange-50 to-red-50">
                              <div class="text-center max-w-2xl mx-auto">
                                <h2 class="text-3xl font-bold text-gray-900">{{ block.data.heading }}</h2>
                                <p class="text-gray-600 mt-3">{{ block.data.description }}</p>
                              </div>
                              <div class="grid md:grid-cols-3 gap-6 mt-12">
                                <div v-for="n in 3" :key="n" class="bg-white rounded-2xl shadow p-5 space-y-4">
                                  <div class="h-32 rounded-xl bg-gray-100"></div>
                                  <div class="font-semibold text-gray-900">Популярное блюдо {{ n }}</div>
                                  <p class="text-sm text-gray-500">Описание и цена подтягиваются из каталога</p>
                                  <div class="flex items-center justify-between text-sm text-gray-600">
                                    <span>450 ₽</span>
                                    <span class="inline-flex items-center space-x-1 text-orange-600">
                                      <i class="fa-solid fa-star"></i>
                                      <span>Хит</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'delivery'">
                            <div class="py-16 px-10" :style="{ backgroundColor: block.data.backgroundColor || '#fff7ed' }">
                              <div class="grid lg:grid-cols-2 gap-10 items-start">
                                <div class="space-y-4">
                                  <h2 class="text-3xl font-bold text-gray-900">{{ block.data.heading }}</h2>
                                  <p class="text-gray-600">{{ block.data.description }}</p>
                                  <ul class="space-y-3">
                                    <li
                                      v-for="feature in block.data.features"
                                      :key="feature"
                                      class="flex items-start space-x-3"
                                    >
                                      <span class="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">
                                        <i class="fa-solid fa-check"></i>
                                      </span>
                                      <span class="text-gray-700 text-sm">{{ feature }}</span>
                                    </li>
                                  </ul>
                                  <div class="flex items-center space-x-4 text-sm text-gray-600 pt-4">
                                    <span class="inline-flex items-center space-x-2"><i class="fa-solid fa-phone"></i><span>{{ block.data.contactPhone }}</span></span>
                                    <span class="inline-flex items-center space-x-2"><i class="fa-solid fa-box"></i><span>Мин. заказ {{ block.data.minOrder }} ₽</span></span>
                                  </div>
                                </div>
                                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                                  <div class="bg-gradient-to-r from-orange-400 to-red-500 h-12"></div>
                                  <div class="p-6 space-y-4">
                                    <h3 class="font-semibold text-gray-900">Трекинг курьера</h3>
                                    <div class="space-y-2">
                                      <div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-orange-500 to-red-500 w-3/4"></div>
                                      </div>
                                      <p class="text-xs text-gray-500">Курьер уже рядом – доставит заказ в течение 10 минут</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'reviews'">
                            <div class="py-16 px-10 bg-gradient-to-br from-orange-50 to-red-50">
                              <div class="text-center max-w-2xl mx-auto">
                                <h2 class="text-3xl font-bold text-gray-900">{{ block.data.heading }}</h2>
                                <p class="text-gray-600 mt-3">{{ block.data.description }}</p>
                              </div>
                              <div class="grid md:grid-cols-3 gap-6 mt-12">
                                <div v-for="n in 3" :key="n" class="bg-white rounded-2xl shadow p-6 space-y-3">
                                  <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 rounded-full bg-orange-100"></div>
                                    <div>
                                      <div class="font-semibold text-gray-900">Клиент {{ n }}</div>
                                      <div class="text-xs text-gray-500">Постоянный клиент</div>
                                    </div>
                                  </div>
                                  <div class="flex space-x-1 text-orange-500 text-sm">
                                    <i v-for="star in 5" :key="star" class="fa-solid fa-star"></i>
                                  </div>
                                  <p class="text-sm text-gray-600">«Каждый заказ приезжает горячим. Любим за сервис и бонусы»</p>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'map'">
                            <div class="py-16 px-10 bg-white">
                              <div class="grid lg:grid-cols-3 gap-8">
                                <div class="lg:col-span-2">
                                  <div class="aspect-[3/2] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                                    <iframe
                                      :src="block.data.iframeSrc"
                                      width="100%"
                                      height="100%"
                                      style="border:0"
                                      allowfullscreen
                                      loading="lazy"
                                    ></iframe>
                                  </div>
                                </div>
                                <div class="space-y-4">
                                  <h2 class="text-3xl font-bold text-gray-900">{{ block.data.heading }}</h2>
                                  <p class="text-gray-600">{{ block.data.description }}</p>
                                  <div class="space-y-3 text-sm text-gray-700">
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-location-dot text-orange-500"></i>
                                      <span>{{ block.data.address }}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-clock text-orange-500"></i>
                                      <span>{{ block.data.workHours }}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-phone text-orange-500"></i>
                                      <span>{{ block.data.phone }}</span>
                                    </div>
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
                  <div v-if="selectionBreadcrumbs.length" class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <template v-for="(crumb, index) in selectionBreadcrumbs" :key="crumb.type + '-' + crumb.key">
                      <button
                        class="inline-flex items-center space-x-1 px-2 py-1 rounded-full border border-gray-200 hover:border-orange-400 hover:text-orange-600 transition"
                        @click="focusBreadcrumb(crumb)"
                        type="button"
                      >
                        <i :class="crumb.type === 'block' ? 'fa-solid fa-layer-group' : 'fa-solid fa-pen-nib'"></i>
                        <span>{{ crumb.label }}</span>
                      </button>
                      <span v-if="index < selectionBreadcrumbs.length - 1" class="text-gray-400">/</span>
                    </template>
                  </div>
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
                      <template v-else-if="field.type === 'number'">
                        <input
                          type="number"
                          :value="getFieldValue(selectedBlock, field)"
                          @input="updateBlockField(field, $event.target.value)"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                          :min="field.min"
                          :max="field.max"
                          :step="field.step || '1'"
                        />
                      </template>
                      <template v-else-if="field.type === 'range'">
                        <div class="flex items-center space-x-3">
                          <input
                            type="range"
                            class="flex-1 accent-orange-500"
                            :value="getFieldValue(selectedBlock, field)"
                            @input="updateBlockField(field, $event.target.value)"
                            :min="field.min ?? 0"
                            :max="field.max ?? 100"
                            :step="field.step ?? 1"
                          />
                          <span class="text-xs text-gray-500 w-12 text-right">{{ getFieldValue(selectedBlock, field) }}</span>
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
                      <template v-else-if="field.type === 'number'">
                        <input
                          type="number"
                          :value="getElementFieldValue(currentElement, field)"
                          @input="updateElementField(field, $event.target.value)"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                          :min="field.min"
                          :max="field.max"
                          :step="field.step || '1'"
                        />
                      </template>
                      <template v-else-if="field.type === 'range'">
                        <div class="flex items-center space-x-3">
                          <input
                            type="range"
                            class="flex-1 accent-orange-500"
                            :value="getElementFieldValue(currentElement, field)"
                            @input="updateElementField(field, $event.target.value)"
                            :min="field.min ?? 0"
                            :max="field.max ?? 100"
                            :step="field.step ?? 1"
                          />
                          <span class="text-xs text-gray-500 w-12 text-right">{{ getElementFieldValue(currentElement, field) }}</span>
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

      const heroCanvasRefs = new Map();
      const freeformDrag = reactive({
        active: false,
        blockId: null,
        elementId: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
        containerRect: null
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

      const selectionBreadcrumbs = computed(() => {
        const crumbs = [];
        const block = selectedBlock.value;
        if (block) {
          crumbs.push({
            key: block.id,
            type: 'block',
            label: block.name || block.type
          });
          if (currentElement.value) {
            crumbs.push({
              key: currentElement.value.id,
              type: 'element',
              blockId: block.id,
              label: elementRegistry[currentElement.value.type]?.label || currentElement.value.type
            });
          }
        }
        return crumbs;
      });

      function blockWrapperClasses(block) {
        const classes = [
          'relative transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden',
          'shadow-lg mb-6'
        ];
        if (selectedBlockId.value === block.id) {
          classes.push('ring-2 ring-orange-400 ring-offset-2 ring-offset-white');
        } else {
          classes.push('hover:ring-2 hover:ring-orange-200 hover:shadow-xl');
        }
        return classes;
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
            return 'p';
          default:
            return 'div';
        }
      }

      function heroElementProps(block, element) {
        const data = element.data || {};
        const layoutFree = isHeroLayoutFree(block);
        const classes = [];
        const style = {};

        if (['heading', 'subheading', 'paragraph', 'feature'].includes(element.type)) {
          classes.push(data.fontSize || (element.type === 'heading' ? 'text-4xl' : element.type === 'subheading' ? 'text-2xl' : 'text-base'));
          if (data.align === 'center') classes.push('text-center');
          else if (data.align === 'right') classes.push('text-right');
          else classes.push('text-left');

          style.color = data.color || (element.type === 'subheading' ? '#fbbf24' : '#ffffff');
          style.marginTop = layoutFree ? '0px' : (data.marginTop || '0px');
          style.marginBottom = layoutFree ? '0px' : (data.marginBottom || '16px');
          style.fontWeight = data.fontWeight || (element.type === 'heading' ? '700' : element.type === 'feature' ? '600' : '500');
          style.lineHeight = data.lineHeight || undefined;
          style.letterSpacing = data.letterSpacing || undefined;
          style.maxWidth = data.maxWidth || undefined;
          if (data.customFontSize) style.fontSize = data.customFontSize;
          if (data.backgroundColor && data.backgroundColor !== 'transparent') {
            style.backgroundColor = data.backgroundColor;
          }
          if (data.paddingX) {
            style.paddingLeft = data.paddingX;
            style.paddingRight = data.paddingX;
          }
          if (data.paddingY) {
            style.paddingTop = data.paddingY;
            style.paddingBottom = data.paddingY;
          }
          if (data.width && data.width !== 'auto') {
            style.width = data.width;
          }
          style.boxShadow = elementShadowStyles[data.shadow || 'none'];
        }

        if (element.type === 'button') {
          classes.push('inline-flex items-center space-x-2 transition font-semibold rounded-full shadow');
          if (data.align === 'center') classes.push('mx-auto');
          else if (data.align === 'right') classes.push('ml-auto');
          else classes.push('mr-auto');

          style.marginTop = layoutFree ? '0px' : (data.marginTop || '0px');
          style.marginBottom = layoutFree ? '0px' : (data.marginBottom || '0px');
          style.paddingLeft = data.paddingX || '24px';
          style.paddingRight = data.paddingX || '24px';
          style.paddingTop = data.paddingY || '14px';
          style.paddingBottom = data.paddingY || '14px';
          style.borderRadius = data.borderRadius || '9999px';
          style.fontWeight = data.fontWeight || '600';
          style.backgroundColor = data.backgroundColor || (data.style === 'secondary' ? 'transparent' : '#ffffff');
          style.color = data.textColor || (data.style === 'secondary' ? '#ffffff' : '#1f2937');
          style.border = `2px solid ${data.borderColor || (data.style === 'secondary' ? '#ffffff' : 'transparent')}`;
          style.boxShadow = elementShadowStyles[data.shadow || 'soft'];
          if (data.width && data.width !== 'auto') {
            style.width = data.width;
          }
        }

        if (element.type === 'image') {
          if (data.align === 'center') classes.push('mx-auto');
          else if (data.align === 'right') classes.push('ml-auto');
          else classes.push('mr-auto');
          style.marginTop = layoutFree ? '0px' : (data.marginTop || '0px');
          style.marginBottom = layoutFree ? '0px' : (data.marginBottom || '16px');
          if (data.width && data.width !== 'auto') {
            style.width = data.width;
          }
        }

        if (element.type === 'spacer') {
          style.height = data.height || '24px';
          style.marginTop = layoutFree ? '0px' : (data.marginTop || '0px');
          style.marginBottom = layoutFree ? '0px' : (data.marginBottom || '0px');
          if (data.width) {
            style.width = data.width;
          }
        }

        if (element.type === 'feature') {
          classes.push('flex items-center space-x-3');
        }

        return {
          class: classes.join(' '),
          style
        };
      }

      function heroImageProps(element) {
        const data = element.data || {};
        const width = data.width && data.width !== 'auto' ? data.width : (data.width === 'auto' ? 'auto' : '320px');
        const height = data.height || 'auto';
        const shadow = elementShadowStyles[data.shadow || 'soft'];
        return {
          src: data.src || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10',
          alt: data.alt || 'Изображение',
          style: {
            width,
            height,
            borderRadius: data.borderRadius || '16px',
            objectFit: data.objectFit || 'cover',
            boxShadow: shadow,
            border: `${data.borderWidth || '0px'} solid ${data.borderColor || 'transparent'}`
          }
        };
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
        if (block.type === 'hero') {
          ensureHeroFreeformDefaults(block);
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

      function focusBreadcrumb(crumb) {
        if (crumb.type === 'block') {
          selectBlock(crumb.key);
        } else if (crumb.type === 'element') {
          const targetBlockId = crumb.blockId || selectedBlockId.value;
          if (targetBlockId) {
            selectElement(targetBlockId, crumb.key);
          }
        }
      }

      function setHeroCanvasRef(blockId, el) {
        if (el) {
          heroCanvasRefs.set(blockId, el);
        } else {
          heroCanvasRefs.delete(blockId);
        }
      }

      function isHeroLayoutFree(block) {
        return (block?.data?.layoutMode || 'stacked') === 'free';
      }

      function formatCssUnit(value, fallback) {
        if (value === undefined || value === null || value === '') {
          return fallback;
        }
        if (typeof value === 'number' && Number.isFinite(value)) {
          return `${value}px`;
        }
        const str = String(value).trim();
        if (/px$|%$|rem$|vh$|vw$/.test(str)) {
          return str;
        }
        const numeric = Number(str);
        return Number.isFinite(numeric) ? `${numeric}px` : fallback;
      }

      function heroCanvasSurfaceStyle(block) {
        const data = block?.data || {};
        const style = {
          padding: data.canvasPadding || '96px 72px',
          minHeight: formatCssUnit(data.canvasHeight, '640px')
        };
        return style;
      }

      function heroStackContentClasses(block) {
        const align = block?.data?.contentAlign || 'left';
        if (align === 'center') return 'items-center text-center';
        if (align === 'right') return 'items-end text-right';
        return 'items-start text-left';
      }

      function heroStackColumnStyle(block) {
        const data = block?.data || {};
        const style = {
          gap: data.stackGap || '24px',
          maxWidth: data.contentWidth || '560px'
        };
        if (data.contentAlign === 'center') {
          style.marginLeft = 'auto';
          style.marginRight = 'auto';
        } else if (data.contentAlign === 'right') {
          style.marginLeft = 'auto';
        }
        return style;
      }

      function onHeroFreeformPointerDown(blockId, element, event) {
        if (event.button !== undefined && event.button !== 0) return;
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block || !isHeroLayoutFree(block)) return;
        const canvasEl = heroCanvasRefs.get(blockId);
        if (!canvasEl) return;

        event.preventDefault();
        event.stopPropagation();
        selectElement(blockId, element.id);

        const rect = canvasEl.getBoundingClientRect();
        freeformDrag.active = true;
        freeformDrag.blockId = blockId;
        freeformDrag.elementId = element.id;
        freeformDrag.startX = event.clientX;
        freeformDrag.startY = event.clientY;
        freeformDrag.initialX = coerceNumber(element.data?.positionX, 0);
        freeformDrag.initialY = coerceNumber(element.data?.positionY, 0);
        freeformDrag.containerRect = rect;

        document.addEventListener('pointermove', onHeroFreeformPointerMove);
        document.addEventListener('pointerup', onHeroFreeformPointerUp, { once: true });
      }

      function onHeroFreeformPointerMove(event) {
        if (!freeformDrag.active || !freeformDrag.containerRect) return;
        const block = pageBlocks.value.find(b => b.id === freeformDrag.blockId);
        if (!block) return;
        const element = block.data?.elements?.find(el => el.id === freeformDrag.elementId);
        if (!element) return;
        const rect = freeformDrag.containerRect;
        const deltaX = ((event.clientX - freeformDrag.startX) / rect.width) * 100;
        const deltaY = ((event.clientY - freeformDrag.startY) / rect.height) * 100;
        element.data.positionX = clamp(freeformDrag.initialX + deltaX, 0, 100);
        element.data.positionY = clamp(freeformDrag.initialY + deltaY, 0, 100);
      }

      function onHeroFreeformPointerUp() {
        if (!freeformDrag.active) return;
        document.removeEventListener('pointermove', onHeroFreeformPointerMove);
        freeformDrag.active = false;
        freeformDrag.blockId = null;
        freeformDrag.elementId = null;
        freeformDrag.containerRect = null;
      }

      function heroDropIsActive(blockId, index) {
        return Boolean(heroDrag.elementId) && heroDrag.targetBlockId === blockId && heroDrag.dropIndex === index;
      }

      function heroDropWrapperClass(blockId, index) {
        if (!heroDrag.elementId) {
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
        const classes = ['relative group rounded-2xl transition pointer-events-auto'];
        const isSelected = selectedBlockId.value === block.id && isElementSelected(element);
        if (isHeroLayoutFree(block)) {
          classes.push('cursor-move');
          if (isSelected) {
            classes.push('ring-2 ring-orange-300 bg-white/10 shadow-xl');
          }
        } else {
          classes.push('px-2 py-1 hover:bg-white/10 hover:bg-opacity-30');
          if (isSelected) {
            classes.push('ring-2 ring-orange-300 bg-white/10 shadow-lg');
          } else {
            classes.push('ring-1 ring-transparent hover:ring-orange-200');
          }
        }
        return classes.join(' ');
      }

      function heroElementWrapperStyle(block, element) {
        const data = element.data || {};
        const style = {};
        const zIndex = Number(data.zIndex);
        if (Number.isFinite(zIndex)) {
          style.zIndex = zIndex;
        }
        if (data.width && data.width !== 'auto') {
          style.width = data.width;
        }
        if (isHeroLayoutFree(block)) {
          style.position = 'absolute';
          style.left = `${normalizePercent(data.positionX)}%`;
          style.top = `${normalizePercent(data.positionY)}%`;
        }
        return style;
      }

      function normalizePercent(value) {
        return clamp(coerceNumber(value, 0), 0, 100);
      }

      function coerceNumber(value, fallback = 0) {
        if (typeof value === 'number' && Number.isFinite(value)) {
          return value;
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
      }

      function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
      }

      function onHeroElementDragStart(blockId, elementId, event = null) {
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
        heroDrag.targetBlockId = blockId;
        heroDrag.dropIndex = index;
      }

      function onHeroElementDragLeave(blockId, index) {
        if (!heroDrag.elementId) return;
        if (heroDrag.targetBlockId === blockId && heroDrag.dropIndex === index) {
          heroDrag.dropIndex = null;
        }
      }

      function onHeroElementDrop(blockId, index) {
        if (!heroDrag.elementId) return;
        const sourceBlock = pageBlocks.value.find(b => b.id === heroDrag.sourceBlockId);
        const targetBlock = pageBlocks.value.find(b => b.id === blockId);
        if (!sourceBlock || !targetBlock || targetBlock.type !== 'hero') {
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
        if (block.type === 'hero') {
          ensureHeroBlockConsistency(block);
          ensureHeroFreeformDefaults(block);
        }
        currentElementId.value = element.id;
        elementPaletteOpen.value = false;
      }

      function removeElement(blockId, index) {
        const block = pageBlocks.value.find(b => b.id === blockId);
        if (!block || !Array.isArray(block.data.elements)) return;
        const [removed] = block.data.elements.splice(index, 1);
        if (removed && block.type === 'hero') {
          reconcileHeroBlockAfterElementRemoval(block, removed.type);
        }
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
        if (field.type === 'number' || field.type === 'range') {
          return value ?? (field.type === 'range' ? field.min ?? 0 : '');
        }
        return value ?? '';
      }

      function updateBlockField(field, rawValue) {
        const block = selectedBlock.value;
        if (!block) return;
        const value = field.type === 'list'
          ? String(rawValue || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean)
          : (field.type === 'number' || field.type === 'range')
            ? coerceNumber(rawValue, field.type === 'range' ? field.min ?? 0 : 0)
            : rawValue;
        block.data[field.key] = value;
        if (block.type === 'hero') {
          applyHeroBlockFieldToElement(block, field.key, value);
          if (field.key === 'layoutMode' && value === 'free') {
            ensureHeroFreeformDefaults(block);
          }
        }
      }

      function getElementFieldValue(element, field) {
        if (!element || !element.data) return '';
        const value = element.data[field.key];
        if (field.type === 'number' || field.type === 'range') {
          return value ?? (field.type === 'range' ? field.min ?? 0 : 0);
        }
        return value ?? '';
      }

      function updateElementField(field, value) {
        const element = currentElement.value;
        if (!element) return;
        if (field.type === 'number' || field.type === 'range') {
          element.data[field.key] = coerceNumber(value, field.type === 'range' ? field.min ?? 0 : 0);
        } else {
          element.data[field.key] = value;
        }
        const block = selectedBlock.value;
        if (block) {
          applyHeroElementFieldToBlock(block, element, field.key, element.data[field.key]);
        }
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
          if (block.type === 'hero') {
            ensureHeroBlockConsistency(block);
          }
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
          return;
        }
        if (!blocks.some(block => block.id === selectedBlockId.value)) {
          selectedBlockId.value = blocks[0].id;
        }
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
      });

      onUnmounted(() => {
        document.removeEventListener('pointermove', onHeroFreeformPointerMove);
      });

      onMounted(async () => {
        await loadSettings();
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
        dropIndex,
        selectedBlockId,
        selectedBlock,
        selectedBlockDefinition,
        inspectorSections,
        elementPalette,
        elementPaletteOpen,
        selectionBreadcrumbs,
        currentElement,
        currentElementDefinition,
        elementRegistry,
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
        heroCanvasSurfaceStyle,
        heroStackContentClasses,
        heroStackColumnStyle,
        heroElementProps,
        heroImageProps,
        heroElementWrapperClasses,
        heroElementWrapperStyle,
        heroDropWrapperClass,
        heroDropLabelClass,
        isHeroLayoutFree,
        setHeroCanvasRef,
        onHeroElementDragStart,
        onHeroElementDragEnd,
        onHeroElementDragOver,
        onHeroElementDragLeave,
        onHeroElementDrop,
        onHeroFreeformPointerDown,
        selectElement,
        isElementSelected,
        addElement,
        removeElement,
        moveElement,
        toggleElementPalette,
        focusBreadcrumb,
        getFieldValue,
        updateBlockField,
        onBlockFileSelected,
        onFileSelected,
        getElementFieldValue,
        updateElementField
      };
    }
  };
})();
