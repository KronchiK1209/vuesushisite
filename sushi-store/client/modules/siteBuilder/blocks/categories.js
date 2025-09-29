// Block definition: categories
(function(){
  window.SiteBuilderBlocks = window.SiteBuilderBlocks || {};
  window.SiteBuilderBlocks['categories'] = {
      name: 'Категории',
      icon: 'fa-solid fa-tags',
      defaultData: () => ({
        heading: 'Категории и блюда',
        subheading: 'которые вы нигде не найдете',
        description: 'Уникальные подборки от наших шефов',
        backgroundMode: 'solid',
        backgroundColor: '#f9f4e5',
        backgroundGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        backgroundImage: '',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overlayColor: '',
        overlayBlur: '0px',
        sectionPaddingY: '64px',
        sectionPaddingX: '40px',
        sectionBorderRadius: '0px',
        sectionShadow: '',
        textAlign: 'center',
        headingColor: '#111827',
        headingFontSize: '40px',
        headingFontWeight: '700',
        headingFontFamily: '',
        subheadingColor: '#f97316',
        subheadingFontSize: '20px',
        subheadingFontWeight: '600',
        descriptionColor: '#4b5563',
        descriptionFontSize: '18px',
        descriptionMaxWidth: '720px',
        cardBackground: '#ffffff',
        cardTextColor: '#1f2937',
        cardDescriptionColor: '#6b7280',
        cardBorderRadius: '24px',
        cardShadow: '0 20px 45px rgba(15,23,42,0.08)',
        cardBorderColor: 'rgba(255,255,255,0)',
        cardPadding: '28px',
        cardGap: '24px',
        cardMinWidth: '240px',
        cardIconBackground: '#f97316',
        cardIconColor: '#ffffff',
        cardIconShape: 'circle',
        cardIconSize: '80px',
        cardHoverLift: true,
        cardHoverShadow: '0 24px 55px rgba(249,115,22,0.25)',
        buttonVisible: true,
        buttonText: 'Все категории',
        buttonStyle: 'secondary',
        buttonAction: 'link',
        buttonLink: '/catalog',
        buttonBackground: '#111827',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: '999px',
        buttonAlign: 'center',
        buttonShadow: '0 16px 40px rgba(15,23,42,0.18)'
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
            { key: 'sectionPaddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '64px' },
            { key: 'sectionPaddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '40px' },
            { key: 'sectionBorderRadius', label: 'Скругление секции', type: 'text', placeholder: '0px' },
            { key: 'sectionShadow', label: 'Тень секции', type: 'text', placeholder: '0 20px 50px rgba(...)' }
          ]
        },
        {
          label: 'Заголовки',
          fields: [
            { key: 'textAlign', label: 'Выравнивание', type: 'select', options: [
              { value: 'left', label: 'Слева' },
              { value: 'center', label: 'По центру' },
              { value: 'right', label: 'Справа' }
            ] },
            { key: 'headingColor', label: 'Цвет заголовка', type: 'color' },
            { key: 'headingFontSize', label: 'Размер заголовка', type: 'text', placeholder: '40px' },
            { key: 'headingFontWeight', label: 'Начертание заголовка', type: 'text', placeholder: '700' },
            { key: 'headingFontFamily', label: 'Шрифт заголовка', type: 'text', placeholder: 'Manrope, sans-serif' },
            { key: 'subheadingColor', label: 'Цвет подзаголовка', type: 'color' },
            { key: 'subheadingFontSize', label: 'Размер подзаголовка', type: 'text', placeholder: '20px' },
            { key: 'subheadingFontWeight', label: 'Начертание подзаголовка', type: 'text', placeholder: '600' },
            { key: 'descriptionColor', label: 'Цвет описания', type: 'color' },
            { key: 'descriptionFontSize', label: 'Размер описания', type: 'text', placeholder: '18px' },
            { key: 'descriptionMaxWidth', label: 'Макс. ширина описания', type: 'text', placeholder: '720px' }
          ]
        },
        {
          label: 'Карточки',
          fields: [
            { key: 'cardBackground', label: 'Фон карточек', type: 'color' },
            { key: 'cardTextColor', label: 'Цвет заголовка карточки', type: 'color' },
            { key: 'cardDescriptionColor', label: 'Цвет описания карточки', type: 'color' },
            { key: 'cardBorderRadius', label: 'Скругление карточек', type: 'text', placeholder: '24px' },
            { key: 'cardShadow', label: 'Тень карточек', type: 'text', placeholder: '0 20px 45px rgba(...)' },
            { key: 'cardBorderColor', label: 'Цвет границы', type: 'color' },
            { key: 'cardPadding', label: 'Внутренние отступы', type: 'text', placeholder: '28px' },
            { key: 'cardGap', label: 'Расстояние между карточками', type: 'text', placeholder: '24px' },
            { key: 'cardMinWidth', label: 'Мин. ширина карточки', type: 'text', placeholder: '240px' },
            { key: 'cardIconBackground', label: 'Фон иконки', type: 'color' },
            { key: 'cardIconColor', label: 'Цвет иконки', type: 'color' },
            {
              key: 'cardIconShape',
              label: 'Форма иконки',
              type: 'select',
              options: [
                { value: 'circle', label: 'Круг' },
                { value: 'rounded', label: 'Скруглённый квадрат' },
                { value: 'square', label: 'Квадрат' }
              ]
            },
            { key: 'cardIconSize', label: 'Размер иконки', type: 'text', placeholder: '80px' },
            { key: 'cardHoverLift', label: 'Поднимать при наведении', type: 'toggle' },
            { key: 'cardHoverShadow', label: 'Тень при наведении', type: 'text', placeholder: '0 24px 55px rgba(...)' }
          ]
        },
        {
          label: 'Кнопка',
          fields: [
            { key: 'buttonVisible', label: 'Показывать кнопку', type: 'toggle' },
            { key: 'buttonText', label: 'Текст кнопки', type: 'text', placeholder: 'Все категории' },
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
            { key: 'buttonLink', label: 'Ссылка', type: 'text', placeholder: '/catalog' },
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
