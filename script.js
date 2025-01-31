let players = [];
let punishments = [];
let spinning = false;

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
// แอบมองโค้ดหรอครับ เม้นไว้เผื่อใครแอบอ่านเฉยๆ อิอิ By.PetTeddy
// Event Listeners
document.getElementById('add-player').addEventListener('click', addPlayer);
document.getElementById('add-punishment').addEventListener('click', addPunishment);
document.getElementById('spin-btn').addEventListener('click', spinWheel);

function addPlayer() {
    const input = document.getElementById('player-name');
    const name = input.value.trim();
    if (name) {
        players.push(name);
        updatePlayersList();
        input.value = '';
    }
}

function addPunishment() {
    const input = document.getElementById('punishment');
    const punishment = input.value.trim();
    if (punishment) {
        punishments.push(punishment);
        updatePunishmentList();
        input.value = '';
    }
}

function updatePlayersList() {
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = player;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'ลบ';
        deleteBtn.onclick = () => {
            players.splice(index, 1);
            updatePlayersList();
        };
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

function updatePunishmentList() {
    const list = document.getElementById('punishment-list');
    list.innerHTML = '';
    punishments.forEach((punishment, index) => {
        const li = document.createElement('li');
        li.textContent = punishment;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'ลบ';
        deleteBtn.onclick = () => {
            punishments.splice(index, 1);
            updatePunishmentList();
        };
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (players.length === 0) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
    const sliceAngle = (Math.PI * 2) / players.length;
    
    // วาดเงาวงล้อ
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX + 5, centerY + 5, radius, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    
    players.forEach((player, index) => {
        // คำนวณมุมสำหรับแต่ละส่วน
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        
        // วาดส่วนของวงล้อ
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = `hsl(${(360 / players.length) * index}, 70%, 65%)`;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // วาดข้อความ
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Kanit';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(player, radius - 30, 6);
        ctx.restore();
    });

    // วาดวงกลมตรงกลาง
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();
}

// Add resize handler
window.addEventListener('resize', () => {
    const container = document.querySelector('.wheel-container');
    const size = Math.min(container.offsetWidth, 400);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
});

// Trigger initial resize
window.dispatchEvent(new Event('resize'));

// เพิ่มฟังก์ชันสำหรับจัดการ modal
function showModal(winner, punishment) {
    const modal = document.getElementById('result-modal');
    const resultText = modal.querySelector('.result-text');
    resultText.textContent = `${winner} ต้อง ${punishment}!`;
    modal.classList.add('show');
    
    const closeBtn = modal.querySelector('.close-modal');
    const closeModal = () => {
        modal.classList.remove('show');
        closeBtn.removeEventListener('click', closeModal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = notification.querySelector('.notification-text');
    notificationText.textContent = message;
    notification.classList.add('show');
    
    const closeBtn = notification.querySelector('.notification-close');
    const closeNotification = () => {
        notification.classList.remove('show');
        closeBtn.removeEventListener('click', closeNotification);
    };
    
    closeBtn.addEventListener('click', closeNotification);
    notification.addEventListener('click', (e) => {
        if (e.target === notification) closeNotification();
    });
}

function spinWheel() {
    if (spinning) return;
    
    if (players.length === 0 && punishments.length === 0) {
        showNotification('กรุณาเพิ่มรายชื่อผู้เล่นและบทลงโทษก่อนหมุน');
        return;
    }
    
    if (players.length === 0) {
        showNotification('กรุณาเพิ่มรายชื่อผู้เล่นก่อนหมุน');
        return;
    }
    
    if (punishments.length === 0) {
        showNotification('กรุณาเพิ่มบทลงโทษก่อนหมุน');
        return;
    }
    
    spinning = true;
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    
    let rotation = 0;
    const totalRotation = 3000 + Math.random() * 1000;
    const startTime = performance.now();
    const duration = 5000;
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = 1 - Math.pow(1 - progress, 3);
        rotation = eased * totalRotation;
        
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-canvas.width/2, -canvas.height/2);
        drawWheel();
        ctx.restore();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            spinBtn.disabled = false;
            
            // คำนวณผู้ชนะจากองศาที่หมุนไป
            const finalAngle = (-rotation % 360 + 360) % 360;
            const sliceAngle = 360 / players.length;
            const winnerIndex = (Math.floor(finalAngle / sliceAngle)) % players.length;
            const winner = players[winnerIndex];
            const punishment = punishments[Math.floor(Math.random() * punishments.length)];
            
            showModal(winner, punishment);
        }
    }
    
    requestAnimationFrame(animate);
}

// Initial draw
drawWheel();
