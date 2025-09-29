// Block definition: delivery
(function(){
  window.SiteBuilderBlocks = window.SiteBuilderBlocks || {};
  window.SiteBuilderBlocks['delivery'] = {
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
        backgroundMode: 'solid',
        backgroundColor: '#fff7ed',
        backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #fde68a 100%)',
        backgroundImage: '',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overlayColor: '',
        overlayBlur: '0px',
        sectionPaddingY: '80px',
        sectionPaddingX: '40px',
        sectionBorderRadius: '0px',
        sectionShadow: '',
        headingColor: '#111827',
        headingFontSize: '36px',
        headingFontWeight: '700',
        headingFontFamily: '',
        textColor: '#4b5563',
        layout: 'two-column',
        illustrationImage: '',
        showTrackingCard: true,
        trackingTitle: 'Трекинг курьера',
        trackingDescription: 'Курьер уже рядом – доставит заказ в течение 10 минут',
        trackingProgress: 75,
        cardBackground: '#ffffff',
        cardBorderRadius: '24px',
        cardShadow: '0 20px 50px rgba(15,23,42,0.1)',
        featureIconBackground: '#f97316',
        featureIconColor: '#ffffff',
        featureIconShape: 'circle',
        featureTextColor: '#1f2937',
        contactPhone: '+7 (900) 000-00-00',
        minOrder: '1500',
        contactTextColor: '#4b5563',
        buttonVisible: true,
        buttonText: 'Условия доставки',
        buttonStyle: 'secondary',
        buttonAction: 'link',
        buttonLink: '/delivery',
        buttonBackground: '#111827',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: '14px',
        buttonAlign: 'left',
        buttonShadow: '0 16px 36px rgba(15,23,42,0.18)'
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
            { key: 'sectionPaddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '80px' },
            { key: 'sectionPaddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '40px' },
            { key: 'sectionBorderRadius', label: 'Скругление секции', type: 'text', placeholder: '0px' },
            { key: 'sectionShadow', label: 'Тень секции', type: 'text', placeholder: '0 20px 50px rgba(...)' }
          ]
        },
        {
          label: 'Заголовок и текст',
          fields: [
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'headingFontSize', label: 'Размер заголовка', type: 'text', placeholder: '36px' },
            { key: 'headingFontWeight', label: 'Начертание заголовка', type: 'text', placeholder: '700' },
            { key: 'headingFontFamily', label: 'Шрифт заголовка', type: 'text', placeholder: 'Manrope, sans-serif' },
            { key: 'textColor', label: 'Цвет описаний', type: 'color' },
            {
              key: 'layout',
              label: 'Макет',
              type: 'select',
              options: [
                { value: 'two-column', label: 'Две колонки' },
                { value: 'stacked', label: 'Столбцом' },
                { value: 'spotlight', label: 'С иллюстрацией сверху' }
              ]
            },
            { key: 'illustrationImage', label: 'Изображение/иллюстрация', type: 'image' }
          ]
        },
        {
          label: 'Преимущества',
          fields: [
            { key: 'features', label: 'Список преимуществ', type: 'list', placeholder: 'Каждое с новой строки' },
            { key: 'featureIconBackground', label: 'Фон иконки', type: 'color' },
            { key: 'featureIconColor', label: 'Цвет иконки', type: 'color' },
            {
              key: 'featureIconShape',
              label: 'Форма иконки',
              type: 'select',
              options: [
                { value: 'circle', label: 'Круг' },
                { value: 'rounded', label: 'Скруглённый квадрат' },
                { value: 'square', label: 'Квадрат' }
              ]
            },
            { key: 'featureTextColor', label: 'Цвет текста преимуществ', type: 'color' }
          ]
        },
        {
          label: 'Трекинг и карточка',
          fields: [
            { key: 'showTrackingCard', label: 'Показывать карточку трекинга', type: 'toggle' },
            { key: 'trackingTitle', label: 'Заголовок трекинга', type: 'text', placeholder: 'Трекинг курьера' },
            { key: 'trackingDescription', label: 'Описание трекинга', type: 'textarea', rows: 3 },
            { key: 'trackingProgress', label: 'Прогресс (%)', type: 'text', placeholder: '75' },
            { key: 'cardBackground', label: 'Фон карточки', type: 'color' },
            { key: 'cardBorderRadius', label: 'Скругление карточки', type: 'text', placeholder: '24px' },
            { key: 'cardShadow', label: 'Тень карточки', type: 'text', placeholder: '0 20px 50px rgba(...)' }
          ]
        },
        {
          label: 'Контакты и CTA',
          fields: [
            { key: 'contactPhone', label: 'Телефон курьера', type: 'text', placeholder: '+7 (900) 000-00-00' },
            { key: 'minOrder', label: 'Минимальный заказ', type: 'text', placeholder: '1500' },
            { key: 'contactTextColor', label: 'Цвет текста контактов', type: 'color' },
            { key: 'buttonVisible', label: 'Показывать кнопку', type: 'toggle' },
            { key: 'buttonText', label: 'Текст кнопки', type: 'text', placeholder: 'Условия доставки' },
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
            { key: 'buttonLink', label: 'Ссылка', type: 'text', placeholder: '/delivery' },
            { key: 'buttonBackground', label: 'Фон кнопки', type: 'color' },
            { key: 'buttonTextColor', label: 'Цвет текста', type: 'color' },
            { key: 'buttonBorderRadius', label: 'Скругление', type: 'text', placeholder: '14px' },
            { key: 'buttonAlign', label: 'Выравнивание', type: 'select', options: [
              { value: 'left', label: 'Слева' },
              { value: 'center', label: 'По центру' },
              { value: 'right', label: 'Справа' }
            ] },
            { key: 'buttonShadow', label: 'Тень кнопки', type: 'text', placeholder: '0 16px 36px rgba(...)' }
          ]
        }
      ]
    };
})();
