"use strict";
var Pixelate = /** @class */ (function () {
    function Pixelate(top, left, width, height) {
        var _this = this;
        this.pixelate = false;
        this.startSize = 20;
        this.ctx = document.getElementById("canvas").getContext("2d");
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.onload = function () { _this.draw(); };
        this.image.src = "Maxim.jpg";
        document.getElementById("pixelate").addEventListener("change", function () {
            _this.pixelate = !_this.pixelate;
            _this.draw();
        });
        document.getElementById("size").addEventListener("change", function () {
            _this.startSize = parseInt(document.getElementById("size").value);
            _this.draw();
        });
    }
    Pixelate.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        if (this.pixelate) {
            var tileWidth = this.startSize;
            var tileHeight = this.startSize;
            for (var y = this.top; y < this.top + this.height; y += tileHeight) {
                for (var x = this.left; x < this.left + this.width; x += tileWidth) {
                    tileWidth = this.startSize;
                    tileHeight = this.startSize;
                    if (x + tileWidth > this.left + this.width) {
                        tileWidth = tileWidth - (x + tileWidth - this.left - this.width);
                    }
                    if (y + tileHeight > this.top + this.height) {
                        tileHeight = tileHeight - (y + tileHeight - this.top - this.height);
                    }
                    this.drawAverage(x, y, tileWidth, tileHeight);
                }
            }
        }
    };
    Pixelate.prototype.drawAverage = function (left, top, tileWidth, tileHeight) {
        var averageR = 0;
        var averageG = 0;
        var averageB = 0;
        var data = this.ctx.getImageData(left, top, tileWidth, tileHeight).data;
        for (var i = 0; i < data.length; i += 4) {
            averageR += data[i];
            averageG += data[i + 1];
            averageB += data[i + 2];
        }
        var pixelCount = tileWidth * tileHeight;
        averageR /= pixelCount;
        averageG /= pixelCount;
        averageB /= pixelCount;
        this.ctx.fillStyle = "rgb(" + Math.round(averageR) + ", " + Math.round(averageG) + ", " + Math.round(averageB) + ")";
        this.ctx.fillRect(left, top, tileWidth, tileHeight);
    };
    return Pixelate;
}());
document.addEventListener("DOMContentLoaded", function () {
    var pixelate = new Pixelate(50, 200, 325, 550);
});
