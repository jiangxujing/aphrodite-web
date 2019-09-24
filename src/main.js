import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import api from './common/api.js'
import utils from './common/utils.js'
//import "babel-polyfill"
// 将工具方法绑定到全局
Vue.prototype.$utils = utils
// 将API方法绑定到全局
Vue.prototype.$api = api
Vue.use(ElementUI)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
        let account = sessionStorage.getItem('userName')
        if (to.path === '/Login') {
            if (account) {
                next('/ObjManagement.vue')
            } else {
                next()
                return
            }
        }
        if (!account && to.path !== '/Login') {
            next({ path: '/Login' })
        } else {
            next()
        }
        if (!account) {
            next({ path: '/Login' })
            return
        }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
