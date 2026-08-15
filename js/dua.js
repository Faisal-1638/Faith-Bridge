function filterDuas(category, evt) {
            const cards = document.querySelectorAll('.dua-card');
            const btns = document.querySelectorAll('.cat-btn');

            btns.forEach(btn => btn.classList.remove('active'));
            evt.currentTarget.classList.add('active');

            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Copy Dua to Clipboard Logic
        function copyDua(btn) {
            const card = btn.closest('.dua-card');
            const title = card.querySelector('.dua-title').innerText;
            const arabic = card.querySelector('.arabic-dua').innerText;
            const transliteration = card.querySelector('.transliteration').innerText;
            const translation = card.querySelector('.translation').innerText;

            const textToCopy = `${title}\n\n${arabic}\n\n${transliteration}\n${translation}`;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast();
            });
        }

        function showToast() {
            const toast = document.getElementById('toast');
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
