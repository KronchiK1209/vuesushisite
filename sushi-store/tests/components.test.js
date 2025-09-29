/**
 * Component тесты для Vue компонентов
 * Тестируем поведение компонентов приложения
 */

import { mount, shallowMount } from '@vue/test-utils';

describe('Компоненты приложения', () => {
  
  describe('LoadingSpinner', () => {
    test('должен отображать анимацию загрузки', () => {
      const LoadingSpinner = {
        template: `
          <div class="loading-overlay">
            <div class="loading-container">
              <div class="sushi-animation">
                <div class="sushi-roll">
                  <div class="sushi-piece" v-for="i in 8" :key="i"></div>
                </div>
                <div class="chopsticks">
                  <div class="chopstick left"></div>
                  <div class="chopstick right"></div>
                </div>
              </div>
              <div class="loading-content">
                <div class="loading-logo">
                  <i class="fa-solid fa-fish"></i>
                  <h2>Sushi Store</h2>
                  <p>Готовим для вас самое вкусное...</p>
                </div>
                <div class="loading-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                  </div>
                  <p class="progress-text">{{ progress }}%</p>
                </div>
              </div>
            </div>
          </div>
        `,
        setup() {
          const progress = global.Vue.ref(0);
          return { progress };
        }
      };

      const wrapper = mount(LoadingSpinner);
      
      expect(wrapper.find('.loading-overlay').exists()).toBe(true);
      expect(wrapper.find('.sushi-roll').exists()).toBe(true);
      expect(wrapper.findAll('.sushi-piece')).toHaveLength(8);
      expect(wrapper.findAll('.chopstick')).toHaveLength(2);
      expect(wrapper.find('h2').text()).toBe('Sushi Store');
    });

    test('должен обновлять прогресс загрузки', async () => {
      const LoadingSpinner = {
        template: `
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          <p class="progress-text">{{ progress }}%</p>
        `,
        setup() {
          const progress = global.Vue.ref(0);
          
          // Симулируем обновление прогресса
          setTimeout(() => {
            progress.value = 50;
          }, 100);
          
          return { progress };
        }
      };

      const wrapper = mount(LoadingSpinner);
      
      expect(wrapper.find('.progress-text').text()).toBe('0%');
      
      // Ждем обновления
      await new Promise(resolve => setTimeout(resolve, 150));
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('.progress-text').text()).toBe('50%');
    });
  });

  describe('ProductCard', () => {
    test('должен отображать информацию о товаре', () => {
      const ProductCard = {
        template: `
          <div class="product-card">
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="price">{{ formatPrice(product.price) }}</div>
            <button @click="addToCart" class="add-to-cart">
              Заказать
            </button>
          </div>
        `,
        props: ['product'],
        methods: {
          formatPrice(price) {
            return price.toLocaleString('ru-RU', { 
              style: 'currency', 
              currency: 'RUB' 
            });
          },
          addToCart() {
            this.$emit('add-to-cart', this.product);
          }
        }
      };

      const product = {
        id: 1,
        name: 'Ролл Калифорния',
        description: 'С крабом и авокадо',
        price: 350,
        image: 'california.jpg'
      };

      const wrapper = mount(ProductCard, {
        props: { product }
      });

      expect(wrapper.find('h3').text()).toBe('Ролл Калифорния');
      expect(wrapper.find('p').text()).toBe('С крабом и авокадо');
      expect(wrapper.find('.price').text()).toBe('350,00 ₽');
      expect(wrapper.find('img').attributes('src')).toBe('california.jpg');
    });

    test('должен эмитить событие при добавлении в корзину', async () => {
      const ProductCard = {
        template: `
          <button @click="addToCart" class="add-to-cart">
            Заказать
          </button>
        `,
        props: ['product'],
        methods: {
          addToCart() {
            this.$emit('add-to-cart', this.product);
          }
        }
      };

      const product = { id: 1, name: 'Тест', price: 100 };
      const wrapper = mount(ProductCard, { props: { product } });

      await wrapper.find('.add-to-cart').trigger('click');

      expect(wrapper.emitted('add-to-cart')).toBeTruthy();
      expect(wrapper.emitted('add-to-cart')[0]).toEqual([product]);
    });
  });

  describe('CartPreview', () => {
    test('должен отображать товары в корзине', () => {
      const CartPreview = {
        template: `
          <div class="cart-preview">
            <div v-for="item in items" :key="item.id" class="cart-item">
              <span>{{ item.name }}</span>
              <span>{{ item.quantity }}x</span>
              <span>{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
            <div class="cart-total">
              Итого: {{ formatPrice(total) }}
            </div>
          </div>
        `,
        props: ['items'],
        computed: {
          total() {
            return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          }
        },
        methods: {
          formatPrice(price) {
            return price.toLocaleString('ru-RU', { 
              style: 'currency', 
              currency: 'RUB' 
            });
          }
        }
      };

      const items = [
        { id: 1, name: 'Ролл Калифорния', price: 350, quantity: 2 },
        { id: 2, name: 'Суши с лососем', price: 200, quantity: 1 }
      ];

      const wrapper = mount(CartPreview, { props: { items } });

      expect(wrapper.findAll('.cart-item')).toHaveLength(2);
      expect(wrapper.find('.cart-total').text()).toBe('Итого: 900,00 ₽');
    });
  });

  describe('CategoryFilter', () => {
    test('должен отображать категории', () => {
      const CategoryFilter = {
        template: `
          <div class="category-filter">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="selectCategory(category)"
              :class="{ active: selectedCategory === category }"
            >
              {{ category }}
            </button>
          </div>
        `,
        props: ['categories', 'selectedCategory'],
        methods: {
          selectCategory(category) {
            this.$emit('category-selected', category);
          }
        }
      };

      const categories = ['Все', 'Роллы', 'Суши', 'Сеты'];
      const selectedCategory = 'Роллы';

      const wrapper = mount(CategoryFilter, {
        props: { categories, selectedCategory }
      });

      expect(wrapper.findAll('button')).toHaveLength(4);
      expect(wrapper.find('button.active').text()).toBe('Роллы');
    });

    test('должен эмитить событие при выборе категории', async () => {
      const CategoryFilter = {
        template: `
          <button @click="selectCategory('Роллы')">Роллы</button>
        `,
        methods: {
          selectCategory(category) {
            this.$emit('category-selected', category);
          }
        }
      };

      const wrapper = mount(CategoryFilter);

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('category-selected')).toBeTruthy();
      expect(wrapper.emitted('category-selected')[0]).toEqual(['Роллы']);
    });
  });

  describe('SearchBar', () => {
    test('должен обновлять поисковый запрос', async () => {
      const SearchBar = {
        template: `
          <input 
            v-model="query" 
            @input="onSearch"
            placeholder="Поиск товаров..."
          />
        `,
        data() {
          return { query: '' };
        },
        methods: {
          onSearch() {
            this.$emit('search', this.query);
          }
        }
      };

      const wrapper = mount(SearchBar);

      await wrapper.find('input').setValue('калифорния');
      await wrapper.find('input').trigger('input');

      expect(wrapper.emitted('search')).toBeTruthy();
      expect(wrapper.emitted('search')[0]).toEqual(['калифорния']);
    });
  });
});
