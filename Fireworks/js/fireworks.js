"use strict";
var Fireworks = /** @class */ (function () {
    function Fireworks() {
        var _this = this;
        this.fireworks = [];
        this.ctx = document.getElementById("canvas").getContext("2d");
        var count = 0;
        var mainDraw = function () {
            _this.draw();
            count++;
            if (count === 25) {
                _this.add(new Firework(Math.random() * 1000, 0, Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 8, 10, Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255));
                count = 0;
            }
            requestAnimationFrame(mainDraw);
        };
        mainDraw();
    }
    Fireworks.prototype.add = function (firework) {
        this.fireworks.push(firework);
    };
    Fireworks.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var _i = 0, _a = this.fireworks; _i < _a.length; _i++) {
            var firework = _a[_i];
            firework.draw(this.ctx);
            if (firework.blowUpY !== 0) {
                for (var i = 0; i < 20; i++) {
                    this.add(new Firework(firework.blowUpX, firework.blowUpY, Math.random() * 2 * Math.PI, 5, firework.rgb));
                }
            }
        }
        for (var i = this.fireworks.length - 1; i >= 0; i--) {
            if (this.fireworks[i].destroy) {
                this.fireworks.splice(i, 1);
            }
        }
    };
    return Fireworks;
}());
var Firework = /** @class */ (function () {
    function Firework(x, y, angle, speed, rgb) {
        this.y = 0;
        this.count = 0;
        this.blowUpX = 0;
        this.blowUpY = 0;
        this.x = x;
        this.y = y;
        this.xSpeed = Math.cos(angle) * speed;
        this.ySpeed = Math.sin(angle) * speed;
        this.rgb = rgb;
    }
    Object.defineProperty(Firework.prototype, "destroy", {
        get: function () {
            if (this.blowUpY !== 0) {
                return true;
            }
            if (this.count >= 35 && this.y !== 0) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Firework.prototype.draw = function (ctx) {
        ctx.save();
        {
            var cX = this.x;
            var cY = this.y;
            var cYSpeed = this.ySpeed;
            var a = 0;
            ctx.transform(1, 0, 0, -1, 0, ctx.canvas.height);
            this.count++;
            var points = 50;
            for (var i = 0; i < this.count; i++) {
                if (i >= this.count - points) {
                    ctx.fillStyle = "rgba(" + this.rgb + ", " + a + ")";
                    ctx.fillRect(cX, cY, 3, 3);
                    a += 1 / points;
                }
                cX += this.xSpeed;
                cY += cYSpeed;
                cYSpeed -= Firework.GravityAcceleration;
            }
            if (cYSpeed <= 0 && this.y === 0) {
                this.blowUpX = cX;
                this.blowUpY = cY;
            }
        }
        ctx.restore();
    };
    Firework.GravityAcceleration = 0.1;
    return Firework;
}());
document.addEventListener("DOMContentLoaded", function () {
    new Fireworks();
});
