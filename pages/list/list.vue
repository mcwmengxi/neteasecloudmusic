<template>
	<view >
		<view class="background" :style="{backgroundImage:'url('+playlist.coverImgUrl+')'}"></view>
		<customNavBar :title="title" :iconShow="iconShow" :style="{color:color}"></customNavBar>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl" mode=""></image>
						<text class="iconfont icon-yousanjiao">{{playlist.playCount | formatCount}}</text>
						
					</view>
					<view class="list-head-text">
						<view class="text-title">
							{{playlist.name}}
						</view>
						
						<view class="text-name">
							<image class="text-icon" :src="playlist.creator.avatarUrl"></image>
							<text>{{playlist.creator.nickname}}</text>
						</view>
						<view class="text-description">
							<text class="description-info">{{playlist.description}}</text>
							<text class="iconfont icon-youjiantou"></text>
						</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button v-show="isShow" class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-song">
					<view class="list-song-title" v-show="isShow">
						<text class="iconfont icon-bofang"></text>
						<text class="list-playall">播放全部</text>
						<text class="list-count">(共{{ playlist.trackCount }}首)</text>
					</view>
					<view class="list-song-item" v-for="(track,index) in playlist.tracks" :key="index" @tap="handleToSongDetail(track.id)">
						<view class="song-index">{{index+1}}</view>
						<view class="song-content">
							<view class="song-name">{{track.name}}</view>
							<view class="song-info">
								<image src="../../static/dujia.png" v-if=" privileges[index].flag > 60 && privileges[index].flag < 70" mode="" ></image>
								<image src="../../static/sq.png" v-if="privileges[index].maxbr===999000" mode=""></image>{{track.ar | arName}}-{{track.name}}
							</view>
						</view>					
						<text class="iconfont icon-bofang1"></text>
					</view>					
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script >
	import {PlaylistDetail} from '@/common/api.js'
	import customNavBar from '@/components/customNavBar/customNavBar.vue'
	export default {
		data() {
			return {
				iconShow:true,
				title:"歌单",
				color:"white",
				playlist:{
					coverImgUrl : '',
					trackCount : '',
					creator : '',
					tracks:[]
				},
				privileges:[],
				isShow:false
			}
		},
		onLoad(options) {
			uni.showLoading({
			    title: '加载中'
			});
			// console.log(options)
			PlaylistDetail(options.id).then((res)=>{
				if(res[1].data.code===200){			
					this.playlist = res[1].data.playlist
					this.privileges = res[1].data.privileges
					// this.$store.commit([GET_TOPLISTID],this.playlist.trackIds)
					this.$store.dispatch('getTopListId',this.playlist.trackIds)
					uni.hideLoading()
					this.isShow=true
					
				}
				// console.log(this.playlist)
			})
		
		},
		methods: {
			handleToSongDetail(songId){
				uni.navigateTo({
					url:'../detail/detail?songId='+songId
				})
			}
		},
		mounted() {
			
		},
		components:{
			customNavBar
		}
	}
</script>

<style lang="scss" scoped>
	.list-head{
		display: flex;
		margin: 30rpx;
		.list-head-img{
			width: 265rpx;
			height: 265rpx;
			margin-right: 40rpx;
			border-radius: 15rpx;
			position: relative;
			overflow: hidden;
			>image{
				width: 100%;
				height: 100%;
			}
			>text{
				position: absolute;
				top: 8rpx;
				right: 8rpx;
				font-size: 26rpx;
				color: white;		
			}
		}
		.list-head-text{
			flex: 1;
			color:#c3d1e3;
			font-size: 24rpx;
			.text-title{
				font-size: 34rpx;
				color: white;
			}
			.text-name{
				display: flex;
				align-items: center;
				margin: 30rpx 0;
				>image{
					display: inline-block;
					width: 52rpx;
					height: 52rpx;
					border-radius: 50%;
					
				}
				>text{
					font-size: 28rpx;
					margin-left: 15rpx;
				}
			}
			.text-description{
				font-size: 24rpx;
				line-height: 38rpx;
				.description-info{
					display: -webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
					overflow: hidden;
				}
				.icon-youjiantou{
					font-size: 24rpx;
				}
			}
		}
	}
	.list-share{
		width: 330rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		font-size: 26rpx;
		border-radius: 36rpx;
		color: white;
		background: rgba($color: #000000, $alpha: 0.4);
		margin: 0 auto;
		>text{
			margin-right: 15rpx;
		}
	}
	.list-song{
		background: white;
		border-radius: 50rpx;
		overflow: hidden;
		margin-top: 45rpx;
		.list-song-title{
			height: 58rpx;
			line-height: 58rpx;
			display: flex;
			align-items: center;
			margin: 30rpx 30rpx 70rpx 30rpx;
			.icon-bofang{
				font-size: 58rpx;
			}
			.list-playall{
				font-size: 34rpx;
				margin: 0 10rpx 0 25rpx;
			}
			.list-count{
				font-size: 28rpx;
				color: #b2b2b2;
			}
		}
		.list-song-item{
			display: flex;
			margin:0 30rpx 50rpx 44rpx;
			align-items: center;
			.song-index{
				width:56rpx;
				font-size:28rpx;
				color:#979797;
			}
			.song-content{
				display: flex;
				flex-direction: column;
				.song-name{
					font-size:30rpx; 
					width:70vw; 
					white-space: nowrap; 
					overflow: hidden; 
					text-overflow: ellipsis;
				}
				.song-info{
					font-size:22rpx; 
					color:#a2a2a2; 
					width:70vw; 
					white-space: nowrap; 
					overflow: hidden; 
					text-overflow: ellipsis;
					>image{
						width:34rpx; 
						height:22rpx; 
						margin-right:10rpx;
					}
					
				}
				
			}
			.icon-bofang1{
				font-size:50rpx; 
				color:#c8c8c8;
			}
		}
		
	}
</style>
