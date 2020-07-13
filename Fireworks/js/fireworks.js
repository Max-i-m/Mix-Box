"use strict";
var Fireworks = /** @class */ (function () {
    function Fireworks() {
        var _this = this;
        this.fireworks = [];
        this.ctx = document.getElementById("canvas").getContext("2d");
        var showFlag = false;
        this.sound = new Audio("anthem.mp3");
        // Chrome plays sounds only after user interaction
        document.addEventListener("click", function () {
            _this.sound.play();
            showFlag = true;
        });
        var tick = 0;
        // Opacity style is a string, so I use variable to increment it
        var flagOpacity = 0;
        var mainDraw = function () {
            if (showFlag && flagOpacity <= 0.025) {
                document.getElementById("flag").style.opacity = flagOpacity.toString();
                flagOpacity += 0.0001;
            }
            tick++;
            // Adding a firework every half of a second
            if (tick == 30) {
                _this.add(new Firework(Math.random() * _this.ctx.canvas.width, 0, (Math.random() * 30) + 75, (Math.random() * 3) + 9, 55 + Math.random() * 200, 55 + Math.random() * 200, 55 + Math.random() * 200, 4, true));
                tick = 0;
            }
            _this.draw();
            // Remove dead fireworks
            for (var i = _this.fireworks.length - 1; i >= 0; i--) {
                if (_this.fireworks[i].delete) {
                    _this.fireworks.splice(i, 1);
                }
            }
            requestAnimationFrame(mainDraw);
        };
        mainDraw();
    }
    Fireworks.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        {
            // Moves the origin to the left-bottom corner
            this.ctx.transform(1, 0, 0, -1, 0, this.ctx.canvas.height);
            for (var _i = 0, _a = this.fireworks; _i < _a.length; _i++) {
                var firework = _a[_i];
                firework.draw(this.ctx, this);
            }
        }
        this.ctx.restore();
    };
    Fireworks.prototype.add = function (firework) {
        this.fireworks.push(firework);
    };
    return Fireworks;
}());
var Firework = /** @class */ (function () {
    function Firework(x, y, angle, speed, r, g, b, size, canBlowUp) {
        this.counter = 0;
        this.delete = false;
        this.x = x;
        this.y = y;
        var angleRadians = Math.PI * angle / 180;
        this.xSpeed = Math.cos(angleRadians) * speed;
        this.ySpeed = Math.sin(angleRadians) * speed;
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
        this.size = size;
        this.sound = new Audio();
        this.sound.src = "bang.wav";
        this.canBlowUp = canBlowUp;
    }
    Firework.prototype.blowUp = function (fireworks, x, y) {
        this.delete = true;
        this.sound.play();
        var angle = 0;
        var shots = 60;
        var rareR = Math.random() * 255;
        var rareG = Math.random() * 255;
        var rareB = Math.random() * 255;
        // Makes the firework explode into multiple flares
        for (var i = 0; i < shots; i++) {
            var r = void 0;
            var g = void 0;
            var b = void 0;
            // Make every sixth flare a completly different color
            if (i % 6 === 0) {
                r = rareR;
                g = rareG;
                b = rareB;
            }
            else {
                r = Math.max(0, Math.min(255, this.r + (Math.random() - 0.5) * 50));
                g = Math.max(0, Math.min(255, this.g + (Math.random() - 0.5) * 50));
                b = Math.max(0, Math.min(255, this.b + (Math.random() - 0.5) * 50));
            }
            fireworks.add(new Firework(x, y, angle, 5, r, g, b, 2, false));
            angle += 360 / shots;
        }
    };
    Firework.prototype.draw = function (ctx, fireworks) {
        this.counter++;
        var tailSize = 30;
        if (!this.canBlowUp) {
            tailSize = 15;
        }
        var cx = this.x;
        var cy = this.y;
        var cySpeed = this.ySpeed;
        var a = 0;
        for (var i = 0; i < this.counter; i++) {
            // Only draw the tailSize of squares
            if (i > this.counter - tailSize) {
                // Draw the light effect around the last square
                if (i === this.counter - 1) {
                    ctx.beginPath();
                    {
                        ctx.fillStyle = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", 0.35)";
                        ctx.arc(cx + this.size / 2, cy + this.size / 2, this.size * 1.5, 0, 2 * Math.PI);
                    }
                    ctx.fill();
                    ctx.beginPath();
                    {
                        ctx.fillStyle = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", 0.2)";
                        ctx.arc(cx + this.size / 2, cy + this.size / 2, this.size * 2.5, 0, 2 * Math.PI);
                    }
                    ctx.fill();
                }
                ctx.fillStyle = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + a + ")";
                ctx.fillRect(cx, cy, this.size, this.size);
                // Add to the opacity of each square
                a += 1 / tailSize;
            }
            cx += this.xSpeed;
            cy += cySpeed;
            cySpeed -= Firework.gravity;
        }
        if (this.canBlowUp) {
            if (cySpeed <= 0) {
                this.blowUp(fireworks, cx, cy);
            }
        }
        else {
            // Destroys the flare in fifty ticks
            if (this.counter == 50) {
                this.delete = true;
            }
        }
    };
    Firework.gravity = 0.1;
    return Firework;
}());
document.addEventListener("DOMContentLoaded", function () {
    new Fireworks();
});
