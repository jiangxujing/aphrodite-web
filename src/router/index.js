import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/pages/Header'
import Login from '@/pages/Login'
import ObjManagement from '@/pages/ObjManagement'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
		path: '/',
		name: 'Header',
		component: Header,
		children: [{
			path: '/ObjManagement',
			name: 'ObjManagement',
			component: ObjManagement
		}]
	}, {
		path: '/Login',
		name: 'Login',
		component: Login
	}]
})