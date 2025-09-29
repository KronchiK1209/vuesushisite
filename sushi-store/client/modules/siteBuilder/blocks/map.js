// Block definition: map
(function(){
  window.SiteBuilderBlocks = window.SiteBuilderBlocks || {};
  window.SiteBuilderBlocks['map'] = {
      name: 'Карта и контакты',
      icon: 'fa-solid fa-map-location-dot',
      defaultData: () => ({
        heading: 'Зоны доставки',
        description: 'Нажмите на нужный район, чтобы узнать условия доставки',
        iframeSrc: 'https://yandex.ru/map-widget/v1/?lang=ru_RU&scroll=true&source=constructor-api&um=constructor%3A1569f1da7d596921cd82db1f441ffc63d2a386db371645fede23dbc26dc86a74',
        address: 'г. Санкт-Петербург, ул. Суши, 5',
        workHours: 'Ежедневно 10:00 — 23:00',
        phone: '+7 (812) 000-00-00',
        backgroundMode: 'solid',
        backgroundColor: '#ffffff',
        backgroundGradient: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
        backgroundImage: '',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overlayColor: '',
        overlayBlur: '0px',
        sectionPaddingY: '80px',
        sectionPaddingX: '40px',
        headingColor: '#111827',
        headingFontSize: '32px',
        headingFontWeight: '700',
        headingFontFamily: '',
        descriptionColor: '#4b5563',
        descriptionFontSize: '18px',
        descriptionMaxWidth: '520px',
        textAlign: 'left',
        mapHeight: '380px',
        mapBorderRadius: '24px',
        mapShadow: '0 20px 45px rgba(15,23,42,0.08)',
        cardBackground: '#ffffff',
        cardBorderRadius: '24px',
        cardShadow: '0 18px 40px rgba(15,23,42,0.08)',
        cardTextColor: '#1f2937',
        contactIconColor: '#f97316',
        contactTextColor: '#4b5563',
        buttonVisible: true,
        buttonText: 'Позвонить нам',
        buttonStyle: 'primary',
        buttonAction: 'link',
        buttonLink: 'tel:+79000000000',
        buttonBackground: '#f97316',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: '999px',
        buttonAlign: 'left',
        buttonShadow: '0 18px 40px rgba(249,115,22,0.35)'
      }),
      inspector: [
        {
          label: 'Контент',
          fields: [
            { key: 'heading', label: 'Заголовок', type: 'text', placeholder: 'Зоны доставки' },
            { key: 'description', label: 'Описание', type: 'textarea', rows: 3, placeholder: 'Опишите как работает доставка' },
            { key: 'descriptionMaxWidth', label: 'Макс. ширина описания', type: 'text', placeholder: '520px' },
            { key: 'textAlign', label: 'Выравнивание текста', type: 'select', options: [
              { value: 'left', label: 'Слева' },
              { value: 'center', label: 'По центру' },
              { value: 'right', label: 'Справа' }
            ] }
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
            { key: 'sectionPaddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '40px' }
          ]
        },
        {
          label: 'Карта',
          fields: [
            { key: 'iframeSrc', label: 'Ссылка на карту (iframe)', type: 'textarea', rows: 2 },
            { key: 'mapHeight', label: 'Высота карты', type: 'text', placeholder: '380px' },
            { key: 'mapBorderRadius', label: 'Скругление карты', type: 'text', placeholder: '24px' },
            { key: 'mapShadow', label: 'Тень карты', type: 'text', placeholder: '0 20px 45px rgba(...)' }
          ]
        },
        {
          label: 'Контакты',
          fields: [
            { key: 'address', label: 'Адрес', type: 'text', placeholder: 'г. Санкт-Петербург...' },
            { key: 'phone', label: 'Телефон', type: 'text', placeholder: '+7 (...)' },
            { key: 'workHours', label: 'Время работы', type: 'text', placeholder: '10:00 — 23:00' },
            { key: 'cardBackground', label: 'Фон карточки контактов', type: 'color' },
            { key: 'cardBorderRadius', label: 'Скругление карточки', type: 'text', placeholder: '24px' },
            { key: 'cardShadow', label: 'Тень карточки', type: 'text', placeholder: '0 18px 40px rgba(...)' },
            { key: 'cardTextColor', label: 'Цвет текста карточки', type: 'color' },
            { key: 'contactIconColor', label: 'Цвет иконок', type: 'color' },
            { key: 'contactTextColor', label: 'Цвет текста контактов', type: 'color' }
          ]
        },
        {
          label: 'Кнопка',
          fields: [
            { key: 'buttonVisible', label: 'Показывать кнопку', type: 'toggle' },
            { key: 'buttonText', label: 'Текст кнопки', type: 'text', placeholder: 'Позвонить нам' },
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
            { key: 'buttonLink', label: 'Ссылка', type: 'text', placeholder: 'tel:+79000000000' },
            { key: 'buttonBackground', label: 'Фон кнопки', type: 'color' },
            { key: 'buttonTextColor', label: 'Цвет текста', type: 'color' },
            { key: 'buttonBorderRadius', label: 'Скругление', type: 'text', placeholder: '999px' },
            { key: 'buttonAlign', label: 'Выравнивание', type: 'select', options: [
              { value: 'left', label: 'Слева' },
              { value: 'center', label: 'По центру' },
              { value: 'right', label: 'Справа' }
            ] },
            { key: 'buttonShadow', label: 'Тень кнопки', type: 'text', placeholder: '0 18px 40px rgba(...)' }
          ]
        }
      ]
    };
})();
