class Pixelate{
    private ctx: CanvasRenderingContext2D;
    private top: number;
    private left: number;
    private width: number;
    private height: number;
    private image: HTMLImageElement;
    private pixelate: boolean = false;
    private startSize: number = 20;

    constructor(top: number, left: number, width: number, height: number){
        this.ctx = (<HTMLCanvasElement>document.getElementById("canvas")).getContext("2d")!;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.onload = () => {this.draw()};
        this.image.src = "Maxim.jpg";

        document.getElementById("pixelate")!.addEventListener("change", () => {
            this.pixelate = !this.pixelate;
            this.draw();
        });

        document.getElementById("size")!.addEventListener("change", () => {
            this.startSize = parseInt((<HTMLInputElement>document.getElementById("size")).value);
            this.draw();
        });
    }

    public draw(): void{
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);

        if(this.pixelate){
            let tileWidth = this.startSize;
            let tileHeight = this.startSize;
            for(let y = this.top; y < this.top + this.height; y += tileHeight){
                for(let x = this.left; x < this.left + this.width; x += tileWidth){
                    tileWidth = this.startSize;
                    tileHeight = this.startSize;
                    if(x + tileWidth > this.left + this.width){
                        tileWidth = tileWidth - (x + tileWidth - this.left - this.width);
                    }
                    if(y + tileHeight > this.top + this.height){
                        tileHeight = tileHeight - (y + tileHeight - this.top - this.height);
                    }
                    this.drawAverage(x, y, tileWidth, tileHeight);
                }
            }
        }
    }

    private drawAverage(left: number, top: number, tileWidth: number, tileHeight: number): void{
        let averageR = 0;
        let averageG = 0;
        let averageB = 0;
        let data = this.ctx.getImageData(left, top, tileWidth, tileHeight).data;

        for(let i = 0; i < data.length; i += 4){
            averageR += data[i];
            averageG += data[i + 1];
            averageB += data[i + 2];
        }

        let pixelCount = tileWidth * tileHeight;
        averageR /= pixelCount;
        averageG /= pixelCount;
        averageB /= pixelCount;

        this.ctx.fillStyle = `rgb(${Math.round(averageR)}, ${Math.round(averageG)}, ${Math.round(averageB)})`;
        this.ctx.fillRect(left, top, tileWidth, tileHeight);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let pixelate = new Pixelate(50, 200, 325, 550);
});