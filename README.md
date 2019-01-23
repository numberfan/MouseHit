# MouseHit
超级打地鼠11


###使用说明
- 地鼠结构
````
<div class="container clearfix" id="container">
	<div class="mh-item item01">
		<div class="mh-mouse"></div>
		<div class="mh-hole"></div>
	</div>
</div>
注：mh-开头的类必须有
地鼠激活状态：.active
````

- 引用文件：
````
<script type="text/javascript" src="js/jquery-1.9.0.js"></script>
<script type="text/javascript" src="js/MouseHit.js"></script>
 ````

 - 方法调用
 ````
var mousehit = new MouseHit(4, 3);
mousehit.init(".mh-item", {
	gameTime: 20000, //游戏总时长
	gameSpeed: 20, //地鼠出现的次数
	callback: function() {
		console.log("初始化回调");
		console.log("花费时间：" + this.expendTime);
		console.log("剩余时间：" + this.surplusTime);
		console.log("已出现地鼠个数：" + this.hasDisplay);
		console.log("打中的地鼠个数：" + this.score);
	}
});

mousehit.start({
	gameTime: 30000,
	gameSpeed: 30,
	mouseHitting: function() {
		console.log("打中了,时间花费了");
		console.log("花费时间：" + this.expendTime);
		console.log("剩余时间：" + this.surplusTime);
		console.log("已出现地鼠个数：" + this.hasDisplay);
		console.log("打中的地鼠个数：" + this.score);
	},
	gameProcess: function() {
		console.log("=============游戏进行中================");
		console.log("花费时间：" + this.expendTime);
		console.log("剩余时间：" + this.surplusTime);
		console.log("已出现地鼠个数：" + this.hasDisplay);
		console.log("打中的地鼠个数：" + this.score);
	},
	gameEnd: function() {
		console.log("Game Over!");
		console.log("花费时间：" + this.expendTime);
		console.log("剩余时间：" + this.surplusTime);
		console.log("已出现地鼠个数：" + this.hasDisplay);
		console.log("打中的地鼠个数：" + this.score);
	}
});

mousehit.finish(function() {
	console.log("----------------求游戏快点结束！-----------")
});
 ````
