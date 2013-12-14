var SpaceShip = (function()
{
	var shape, bitmap, animation;
	function SpaceShip(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velX = 0;
		this.velY = 0;
		this.gravity = 0.02;
		this.speed = 3;
		this.friction = 0.9;
		this.container = new createjs.Container();
		
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	SpaceShip.prototype.draw = function()
	{
		this.shape = new createjs.Shape();
		this.shape.graphics.c();
		this.shape.graphics.f("00FF00");
		this.shape.graphics.drawCircle(0,0,50);
		this.shape.graphics.ef();
		this.shape.alpha = 0;

		var data = {
		     images: ["css/images/raketSprite.png"],
		     frames: {width:125, height:125,
	 		 animations: {spin:[0,7]}}};

		var spriteSheet = new createjs.SpriteSheet(data);
		this.animation = new createjs.Sprite(spriteSheet);
		this.animation.x = -60;
		this.animation.y = -60;
		this.animation.gotoAndStop(4);

		this.container.addChild(this.shape);
		this.container.addChild(this.animation);
	};

	SpaceShip.prototype.update = function()
	{
		this.x += this.velX;
		this.y += this.velY;
		this.x = Math.round(this.x,1);
		this.y = Math.round(this.y,1);
		this.container.x = this.x;
		this.container.y = this.y;
		// comment frictie voor bizare beweging. maakt het iets cooler.
		this.velX *= this.friction;
		this.velY *= this.friction;

		// uncomment voor gravity
		//this.velY += this.gravity;
	}

	return SpaceShip;

})();