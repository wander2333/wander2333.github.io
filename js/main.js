document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('animated-title');
  const ellipsis = document.getElementById('ellipsis');
  const text = 'xxxxx';
  let index = 0;

  // 逐字显示函数
  const typeWriter = () => {
    if (index < text.length) {
      title.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, 200); // 200ms/字
    } else {
      // 显示并开始闪烁省略号
      ellipsis.classList.remove('hidden');
    }
  };

  // 启动动画
  typeWriter();
  // 1. 获取Canvas元素和绘图上下文
  const canvas = document.getElementById('particleCanvas');
  const bg_canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');




  // 2. 设置画布尺寸为整个窗口
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bg_canvas.width = window.innerWidth;
    bg_canvas.height = window.innerHeight;
  }
  resizeCanvas(); // 初始化尺寸
  // 监听窗口大小变化，实时调整画布尺寸
  window.addEventListener('resize', resizeCanvas);
  // 初始化云朵管理器
  const cloudManager = new CloudManager(canvas, canvas.width / 200);
  // 初始化太阳 [新增]
  const sun = new Sun(canvas);

  // 3. 定义粒子类
  class Particle {
    constructor() {
      // 初始位置随机分布在画布上
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      // 随机大小（1到5像素）
      this.size = Math.random() * 5 + 1;
      // 随机速度（X和Y方向，范围在-2到2之间，产生各向运动）
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;

      // 可以添加颜色属性，这里使用淡蓝色
      this.color = 'rgba(255, 255, 255, 0.8)';
    }

    // 更新粒子位置
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界检测：如果粒子移出画布，让其从对侧重新进入
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;

      // 另一种边界行为：碰壁反弹（可选，替换上方边界检测代码）
      // if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      //     this.speedX = -this.speedX;
      // }
      // if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      //     this.speedY = -this.speedY;
      // }
    }

    // 绘制粒子
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      ctx.closePath();
      ctx.fill();
    }
  }
  class Dandelion {
    constructor(img) {
      this.reset();
      // 初始位置从屏幕上方随机位置开始飘落
      this.y = Math.random() * -canvas.height;
      this.img = img;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 100;//Math.random() * -100; // 从屏幕外上方开始
      // 随机大小，模拟远近感
      this.size = 15 + Math.random() * 40; // 宽度在15到40像素之间
      // 更缓慢的飘落速度，更符合蒲公英特性
      this.speedX = (Math.random() - 0.5) * 1.5; // X方向速度范围-0.75到0.75
      this.speedY = 0.5 + Math.random() * 1.5; // Y方向向下飘落，速度范围0.5到2

      this.speedX /= 2;
      this.speedY /= 2;
      this.speedY = -this.speedY;
      // 旋转角度和旋转速度，增加真实感
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 0.5; // 旋转速度范围-0.25到0.25度/帧
      // 轻微的透明度变化
      this.alpha = 0.7 + Math.random() * 0.3; // 透明度范围0.7到1
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.angle += this.spinSpeed;

      // 如果蒲公英飘出屏幕，重置它到顶部
      // if (this.y > canvas.height || this.x < -50 || this.x > canvas.width + 50) {
      if (this.y < 0 || this.x < -50 || this.x > canvas.width + 50) {
        this.reset();
      }
    }

    draw() {
      if (!this.img.complete) return; // 确保图片已加载

      ctx.save();
      ctx.globalAlpha = this.alpha;
      // 将画布原点移动到粒子中心，便于旋转
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle * Math.PI / 180); // 将角度转换为弧度进行旋转

      // 绘制蒲公英图片，以原点为中心
      ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);

      ctx.restore();
    }
  }

  // 初始化背景
  const background = new Background(bg_canvas, '/assets/bjs.webp');
  // const person1=new Person(bg_canvas,"/assets/me.webp",0);
  // 窗口大小变化时重绘
  window.addEventListener('resize', () => {
    background.draw();
    // person1.draw();
  });

  // 2. 加载蒲公英图片
  const dandelionImg1 = new Image();
  dandelionImg1.src = '/assets/p1.webp';//'/examples/me/one.svg'; // 请替换为你的蒲公英图片实际地址
  const dandelionImg2 = new Image();
  dandelionImg2.src = '/assets/p2.webp';
  // 4. 创建粒子数组并初始化
  const particlesArray = [];
  const numberOfParticles = 16; // 粒子数量，可根据性能调整
  // 4. 创建蒲公英粒子数组
  const dandelions = [];
  const dandelionCount = 80; // 蒲公英数量，可根据性能调整

  // 等待图片加载完成后初始化粒子
  dandelionImg1.onload = function () {
    for (let i = 0; i < dandelionCount; i++) {
      // 设置不同的延迟，让蒲公英不同时出现
      setTimeout(() => {
        dandelions.push(new Dandelion(dandelionImg1));
      }, i * 10); // 每500毫秒创建一个新蒲公英
    }
    // 启动动画循环
    // animate();
  };
  dandelionImg2.onload = function () {
    for (let i = 0; i < dandelionCount; i++) {
      // 设置不同的延迟，让蒲公英不同时出现
      setTimeout(() => {
        dandelions.push(new Dandelion(dandelionImg2));
      }, i * 10); // 每500毫秒创建一个新蒲公英
    }
    // 启动动画循环
    // animate();
  };

  function init() {
    particlesArray.length = 0; // 清空数组
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  init();

  // 5. 动画循环函数
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // 更新和绘制云朵
    cloudManager.update();
    cloudManager.draw();

    // 更新和绘制太阳 [新增]
    sun.update();
    sun.draw();

    // 遍历所有粒子，更新位置并绘制
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    // 更新并绘制每个蒲公英
    for (let i = 0; i < dandelions.length; i++) {
      dandelions[i].update();
      dandelions[i].draw();
    }
    // 递归调用animate，形成动画循环
    requestAnimationFrame(animate);
  }

  // 6. 启动动画
  animate();
});