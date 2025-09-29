// Block definition: reviews
(function(){
  window.SiteBuilderBlocks = window.SiteBuilderBlocks || {};
  window.SiteBuilderBlocks['reviews'] = {
      name: 'Отзывы',
      icon: 'fa-solid fa-comments',
      defaultData: () => ({
        heading: 'Отзывы наших гостей',
        description: 'Более 1000 довольных клиентов в этом месяце',
        backgroundMode: 'gradient',
        backgroundColor: '#fff7ed',
        backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)',
        backgroundImage: '',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overlayColor: 'rgba(255,247,237,0.7)',
        overlayBlur: '0px',
        sectionPaddingY: '80px',
        sectionPaddingX: '40px',
        headingColor: '#111827',
        headingFontSize: '36px',
        headingFontWeight: '700',
        headingFontFamily: '',
        descriptionColor: '#4b5563',
        descriptionFontSize: '18px',
        descriptionMaxWidth: '640px',
        textAlign: 'center',
        layout: 'grid',
        columns: 3,
        autoPlay: true,
        autoPlayInterval: 6000,
        showArrows: true,
        showDots: true,
        cardBackground: '#ffffff',
        cardTextColor: '#1f2937',
        cardBorderRadius: '24px',
        cardShadow: '0 16px 40px rgba(15,23,42,0.08)',
        cardBorderColor: 'rgba(255,255,255,0)',
        cardQuoteColor: '#4b5563',
        ratingColor: '#facc15',
        avatarBackground: '#fed7aa',
        avatarShape: 'circle',
        accentColor: '#f97316'
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
          label: 'Заголовки',
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
          label: 'Настройки карусели',
          fields: [
            {
              key: 'layout',
              label: 'Макет',
              type: 'select',
              options: [
                { value: 'grid', label: 'Сетка' },
                { value: 'carousel', label: 'Карусель' }
              ]
            },
            { key: 'columns', label: 'Кол-во колонок (превью)', type: 'text', placeholder: '3' },
            { key: 'autoPlay', label: 'Автопрокрутка', type: 'toggle' },
            { key: 'autoPlayInterval', label: 'Интервал автопрокрутки (мс)', type: 'text', placeholder: '6000' },
            { key: 'showArrows', label: 'Показывать стрелки', type: 'toggle' },
            { key: 'showDots', label: 'Показывать индикаторы', type: 'toggle' }
          ]
        },
        {
          label: 'Карточки отзывов',
          fields: [
            { key: 'cardBackground', label: 'Фон карточки', type: 'color' },
            { key: 'cardTextColor', label: 'Цвет текста', type: 'color' },
            { key: 'cardQuoteColor', label: 'Цвет цитаты', type: 'color' },
            { key: 'ratingColor', label: 'Цвет звёзд', type: 'color' },
            { key: 'cardBorderRadius', label: 'Скругление карточки', type: 'text', placeholder: '24px' },
            { key: 'cardShadow', label: 'Тень карточки', type: 'text', placeholder: '0 16px 40px rgba(...)' },
            { key: 'cardBorderColor', label: 'Цвет границы', type: 'color' },
            { key: 'avatarBackground', label: 'Фон аватара', type: 'color' },
            {
              key: 'avatarShape',
              label: 'Форма аватара',
              type: 'select',
              options: [
                { value: 'circle', label: 'Круг' },
                { value: 'rounded', label: 'Скруглённый квадрат' },
                { value: 'square', label: 'Квадрат' }
              ]
            },
            { key: 'accentColor', label: 'Акцентный цвет', type: 'color' }
          ]
        }
      ]
    };
})();
