// РСЃРїРѕР»СЊР·СѓРµРј РіР»РѕР±Р°Р»СЊРЅС‹Рµ СЃР±РѕСЂРєРё Vue Рё VueRouter, РїРѕРґРєР»СЋС‡С‘РЅРЅС‹Рµ С‡РµСЂРµР· CDN.
const { createApp, reactive, ref, computed, onMounted, onUnmounted, watch } = Vue;
const { createRouter, createWebHistory } = VueRouter;
const { useRouter, useRoute } = VueRouter;

// РСЃРїРѕР»СЊР·СѓРµРј РіР»РѕР±Р°Р»СЊРЅС‹Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ, Р·Р°РіСЂСѓР¶РµРЅРЅС‹Рµ РёР· РјРѕРґСѓР»РµР№
// Р­С‚Рё РїРµСЂРµРјРµРЅРЅС‹Рµ Р±СѓРґСѓС‚ РґРѕСЃС‚СѓРїРЅС‹ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё РјРѕРґСѓР»РµР№ РІ index.html

// РџСЂРѕРІРµСЂСЏРµРј РґРѕСЃС‚СѓРїРЅРѕСЃС‚СЊ Р°РґРјРёРЅСЃРєРёС… РєРѕРјРїРѕРЅРµРЅС‚РѕРІ Рё СЃРѕР·РґР°РµРј fallback
const AdminOrdersView = window.AdminOrdersView || { name: 'AdminOrdersView', template: '<div>Р—Р°РіСЂСѓР·РєР°...</div>' };
