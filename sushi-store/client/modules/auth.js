// Модуль аутентификации: современный вход/регистрация для пользователей
// Регистрирует window.LoginView

(function(){
  const { ref, computed } = Vue;

  window.LoginView = {
    name: 'LoginView',
    template: /* html */`
      <div class="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center py-12 px-4">
        <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Левая панель с иллюстрацией -->
          <div class="hidden md:flex flex-col justify-between bg-white/10 rounded-3xl p-8 text-white shadow-2xl glass-effect">
            <div>
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"><i class="fa-solid fa-user-shield text-2xl"></i></div>
                <h2 class="text-2xl font-bold">Личный кабинет</h2>
              </div>
              <p class="text-white/90 leading-relaxed">Войдите, чтобы быстрее оформлять заказы, видеть историю покупок и оставлять отзывы. Регистрация занимает 1 минуту.</p>
            </div>
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-white/10 rounded-2xl p-4">
                <div class="text-2xl font-bold">1 мин</div>
                <div class="text-xs text-white/80">регистрация</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-4">
                <div class="text-2xl font-bold">10%</div>
                <div class="text-xs text-white/80">акции и бонусы</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-4">
                <div class="text-2xl font-bold">24/7</div>
                <div class="text-xs text-white/80">поддержка</div>
              </div>
            </div>
          </div>

          <!-- Правая панель: формы -->
          <div class="bg-white rounded-3xl p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-2xl font-bold text-gray-900 flex items-center"><i class="fa-solid fa-right-to-bracket text-orange-600 mr-3"></i>{{ isRegister ? 'Регистрация' : 'Вход' }}</h1>
              <button @click="toggle" class="text-sm text-orange-600 hover:text-orange-700">
                {{ isRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт' }}
              </button>
            </div>

            <div class="flex space-x-2 mb-6">
              <button :class="tabBtn(!isRegister)" @click="isRegister=false"><i class="fa-solid fa-unlock-keyhole mr-2"></i>Вход</button>
              <button :class="tabBtn(isRegister)" @click="isRegister=true"><i class="fa-solid fa-user-plus mr-2"></i>Регистрация</button>
            </div>

            <form v-if="!isRegister" @submit.prevent="login" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"><i class="fa-solid fa-phone mr-2 text-orange-500"></i>Телефон</label>
                <input v-model="loginForm.phone" type="tel" placeholder="+7 (999) 123-45-67" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"><i class="fa-solid fa-key mr-2 text-orange-500"></i>Пароль</label>
                <input v-model="loginForm.password" type="password" placeholder="••••••" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{{ error }}</div>
              <button :disabled="loading" class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow transition">
                <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-2"></i>
                <i v-else class="fa-solid fa-right-to-bracket mr-2"></i>
                {{ loading ? 'Входим...' : 'Войти' }}
              </button>
            </form>

            <form v-else @submit.prevent="register" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"><i class="fa-solid fa-user mr-2 text-orange-500"></i>Имя</label>
                <input v-model="registerForm.name" type="text" placeholder="Иван" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"><i class="fa-solid fa-envelope mr-2 text-orange-500"></i>Email (необязательно)</label>
                <input v-model="registerForm.email" type="email" placeholder="ivan@example.com" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"><i class="fa-solid fa-phone mr-2 text-orange-500"></i>Телефон</label>
                <input v-model="registerForm.phone" type="tel" placeholder="+7 (999) 123-45-67" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"><i class="fa-solid fa-key mr-2 text-orange-500"></i>Пароль</label>
                <input v-model="registerForm.password" type="password" minlength="6" placeholder="Минимум 6 символов" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm">{{ success }}</div>
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{{ error }}</div>
              <button :disabled="loading" class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow transition">
                <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-2"></i>
                <i v-else class="fa-solid fa-user-plus mr-2"></i>
                {{ loading ? 'Регистрируем...' : 'Зарегистрироваться' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    `,
    setup() {
      const isRegister = ref(false);
      const loading = ref(false);
      const error = ref('');
      const success = ref('');
      const loginForm = ref({ phone: '', password: '' });
      const registerForm = ref({ name: '', email: '', phone: '', password: '' });

      function tabBtn(active) {
        return [
          'flex-1 px-4 py-2 rounded-xl border text-sm font-semibold transition',
          active ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        ].join(' ');
      }

      function setToken(token) {
        try {
          localStorage.setItem('admin_token', token); // использует существующую схему
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        } catch (_) {}
      }

      function setUser(user) {
        try {
          localStorage.setItem('auth_user', JSON.stringify(user || null));
        } catch (_) {}
      }

      async function login() {
        loading.value = true; error.value = ''; success.value='';
        try {
          const res = await axios.post('/api/auth/login', loginForm.value);
          if (res.data?.token) {
            setToken(res.data.token);
            if (res.data?.user) setUser(res.data.user);
            window.location.href = '/';
          } else {
            error.value = 'Не удалось выполнить вход';
          }
        } catch (e) {
          error.value = e.response?.data?.error || 'Ошибка входа';
        } finally {
          loading.value = false;
        }
      }

      async function register() {
        loading.value = true; error.value = ''; success.value='';
        try {
          const res = await axios.post('/api/auth/register', registerForm.value);
          if (res.data?.token) {
            setToken(res.data.token);
            if (res.data?.user) setUser(res.data.user);
            success.value = 'Регистрация успешна! Вы автоматически вошли в систему.';
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            success.value = 'Регистрация успешна! Теперь можете войти.';
            isRegister.value = false;
            loginForm.value = { phone: registerForm.value.phone, password: registerForm.value.password };
          }
        } catch (e) {
          error.value = e.response?.data?.error || 'Ошибка регистрации';
        } finally {
          loading.value = false;
        }
      }

      function toggle() { isRegister.value = !isRegister.value; error.value=''; success.value=''; }

      return { isRegister, loading, error, success, loginForm, registerForm, login, register, toggle, tabBtn };
    }
  };
})();


