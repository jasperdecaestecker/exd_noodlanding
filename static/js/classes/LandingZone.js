var LandingZone = (function()
{
	var shape, container, bitmap;
	function LandingZone(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.container = new createjs.Container();
		this.container.x = this.x;
		this.container.y = this.y;
		this.draw();
	}

	LandingZone.prototype.draw = function()
	{
		this.shape = new createjs.Shape();
		this.shape.graphics.c();
		this.shape.graphics.f("FF0000");
		this.shape.graphics.drawRect(0,0,150,50);
		this.shape.graphics.ef();
		this.shape.y = 165;
		this.shape.x = 525;
		this.shape.alpha = 0;

		this.bitmap = new createjs.Bitmap("css/images/planet.png");
		this.bitmap.x = 0;
		this.bitmap.y = 0;

		this.container.addChild(this.shape);
		this.container.addChild(this.bitmap);
	};

	return LandingZone;

})();