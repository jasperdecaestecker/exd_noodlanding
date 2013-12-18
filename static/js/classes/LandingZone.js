var LandingZone = (function()
{
	var shape, container, bitmap, pilke;
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
		this.shape.y = 155;
		this.shape.x = 555;
		this.shape.alpha = 0;

		this.bitmap = new createjs.Bitmap("css/images/planet.png");
		this.bitmap.x = 0;
		this.bitmap.y = 0;


		var data = {
		     images: ["css/images/pilke.png"],
		     frames: {width:50, height:100,
	 		 animations: {arrowLoop:[0,3]}}};

		var spriteSheet = new createjs.SpriteSheet(data);
		this.pilke = new createjs.Sprite(spriteSheet);
		this.pilke.x = 600;
		this.pilke.y = 75;

	

		this.container.addChild(this.bitmap);
			this.container.addChild(this.pilke);
					this.container.addChild(this.shape);
	};

	return LandingZone;

})();