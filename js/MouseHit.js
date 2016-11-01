;(function(){

	var MouseHit = function(rows, cols) {

	//洞行、列数
	var rows = rows || 4;
	var cols = cols || 3;

	//mouse的DOM节点
	var mouseEle;

	//供显示的Mouse对象
	var mouse01 = {};
	var mouse02 = {};

	//mouse位置
	var org_Top = 40;
	var fina_Top = 0;
	var left = 0;

	//游戏总时长
	var ALLTIME = 30000; 

	//游戏速度，即每次地鼠出来到地鼠进去的速度
	var speed = 1000; 

	//游戏是否正在进行
	var isRunning = false;

	//游戏进程timer
	var mouseTimer = null;
	//游戏时间
	var countTimer = null; 

	this.hasDisplay = 0, //已出现个数
	this.expendTime = 0, //游戏花费时间
	this.surplusTime = ALLTIME, //游戏剩余时间
	this.score = 0; //击中的个数	

	this._initArray = function(rows, cols, occupyValue) {
		var arr = [];
		var occupyValue = occupyValue || 0;

		for(var i = 0; i < rows; i++) {

			arr[i] = [];

			for(var j = 0; j < cols; j++) {
				arr[i][j] = 0;
			}
		}

		return arr;
	};

	//计算data-id对应的坐标值,数值转换成坐标
	this._calaultePosition = function(num) {
		var len = mouseEle.length;

		if (num > len) {num = Math.floor(Math.random()*len);}

		var x = Math.floor(num/cols);
		var y = num < cols ? num : num-x*cols;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		return {
			x : x,
			y : y
		}
	};

	//获取DOM节点，设置mouse节点的相对定位
	this._initMouse = function(mouseItem) {
		var itemEle = $(mouseItem || '.mh-item');
		mouseEle = itemEle.find(".mh-mouse");

		itemEle.each(function(index, el) {
			mouseEle.css('position', 'relative');
		});
	};

	//随机生成两个位置
	this._randomSelectMouse = function() {

		var len = mouseEle.length;

		var a = Math.floor(Math.random()*len/2);
		var b = Math.floor(Math.random()*len/2 + len/2);

		//计算坐标
		var matrix01 = this._calaultePosition(a);
		var matrix02 = this._calaultePosition(b);

		//更新地鼠矩阵
		existMatrix[matrix01.x][matrix01.y] = 1;
		existMatrix[matrix02.x][matrix02.y] = 1;

		return {
			num1 : a,
			num2 : b
		}; 
	};

	//实例化Mouse
	this._createMouse = function() {
		var num = this._randomSelectMouse();

		var a = num.num1;
		var matrix01 = this._calaultePosition(a);
		mouse01 = new Mouse();
		mouse01.x = matrix01.x;
		mouse02.y = matrix01.y;
		mouse01.init(a, mouseEle.eq(a), org_Top, left, org_Top, fina_Top);

		var b = num.num2;
		var matrix02 = this._calaultePosition(b);
		mouse02 = new Mouse();
		mouse02.x = matrix02.x;
		mouse02.y = matrix02.y;
		mouse02.init(b, mouseEle.eq(b), org_Top, left, org_Top, fina_Top);

		this.hasDisplay += 2; //更新出现的地鼠数
	};


	//游戏时间控制
	this._setIntervalFunc = function(gameProcessFn, gameEndFn) {
		var _this = this;

		this._createMouse();
		mouse01.animate(speed);
		mouse02.animate(speed);

		if (countTimer) {clearInterval(countTimer);}
	    countTimer = setInterval(function() {

		_this.surplusTime -= 1000;
		_this.expendTime += 1000;


		if (gameProcessFn && (typeof gameProcessFn == "function")) {
			gameProcessFn.apply(_this);
		}

		//游戏时间到，游戏结束
		if (_this.expendTime == ALLTIME || _this.surplusTime == 0) {

			_this._finishGame(gameEndFn); // 游戏结束回调
			return;
		}

	    }, 1000);

	    //根据计算时间，产生地鼠ALLTIME/gameSpeed
		if (mouseTimer) {clearInterval(mouseTimer);}
	    mouseTimer = setInterval(function(){
			_this._createMouse();
			existMatrix[mouse01.x, mouse01.y] = 0;
			existMatrix[mouse02.x, mouse02.y] = 0;
			mouse01.animate(speed);
			mouse02.animate(speed);

		}, speed);
	}	

	this._finishGame = function(callback) {

		clearInterval(countTimer);
	    clearInterval(mouseTimer);

		if (callback && (typeof callback == "function")) {
			//游戏结束，回调函数
			callback.apply(this);
		}

		//还原参数值
		this._initParams();
	}

	//事件监听
	this._eventMouse = function(callback) {
		var _this = this; //this未动态变化

		mouseEle.on('click', function(event) {
			event.preventDefault();

			if($(this).hasClass('active')){
				return false;
			}

			$(this).addClass('active');

			_this.score += 1;

			if (callback && (typeof callback == "function")) {
			callback.apply(_this);
		}

			var timer = null;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				mouseEle.removeClass('active');
			}, speed/2);
		});
	}

	//初始化参数
	this._initParams = function() {
		clearInterval(mouseTimer);
		this.expendTime = 0; //花费时间
		this.surplusTime = ALLTIME; //剩余时间
		this.hasDisplay = 0; //已出现地鼠个数
		this.score = 0; //打中的地鼠个数
		isRunning = false; //是否正则进行

		existMatrix = this._initArray(rows, cols, 0); //地鼠矩阵
	}

	//洞，标识是否有老鼠，矩阵
	var existMatrix = this._initArray(rows, cols);

	/**
	 * [游戏初始化]
	 * @param  {[type]} mouseItem [地鼠的父级节点]
	 */
	this.init = function(mouseItem, options) {
		this._initMouse(mouseItem);

		var defaults = {
			gameTime: 60000, //游戏时长，单位ms
			gameSpeed: 60, //游戏速度，单位10次
			origonTop: 40, //初始top值
			finalTop: 0, //结束top值
			left: 0, // 
			callback: function() {}
		};
		var params = $.extend({}, defaults, options);

		speed = params.gameTime/params.gameSpeed;
		ALLTIME = params.gameTime;
		org_Top = params.origonTop;
		fina_Top = params.finalTop;
		left = params.left;

		this._initParams();
		(params.callback).apply(this); //init callback
	}

	this.start = function(options) {
		if(isRunning) {
			return;
		}

		var defaults = {
			mouseHitting: function() {}, //打中地鼠的回调
			gameProcess: function() {}, //游戏进行中
			gameEnd: function() {} //游戏结束回调
		};
		var params = $.extend({}, defaults, options);

		this._initParams();
		isRunning = true;

		this._setIntervalFunc(params.gameProcess, params.gameEnd);
		this._eventMouse(params.mouseHitting);
	};

	this.finish = function(gameEndFn) {
		this._finishGame(gameEndFn);
		isRunning = false;
	};
	};



	function Mouse() {

	this.id = 0;

	this.originTop; //初始top值
	this.finalTop; //目标top值

	//坐标
	this.top;
	this.left;

	//矩阵坐标
	this.x = 0;
	this.y = 0;

	//DOM元素
	this.ele;
	};

	/**
	* [地鼠初始化n]
	* @param  {[type]} id        [id,标识地鼠，对应data-id]
	* @param  {[type]} ele       [地鼠DOM节点]
	* @param  {[type]} top       [地鼠定位top值]
	* @param  {[type]} left      [地鼠定位left值]
	* @param  {[type]} originTop [运动前位置]
	* @param  {[type]} finalTop  [运动结束位置]
	*/
	Mouse.prototype.init = function(id, ele, top, left, originTop, finalTop) {

	this.id = id || 0;
	this.ele = ele;
	this.top = top;
	this.left = left;
	this.originTop = originTop || 40;
	this.finalTop = finalTop || 0;

	var ele = this.ele;

	ele.css({
		position: "absolute",
		top : this.top + 'px',
		left : this.left + 'px'
	});
	};

	/**
	* [地鼠运动]
	* @param  {[type]} speed [运动速度]
	*/
	Mouse.prototype.animate = function(speed) {

	var fina_y = this.finalTop;
	var org_y = this.originTop;
	var ele = this.ele;
	var speed = speed/2 || 10;

	ele.animate({
		top: fina_y + 'px'
	}, speed, function() {
		ele.animate({
			top: org_y + 'px'
		}, speed);
	});
	};

	window.MouseHit = MouseHit;
})();
