<template>
	<view class="nav">
		<view class="navbar" :style="{color:color}">
			<view class="navbar_left " v-if="iconShow" :class="{navbar_left_black: iconBlack}" >
				<text class="iconfont icon-zuojiantou" @click="handleToBack()"></text>|
				<text class="iconfont icon-shouye-tianchong" @click="handleToHome()"></text>
			</view>
			{{title}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:['title','iconShow','color','iconBlack'],
		methods:{
			handleToBack(){
				uni.navigateBack()
			},
			handleToHome(){
				uni.navigateTo({
					url:'../../pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
.nav{
	margin-bottom: 75px;
}
.navbar{
	position: fixed;
	top: 0;
	left: 0;
	z-index: 5;
	width: 100%;
	height: 75px;
	line-height: 80px;
	text-align: center;
	overflow: hidden;
	font-size: 16px;
	color: #000;
	.navbar_left{
		width: 97px;
		height: 31px;
		line-height: 31px;
		border-radius: 15px;
		background-color: rgba(0,0,0,0.5);
		color: #fff;
		position: absolute;
		left: 10px;
		top: 25px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		&.navbar_left_black{
			background: white;
			border: 1px black solid;
			.iconfont{
				color: black;
			}
		}
	}
}
</style>
