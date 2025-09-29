// Block definition: menu
(function(){
  window.SiteBuilderBlocks = window.SiteBuilderBlocks || {};
  window.SiteBuilderBlocks['menu'] = {
      name: 'Меню',
      icon: 'fa-solid fa-utensils',
      defaultData: () => ({
        heading: 'Популярные блюда',
        description: 'Выберите категорию и сформируйте свой сет',
        backgroundMode: 'gradient',
        backgroundColor: '#fff7ed',
        backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)',
        backgroundImage: '',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overlayColor: 'rgba(255,247,237,0.75)',
        overlayBlur: '0px',
        sectionPaddingY: '72px',
        sectionPaddingX: '40px',
        headingColor: '#111827',
        headingFontSize: '36px',
        headingFontWeight: '700',
        headingFontFamily: '',
        descriptionColor: '#4b5563',
        descriptionFontSize: '18px',
        descriptionMaxWidth: '640px',
        textAlign: 'center',
        showSearch: true,
        showFilters: true,
        showCategoryTabs: true,
        highlightHits: true,
        cardsPerRow: '3',
        cardMinWidth: '260px',
        cardBackground: '#ffffff',
        cardTextColor: '#1f2937',
        cardDescriptionColor: '#6b7280',
        cardBorderRadius: '24px',
        cardShadow: '0 18px 40px rgba(15,23,42,0.08)',
        cardBorderColor: 'rgba(255,255,255,0)',
        cardImageHeight: '180px',
        priceColor: '#f97316',
        tagTextColor: '#f97316',
        tagBackground: 'rgba(249,115,22,0.12)',
        filtersBackground: '#ffffff',
        filtersTextColor: '#1f2937',
        filtersShadow: '0 14px 30px rgba(15,23,42,0.08)',
        buttonVisible: false,
        buttonText: 'Открыть меню',
        buttonStyle: 'primary',
        buttonAction: 'scrollMenu',
        buttonLink: '',
        buttonBackground: '#f97316',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: '999px',
        buttonAlign: 'center',
        buttonShadow: '0 16px 40px rgba(249,115,22,0.35)'
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
          label: 'Фон и отступы',
          fields: [
            {
              key: 'backgroundMode',
              label: 'Тип фона',
              type: 'select',
              options: [
                { value: 'solid', label: 'Цвет' },
                { value: 'gradient', label: 'Градиент' },
                { value: 'image', label: 'Изображение' }
              ]
            },
            { key: 'backgroundColor', label: 'Фон блока', type: 'color' },
            { key: 'backgroundGradient', label: 'CSS градиент', type: 'text', placeholder: 'linear-gradient(...)' },
            { key: 'backgroundImage', label: 'Фоновое изображение', type: 'image' },
            { key: 'backgroundPosition', label: 'Позиция фона', type: 'text', placeholder: 'center center' },
            { key: 'backgroundSize', label: 'Размер фона', type: 'text', placeholder: 'cover' },
            { key: 'backgroundRepeat', label: 'Повторение', type: 'text', placeholder: 'no-repeat' },
            { key: 'overlayColor', label: 'Цвет оверлея', type: 'color' },
            { key: 'overlayBlur', label: 'Размытие оверлея', type: 'text', placeholder: '0px' },
            { key: 'sectionPaddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '72px' },
            { key: 'sectionPaddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '40px' }
          ]
        },
        {
          label: 'Заголовки и описание',
          fields: [
            { key: 'textAlign', label: 'Выравнивание', type: 'select', options: [
              { value: 'left', label: 'Слева' },
              { value: 'center', label: 'По центру' },
              { value: 'right', label: 'Справа' }
            ] },
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'headingFontSize', label: 'Размер заголовка', type: 'text', placeholder: '36px' },
            { key: 'headingFontWeight', label: 'Начертание заголовка', type: 'text', placeholder: '700' },
            { key: 'headingFontFamily', label: 'Шрифт заголовка', type: 'text', placeholder: 'Manrope, sans-serif' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'descriptionFontSize', label: 'Размер описания', type: 'text', placeholder: '18px' },
            { key: 'descriptionMaxWidth', label: 'Макс. ширина описания', type: 'text', placeholder: '640px' }
          ]
        },
        {
          label: 'Функции',
          fields: [
            { key: 'showSearch', label: 'Показывать поиск', type: 'toggle' },
            { key: 'showFilters', label: 'Показывать фильтры', type: 'toggle' },
            { key: 'showCategoryTabs', label: 'Вкладки категорий', type: 'toggle' },
            { key: 'highlightHits', label: 'Подсвечивать хиты', type: 'toggle' },
            { key: 'cardsPerRow', label: 'Карточек в ряд (превью)', type: 'text', placeholder: '3' }
          ]
        },
        {
          label: 'Карточки блюд',
          fields: [
            { key: 'cardMinWidth', label: 'Мин. ширина карточки', type: 'text', placeholder: '260px' },
            { key: 'cardBackground', label: 'Фон карточки', type: 'color' },
            { key: 'cardTextColor', label: 'Цвет названия', type: 'color' },
            { key: 'cardDescriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'cardBorderRadius', label: 'Скругление карточки', type: 'text', placeholder: '24px' },
            { key: 'cardShadow', label: 'Тень карточки', type: 'text', placeholder: '0 18px 40px rgba(...)' },
            { key: 'cardBorderColor', label: 'Цвет границы', type: 'color' },
            { key: 'cardImageHeight', label: 'Высота изображения', type: 'text', placeholder: '180px' },
            { key: 'priceColor', label: 'Цвет цены', type: 'color' },
            { key: 'tagTextColor', label: 'Цвет бейджа', type: 'color' },
            { key: 'tagBackground', label: 'Фон бейджа', type: 'color' }
          ]
        },
        {
          label: 'Поиск и фильтры',
          fields: [
            { key: 'filtersBackground', label: 'Фон панели', type: 'color' },
            { key: 'filtersTextColor', label: 'Цвет текста', type: 'color' },
            { key: 'filtersShadow', label: 'Тень панели', type: 'text', placeholder: '0 14px 30px rgba(...)' }
          ]
        },
        {
          label: 'Кнопка',
          fields: [
            { key: 'buttonVisible', label: 'Показывать кнопку', type: 'toggle' },
            { key: 'buttonText', label: 'Текст кнопки', type: 'text', placeholder: 'Открыть меню' },
            {
              key: 'buttonStyle',
              label: 'Стиль',
              type: 'select',
              options: [
                { value: 'primary', label: 'Основная' },
                { value: 'secondary', label: 'Вторичная' },
                { value: 'outline', label: 'Контурная' },
                { value: 'link', label: 'Ссылка' }
              ]
            },
            {
              key: 'buttonAction',
              label: 'Действие',
              type: 'select',
              options: [
                { value: 'scrollMenu', label: 'Прокрутка к меню' },
                { value: 'openCart', label: 'Открыть корзину' },
                { value: 'link', label: 'Ссылка' }
              ]
            },
            { key: 'buttonLink', label: 'Ссылка', type: 'text', placeholder: '#menu' },
            { key: 'buttonBackground', label: 'Фон кнопки', type: 'color' },
            { key: 'buttonTextColor', label: 'Цвет текста', type: 'color' },
            { key: 'buttonBorderRadius', label: 'Скругление', type: 'text', placeholder: '999px' },
            { key: 'buttonAlign', label: 'Выравнивание', type: 'select', options: [
              { value: 'left', label: 'Слева' },
              { value: 'center', label: 'По центру' },
              { value: 'right', label: 'Справа' }
            ] },
            { key: 'buttonShadow', label: 'Тень кнопки', type: 'text', placeholder: '0 16px 40px rgba(...)' }
          ]
        }
      ]
    };
})();
