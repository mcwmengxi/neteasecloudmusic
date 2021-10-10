<script>
	export default {
		onLaunch: function() {
		
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("@/common/iconfont.css");
	.container{
		width: 100%;
		height: calc(100vh-75px);
		overflow: hidden;
	}
	.container scroll-view{ height:100%;}
	.background{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		/* background-image: url('static/wangyiyunyinyue.png'); */
		background-size: cover;
		background-position:center 0;
		filter: blur(20px);
		z-index: -1;
	}
</style>
