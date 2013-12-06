var LandingZone = (function()
{
	var shape;
	function LandingZone(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.shape = new createjs.Shape();
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.draw();
	}

	LandingZone.prototype.draw = function()
	{
		this.shape.graphics.c();
		this.shape.graphics.f("FF0000");
		this.shape.graphics.drawRect(0,0,this.width,this.height);
		this.shape.graphics.ef();
	};

	return LandingZone;

})();