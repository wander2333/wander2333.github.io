class Cloud {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
    this.y = Math.random() * this.canvas.height * 0.4;//topPosition + (Math.random() - 0.5) * topPosition;//(this.canvas.height * 0.2);

    // 初始位置在canvas左侧外
    this.x = Math.random() * this.canvas.width;
  }

  reset() {
    // 随机选择云朵图片
    this.image = new Image();
    this.image.src = Math.random() > 0.5 ? '/assets/y1s.webp' : '/assets/y2s.webp';

    // 初始位置在canvas左侧外
    this.x = -200 - Math.random() * 200;

    // 在顶部30vh位置，允许±10vh的随机偏移
    // const topPosition = this.canvas.height * 0.3;
    // this.y = Math.random()*this.canvas.height*0.4;//topPosition + (Math.random() - 0.5) * topPosition;//(this.canvas.height * 0.2);

    // 随机大小 (0.4-0.9倍原始大小)
    this.scale = 0.4 + Math.random() / 2;

    // 随机水平翻转
    this.flipX = Math.random() > 0.5;

    // 随机速度 (1-3像素/帧)
    this.speed = 4-this.scale*10/3;//1 + Math.random() * 3;

    // 随机透明度 (0.4-0.9)
    this.alpha =  this.scale/2;//0.4 + Math.random() * 0.5;
    this.counter=0;
  }

  update() {
    this.counter++;
    if(this.counter%2==0)
      this.x += this.speed;

    // 如果云朵移出右侧屏幕，重置位置
    if (this.x > this.canvas.width + 100) {
      this.reset();
    }
  }

  draw() {
    if (!this.image.complete) return;

    this.ctx.save();
    this.ctx.globalAlpha = this.alpha;

    if (this.flipX) {
      // 水平翻转绘制
      this.ctx.translate(this.x + this.image.width * this.scale, 0);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(this.image, 0, this.y, this.image.width * this.scale, this.image.height * this.scale);
    } else {
      // 正常绘制
      this.ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);
    }

    this.ctx.restore();
  }
}

// 太阳类
class Sun {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.image = new Image();
    this.image.src = '/assets/ty.webp';

    // 初始位置（右上角）
    this.x = canvas.width * 0.8;
    this.y = canvas.height*0.1;//50;

    // 大小
    this.width = this.canvas.height / 6;
    this.height = this.width;
    console.log("====", this.canvas.width, this.canvas.height)
    // 旋转角度
    this.rotation = 0;
    this.rotationSpeed = 0.01; // 旋转速度
  }

  update() {
    // 更新旋转角度
    this.rotation += this.rotationSpeed;
  }

  draw() {
    this.ctx.save();

    // 移动到太阳中心
    this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // 旋转画布
    this.ctx.rotate(this.rotation);

    // 绘制太阳（绘制位置需要偏移回左上角）
    this.ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    this.ctx.restore();
  }
}

// 云朵管理器
class CloudManager {
  constructor(canvas, count = 5) {
    this.canvas = canvas;
    this.clouds = [];

    // 创建指定数量的云朵
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.clouds.push(new Cloud(canvas));
      // 错开云朵的初始位置
        this.clouds[i].x = -200 * i;
      }, i * 10); // 每500毫秒创建一个新蒲公英

      
    }
  }

  update() {
    this.clouds.forEach(cloud => cloud.update());
  }

  draw() {
    this.clouds.forEach(cloud => cloud.draw());
  }
}

// 导出云朵管理器
window.CloudManager = CloudManager;


// 执行测试
// testFlip(); // 取消注释以运行测试