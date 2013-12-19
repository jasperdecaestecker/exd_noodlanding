var SpaceShip = (function()
{
	var shape, bitmap, animation, radar;
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
		this.container.width = width;
		this.container.height = height;
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

		var data = {
		     images: ["css/images/radar.png"],
		     frames: {width:150, height:150}
	 		 };

		var spriteSheet = new createjs.SpriteSheet(data);
		this.radar = new createjs.Sprite(spriteSheet);
		this.radar.x = -70;
		this.radar.y = -75;
		this.radar.gotoAndStop(0);


		this.container.addChild(this.shape);
		this.container.addChild(this.animation);
			this.container.addChild(this.radar);
	};

	SpaceShip.prototype.update = function()
	{
		this.x += this.velX;
		this.y += this.velY;
		this.x = Math.round(this.x,1);
		this.y = Math.round(this.y,1);

		// controle indien je uit het scherm zou botsen dat je gereset wordt
		if(this.x < 0 || this.x > 1000)
		{
			this.x = 100;
		}
		if(this.y < 0 || this.y > 1100)
		{
			this.y = 100;
		}

		this.container.x = this.x;
		this.container.y = this.y;
		this.velX *= this.friction;
		this.velY *= this.friction;

		// gravity is niet goed
		//this.velY +=0.1;
	}

	return SpaceShip;

})();