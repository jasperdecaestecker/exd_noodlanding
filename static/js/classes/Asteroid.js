var Asteroid = (function()
{
	var shape, bitmap, container;
	function Asteroid(x, y, width, height, typeAsteroid)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.typeAsteroid = typeAsteroid;
		this.container = new createjs.Container();
		
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	Asteroid.prototype.draw = function()
	{
		this.shape = new createjs.Shape();
		this.shape.graphics.c();
		this.shape.graphics.f("00FF00");
		this.shape.graphics.drawCircle(0,0,50);
		this.shape.graphics.ef();
		this.shape.alpha = 0;

		switch(this.typeAsteroid)
		{
			case 1:
				this.bitmap = new createjs.Bitmap("css/images/asteroid1.png");
				this.bitmap.x = -50;
				this.bitmap.y = -50;
				break;
			case 2:
				this.bitmap = new createjs.Bitmap("css/images/asteroid2.png");
				this.bitmap.x = -50;
				this.bitmap.y = -50;
			break;
			case 3:
				this.bitmap = new createjs.Bitmap("css/images/asteroid3.png");
				this.bitmap.x = -50;
				this.bitmap.y = -50;
			break;
			case 4:
				this.bitmap = new createjs.Bitmap("css/images/asteroid4.png");
				this.bitmap.x = -50;
				this.bitmap.y = -50;
			break;
		}

		this.container.addChild(this.shape);
		this.container.addChild(this.bitmap);
	};

	return Asteroid;

})();