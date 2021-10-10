import Vue from 'vue'
import App from './App'
import store from './store/index.js'
Vue.config.productionTip = false

import filters from '@/filters/index.js'
Object.keys(filters).forEach(key=>Vue.filter(key,filters[key]))


App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
