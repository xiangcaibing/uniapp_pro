<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				// 请求参数
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pageSize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 是否在请求数据
				isLoading: false
			};
		},
		onLoad(options) {
			// console.log(options)
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		methods: {
			// 点击跳转到商品详情页面
			gotoDetail(item){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			async getGoodsList(cb) {
				// 打开节流阀
				this.isLoading = true
				// 发起请求
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 关闭节流阀
				this.isLoading = false
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				
				if(res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				console.log(this.goodsList)
				console.log(this.total)
			}
		},
		// 触底事件
		onReachBottom() {
			// 判断是否有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pageSize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在请求其他数据，如果是，则不发起额外的请求
			if(this.isLoading) return
			// 让页码值自增
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
		},
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []
			
			// 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
