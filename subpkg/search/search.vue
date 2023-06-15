<template>
	<view>
		<view class="search-box">
			<uni-search-bar :radius="100" @input="input" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 索索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" @click="gotoDetail(item)" v-for="(item, i) in searchResults" :key="i">
				<view class="goods_name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag v-for="(item, i) in histories" :key="i" :text="item" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器的 timerId
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索列表
				searchResults: [],
				historyList: ['a','app','apple']
			};
		},
		methods: {
			// 点击跳转到商品列表页面
			gotoGoodsList(kw){
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			},
			// 情况搜索历史记录
			cleanHistory(){
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			// input 输入时间的处理函数
			input (e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					// 如果 500 毫秒内 没有触发新的事件 则为搜索关键词赋值
					this.kw = e
					this.getSearchList()
					// console.log(this.kw)
				}, 500)	
			},
			async getSearchList () {
				// 判断搜索关键词是否为空
				if(this.kw.length === 0) {
					this.searchResults = []
					return
				}
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search',{query: this.kw})
				if(res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message.goods
				console.log(res)
				// 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
				this.saveSearchHistory()
			},
			// 保存搜索关键词的方法
			saveSearchHistory () {
				// this.historyList.push(this.kw)
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				
				this.historyList = Array.from(set)
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
			},
			gotoDetail(item) {
				console.log(item.goods_id)
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		computed: {
			histories () {
				return [...this.historyList].reverse()
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw')|| '[]')
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
.sugg-list {
	padding: 0 5px;
	.sugg-item {
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.goods_name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}
.history-box {
	padding: 0 5px;
	.history-title {
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list {
		display: flex;
		flex-wrap: wrap;
		.uni-tag {
			margin-top: 5px;
			margin-right: 5px;
			background-color: #efefef;
			color: black;
		}
	}
}
</style>