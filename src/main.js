// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios' 
import echarts from 'echarts'
import Vuex from 'vuex'

import './assets/globa.css'
Vue.prototype.$echarts = echarts 
/*Vue.config.productionTip = false*/
Vue.prototype.$ajax = axios

Vue.use(Vuex)

let store = new Vuex.Store({
	state:{
		Email_person:{},
		Check_person:{},
		Web_person:{}
	},
	getters:{
		getEmail_person (state) {
			return state.Email_person
		},
		getECheck_person (state) {
			return state.Check_person
		},
		getWeb_person (state) {
			return state.Web_person
		}
	},
	mutations:{
		getEmail_personMutation(state,aim){
			state.Email_person = aim
		},
		Check_personMutation(state,aim){
			state.Check_person = aim
		},
		Web_personMutation(state,aim){
			state.Web_person = aim
		}
	},
	actions:{
		getEmail_personAction(context,aim) {
			context.commit('getEmail_personMutation',aim)
		},
		Check_person_personAction(context,aim) {
			context.commit('Check_personMutation',aim)
		},
		Web_person_personAction(context,aim) {
			context.commit('Web_personMutation',aim)
		}
	}
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})