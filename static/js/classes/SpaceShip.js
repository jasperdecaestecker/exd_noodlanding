var SpaceShip = (function()
{
	var shape;
	function SpaceShip(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velX = 0;
		this.velY = 0;
		this.speed = 3;
		this.friction = 0.9;
		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();
	}

	SpaceShip.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("00FF00");
		this.shape.graphics.drawCircle(0,0,this.height);
		this.shape.graphics.ef();
	};

	SpaceShip.prototype.update = function()
	{
		this.x += this.velX;
		this.y += this.velY;
		this.x = Math.round(this.x,1);
		this.y = Math.round(this.y,1);
		this.shape.x = this.x;
		this.shape.y = this.y;

		// comment frictie voor bizare beweging. maakt het iets cooler.
		this.velX *= this.friction;
		this.velY *= this.friction;
	}

	return SpaceShip;

})();