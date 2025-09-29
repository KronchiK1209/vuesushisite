// Модуль личного кабинета (заглушка)
(function(){
  const { ref } = Vue;

  window.AccountView = {
    name: 'AccountView',
    template: /* html */`
      <div class="min-h-screen bg-gray-50 py-10">
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
                <i class="fa-solid fa-user text-2xl"></i>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Личный кабинет</h1>
            </div>
            <p class="text-gray-600">Скоро здесь появится: история заказов, настройки профиля, адреса доставки и бонусы.</p>
            <div class="mt-6 grid sm:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div class="font-semibold text-gray-800 mb-1">История заказов</div>
                <div class="text-sm text-gray-500">Просматривайте прошлые заказы и повторяйте любимые.</div>
              </div>
              <div class="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div class="font-semibold text-gray-800 mb-1">Профиль</div>
                <div class="text-sm text-gray-500">Редактируйте имя, телефон и e‑mail.</div>
              </div>
              <div class="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div class="font-semibold text-gray-800 mb-1">Адреса</div>
                <div class="text-sm text-gray-500">Сохраняйте адреса для быстрой доставки.</div>
              </div>
              <div class="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div class="font-semibold text-gray-800 mb-1">Бонусы</div>
                <div class="text-sm text-gray-500">Копите и используйте бонусные баллы.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    setup() {
      return {};
    }
  };
})();


