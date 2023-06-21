<template>
	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<radio @click="radioChangeHandler" :checked="goods.goods_state" color="#c00000" v-if="showRadio"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			    <view class="goods-info-box">
			        <!-- 商品价格 -->
					<view class="goods-price">￥{{(goods.goods_price).toFixed(2)}}</view>
					<!-- 商品数量 -->
					<uni-number-box v-if="showNum" :min="1" :value="goods.goods_count" @change="numberChangeHandler"></uni-number-box>
			    </view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		props: {
			// 商品的信息对象
			goods: {
				type: Object,
				default: {}
			},
			// 是否展示图片左侧的 radio
			showRadio: {
				type: Boolean,
				default: false,
			},
			// 是否显示右侧 NumberBox 组件
			showNum: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		methods: {
			radioChangeHandler(){
				this.$emit('radio-change', {
					// 商品id
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			numberChangeHandler(val){
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: +val
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item {
	width: 750rpx;
	box-sizing: border-box;
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	
	.goods-item-left {
		margin-right: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.goods-pic {
			width: 100px;
			height: 100px;
			display: block;
		}
	}
	
	.goods-item-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.goods-name {
			font-size: 13px
		}
		.goods-info-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.goods-price {
			font-size: 16px;
			color: #c00000;
		}
	}
}
</style>