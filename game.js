let timerInterval;
let timeLeft = 60;

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 59;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            playBeepPattern([
                [100, 50], [100, 50], [100, 50], [100, 500], 
                [100, 50], [100, 50], [100, 50], [100, 500], 
            ]);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${min}:${sec}`;
}

function playBeepPattern(pattern) {
    let idx = 0;
    const colors = ["#fffd38", "#ff38a8", "#38fff9"];
    const original = document.body.style.background || "#f9f9f9";
    function next() {
        if (idx >= pattern.length) {
            document.body.style.background = original;
            return;
        }
        const [beepDuration, gapDuration] = pattern[idx];
        document.body.style.background = colors[idx % colors.length];
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 900;
        oscillator.connect(ctx.destination);
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            ctx.close();
            idx++;
            if (gapDuration > 0) {
                setTimeout(next, gapDuration);
            } else {
                next();
            }
        }, beepDuration);
    }
    next();
}

const seenCards = { Easy: new Set(), Medium: new Set(), Hard: new Set() };

function drawCard() {
    const difficulty = document.getElementById('difficulty').value;
    const cards = deck[difficulty];
    const seen = seenCards[difficulty];

    const card = document.getElementById('card');
    const category = document.getElementById('category');
    const itemsList = document.getElementById('items');

    if (seen.size >= cards.length) {
        card.style.display = 'block';
        category.textContent = `All ${difficulty} cards seen!`;
        itemsList.innerHTML = '<li>Try another difficulty.</li>';
        return;
    }

    const remaining = cards.map((_, i) => i).filter(i => !seen.has(i));
    const idx = remaining[Math.floor(Math.random() * remaining.length)];
    seen.add(idx);
    const random = cards[idx];

    card.style.display = 'block';
    category.textContent = `${random.category} (${difficulty})`;
    itemsList.innerHTML = '';
    random.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        itemsList.appendChild(li);
    });
}
