class Fireworks{
    private fireworks: Firework[] = [];
    private ctx: CanvasRenderingContext2D;

    constructor(){
        this.ctx = (<HTMLCanvasElement>document.getElementById("canvas")).getContext("2d")!;
        
        let count = 0;
        let mainDraw = () => {
            this.draw();
            count++;
            if(count === 25){
                this.add(new Firework(Math.random() * 1000, 
                    0, 
                    Math.PI/2 + (Math.random() - 0.5) * Math.PI/8, 
                    10, 
                    `${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}`));

                count = 0;
            }
            requestAnimationFrame(mainDraw);
        };
    
        mainDraw();
    }

    public add(firework: Firework): void{
        this.fireworks.push(firework);
    }

    private draw(): void{
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for(let firework of this.fireworks){
            firework.draw(this.ctx);
        
            if(firework.blowUpY !== 0){
                for(let i = 0; i < 20; i++){
                    this.add(new Firework(firework.blowUpX, firework.blowUpY, Math.random() * 2 * Math.PI, 5, firework.rgb));
                }
            }
        }

        for(let i = this.fireworks.length - 1; i >= 0; i--){
            if(this.fireworks[i].destroy){
                this.fireworks.splice(i, 1);
            }
        }
    }
}

class Firework{
    private static readonly GravityAcceleration: number = 0.1;

    private x: number;
    private y: number = 0;
    private xSpeed: number;
    private ySpeed: number;
    private count: number = 0;
    public rgb: string;
    public blowUpX: number = 0;
    public blowUpY: number = 0;

    constructor(x: number, y: number, angle: number, speed: number, rgb: string){    
        this.x = x;
        this.y = y;
        this.xSpeed = Math.cos(angle) * speed;
        this.ySpeed = Math.sin(angle) * speed;
        this.rgb = rgb;
    }

    public get destroy(): boolean{
        if(this.blowUpY !== 0){
            return true;
        }
        if(this.count >= 35 && this.y !== 0){
            return true;
        }
        return false;
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        ctx.save();
        {
            let cX = this.x;
            let cY = this.y;
            let cYSpeed = this.ySpeed;
            let a = 0;
            ctx.transform(1, 0, 0, -1, 0, ctx.canvas.height);

            this.count++;

            let points = 50;

            for(let i = 0; i < this.count; i++){
                if(i >= this.count - points){
                    ctx.fillStyle = `rgba(${this.rgb}, ${a})`;
                    ctx.fillRect(cX, cY, 3, 3);
                    a += 1 / points;
                }

                cX += this.xSpeed;
                cY += cYSpeed;
                cYSpeed -= Firework.GravityAcceleration;
            }

            if(cYSpeed <= 0 && this.y === 0){
                this.blowUpX = cX;
                this.blowUpY = cY;
            }
        }
        ctx.restore();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Fireworks();
});