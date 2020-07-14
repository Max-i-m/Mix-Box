class Fireworks{
    private fireworks: Firework[] = [];
    private ctx: CanvasRenderingContext2D;
    private sound: HTMLAudioElement;

    constructor(){
        this.ctx = (<HTMLCanvasElement>document.getElementById("canvas")).getContext("2d")!;
    
        let showFlag = false;
        this.sound = new Audio("anthem.mp3");
        // Chrome plays sounds only after user interaction
        document.addEventListener("click", () => {
            this.sound.play();
            showFlag = true;
        });

        let tick = 0;
        // Opacity style is a string, so I use variable to increment it
        let flagOpacity = 0;
        let mainDraw = (): void => {
            if(showFlag && flagOpacity <= 0.025){
                document.getElementById("flag")!.style.opacity = flagOpacity.toString();
                flagOpacity += 0.0001;
            }
            
            tick++;

            // Adding a firework every half of a second
            if(tick == 30){
                this.add(new Firework(Math.random()*this.ctx.canvas.width, 
                    0, 
                    (Math.random() * 30) + 75, 
                    (Math.random() * 3) + 9, 
                    55 + Math.random() * 200, 
                    55 + Math.random() * 200, 
                    55 + Math.random() * 200, 
                    4, 
                    true));
                tick = 0;
            }

            this.draw();

            // Remove dead fireworks
            for(let i = this.fireworks.length - 1; i >= 0; i--){                
                if(this.fireworks[i].delete){
                    this.fireworks.splice(i, 1);
                }
            }

            requestAnimationFrame(mainDraw);
        }

        mainDraw();
    }

    private draw(): void{        
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.save();
        {
            // Moves the origin to the left-bottom corner
            this.ctx.transform(1, 0, 0, -1, 0, this.ctx.canvas.height);

            for(let firework of this.fireworks){
                firework.draw(this.ctx, this);
            }
        }
        this.ctx.restore();
    }
    
    public add(firework: Firework): void{
        this.fireworks.push(firework);
    }
}

class Firework{
    private static readonly gravity: number = 0.1;

    private x: number;
    private y: number;
    private xSpeed: number;
    private ySpeed: number;
    private size: number;
    private r: number;
    private g: number;
    private b: number;
    private counter: number = 0;
    private canBlowUp: boolean;
    private sound: HTMLAudioElement;
    public delete: boolean = false;

    constructor(x: number, y: number, angle: number, speed: number, r: number, g: number, b: number, size: number, canBlowUp: boolean){
        this.x = x;
        this.y = y;
        let angleRadians = Math.PI * angle / 180;
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

    public blowUp(fireworks: Fireworks, x: number, y: number): void{
        this.delete = true;
        this.sound.play();
        
        let angle = 0;
        let shots = 60;

        // Makes the firework explode into multiple flares
        for(let i = 0; i < shots; i++){
            let r: number;
            let g: number;
            let b: number;

            // Make every sixth flare a completly different color
            if(i % 6 === 0){
                r = this.b;
                g = this.r;
                b = this.g;
            }
            else{
                r = Math.max(0, Math.min(255, this.r + (Math.random() - 0.5) * 50));
                g = Math.max(0, Math.min(255, this.g + (Math.random() - 0.5) * 50));
                b = Math.max(0, Math.min(255, this.b + (Math.random() - 0.5) * 50));
            }
            fireworks.add(new Firework(x, y, 
                angle, 5, r, g, b, 2, false));
                
            angle += 360 / shots;
        }
    }

    public draw(ctx: CanvasRenderingContext2D, fireworks: Fireworks): void{        
        this.counter++;
            
        let tailSize = 30;
        if(!this.canBlowUp){
            tailSize = 15;
        }
        let cx = this.x;
        let cy = this.y;
        let cySpeed = this.ySpeed;
        let a = 0;
        for(let i = 0; i < this.counter; i++){
            // Only draw the tailSize of squares
            if(i > this.counter - tailSize){
                // Draw the light effect around the last square
                if(i === this.counter - 1){
                    ctx.beginPath();
                    {
                        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, 0.35)`;
                        ctx.arc(cx + this.size / 2, cy + this.size / 2, this.size * 1.5, 0, 2 * Math.PI);
                    }
                    ctx.fill();
                    ctx.beginPath();
                    {
                        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, 0.2)`;
                        ctx.arc(cx + this.size / 2, cy + this.size / 2, this.size * 2.5, 0, 2 * Math.PI);
                    }
                    ctx.fill();
                }
                ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
                ctx.fillRect(cx, cy, this.size, this.size);
                // Add to the opacity of each square
                a += 1 / tailSize;
            }
            cx += this.xSpeed;
            cy += cySpeed;
            cySpeed -= Firework.gravity;
        }

        if(this.canBlowUp){
            if(cySpeed <= 0){
                this.blowUp(fireworks, cx, cy);
            }
        }
        else{
            // Destroys the flare in fifty ticks
            if(this.counter == 50){
                this.delete = true;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Fireworks();
});