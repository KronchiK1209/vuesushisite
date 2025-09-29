// Element registry for the site builder
(function(){
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
          marginBottom: '16px',
          fontFamily: '',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '0px',
          textTransform: 'none',
          backgroundColor: '',
          paddingX: '0px',
          paddingY: '0px',
          borderRadius: '0px',
          textShadow: '',
          positionMode: 'flow',
          positionX: '0px',
          positionY: '0px',
          zIndex: '10',
          maxWidth: '640px'
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
            key: 'fontWeight',
            label: 'Начертание',
            type: 'select',
            options: [
              { value: '400', label: 'Обычный' },
              { value: '500', label: 'Средний' },
              { value: '600', label: 'Полужирный' },
              { value: '700', label: 'Жирный' },
              { value: '800', label: 'Экстра жирный' }
            ]
          },
          { key: 'fontFamily', label: 'Шрифт', type: 'text', placeholder: 'Например, "Manrope"' },
          { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.2' },
          { key: 'letterSpacing', label: 'Интервал между буквами', type: 'text', placeholder: '0px' },
          {
            key: 'textTransform',
            label: 'Регистр',
            type: 'select',
            options: [
              { value: 'none', label: 'Обычный' },
              { value: 'uppercase', label: 'Верхний' },
              { value: 'lowercase', label: 'Нижний' },
              { value: 'capitalize', label: 'Каждое слово' }
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
          { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' },
          { key: 'backgroundColor', label: 'Фон текста', type: 'color' },
          { key: 'paddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '0px' },
          { key: 'paddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '0px' },
          { key: 'borderRadius', label: 'Скругление', type: 'text', placeholder: '0px' },
          { key: 'textShadow', label: 'Тень текста', type: 'text', placeholder: '0 10px 30px rgba(15,23,42,0.35)' },
          {
            key: 'positionMode',
            label: 'Расположение',
            type: 'select',
            options: [
              { value: 'flow', label: 'В потоке' },
              { value: 'free', label: 'Свободное' }
            ]
          },
          { key: 'positionX', label: 'Позиция X', type: 'text', placeholder: '0px' },
          { key: 'positionY', label: 'Позиция Y', type: 'text', placeholder: '0px' },
          { key: 'zIndex', label: 'Слой (z-index)', type: 'text', placeholder: '10' },
          { key: 'maxWidth', label: 'Макс. ширина', type: 'text', placeholder: '640px' }
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
          marginBottom: '12px',
          fontFamily: '',
          fontWeight: '600',
          lineHeight: '1.4',
          letterSpacing: '0px',
          textTransform: 'none',
          backgroundColor: '',
          paddingX: '0px',
          paddingY: '0px',
          borderRadius: '0px',
          textShadow: '',
          positionMode: 'flow',
          positionX: '0px',
          positionY: '0px',
          zIndex: '10',
          maxWidth: '640px'
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
            key: 'fontWeight',
            label: 'Начертание',
            type: 'select',
            options: [
              { value: '400', label: 'Обычный' },
              { value: '500', label: 'Средний' },
              { value: '600', label: 'Полужирный' },
              { value: '700', label: 'Жирный' }
            ]
          },
          { key: 'fontFamily', label: 'Шрифт', type: 'text', placeholder: 'Например, "Inter"' },
          { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.4' },
          { key: 'letterSpacing', label: 'Интервал между буквами', type: 'text', placeholder: '0px' },
          {
            key: 'textTransform',
            label: 'Регистр',
            type: 'select',
            options: [
              { value: 'none', label: 'Обычный' },
              { value: 'uppercase', label: 'Верхний' },
              { value: 'lowercase', label: 'Нижний' },
              { value: 'capitalize', label: 'Каждое слово' }
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
          { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '12px' },
          { key: 'backgroundColor', label: 'Фон текста', type: 'color' },
          { key: 'paddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '0px' },
          { key: 'paddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '0px' },
          { key: 'borderRadius', label: 'Скругление', type: 'text', placeholder: '0px' },
          { key: 'textShadow', label: 'Тень текста', type: 'text', placeholder: '0 6px 20px rgba(15,23,42,0.25)' },
          {
            key: 'positionMode',
            label: 'Расположение',
            type: 'select',
            options: [
              { value: 'flow', label: 'В потоке' },
              { value: 'free', label: 'Свободное' }
            ]
          },
          { key: 'positionX', label: 'Позиция X', type: 'text', placeholder: '0px' },
          { key: 'positionY', label: 'Позиция Y', type: 'text', placeholder: '0px' },
          { key: 'zIndex', label: 'Слой (z-index)', type: 'text', placeholder: '10' },
          { key: 'maxWidth', label: 'Макс. ширина', type: 'text', placeholder: '640px' }
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
          marginBottom: '16px',
          fontFamily: '',
          fontWeight: '400',
          lineHeight: '1.6',
          letterSpacing: '0px',
          textTransform: 'none',
          maxWidth: '640px',
          backgroundColor: '',
          paddingX: '0px',
          paddingY: '0px',
          borderRadius: '0px',
          textShadow: '',
          positionMode: 'flow',
          positionX: '0px',
          positionY: '0px',
          zIndex: '10'
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
            key: 'fontWeight',
            label: 'Начертание',
            type: 'select',
            options: [
              { value: '300', label: 'Светлый' },
              { value: '400', label: 'Обычный' },
              { value: '500', label: 'Средний' },
              { value: '600', label: 'Полужирный' }
            ]
          },
          { key: 'fontFamily', label: 'Шрифт', type: 'text', placeholder: 'Например, "Rubik"' },
          { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.6' },
          { key: 'letterSpacing', label: 'Интервал между буквами', type: 'text', placeholder: '0px' },
          {
            key: 'textTransform',
            label: 'Регистр',
            type: 'select',
            options: [
              { value: 'none', label: 'Обычный' },
              { value: 'uppercase', label: 'Верхний' },
              { value: 'lowercase', label: 'Нижний' },
              { value: 'capitalize', label: 'Каждое слово' }
            ]
          },
          { key: 'maxWidth', label: 'Максимальная ширина', type: 'text', placeholder: '640px' },
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
          { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '16px' },
          { key: 'backgroundColor', label: 'Фон текста', type: 'color' },
          { key: 'paddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '0px' },
          { key: 'paddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '0px' },
          { key: 'borderRadius', label: 'Скругление', type: 'text', placeholder: '0px' },
          { key: 'textShadow', label: 'Тень текста', type: 'text', placeholder: '0 4px 16px rgba(15,23,42,0.15)' },
          {
            key: 'positionMode',
            label: 'Расположение',
            type: 'select',
            options: [
              { value: 'flow', label: 'В потоке' },
              { value: 'free', label: 'Свободное' }
            ]
          },
          { key: 'positionX', label: 'Позиция X', type: 'text', placeholder: '0px' },
          { key: 'positionY', label: 'Позиция Y', type: 'text', placeholder: '0px' },
          { key: 'zIndex', label: 'Слой (z-index)', type: 'text', placeholder: '10' }
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
          backgroundColor: '#ffffff',
          textColor: '#dc2626',
          hoverBackgroundColor: '#f3f4f6',
          hoverTextColor: '#b91c1c',
          borderRadius: '9999px',
          borderWidth: '0px',
          borderColor: '#ffffff',
          paddingX: '28px',
          paddingY: '14px',
          fontSize: '16px',
          fontFamily: '',
          fontWeight: '600',
          boxShadow: '0 15px 40px rgba(255,255,255,0.18)',
          positionMode: 'flow',
          positionX: '0px',
          positionY: '0px',
          zIndex: '20',
          width: ''
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
          { key: 'fontSize', label: 'Размер шрифта (px)', type: 'text', placeholder: '16px' },
          { key: 'fontFamily', label: 'Шрифт', type: 'text', placeholder: 'Например, "Nunito"' },
          {
            key: 'fontWeight',
            label: 'Начертание',
            type: 'select',
            options: [
              { value: '500', label: 'Средний' },
              { value: '600', label: 'Полужирный' },
              { value: '700', label: 'Жирный' }
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
          { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
          { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '0px' },
          { key: 'backgroundColor', label: 'Цвет фона', type: 'color' },
          { key: 'textColor', label: 'Цвет текста', type: 'color' },
          { key: 'hoverBackgroundColor', label: 'Фон при наведении', type: 'color' },
          { key: 'hoverTextColor', label: 'Текст при наведении', type: 'color' },
          { key: 'borderRadius', label: 'Скругление', type: 'text', placeholder: '9999px' },
          { key: 'borderWidth', label: 'Толщина границы', type: 'text', placeholder: '0px' },
          { key: 'borderColor', label: 'Цвет границы', type: 'color' },
          { key: 'paddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '28px' },
          { key: 'paddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '14px' },
          { key: 'boxShadow', label: 'Тень', type: 'text', placeholder: '0 15px 40px rgba(255,255,255,0.18)' },
          {
            key: 'positionMode',
            label: 'Расположение',
            type: 'select',
            options: [
              { value: 'flow', label: 'В потоке' },
              { value: 'free', label: 'Свободное' }
            ]
          },
          { key: 'positionX', label: 'Позиция X', type: 'text', placeholder: '0px' },
          { key: 'positionY', label: 'Позиция Y', type: 'text', placeholder: '0px' },
          { key: 'zIndex', label: 'Слой (z-index)', type: 'text', placeholder: '20' },
          { key: 'width', label: 'Ширина', type: 'text', placeholder: 'auto' }
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
          boxShadow: '0 25px 60px rgba(15,23,42,0.35)',
          borderWidth: '0px',
          borderColor: 'rgba(255,255,255,0.2)',
          backgroundColor: 'transparent',
          positionMode: 'flow',
          positionX: '0px',
          positionY: '0px',
          zIndex: '5'
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
            label: 'Вписывание',
            type: 'select',
            options: [
              { value: 'cover', label: 'Cover' },
              { value: 'contain', label: 'Contain' },
              { value: 'fill', label: 'Fill' }
            ]
          },
          { key: 'boxShadow', label: 'Тень', type: 'text', placeholder: '0 25px 60px rgba(15,23,42,0.35)' },
          { key: 'borderWidth', label: 'Толщина границы', type: 'text', placeholder: '0px' },
          { key: 'borderColor', label: 'Цвет границы', type: 'color' },
          { key: 'backgroundColor', label: 'Фон', type: 'color' },
          {
            key: 'positionMode',
            label: 'Расположение',
            type: 'select',
            options: [
              { value: 'flow', label: 'В потоке' },
              { value: 'free', label: 'Свободное' }
            ]
          },
          { key: 'positionX', label: 'Позиция X', type: 'text', placeholder: '0px' },
          { key: 'positionY', label: 'Позиция Y', type: 'text', placeholder: '0px' },
          { key: 'zIndex', label: 'Слой (z-index)', type: 'text', placeholder: '5' }
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
          marginBottom: '8px',
          fontFamily: '',
          fontWeight: '500',
          lineHeight: '1.4',
          letterSpacing: '0px',
          textTransform: 'none',
          iconColor: '#f97316',
          iconBackground: 'rgba(249, 115, 22, 0.12)',
          iconShape: 'circle',
          positionMode: 'flow',
          positionX: '0px',
          positionY: '0px',
          zIndex: '15'
        }),
        fields: [
          { key: 'text', label: 'Текст', type: 'text', placeholder: 'Например, Бесплатная доставка' },
          { key: 'icon', label: 'Иконка FontAwesome', type: 'text', placeholder: 'fa-solid fa-check' },
          { key: 'fontFamily', label: 'Шрифт', type: 'text', placeholder: 'Например, "Open Sans"' },
          {
            key: 'fontWeight',
            label: 'Начертание',
            type: 'select',
            options: [
              { value: '400', label: 'Обычный' },
              { value: '500', label: 'Средний' },
              { value: '600', label: 'Полужирный' }
            ]
          },
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
          { key: 'lineHeight', label: 'Межстрочный интервал', type: 'text', placeholder: '1.4' },
          { key: 'letterSpacing', label: 'Интервал между буквами', type: 'text', placeholder: '0px' },
          {
            key: 'textTransform',
            label: 'Регистр',
            type: 'select',
            options: [
              { value: 'none', label: 'Обычный' },
              { value: 'uppercase', label: 'Верхний' },
              { value: 'capitalize', label: 'Каждое слово' }
            ]
          },
          { key: 'iconColor', label: 'Цвет иконки', type: 'color' },
          { key: 'iconBackground', label: 'Фон иконки', type: 'color' },
          {
            key: 'iconShape',
            label: 'Форма иконки',
            type: 'select',
            options: [
              { value: 'circle', label: 'Круг' },
              { value: 'rounded', label: 'Скруглённый квадрат' },
              { value: 'square', label: 'Квадрат' }
            ]
          },
          { key: 'marginTop', label: 'Отступ сверху', type: 'text', placeholder: '0px' },
          { key: 'marginBottom', label: 'Отступ снизу', type: 'text', placeholder: '8px' },
          {
            key: 'positionMode',
            label: 'Расположение',
            type: 'select',
            options: [
              { value: 'flow', label: 'В потоке' },
              { value: 'free', label: 'Свободное' }
            ]
          },
          { key: 'positionX', label: 'Позиция X', type: 'text', placeholder: '0px' },
          { key: 'positionY', label: 'Позиция Y', type: 'text', placeholder: '0px' },
          { key: 'zIndex', label: 'Слой (z-index)', type: 'text', placeholder: '15' }
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
  window.SiteBuilderElements = elementRegistry;
})();
