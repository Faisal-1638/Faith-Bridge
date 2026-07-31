// ================= TASBIH COUNTER =================

document.addEventListener('DOMContentLoaded', () => {

    const dhikrSelect = document.getElementById('dhikr');
    const countDisplay = document.getElementById('count');
    const goalText = document.getElementById('goalText');
    const goalSlider = document.getElementById('goalSlider');
    const countBtn = document.getElementById('countBtn');
    const undoBtn = document.getElementById('undo');
    const resetBtn = document.getElementById('reset');

    const STORAGE_KEY = 'tasbihData';
    let history = [];

    function loadData() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getCurrentDhikr() {
        return dhikrSelect.value;
    }

    // Simple beep using the Web Audio API — no sound file needed
    function playGoalSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 880; // pitch
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    }

    function renderForCurrentDhikr() {
        const data = loadData();
        const entry = data[getCurrentDhikr()] || { count: 0, goal: 33 };

        countDisplay.textContent = entry.count;
        goalSlider.value = entry.goal;
        goalText.textContent = entry.goal;

        history = [];
    }

    countBtn.addEventListener('click', () => {
        const data = loadData();
        const key = getCurrentDhikr();
        const entry = data[key] || { count: 0, goal: parseInt(goalSlider.value, 10) };

        history.push(entry.count);
        entry.count += 1;

        data[key] = entry;
        saveData(data);

        countDisplay.textContent = entry.count;

        if (navigator.vibrate) navigator.vibrate(15);

        // Play sound + stronger vibration when goal is reached
        if (entry.count === entry.goal) {
            playGoalSound();
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        }
    });

    undoBtn.addEventListener('click', () => {
        if (history.length === 0) return;

        const data = loadData();
        const key = getCurrentDhikr();
        const entry = data[key] || { count: 0, goal: parseInt(goalSlider.value, 10) };

        entry.count = history.pop();
        data[key] = entry;
        saveData(data);

        countDisplay.textContent = entry.count;
    });

    resetBtn.addEventListener('click', () => {
        const data = loadData();
        const key = getCurrentDhikr();
        const entry = data[key] || { count: 0, goal: parseInt(goalSlider.value, 10) };

        history.push(entry.count);
        entry.count = 0;
        data[key] = entry;
        saveData(data);

        countDisplay.textContent = 0;
    });

    goalSlider.addEventListener('input', () => {
        goalText.textContent = goalSlider.value;

        const data = loadData();
        const key = getCurrentDhikr();
        const entry = data[key] || { count: 0, goal: 33 };
        entry.goal = parseInt(goalSlider.value, 10);
        data[key] = entry;
        saveData(data);
    });

    dhikrSelect.addEventListener('change', renderForCurrentDhikr);

    renderForCurrentDhikr();
});