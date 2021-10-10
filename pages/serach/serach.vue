<template>
	<view>
		<customNavBar :title="title" :iconShow="iconShow" :iconBlack="iconBlack" ></customNavBar>
		<view class="serach">
			<text class="iconfont icon-search"></text>
			<input type="text" v-model="searchWord" @confirm="handleToSearch" @input="handleToSuggest" value="" placeholder="搜索歌曲" />
			<text v-show="searchType == 2" class="iconfont icon-guanbi" @tap="handleToClose"></text>
		</view>
		<view class="container">
			<scroll-view scroll-y="true" >
				<block v-if="searchType===1">			
					<view class="serach-history">
						<view class="serach-history-title">
							<text>历史记录</text>
							<text class="iconfont icon-lajitong" @tap="handletoClear"></text>
						</view>
						<view class="serach-history-list" v-for="(item,index) in searchHistory" :key="index">
							<text @tap="handleToWord(item)">{{item}}</text>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-title">
							热搜榜
						</view>
						<view class="search-hot-list" @tap="handleToHotWord(item.searchWord)" v-for="(item,index) in searchHot" :key="index">
							<view class="search-hot-top" :class="{active:index<=2}">
								{{index+1}}
							</view>
							<view class="search-hot-word">
								<view>
									{{item.searchWord}}
									<image  :src="item.iconUrl"></image>
								</view>
								<view>{{item.content}}</view>
							</view>
							<view class="search-hot-count">
								{{item.score}}
							</view>
						</view>
					</view>
				</block>
				<block v-else-if="searchType===2">			
					<view class="search-result">
						<view class="search-result-item" @tap="handleToDetail(item.id)" v-for="(item,index) in searchList" :key="index" >
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>
									{{item.artists | arName}}-{{item.name}}
								</view>
							</view>
							<text class="iconfont icon-bofang1"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType===3">				
					<view class="search-suggest"   >
						<view class="search-suggest-title">搜索"{{searchWord}}"</view>
						<view class="search-suggest-item" @tap="handleToWord(item.keyword)" v-for="(item,index) in suggestList" :key="index">
							<text class="iconfont icon-search"></text>
							{{item.keyword}}
						</view>					
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import customNavBar from '@/components/customNavBar/customNavBar.vue'
	import {searchHotSong,searchSuggest,searchSong} from '@/common/api.js'
	export default {
		data() {
			return {
				iconShow:true,
				iconBlack:true,
				title:"搜索",
				searchHot:[],
				searchWord:"",
				searchHistory:[],
				searchType : 1,
				searchList : [],
				suggestList : []
			}
		},
		onLoad() {
			searchHotSong().then((res)=>{
				if(res[1].data.code===200){
					this.searchHot=res[1].data.data
				}
				// console.log(res[1].data)
			}),
			uni.getStorage({
				key:'searchHistory',
				success:(res)=> {
					// console.log(res.data)
					this.searchHistory = res.data
				}
			})
		},
		methods: {
			handleToHotWord(searchWord){
				this.searchWord=searchWord
				this.handleToSearch()
			},
			handleToSearch(){
				this.searchHistory.unshift(this.searchWord)
				this.searchHistory=[...new Set(this.searchHistory)]
				if(this.searchHistory.length>10){
					this.searchHistory.length=10
				}
				uni.setStorage({
					key:'searchHistory',
					data:this.searchHistory
				})
				this.getSearchList(this.searchWord);
				// console.log(this.searchHistory)
			},
			handleToSuggest(ev){
				// console.log(ev.detail)
				if(!ev.detail.value){
					this.searchType = 1;
					return
				}
				searchSuggest(ev.detail.value).then((res)=>{
					// console.log(res)
					if(res[1].data.code===200){
						this.suggestList=res[1].data.result.allMatch
						this.searchType = 3;
					}
				})
				
				
			},
			handletoClear(){
				uni.removeStorage({
					key:'searchHistory',
					success: () => {
						this.searchHistory=[]
					}
				})
			},
			handleToClose(){
				this.searchWord=''
				this.searchType=1
			},
			handleToWord(item){
				this.searchWord=item
				this.getSearchList(this.searchWord);
			},
			getSearchList(word){
				searchSong(word).then((res)=>{
					if(res[1].data.code == '200'){
						this.searchList = res[1].data.result.songs;
						this.searchType = 2;
					}
				});
			},
			handleToDetail(songId){
				uni.navigateTo({
					url:'/pages/detail/detail?songId='+songId
				})
			}
		},
		components:{
			customNavBar
		}
	}
</script>

<style lang="scss">
	.serach{
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
	.serach-history{
		margin: 0 30rpx;
		font-size: 26rpx;
		.serach-history-title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 36rpx;
		}
		.serach-history-list{
			display: flex;
			flex-wrap: wrap;
			>text{
				padding: 16rpx 28rpx;
				margin-right: 30rpx;
				margin-bottom: 30rpx;
				border-radius: 40rpx;
				background: #f7f7f7;
			}
		}
	}
	.search-hot{ 
		margin:30rpx 30rpx; 
		font-size:26rpx; 
		color:#bebebe;
		.search-hot-list{
			display: flex;
			align-items: center;
			margin-top: 40rpx;
			.search-hot-top{ 
				width:60rpx; 				 
				font-size:34rpx;
				&.active{
					color:#fb2221;
				}
			}
			.search-hot-word{ 
				flex:1;
				width: 70vw;
				>view:nth-child(1){ 
					font-size:36rpx; 
					color:black;
					>image{ 
						width:48rpx; 
						height:22rpx;
						margin-left: 16rpx;
					}
				}
				>view:nth-child(2){
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	.search-result{
		border-top: 2rpx #e5e5e5 solid; 
		padding:30rpx;
		.search-result-item{
			display: flex;
			align-items: center;
			border-bottom: 2rpx #e5e5e5 solid;
			padding-bottom:30rpx; 
			margin-bottom: 30rpx;
			.search-result-word{
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;			
				>view:nth-child(1){
					width: 80vw;
					font-size:28rpx; 
					color:#3e6694;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				>view:nth-child(2){
					width: 80vw;
					font-size:26rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
			}
			.icon-bofang1{
				font-size:50rpx; 
			}
		}
	}
	
	.search-suggest{ 
		border-top: 2rpx #e5e5e5 solid; 
		padding:30rpx; 
		font-size:26rpx; 
		.search-suggest-title{ 
			color:#537caa; 
			margin-bottom: 40rpx;
		}
		.search-suggest-item{ 
			color:#666666; 
			margin-bottom: 70rpx;
			>text{ 
				color:#c2c2c2; 
				font-size:26rpx; 
				margin-right:26rpx;
			}
		}
		
	}
</style>
