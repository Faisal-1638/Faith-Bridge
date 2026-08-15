 let count = 0;
        let completedLaps = 0;
        let targetLimit = 33;
        let soundEnabled = true;

        const countDisplay = document.getElementById('countDisplay');
        const lapDisplay = document.getElementById('lapDisplay');
        const arabicText = document.getElementById('arabicText');
        const translationText = document.getElementById('translationText');

        // Simple Beep Audio using Web Audio API
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playClickSound() {
            if (!soundEnabled) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        }

        function incrementCount() {
            count++;
            playClickSound();

            // Haptic Feedback for Mobile Devices
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }

            if (targetLimit > 0 && count >= targetLimit) {
                completedLaps++;
                count = 0;
                if (navigator.vibrate) {
                    navigator.vibrate([50, 100, 50]);
                }
            }

            updateDisplay();
        }

        function decrementCount() {
            if (count > 0) {
                count--;
                updateDisplay();
            }
        }

        function resetCounter() {
            count = 0;
            completedLaps = 0;
            updateDisplay();
        }

        function updateDisplay() {
            countDisplay.innerText = count;
            lapDisplay.innerText = `Completed Rounds: ${completedLaps}`;
        }

        function setDhikr(name, arabic, translation, defaultTarget, btn) {
            arabicText.innerText = arabic;
            translationText.innerText = translation;

            document.querySelectorAll('.preset-chip').forEach(chip => chip.classList.remove('active'));
            btn.classList.add('active');

            // Find matching target button or set directly
            setTarget(defaultTarget);
        }

        function setTarget(target, btn) {
            targetLimit = target;
            count = 0;
            updateDisplay();

            const targetBtns = document.querySelectorAll('.target-btn');
            targetBtns.forEach(b => b.classList.remove('active'));

            if (btn) {
                btn.classList.add('active');
            } else {
                targetBtns.forEach(b => {
                    if ((target === 33 && b.innerText === '33') ||
                        (target === 100 && b.innerText === '100') ||
                        (target === 0 && b.innerText === '∞')) {
                        b.classList.add('active');
                    }
                });
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const icon = document.getElementById('soundToggle').querySelector('i');
            icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        }

        // Spacebar key support for counting
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                incrementCount();
            }
        });