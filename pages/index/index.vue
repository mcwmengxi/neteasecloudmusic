<template>
	<view class="content">
		<customNavBar :title="title" :iconShow="iconShow"></customNavBar>
		<view class="container">
			<view class="index_login">
				<view class="lgoin_info">			
					<text class="iconfont icon-wode"></text>
					<text class="login_info_text">未登录</text>
				</view>
				<navigator url="/pages/login/login"><button class="login_btn" type="default">立即登录</button></navigator>
						
			</view>
			<view class="index_serach" @tap="handleToSerach">
				<text class="iconfont icon-search"></text>
				<input type="text" value="" placeholder="搜索歌曲" />
			</view>
			<view v-if="isLoading">
				<mForSkeleton
					:avatarSize="200"
					:row="3"
					:title="false"
					:titleStyle="{}"
					:loading="isLoading"
					isarc="square"
					v-for="(item,key) in 10"
					:key="key">
				</mForSkeleton>
			</view>
			<view class="index-list" v-else>			
				<view class="index-list-item" v-for="(topdetail,index) in topList" :key="index" @tap="handleToSongList(topdetail.id)">
					<view class="index-list-img">
						<image :src="topdetail.coverImgUrl" mode=""></image>
						<text>{{topdetail.updateFrequency}}</text>
					</view>
					<view class="index-list-text">
						<view v-for="(track,index) in topdetail.tracks" :key="index">{{index+1}}.{{track.first}}-{{track.second}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customNavBar from '@/components/customNavBar/customNavBar.vue'
	import mForSkeleton  from '@/components/m-for-skeleton/m-for-skeleton.vue'
	import {ToplistDetail} from '@/common/api.js'
	export default {
		data() {
			return {
				iconShow:false,
				title: '网易云音乐',
				topList:[],
				isLoading:true
			}
		},
		onLoad() {
			ToplistDetail().then((result)=>{
				if(result.length){
					setTimeout(()=>{
						this.topList = result
						this.isLoading=false
					},1000)
				}
				
				// console.log(this.topList)
			})
		},
		methods: {
			handleToSongList(id){
				uni.navigateTo({
					url:'../../pages/list/list?id='+id
				})
			},
			handleToSerach(){
				uni.navigateTo({
					url:'/pages/serach/serach'
				})
			}
		},
		components:{
			customNavBar,
			mForSkeleton
		}
	}
</script>

<style lang="scss" scoped>
	.index_login{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 53rpx;
		padding:10rpx 30rpx 10rpx 30rpx;
		.lgoin_info{
			display: flex;
			align-items: center;
			.icon-shouye-tianchong{
				font-size: 40rpx;
			}
			.login_info_text{
				line-height: 40rpx;
				color: #808080;
				margin-left: 10rpx;
				font-size: 22rpx;
			}
		}
		.login_btn{
			width: 120rpx;
			height: 40rpx;
			line-height: 40rpx;
			border: 1rpx solid rgba($color: #808080, $alpha: 0.5);
			background: #fff;
			border-radius: 50rpx;
			font-size: 22rpx;
			overflow: hidden;
			padding: 0;
		}
	}
	.index_serach{
		display: flex;
		align-items: center;
		height: 73rpx;
		margin:10rpx 30rpx 10rpx 30rpx;
		border-radius: 50rpx;
		background-color: #f7f7f7;
		>text{
			margin:0 27rpx;
		}
		>input{
			flex: 1;
			font-size:26rpx;
		}
	}
	.index-list{
		margin: 0 30rpx;
		.index-list-item{
			display: flex;
			margin-bottom: 35rpx;
			.index-list-img{
				width: 212rpx;
				height: 212rpx;
				margin-right: 20rpx;
				border-radius: 15rpx;
				overflow: hidden;
				position: relative;
				>image{
					width: 100%;
					height: 100%;
				}
				>text{
					position: absolute;
					bottom: 15rpx;
					left: 15rpx;
					font-size: 22rpx;
					color: #FFFFFF;
				}
			}
			.index-list-text{
				flex: 1;
				font-size: 24rpx;
				line-height: 68rpx;
				width: 200rpx;
				overflow:hidden;
				>view{
					width: 400rpx;
					// display: block;
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
				}
			}
		}
	}
</style>
