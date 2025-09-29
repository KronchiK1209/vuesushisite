// Block definition: hero
(function(){
  window.SiteBuilderBlocks = window.SiteBuilderBlocks || {};
  window.SiteBuilderBlocks['hero'] = {
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
          contentMaxWidth: '620px',
          contentPaddingX: '96px',
          contentPaddingY: '120px',
          contentGap: '40px',
          minHeight: '640px',
          freeformHeight: '640px',
          layout: 'split',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          overlayBlur: '0',
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
            label: 'Макет',
            fields: [
              {
                key: 'layout',
                label: 'Расположение',
                type: 'select',
                options: [
                  { value: 'split', label: 'Текст и изображение' },
                  { value: 'stacked', label: 'Только текст' },
                  { value: 'spotlight', label: 'Текст над изображением' },
                  { value: 'freeform', label: 'Свободное расположение' }
                ]
              },
              { key: 'contentMaxWidth', label: 'Ширина контента', type: 'text', placeholder: '620px' },
              { key: 'contentPaddingX', label: 'Горизонтальные отступы', type: 'text', placeholder: '96px' },
              { key: 'contentPaddingY', label: 'Вертикальные отступы', type: 'text', placeholder: '120px' },
              { key: 'contentGap', label: 'Отступ между колонками', type: 'text', placeholder: '40px' },
              { key: 'minHeight', label: 'Минимальная высота', type: 'text', placeholder: '640px' },
              { key: 'freeformHeight', label: 'Высота для свободного режима', type: 'text', placeholder: '640px' }
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
              { key: 'overlayColor', label: 'Цвет наложения', type: 'color' },
              { key: 'backgroundPosition', label: 'Позиция фона', type: 'text', placeholder: 'center center' },
              { key: 'backgroundSize', label: 'Размер фона', type: 'text', placeholder: 'cover' },
              { key: 'backgroundRepeat', label: 'Повторение фона', type: 'text', placeholder: 'no-repeat' },
              { key: 'overlayBlur', label: 'Размытие наложения (px)', type: 'text', placeholder: '0' }
            ]
          }
        ],
        elements: ['heading', 'subheading', 'paragraph', 'button', 'image', 'feature', 'spacer']
      };
})();
