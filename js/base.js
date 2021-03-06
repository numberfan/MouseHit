(function() {

	var mousehit = new MouseHit(4, 3);
	mousehit.init(".mh-item", {
		gameTime: 20000, //游戏总时长
		gameSpeed: 20, //游戏次数（地鼠出现的次数）
		originTop: 40, //初始top值
		finalTop: 0, //结束top值
		left: 0, // position：left
		callback: function() {
			console.log("初始化回调");
			console.log("花费时间：" + this.expendTime);
			console.log("剩余时间：" + this.surplusTime);
			console.log("已出现地鼠个数：" + this.hasDisplay);
			console.log("打中的地鼠个数：" + this.score);
		}
	});

	$('#start').bind('click', function() {
		mousehit.start({
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
	});
	$("#end").bind('click', function() {
		mousehit.finish(function() {
			console.log("----------------求游戏快点结束！-----------")
		});
	});
})();

