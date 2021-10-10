import {baseUrl} from './config.js';

export const ToplistDetail = ()=>{
	return new Promise((resovle,reject)=>{
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:'GET',
			success: (res) => {
				let result = res.data.list.slice(0,4);
				resovle(result);
				// console.log(result);
			},
			fail: (err) => {
				console.log(err);
			}
		});
	});
};

export const PlaylistDetail = (id)=>{
		return uni.request({
			url:`${baseUrl}/playlist/detail?id=${id}`,
			method:'GET',

		});
};
// 获取歌曲详情/song/detail?ids=347230
export const songDetail = (id)=>{
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${id}`,
		method:'GET',
	});
};
// 获取歌词/lyric?id=33894312
export const songLyric = (id)=>{
		return uni.request({
			url:`${baseUrl}/lyric?id=${id}`,
			method:'GET',
		});
};
// 获取音乐url /song/url?id=33894312
export const songUrl = (id)=>{
		return uni.request({
			url:`${baseUrl}/song/url?id=${id}`,
			method:'GET',
		});
};
// 获取相似音乐/simi/song
export const songSimi = (id)=>{
		return uni.request({
			url:`${baseUrl}/simi/song?id=${id}`,
			method:'GET',
		});
};
// 歌曲评论/comment/music?id=186016&limit=1
export const songComment = (id)=>{
		return uni.request({
			url:`${baseUrl}/comment/music?id=${id}`,
			method:'GET',
		});
};

// 热搜列表(详细)/search/hot/detail
export const searchHotSong = ()=>{
		return uni.request({
			url:`${baseUrl}/search/hot/detail`,
			method:'GET',
		});
};
// 搜索建议 /search/suggest?keywords= 海阔天空 /search/suggest?keywords= 海阔天空&type=mobile
export const searchSuggest = (keywords)=>{
		return uni.request({
			url:`${baseUrl}/search/suggest?keywords=${keywords}&type=mobile`,
			method:'GET',
		});
};
// 搜索多重匹配/search/multimatch?keywords= 海阔天空
export const searchSong = (keywords)=>{
		return uni.request({
			url:`${baseUrl}/search?keywords=${keywords}`,
			method:'GET',
		});
};