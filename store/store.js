import Vuex from 'vuex'
// 1.导入购物车的 vuex 模块
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'


const store = new Vuex.Store({
	modules: {
		m_cart: moduleCart,
		m_user: moduleUser,
	}
})

export default store