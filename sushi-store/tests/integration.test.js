/**
 * Integration тесты
 * Тестируем взаимодействие между компонентами и API
 */

import { mount } from '@vue/test-utils';

describe('Integration тесты', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Загрузка товаров', () => {
    test('должен загружать товары с сервера', async () => {
      const mockProducts = [
        { id: 1, name: 'Ролл Калифорния', price: 350, category: 'Роллы' },
        { id: 2, name: 'Суши с лососем', price: 200, category: 'Суши' }
      ];

      global.axios.get.mockResolvedValue({ data: mockProducts });

      const ProductList = {
        template: `
          <div class="product-list">
            <div v-for="product in products" :key="product.id" class="product-card">
              <h3>{{ product.name }}</h3>
              <p>{{ product.price }} ₽</p>
              <button @click="addToCart(product)">Заказать</button>
            </div>
          </div>
        `,
        data() {
          return { products: [] };
        },
        async mounted() {
          try {
            const response = await global.axios.get('/api/products');
            this.products = response.data;
          } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
          }
        },
        methods: {
          addToCart(product) {
            this.$emit('add-to-cart', product);
          }
        }
      };

      const wrapper = mount(ProductList);
      
      // Ждем завершения загрузки
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.axios.get).toHaveBeenCalledWith('/api/products');
      expect(wrapper.findAll('.product-card')).toHaveLength(2);
      expect(wrapper.find('h3').text()).toBe('Ролл Калифорния');
    });
  });

  describe('Фильтрация товаров', () => {
    test('должен фильтровать товары по категории', async () => {
      const mockProducts = [
        { id: 1, name: 'Ролл Калифорния', category: 'Роллы' },
        { id: 2, name: 'Суши с лососем', category: 'Суши' },
        { id: 3, name: 'Сет №1', category: 'Сеты' }
      ];

      const ProductFilter = {
        template: `
          <div>
            <div class="categories">
              <button 
                v-for="category in categories" 
                :key="category"
                @click="selectCategory(category)"
                :class="{ active: selectedCategory === category }"
              >
                {{ category }}
              </button>
            </div>
            <div class="products">
              <div v-for="product in filteredProducts" :key="product.id">
                {{ product.name }}
              </div>
            </div>
          </div>
        `,
        data() {
          return {
            products: mockProducts,
            categories: ['Все', 'Роллы', 'Суши', 'Сеты'],
            selectedCategory: 'Все'
          };
        },
        computed: {
          filteredProducts() {
            if (this.selectedCategory === 'Все') {
              return this.products;
            }
            return this.products.filter(p => p.category === this.selectedCategory);
          }
        },
        methods: {
          selectCategory(category) {
            this.selectedCategory = category;
          }
        }
      };

      const wrapper = mount(ProductFilter);

      // Проверяем начальное состояние
      expect(wrapper.findAll('.products > div')).toHaveLength(3);

      // Выбираем категорию "Роллы"
      await wrapper.find('button:contains("Роллы")').trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.products > div')).toHaveLength(1);
      expect(wrapper.find('.products > div').text()).toBe('Ролл Калифорния');
    });
  });

  describe('Поиск товаров', () => {
    test('должен искать товары по названию', async () => {
      const mockProducts = [
        { id: 1, name: 'Ролл Калифорния', description: 'С крабом и авокадо' },
        { id: 2, name: 'Суши с лососем', description: 'Свежий лосось' },
        { id: 3, name: 'Сет Калифорния', description: 'Роллы калифорния' }
      ];

      const SearchComponent = {
        template: `
          <div>
            <input 
              v-model="searchQuery" 
              @input="search"
              placeholder="Поиск..."
            />
            <div class="results">
              <div v-for="product in searchResults" :key="product.id">
                {{ product.name }}
              </div>
            </div>
          </div>
        `,
        data() {
          return {
            products: mockProducts,
            searchQuery: '',
            searchResults: []
          };
        },
        methods: {
          search() {
            if (!this.searchQuery.trim()) {
              this.searchResults = [];
              return;
            }
            
            const query = this.searchQuery.toLowerCase();
            this.searchResults = this.products.filter(product =>
              product.name.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query)
            );
          }
        }
      };

      const wrapper = mount(SearchComponent);

      // Вводим поисковый запрос
      await wrapper.find('input').setValue('калифорния');
      await wrapper.find('input').trigger('input');
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.results > div')).toHaveLength(2);
      expect(wrapper.find('.results > div').text()).toBe('Ролл Калифорния');
    });
  });

  describe('Корзина', () => {
    test('должен добавлять товары в корзину', async () => {
      const CartComponent = {
        template: `
          <div>
            <div class="cart-items">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <span>{{ item.name }}</span>
                <span>{{ item.quantity }}</span>
                <span>{{ item.price * item.quantity }} ₽</span>
              </div>
            </div>
            <div class="total">Итого: {{ total }} ₽</div>
          </div>
        `,
        data() {
          return {
            cartItems: []
          };
        },
        computed: {
          total() {
            return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          }
        },
        methods: {
          addToCart(product) {
            const existingItem = this.cartItems.find(item => item.id === product.id);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              this.cartItems.push({ ...product, quantity: 1 });
            }
          }
        }
      };

      const wrapper = mount(CartComponent);

      // Добавляем товар в корзину
      const product = { id: 1, name: 'Ролл Калифорния', price: 350 };
      wrapper.vm.addToCart(product);
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.cart-item')).toHaveLength(1);
      expect(wrapper.find('.total').text()).toBe('Итого: 350 ₽');

      // Добавляем тот же товар еще раз
      wrapper.vm.addToCart(product);
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.cart-item')).toHaveLength(1);
      expect(wrapper.find('.total').text()).toBe('Итого: 700 ₽');
    });
  });

  describe('Аутентификация', () => {
    test('должен выполнять вход пользователя', async () => {
      const mockUser = {
        id: 'user1',
        phone: '+7 (999) 123-45-67',
        role: 'user'
      };

      global.axios.post.mockResolvedValue({ 
        data: { 
          token: 'mock-token',
          user: mockUser
        } 
      });

      const LoginComponent = {
        template: `
          <form @submit.prevent="login">
            <input v-model="phone" placeholder="Телефон" />
            <input v-model="password" type="password" placeholder="Пароль" />
            <button type="submit">Войти</button>
          </form>
        `,
        data() {
          return {
            phone: '',
            password: ''
          };
        },
        methods: {
          async login() {
            try {
              const response = await global.axios.post('/api/login', {
                phone: this.phone,
                password: this.password
              });
              
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('role', response.data.user.role);
              
              this.$emit('login-success', response.data.user);
            } catch (error) {
              this.$emit('login-error', error);
            }
          }
        }
      };

      const wrapper = mount(LoginComponent);

      // Заполняем форму
      await wrapper.find('input[placeholder="Телефон"]').setValue('+7 (999) 123-45-67');
      await wrapper.find('input[type="password"]').setValue('password123');
      
      // Отправляем форму
      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(global.axios.post).toHaveBeenCalledWith('/api/login', {
        phone: '+7 (999) 123-45-67',
        password: 'password123'
      });

      expect(wrapper.emitted('login-success')).toBeTruthy();
      expect(wrapper.emitted('login-success')[0][0]).toEqual(mockUser);
    });
  });

  describe('API взаимодействие', () => {
    test('должен обрабатывать ошибки API', async () => {
      global.axios.get.mockRejectedValue(new Error('Network Error'));

      const ApiComponent = {
        template: `<div>{{ error || 'Загрузка...' }}</div>`,
        data() {
          return { error: null };
        },
        async mounted() {
          try {
            await global.axios.get('/api/products');
          } catch (error) {
            this.error = 'Ошибка загрузки данных';
          }
        }
      };

      const wrapper = mount(ApiComponent);
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(wrapper.text()).toBe('Ошибка загрузки данных');
    });
  });
});
