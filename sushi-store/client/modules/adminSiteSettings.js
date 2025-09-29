// Админ-модуль: Настройки сайта и визуальный конструктор главной страницы
// Вариант интерфейса восстановлен по состоянию после запроса с расширенным управлением блоками.
(function(){
  const { ref, reactive, computed, watch, onMounted } = Vue;

  const elementRegistry = {
    heading: {
      label: 'Заголовок',
      icon: 'fa-solid fa-heading',
      defaultData: () => ({
        text: 'Новый заголовок',
        level: 'h2',
        fontSize: 'text-3xl',
        color: '#111827',
        align: 'left',
        marginTop: '0px',
        marginBottom: '16px'
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
          label: 'Размер',
          type: 'select',
          options: [
            { value: 'text-2xl', label: 'Крупный (2xl)' },
            { value: 'text-3xl', label: 'Очень крупный (3xl)' },
            { value: 'text-4xl', label: 'Заголовок (4xl)' }
          ]
        },
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
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' }
      ]
    },
    subheading: {
      label: 'Подзаголовок',
      icon: 'fa-solid fa-text-height',
      defaultData: () => ({
        text: 'Новый подзаголовок',
        fontSize: 'text-xl',
        color: '#f97316',
        align: 'left',
        marginTop: '0px',
        marginBottom: '12px'
      }),
      fields: [
        { key: 'text', label: 'Текст', type: 'text', placeholder: 'Введите подзаголовок' },
        {
          key: 'fontSize',
          label: 'Размер',
          type: 'select',
          options: [
            { value: 'text-lg', label: 'Крупный' },
            { value: 'text-xl', label: 'Очень крупный' },
            { value: 'text-2xl', label: 'Заголовочный' }
          ]
        },
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
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '12px' }
      ]
    },
    paragraph: {
      label: 'Текст',
      icon: 'fa-solid fa-paragraph',
      defaultData: () => ({
        text: 'Добавьте описание секции или товара',
        fontSize: 'text-base',
        color: '#4b5563',
        align: 'left',
        marginTop: '0px',
        marginBottom: '16px'
      }),
      fields: [
        { key: 'text', label: 'Текст', type: 'textarea', rows: 3, placeholder: 'Расскажите подробнее' },
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
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' }
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
        marginBottom: '0px'
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
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '0px' }
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
        marginBottom: '16px'
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
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' }
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
        marginTop: '0px',
        marginBottom: '8px'
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
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '8px' }
      ]
    },
    spacer: {
      label: 'Отступ',
      icon: 'fa-solid fa-ruler-vertical',
      defaultData: () => ({
        height: '24px',
        marginTop: '0px',
        marginBottom: '0px'
      }),
      fields: [
        { key: 'height', label: 'Высота', type: 'text', placeholder: '24px' },
        { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
        { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '0px' }
      ]
    }
  };

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
        headingColor: '#111827',
        descriptionColor: '#4b5563',
        cardStyle: 'rounded',
        cardBackground: '#ffffff',
        cardTextColor: '#1f2937',
        cardBorderColor: '#f97316'
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
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            {
              key: 'cardStyle',
              label: 'Стиль карточек',
              type: 'select',
              options: [
                { value: 'rounded', label: 'Скруглённые' },
                { value: 'flat', label: 'Плоские' },
                { value: 'glass', label: 'Стекло' }
              ]
            },
            { key: 'cardBackground', label: 'Фон карточки', type: 'color' },
            { key: 'cardTextColor', label: 'Цвет текста карточки', type: 'color' },
            { key: 'cardBorderColor', label: 'Цвет рамки карточки', type: 'color' }
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
        headingColor: '#1f2937',
        descriptionColor: '#4b5563',
        backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)',
        accentColor: '#f97316',
        cardBackground: '#ffffff',
        cardTextColor: '#1f2937',
        badgeBackground: 'rgba(251, 191, 36, 0.9)',
        badgeTextColor: '#ffffff',
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
        },
        {
          label: 'Оформление',
          fields: [
            { key: 'backgroundGradient', label: 'Фон секции', type: 'text', placeholder: 'linear-gradient(...)' },
            { key: 'accentColor', label: 'Акцентный цвет', type: 'color' },
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'cardBackground', label: 'Фон карточки блюда', type: 'color' },
            { key: 'cardTextColor', label: 'Текст карточки блюда', type: 'color' },
            { key: 'badgeBackground', label: 'Фон бейджа цены/хита', type: 'color' },
            { key: 'badgeTextColor', label: 'Текст бейджа', type: 'color' }
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
        accentColor: '#f97316',
        headingColor: '#1f2937',
        descriptionColor: '#4b5563',
        contactPhone: '+7 (900) 000-00-00',
        minOrder: '1500',
        panelBackground: '#ffffff',
        panelTextColor: '#374151',
        badgeBackground: 'rgba(249, 115, 22, 0.12)',
        badgeTextColor: '#ea580c',
        ctaBackground: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)',
        ctaTextColor: '#9a3412'
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
            { key: 'backgroundColor', label: 'Цвет фона', type: 'color' },
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'panelBackground', label: 'Фон правой панели', type: 'color' },
            { key: 'panelTextColor', label: 'Текст правой панели', type: 'color' },
            { key: 'badgeBackground', label: 'Фон бейджа условия', type: 'color' },
            { key: 'badgeTextColor', label: 'Текст бейджа условия', type: 'color' },
            { key: 'ctaBackground', label: 'Фон CTA-блока', type: 'text', placeholder: 'linear-gradient(...)' },
            { key: 'ctaTextColor', label: 'Текст CTA-блока', type: 'color' }
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
        layout: 'grid',
        backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)',
        headingColor: '#1f2937',
        descriptionColor: '#4b5563',
        cardBackground: '#ffffff',
        cardTextColor: '#374151',
        accentColor: '#f97316',
        badgeBackground: 'rgba(251, 146, 60, 0.18)'
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
        },
        {
          label: 'Оформление',
          fields: [
            { key: 'backgroundGradient', label: 'Фон секции', type: 'text', placeholder: 'linear-gradient(...)' },
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'cardBackground', label: 'Фон карточки', type: 'color' },
            { key: 'cardTextColor', label: 'Текст карточки', type: 'color' },
            { key: 'accentColor', label: 'Акцентный цвет', type: 'color' },
            { key: 'badgeBackground', label: 'Фон бейджа', type: 'color' }
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
        phone: '+7 (812) 000-00-00',
        backgroundColor: '#ffffff',
        headingColor: '#1f2937',
        descriptionColor: '#4b5563',
        cardBackground: '#ffffff',
        cardTextColor: '#374151',
        accentColor: '#f97316'
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
            { key: 'iframeSrc', label: 'Ссылка на карту (iframe)', type: 'textarea', rows: 2 },
            { key: 'backgroundColor', label: 'Цвет фона секции', type: 'color' },
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'cardBackground', label: 'Фон карточки контактов', type: 'color' },
            { key: 'cardTextColor', label: 'Текст карточки контактов', type: 'color' },
            { key: 'accentColor', label: 'Акцентный цвет иконок', type: 'color' }
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

    return {
      id: source.id || generateId('block'),
      type,
      name: definition.name,
      icon: definition.icon,
      data: merged,
      meta: {
        hidden: !!(source.hidden || (source.meta && source.meta.hidden))
      }
    };
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
                            <div class="relative overflow-hidden rounded-3xl text-white">
                              <img
                                :src="block.data.backgroundImage"
                                alt="hero bg"
                                class="absolute inset-0 w-full h-full object-cover"
                              />
                              <div class="absolute inset-0" :style="{ background: block.data.overlayColor || 'rgba(17,24,39,0.6)' }"></div>
                              <div class="relative grid lg:grid-cols-2 gap-12 px-12 py-16">
                                <div class="space-y-4">
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
                                      class="space-y-2"
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
                                        :class="heroElementWrapperClasses(block.id, element)"
                                        draggable="true"
                                        @dragstart="onHeroElementDragStart(block.id, element.id, $event)"
                                        @dragend="onHeroElementDragEnd"
                                        @click.stop="selectElement(block.id, element.id)"
                                      >
                                        <div
                                          v-if="canvas.showOverlays"
                                          class="absolute inset-0 rounded-2xl border border-dashed border-white/30 pointer-events-none"
                                          :class="isElementSelected(element) && selectedBlockId === block.id ? 'border-orange-300' : ''"
                                        ></div>
                                        <div class="absolute -left-5 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col items-center space-y-1 text-white/70">
                                          <span class="cursor-grab text-xs"><i class="fa-solid fa-grip-vertical"></i></span>
                                        </div>
                                        <div class="absolute top-2 right-2 text-[11px] uppercase tracking-wider text-white/80 bg-black/30 px-2 py-1 rounded-full">{{ elementRegistry[element.type]?.label || element.type }}</div>
                                        <component
                                          :is="renderHeroElement(element)"
                                          v-bind="heroElementProps(element)"
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
                              </div>
                              <svg v-if="block.data.waveEnabled" class="w-full" height="80" viewBox="0 0 1440 80" preserveAspectRatio="none">
                                <path :fill="block.data.waveColor || '#f9f4e5'" d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32V80H0Z"></path>
                              </svg>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'categories'">
                            <div class="py-14 px-10" :style="{ backgroundColor: block.data.backgroundColor || '#f9f4e5' }">
                              <div class="text-center max-w-3xl mx-auto">
                                <p class="text-sm font-semibold uppercase tracking-widest" :style="{ color: block.data.accentColor || '#f97316' }">{{ block.data.subheading }}</p>
                                <h2 class="text-3xl font-bold mt-2" :style="{ color: block.data.headingColor || '#111827' }">{{ block.data.heading }}</h2>
                                <p class="mt-3" :style="{ color: block.data.descriptionColor || '#4b5563' }">{{ block.data.description }}</p>
                              </div>
                              <div class="grid sm:grid-cols-2 gap-6 mt-10">
                                <div
                                  v-for="n in 4"
                                  :key="n"
                                  :class="[
                                    'p-6 flex flex-col items-center text-center space-y-3 transition',
                                    block.data.cardStyle === 'flat'
                                      ? 'border rounded-xl'
                                      : block.data.cardStyle === 'glass'
                                        ? 'bg-white/70 backdrop-blur rounded-3xl shadow border border-white/40'
                                        : 'rounded-2xl shadow'
                                  ]"
                                  :style="{
                                    backgroundColor: block.data.cardStyle === 'flat' ? block.data.cardBackground || '#ffffff' : (block.data.cardStyle === 'glass' ? 'rgba(255,255,255,0.8)' : block.data.cardBackground || '#ffffff'),
                                    color: block.data.cardTextColor || '#1f2937',
                                    borderColor: block.data.cardStyle === 'flat' ? (block.data.cardBorderColor || block.data.accentColor || '#f97316') : undefined
                                  }"
                                >
                                  <div class="w-20 h-20 rounded-full mx-auto" :style="{ backgroundColor: (block.data.accentColor || '#f97316') + '26' }"></div>
                                  <h3 class="font-semibold text-lg" :style="{ color: block.data.accentColor || '#f97316' }">Категория {{ n }}</h3>
                                  <p class="text-sm" :style="{ color: block.data.cardTextColor || '#4b5563' }">Предпросмотр карточки категории</p>
                                  <div class="w-12 h-1 rounded-full" :style="{ backgroundColor: block.data.accentColor || '#f97316' }"></div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'menu'">
                            <div class="py-16 px-10" :style="{ background: block.data.backgroundGradient || 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)' }">
                              <div class="text-center max-w-2xl mx-auto">
                                <h2 class="text-3xl font-bold" :style="{ color: block.data.headingColor || '#1f2937' }">{{ block.data.heading }}</h2>
                                <p class="mt-3" :style="{ color: block.data.descriptionColor || '#4b5563' }">{{ block.data.description }}</p>
                              </div>
                              <div class="grid lg:grid-cols-[280px_1fr] gap-8 mt-10">
                                <div class="rounded-2xl shadow p-5 space-y-4" :style="{ backgroundColor: block.data.cardBackground || '#ffffff', color: block.data.cardTextColor || '#1f2937' }">
                                  <div v-if="block.data.showSearch !== false" class="space-y-2">
                                    <h3 class="text-sm font-semibold" :style="{ color: block.data.cardTextColor || '#1f2937' }">Поиск по меню</h3>
                                    <div class="h-10 rounded-xl border border-dashed" :style="{ borderColor: (block.data.accentColor || '#f97316') + '40', backgroundColor: (block.data.accentColor || '#f97316') + '12' }"></div>
                                  </div>
                                  <div>
                                    <h3 class="text-sm font-semibold" :style="{ color: block.data.cardTextColor || '#1f2937' }">Категории</h3>
                                    <div class="space-y-2 mt-2 text-xs">
                                      <div class="px-3 py-2 rounded-lg font-medium" :style="{ backgroundColor: (block.data.accentColor || '#f97316') + '26', color: block.data.accentColor || '#f97316' }">Хиты</div>
                                      <div class="px-3 py-2 rounded-lg bg-white/70 text-gray-500">Категория 1</div>
                                      <div class="px-3 py-2 rounded-lg bg-white/70 text-gray-500">Категория 2</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="grid md:grid-cols-3 gap-6">
                                  <div
                                    v-for="n in 3"
                                    :key="n"
                                    class="rounded-2xl shadow p-5 space-y-4 transition"
                                    :style="{ backgroundColor: block.data.cardBackground || '#ffffff', color: block.data.cardTextColor || '#1f2937' }"
                                  >
                                    <div class="h-32 rounded-xl" :style="{ backgroundColor: (block.data.accentColor || '#f97316') + '1a' }"></div>
                                    <div class="font-semibold" :style="{ color: block.data.cardTextColor || '#1f2937' }">Популярное блюдо {{ n }}</div>
                                    <p class="text-sm" :style="{ color: (block.data.descriptionColor || '#4b5563') }">Описание и цена подтягиваются из каталога</p>
                                    <div class="flex items-center justify-between text-sm" :style="{ color: (block.data.cardTextColor || '#4b5563') }">
                                      <span>450 ₽</span>
                                      <span
                                        v-if="block.data.highlightHits !== false"
                                        class="inline-flex items-center space-x-1 px-2 py-1 rounded-full"
                                        :style="{ backgroundColor: block.data.badgeBackground || 'rgba(251, 191, 36, 0.9)', color: block.data.badgeTextColor || '#ffffff' }"
                                      >
                                        <i class="fa-solid fa-star"></i>
                                        <span>Хит</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'delivery'">
                            <div class="py-16 px-10" :style="{ background: block.data.backgroundColor || 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)' }">
                              <div class="grid lg:grid-cols-2 gap-10 items-start">
                                <div class="space-y-4">
                                  <h2 class="text-3xl font-bold" :style="{ color: block.data.headingColor || '#1f2937' }">{{ block.data.heading }}</h2>
                                  <p :style="{ color: block.data.descriptionColor || '#4b5563' }">{{ block.data.description }}</p>
                                  <ul class="space-y-3">
                                    <li
                                      v-for="feature in block.data.features"
                                      :key="feature"
                                      class="flex items-start space-x-3"
                                      :style="{ color: block.data.descriptionColor || '#4b5563' }"
                                    >
                                      <span
                                        class="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs"
                                        :style="{ backgroundColor: block.data.accentColor || '#f97316', color: '#ffffff' }"
                                      >
                                        <i class="fa-solid fa-check"></i>
                                      </span>
                                      <span class="text-sm">{{ feature }}</span>
                                    </li>
                                  </ul>
                                </div>
                                <div class="space-y-4">
                                  <div class="aspect-[3/2] rounded-2xl border-2 border-dashed flex items-center justify-center text-sm"
                                    :style="{ borderColor: (block.data.accentColor || '#f97316') + '55', color: (block.data.accentColor || '#f97316') + 'aa', backgroundColor: '#ffffff40' }"
                                  >
                                    Превью карты доставки
                                  </div>
                                  <div
                                    class="rounded-2xl shadow p-5 space-y-3 text-sm"
                                    :style="{ backgroundColor: block.data.panelBackground || '#ffffff', color: block.data.panelTextColor || '#374151' }"
                                  >
                                    <div class="flex items-center justify-between">
                                      <span>Минимальный заказ</span>
                                      <span class="font-semibold" :style="{ color: block.data.panelTextColor || '#1f2937' }">{{ block.data.minOrder || '1500' }} ₽</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-phone" :style="{ color: block.data.accentColor || '#f97316' }"></i>
                                      <span>{{ block.data.contactPhone || '+7 (900) 000-00-00' }}</span>
                                    </div>
                                    <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                      :style="{ backgroundColor: block.data.badgeBackground || 'rgba(249, 115, 22, 0.12)', color: block.data.badgeTextColor || '#ea580c' }"
                                    >
                                      До двери за 30 минут
                                    </div>
                                  </div>
                                  <div class="rounded-2xl p-5 text-center"
                                    :style="{ background: block.data.ctaBackground || 'linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)', color: block.data.ctaTextColor || '#9a3412' }"
                                  >
                                    <div class="text-2xl font-bold">30 мин</div>
                                    <div class="text-sm">Среднее время доставки</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else-if="block.type === 'reviews'">
                            <div class="py-16 px-10" :style="{ background: block.data.backgroundGradient || 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)' }">
                              <div class="text-center max-w-2xl mx-auto">
                                <h2 class="text-3xl font-bold" :style="{ color: block.data.headingColor || '#1f2937' }">{{ block.data.heading }}</h2>
                                <p class="mt-3" :style="{ color: block.data.descriptionColor || '#4b5563' }">{{ block.data.description }}</p>
                              </div>
                              <div class="grid md:grid-cols-3 gap-6 mt-12">
                                <div
                                  v-for="n in 3"
                                  :key="n"
                                  class="rounded-2xl shadow p-6 space-y-3"
                                  :style="{ backgroundColor: block.data.cardBackground || '#ffffff', color: block.data.cardTextColor || '#374151' }"
                                >
                                  <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 rounded-full" :style="{ backgroundColor: (block.data.accentColor || '#f97316') + '26' }"></div>
                                    <div>
                                      <div class="font-semibold" :style="{ color: block.data.cardTextColor || '#1f2937' }">Клиент {{ n }}</div>
                                      <div class="text-xs" :style="{ color: block.data.descriptionColor || '#6b7280' }">Постоянный клиент</div>
                                    </div>
                                  </div>
                                  <div class="flex space-x-1 text-sm" :style="{ color: block.data.accentColor || '#f97316' }">
                                    <i v-for="star in 5" :key="star" class="fa-solid fa-star"></i>
                                  </div>
                                  <p class="text-sm" :style="{ color: block.data.cardTextColor || '#4b5563' }">«Каждый заказ приезжает горячим. Любим за сервис и бонусы»</p>
                                  <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                    :style="{ backgroundColor: block.data.badgeBackground || 'rgba(251, 146, 60, 0.18)', color: block.data.accentColor || '#f97316' }"
                                  >
                                    Проверенный отзыв
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>

                          <template v-else-if="block.type === 'map'">
                            <div class="py-16 px-10" :style="{ backgroundColor: block.data.backgroundColor || '#ffffff' }">
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
                                <div class="space-y-4 p-6 rounded-2xl shadow" :style="{ backgroundColor: block.data.cardBackground || '#ffffff', color: block.data.cardTextColor || '#374151' }">
                                  <h2 class="text-3xl font-bold" :style="{ color: block.data.headingColor || '#1f2937' }">{{ block.data.heading }}</h2>
                                  <p :style="{ color: block.data.descriptionColor || '#4b5563' }">{{ block.data.description }}</p>
                                  <div class="space-y-3 text-sm">
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-location-dot" :style="{ color: block.data.accentColor || '#f97316' }"></i>
                                      <span>{{ block.data.address }}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-clock" :style="{ color: block.data.accentColor || '#f97316' }"></i>
                                      <span>{{ block.data.workHours }}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                      <i class="fa-solid fa-phone" :style="{ color: block.data.accentColor || '#f97316' }"></i>
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

      const canvas = reactive({
        device: 'desktop',
        zoom: 0.85,
        mode: 'preview',
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
            return 'p';
          default:
            return 'div';
        }
      }

      function heroElementProps(element) {
        const data = element.data || {};
        const classes = [];
        const style = {};

        if (['heading', 'subheading', 'paragraph', 'feature'].includes(element.type)) {
          classes.push(data.fontSize || (element.type === 'heading' ? 'text-4xl' : element.type === 'subheading' ? 'text-xl' : 'text-base'));
          if (element.type === 'heading' || element.type === 'feature') {
            classes.push('font-bold');
          } else {
            classes.push('font-medium');
          }
          if (data.align === 'center') classes.push('text-center');
          else if (data.align === 'right') classes.push('text-right');
          else classes.push('text-left');
          style.color = data.color || (element.type === 'subheading' ? '#fbbf24' : '#ffffff');
          style.marginTop = data.marginTop || '0px';
          style.marginBottom = data.marginBottom || '16px';
        }

        if (element.type === 'button') {
          classes.push('px-6 py-3 rounded-full font-semibold inline-flex items-center transition shadow');
          if (data.style === 'secondary') {
            classes.push('bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600');
          } else {
            classes.push('bg-white text-red-600 hover:bg-gray-100');
          }
          if (data.align === 'center') classes.push('mx-auto');
          else if (data.align === 'right') classes.push('ml-auto');
          else classes.push('mr-auto');
          style.marginTop = data.marginTop || '0px';
          style.marginBottom = data.marginBottom || '0px';
        }

        if (element.type === 'image') {
          if (data.align === 'center') classes.push('text-center');
          else if (data.align === 'right') classes.push('text-right');
          else classes.push('text-left');
          style.marginTop = data.marginTop || '0px';
          style.marginBottom = data.marginBottom || '16px';
        }

        if (element.type === 'spacer') {
          style.height = data.height || '24px';
          classes.push('w-full');
        }

        if (element.type === 'feature') {
          classes.push('flex items-center space-x-2');
        }

        return {
          class: classes.join(' '),
          style
        };
      }

      function heroImageProps(element) {
        const data = element.data || {};
        return {
          src: data.src || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10',
          alt: data.alt || 'Изображение',
          style: {
            width: data.width || '320px',
            height: data.height || 'auto',
            borderRadius: data.borderRadius || '16px'
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

      function heroElementWrapperClasses(blockId, element) {
        const classes = ['relative group rounded-2xl px-2 py-1 transition hover:bg-white/10 hover:bg-opacity-30'];
        if (selectedBlockId.value === blockId && isElementSelected(element)) {
          classes.push('ring-2 ring-orange-300 bg-white/10 shadow-lg');
        } else {
          classes.push('ring-1 ring-transparent hover:ring-white/40');
        }
        return classes.join(' ');
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
        heroElementProps,
        heroImageProps,
        heroElementWrapperClasses,
        heroDropWrapperClass,
        heroDropLabelClass,
        onHeroElementDragStart,
        onHeroElementDragEnd,
        onHeroElementDragOver,
        onHeroElementDragLeave,
        onHeroElementDrop,
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
        updateElementField
      };
    }
  };
})();
