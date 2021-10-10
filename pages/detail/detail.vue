<template>
	<view>
		<view class="background" :style="{backgroundImage:'url('+ songDetail.al.picUrl +')'}"></view>
		<customNavBar :title="songDetail.name" :iconShow="iconShow" :style="{color:color}"></customNavBar>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="detail-play">
					<view class="detail-play-icon">
						<image class="text-icon" src="../../static/wangyiyunyinyue.png"></image>
						<!-- :src="playlist.creator.avatarUrl" -->
						<text>
							<!-- {{playlist.creator.nickname}} -->网易云音乐</text>
					</view>
					<view class="detail-play-control" @tap="handleToPlay">
						<image :src="songDetail.al.picUrl" :class="{'detail-play-run':isPlaying}" mode=""></image>
						<text class="iconfont" :class="playIcon" ></text>
						<view></view>
					</view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrapper" :style="{transform:'translateY('+ -(lyricIndex-1)*82 +'rpx)'}">
						<view class="detail-lyric-item " :class="{active:lyricIndex==index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
					</view>
				</view>
				<view class="detail-look">
					在网易云音乐查看更多歌词
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="detail-share" open-type="share">
					<text>分享给微信好友</text>
				</button>
				<!-- #endif -->
				<view class="detail-like">
					<view class="detail-like-title">
						喜欢这首歌的人也听
					</view>
					<view class="detail-like-item" v-for="(songitem,index) in songSimi" @tap="handleToSimiPlay(songitem.id)" :key="index">
						<image class="song-index" :src="songitem.album.blurPicUrl"></image>
						<view class="song-content">
							<view class="song-name">{{songitem.name}}</view>
							<view class="song-info">
								<image src="../../static/dujia.png" v-if=" songitem.privilege.flag > 60 && songitem.privilege.flag < 70" mode=""></image>
								<image src="../../static/sq.png" v-if="songitem.privilege.maxbr===999000" mode=""></image>{{songitem.artists | arName }}-{{songitem.name}}
							</view>
						</view>
						<text class="iconfont icon-bofang1"></text>
					</view>
				</view>
				<view class="detail-comment">
					<view class="detail-comment-title">
						精彩评论
					</view>
					<view class="detail-comment-item" v-for="(commemtItem,index) in songComment" :key="index">
						<view class="detail-comment-image">
							<image :src="commemtItem.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="comment-head">
								<view class="comment-user">
									<view>{{commemtItem.user.nickname}}</view>
									<view>{{commemtItem.time | formatTime}}</view>
								</view>
								<view class="comment-like">
									{{commemtItem.likedCount | formatCount}} <text class="iconfont icon-icon-"></text>
								</view>
							</view>
							<view class="comment-info">
								{{commemtItem.content}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import customNavBar from '@/components/customNavBar/customNavBar.vue'

	import {
		songDetail,
		songLyric,
		songUrl,
		songSimi,
		songComment
	} from '@/common/api.js'
	export default {
		data() {
			return {
				iconShow: true,
				// title: "歌单",
				color: "white",
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				
				lyricIndex:0,
				playIcon:'icon-zanting',
				 // icon-bofang1
				isPlaying:true
			}
		},
		// props:['title'],
		onLoad(options) {
			// console.log(options.songId)
			this.getSongInfo(options.songId)
		},
		onUnload() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannager.destroy();
			// #endif
		},
		onHide() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannager.destroy();
			// #endif
		},
		methods: {
			getSongInfo(songId) {
				// this.$store.commit('GET_NEXTID',songId)
				this.$store.dispatch('getNextId',songId)
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(songId)]).then((
					res) => {
					// console.log(res)
					if (res[0][1].data.code === 200) {
						this.songDetail = res[0][1].data.songs[0]
						// console.log(this.songDetail)
					}
					if (res[1][1].data.code === 200) {
						this.songSimi = res[1][1].data.songs
						// console.log(this.songSimi)
					}
					if (res[2][1].data.code === 200) {
						this.songComment = res[2][1].data.hotComments
						// console.log(this.songComment)
					}
					if (res[3][1].data.code === 200) {
						let lyric = res[3][1].data.lrc.lyric
						const reg = /\[([^\]]+)\]([^\[]+)/g
						let result =[]
						lyric.replace(reg,(matchstr,$1,$2) => {
							result.push({time:this.formatTime($1),lyric:$2})
						})
						// console.log(result)
						this.songLyric=result
					}
					if(res[4][1].data.code===200){
						// #ifdef MP-WEIXIN						
							this.bgAudioManager = uni.getBackgroundAudioManager();
						// #endif
						// #ifdef H5
							if(!this.bgAudioManager){					
								this.bgAudioManager = uni.createInnerAudioContext();
							}
							this.playIcon='icon-bofang1',
							this.isPlaying=false
						// #endif
							this.bgAudioManager.title = this.songDetail.name;
						// // this.bgAudioManager.singer = '暂无';
						// // this.bgAudioManager.coverImgUrl = '';
						this.bgAudioManager.src = res[4][1].data.data[0].url || '';
						console.log(this.bgAudioManager.destroy)
						this.listenLyricIndex()
						this.bgAudioManager.onPlay(() => {
							this.playIcon='icon-zanting',
							this.isPlaying=true
							this.listenLyricIndex()
						})
						this.bgAudioManager.onPause(() => {
							this.playIcon='icon-bofang1',
							this.isPlaying=false
							this.cancelLyricIndex()
						})
						this.bgAudioManager.onEnded(()=>{
							this.getSongInfo(this.$store.state.nextId)
						})
					}
				})
			},
			formatTime(time){
				const arr  = time.split(":")
				return (parseFloat(arr[0]*60)+parseFloat(arr[1])).toFixed(2)
			},
			handleToPlay(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play()
				}else{
					this.bgAudioManager.pause()
				}
			},
			handleToSimiPlay(songId){
				this.getSongInfo(songId)
			},
			listenLyricIndex(){
				clearInterval(this.timer)
				this.timer = setInterval(()=>{
					for(var i=0;i<this.songLyric.length;i++){						
						if(this.bgAudioManager.currentTime>this.songLyric[this.songLyric.length-1]){
							this.lyricIndex = this.songLyric.length-1;
							break;
						}
						if(this.bgAudioManager.currentTime>=this.songLyric[i].time && this.bgAudioManager.currentTime<this.songLyric[i+1].time){
							this.lyricIndex=i
						}
					}
				},500)
			},
			cancelLyricIndex(){
				clearInterval(this.timer)
			}
		},
		components: {
			customNavBar
		}
	}
</script>

<style scoped lang="scss">
	.detail-play {
		width: 100%;

		.detail-play-control {
			width: 580rpx;
			height: 580rpx;
			margin: 210rpx auto 44rpx auto;
			background: url(~@/static/disc.png);
			position: relative;
			background-size: cover;

			>image {
				width: 380rpx;
				height: 380rpx;
				border-radius: 50%;
				animation: 10s linear move infinite;
				animation-play-state: paused;
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				margin: auto;
				&.detail-play-run{
					animation-play-state: running;
				}
			}

			.iconfont {
				width: 100rpx;
				height: 100rpx;
				font-size: 100rpx;
				color: white;
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				margin: auto;
			}

			>view {
				width: 250rpx;
				height: 409rpx;
				background: url(~@/static/needle-ab.png);
				background-size: cover;
				position: absolute;
				top: -170rpx;
				left: 50%;
				right: 0;
				margin: auto;
			}
		}

		.detail-play-icon {
			position: absolute;
			top: 8rpx;
			left: 8rpx;
			display: flex;
			align-items: center;
			margin: 30rpx 0;
			z-index: 2;

			>image {
				display: inline-block;
				width: 52rpx;
				height: 52rpx;
				border-radius: 50%;
			}

			>text {
				font-size: 28rpx;
				color: white;
				margin-left: 15rpx;
			}
		}
	}
	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
	.detail-lyric {
		height: 246rpx;
		line-height: 82rpx;
		font-size: 32rpx;
		text-align: center;
		color: #949495;
		overflow: hidden;

		.detail-lyric-wrapper {
			transition: .5s;

			.detail-lyric-item {
				height: 82rpx;

				&.active {
					color: white;
				}
			}
		}
	}

	.detail-look {
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		text-decoration: underline;
		color: white;
	}

	.detail-share {
		width: 330rpx;
		height: 72rpx;
		line-height: 72rpx;
		margin-top: 100rpx;
		border: 1px solid white;
		border-radius: 36rpx;
		background: rgba($color: #000000, $alpha: 0.4);
		margin: 0 auto;

		>text {
			font-size: 28rpx;
			color: white;
			text-align: center;
		}
	}

	.detail-like {
		margin: 0 30rpx;

		.detail-like-title {
			font-size: 36rpx;
			color: white;
			margin: 50rpx 0;
		}

		.detail-like-item {
			display: flex;
			margin-bottom: 38rpx;
			align-items: center;

			.song-index {
				width: 82rpx;
				height: 82rpx;
				border-radius: 15rpx;
				overflow: hidden;
				margin-right: 20rpx;
			}

			.song-content {
				display: flex;
				flex-direction: column;

				.song-name {
					font-size: 30rpx;
					width: 70vw;
					color: white;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.song-info {
					font-size: 22rpx;
					color: #a2a2a2;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					>image {
						width: 34rpx;
						height: 22rpx;
						margin-right: 10rpx;
					}

				}

			}

			.icon-bofang1 {
				font-size: 50rpx;
				color: #c8c8c8;
			}
		}
	}

	.detail-comment {
		margin: 0 30rpx;

		.detail-comment-title {
			font-size: 36rpx;
			color: white;
			margin: 50rpx 0;
		}

		.detail-comment-item {
			display: flex;
			margin-bottom: 28rpx;

			.detail-comment-image {
				width: 66rpx;
				height: 66rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 18rpx;
				flex: 0 0 66rpx;

				>image {
					width: 100%;
					height: 100%;

				}
			}

			.detail-comment-content {
				flex: 1;
				color: #5E5E5E;
				.comment-head {
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					.comment-user {
						>view:nth-child(1){
							font-size:24rpx;
							color: #999999;
						}
						>view:nth-child(2){
							font-size:20rpx;
						}
					}

					.comment-like {
						font-size: 24rpx;						
						.icon-icon-{
							font-size: 30rpx;
							margin-left: 6rpx;
						}
					}
				}

				.comment-info {
					line-height: 40rpx;
					color: white;
					font-size: 28rpx;
					margin-top: 16rpx;
					border-bottom: 1px #595860 solid;
					padding-bottom: 40rpx;
				}
			}
		}
	}
</style>
