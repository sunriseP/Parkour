// 获取 Canvas 和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏常量
const playerWidth = 50;
const playerHeight = 50;
const obstacleWidth = 50;
const obstacleHeight = 50;
const numObstacles = 30; // 随机障碍物的数量
const exitWidth = 50;
const exitHeight = 50;
const speed = 5; // 物体运动速度
const minDistanceFromExit = 100; // 玩家与出口的最小距离

// 玩家对象
const player = {
    x: 0,
    y: 0,
    width: playerWidth,
    height: playerHeight,
    color: 'black',
    speed: speed
};

// 障碍物数组
const obstacles = [];

// 出口对象
const exit = {
    x: 0,
    y: 0,
    width: exitWidth,
    height: exitHeight,
    color: 'yellow' // 出口颜色设置为黄色
};

// 游戏状态
let paused = false;
let gameWon = false;

// 随机生成不与障碍物重叠的出口位置
function generateExit() {
    let validPositionFound = false;
    while (!validPositionFound) {
        // 生成随机位置
        exit.x = Math.random() * (canvas.width - exitWidth);
        exit.y = Math.random() * (canvas.height - exitHeight);

        // 检查是否与障碍物重叠
        validPositionFound = true;
        for (const obstacle of obstacles) {
            if (exit.x < obstacle.x + obstacle.width &&
                exit.x + exit.width > obstacle.x &&
                exit.y < obstacle.y + obstacle.height &&
                exit.y + exit.height > obstacle.y) {
                validPositionFound = false;
                break;
            }
        }
    }
}

// 随机生成不与障碍物重叠的障碍物位置
function generateObstacles() {
    obstacles.length = 0; // 清空旧的障碍物
    for (let i = 0; i < numObstacles; i++) {
        let validPositionFound = false;
        while (!validPositionFound) {
            // 生成随机位置
            const x = Math.random() * (canvas.width - obstacleWidth);
            const y = Math.random() * (canvas.height - obstacleHeight);
            const newObstacle = { x, y, width: obstacleWidth, height: obstacleHeight };

            // 检查是否与其他障碍物重叠
            validPositionFound = true;
            for (const obstacle of obstacles) {
                if (newObstacle.x < obstacle.x + obstacle.width &&
                    newObstacle.x + newObstacle.width > obstacle.x &&
                    newObstacle.y < obstacle.y + obstacle.height &&
                    newObstacle.y + newObstacle.height > obstacle.y) {
                    validPositionFound = false;
                    break;
                }
            }

            if (validPositionFound) {
                obstacles.push(newObstacle);
            }
        }
    }
}

// 随机生成不与障碍物重叠且与出口保持一定距离的玩家位置
function generatePlayerPosition() {
    let validPositionFound = false;
    while (!validPositionFound) {
        // 生成随机位置
        player.x = Math.random() * (canvas.width - playerWidth);
        player.y = Math.random() * (canvas.height - playerHeight);

        // 检查是否与障碍物重叠
        validPositionFound = true;
        for (const obstacle of obstacles) {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                validPositionFound = false;
                break;
            }
        }

        // 检查是否与出口重叠，并确保与出口保持一定的最小距离
        const distanceToExit = Math.sqrt(Math.pow(player.x - exit.x, 2) + Math.pow(player.y - exit.y, 2));
        if (distanceToExit < minDistanceFromExit) {
            validPositionFound = false;
        }
    }
}

// 监听键盘事件
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 处理游戏结束和通关
function gameOver() {
    document.getElementById('gameOverScreen').classList.remove('hidden');
    paused = true; // 游戏结束时暂停
}

function winGame() {
    document.getElementById('victoryScreen').classList.remove('hidden');
    paused = true; // 游戏通关时暂停
    gameWon = true; // 标记游戏已通关
}

// 处理重新开始按钮点击事件
document.querySelectorAll('#restartButton').forEach(button => {
    button.addEventListener('click', () => {
        // 隐藏游戏结束和通关屏幕
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('victoryScreen').classList.add('hidden');
        // 重置游戏状态
        resetGame(); // 总是调用 resetGame，障碍物仅在通关后重新生成
    });
});

// 重置游戏
function resetGame() {
    if (!gameWon) {
        // 游戏失败时保留障碍物地图
        generatePlayerPosition(); // 确保玩家初始位置不与障碍物重叠
    } else {
        // 游戏通关时重新生成障碍物
        generateObstacles();
        generateExit();
        generatePlayerPosition(); // 确保玩家初始位置不与障碍物重叠
        gameWon = false; // 重置通关状态
    }
    paused = false;
}

// 调整 canvas 尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateObstacles(); // 重新生成障碍物
    generateExit(); // 重新生成出口
    generatePlayerPosition(); // 确保玩家初始位置不与障碍物重叠
}

// 更新游戏状态
function update() {
    if (paused) return; // 如果游戏暂停，跳过更新逻辑

    // 玩家移动
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
        if (player.x < 0) player.x = canvas.width;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
        if (player.x > canvas.width) player.x = 0;
    }
    if (keys['ArrowUp']) {
        player.y -= player.speed;
        if (player.y < 0) player.y = canvas.height;
    }
    if (keys['ArrowDown']) {
        player.y += player.speed;
        if (player.y > canvas.height) player.y = 0;
    }

    // 检测碰撞
    for (const obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver();
            return; // 触发游戏结束后退出循环
        }
    }

    // 检测是否到达出口
    if (player.x < exit.x + exit.width &&
        player.x + player.width > exit.x &&
        player.y < exit.y + exit.height &&
        player.y + player.height > exit.y) {
        winGame();
    }
}

// 绘制游戏元素
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 绘制障碍物
    ctx.fillStyle = 'red';
    for (const obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // 绘制出口
    ctx.fillStyle = exit.color;
    ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
}

// 主游戏循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 窗口调整大小时重新设置画布尺寸
window.addEventListener('resize', resizeCanvas);

// 初始化画布大小
resizeCanvas();

// 启动游戏
gameLoop();
