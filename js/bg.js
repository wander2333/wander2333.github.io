// 背景图片类
class Background {
    constructor(bg_canvas, imagePath) {
        this.canvas = bg_canvas;
        this.ctx = bg_canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imagePath;
        this.loaded = false;

        this.image.onload = () => {
            this.loaded = true;
            this.draw();
        };
    }

    draw() {
        if (!this.loaded) return;

        const ctx = this.ctx;
        const canvas = this.canvas;

        // 计算绘制区域 (从30vh到底部)
        const startY = canvas.height * 0.3;
        const drawHeight = canvas.height - startY;

        // 清除之前的绘制
        ctx.clearRect(0, startY, canvas.width, drawHeight);

        // 计算图片缩放比例
        const widthRatio = canvas.width / this.image.width;
        const heightRatio = drawHeight / this.image.height;

        // 图片偏小：等比例拉伸
        if (widthRatio > 1 || heightRatio > 1) {
            const scale = Math.max(widthRatio, heightRatio);
            const scaledWidth = this.image.width * scale;
            const scaledHeight = this.image.height * scale;

            ctx.drawImage(
                this.image,
                0, 0, this.image.width, this.image.height,
                0, startY, scaledWidth, scaledHeight
            );
        } else {
            // 图片偏大：从左上角开始绘制
            ctx.drawImage(
                this.image,
                0, 0, // 源图片左上角坐标
                Math.min(this.image.width, canvas.width), // 源宽度
                Math.min(this.image.height, drawHeight), // 源高度
                0, startY, // 目标左上角坐标
                Math.min(this.image.width, canvas.width), // 目标宽度
                Math.min(this.image.height, drawHeight) // 目标高度
            );
        }
    }
}


class Person {
    constructor(bg_canvas, imagePath, leftPos) {
        this.canvas = bg_canvas;
        this.ctx = bg_canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imagePath;
        this.loaded = false;
        this.left_pos = leftPos;

        this.image.onload = () => {
            this.loaded = true;
            this.draw();
        };
    }

    draw() {
        if (!this.loaded) return;

        const ctx = this.ctx;
        const canvas = this.canvas;

        // const startY = canvas.height * 0.3;
        // // const drawHeight = canvas.height - startY;

        // 清除之前的绘制,这里不清除,放在 bg 后面有 bg 清楚
        // ctx.clearRect(0, startY, canvas.width, drawHeight);

        // 计算图片缩放比例
        const widthRatio = canvas.width / 2 / this.image.width;
        console.log("ratio:", widthRatio)
        // 图片偏小：等比例拉伸
        // if (widthRatio > 1) {
        const scale = widthRatio;
        const scaledWidth = this.image.width * scale;
        const scaledHeight = this.image.height * scale;
        const startY = canvas.height - scaledHeight;
        console.log(scaledWidth, scaledHeight, startY);

        ctx.drawImage(
            this.image,
            0, 0, this.image.width, this.image.height,
            this.left_pos, startY, scaledWidth, scaledHeight
        );
        // } else {
        //     const startY = canvas.height * 0.3;
        // const drawHeight = canvas.height - startY;
        //     ctx.drawImage(
        //         this.image,
        //         0, 0, // 源图片左上角坐标
        //         Math.min(this.image.width, canvas.width), // 源宽度
        //         Math.min(this.image.height, drawHeight), // 源高度
        //         0, startY, // 目标左上角坐标
        //         Math.min(this.image.width, canvas.width), // 目标宽度
        //         Math.min(this.image.height, drawHeight) // 目标高度
        //     );
        // }
    }
}