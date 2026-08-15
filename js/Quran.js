// ১১৪টি সূরার ডাটা জমা রাখার গ্লোবাল ভেরিয়েন্ট
let allSurahsData = [];

// পেজ লোড হলেই ১১৪টি সূরার তালিকা নিয়ে আসার জন্য
document.addEventListener('DOMContentLoaded', fetchAllSurahs);

// ১. API থেকে ১১৪টি সূরার তালিকা নিয়ে আসা
async function fetchAllSurahs() {
    const grid = document.getElementById('surahGrid');
    
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();

        if (data.code === 200) {
            allSurahsData = data.data;
            renderSurahGrid(allSurahsData);
        } else {
            grid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color:red;">সূরার তালিকা লোড করা যায়নি।</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color:red;">ইন্টারনেট সংযোগ চেক করুন এবং পেজ রিফ্রেশ করুন।</p>`;
    }
}

// ২. ১১৪টি সূরার কার্ড ডিসপ্লে (Render) করা
function renderSurahGrid(surahs) {
    const grid = document.getElementById('surahGrid');
    grid.innerHTML = '';

    surahs.forEach(surah => {
        const surahCard = document.createElement('div');
        surahCard.className = 'surah-card';
        
        // কার্ডে ক্লিক করলে ডাইনামিকালি openSurah কল হবে
        surahCard.onclick = () => openSurah(surah.number, surah.englishName, surah.englishNameTranslation, `${surah.numberOfAyahs} টি আয়াত`);

        surahCard.innerHTML = `
            <div class="surah-meta">
                <div class="surah-number">${surah.number}</div>
                <div class="surah-details">
                    <h3>${surah.englishName}</h3>
                    <p>${surah.englishNameTranslation} • ${surah.numberOfAyahs} টি আয়াত</p>
                </div>
            </div>
            <div class="surah-arabic-title" dir="rtl" lang="ar">${surah.name}</div>
        `;

        grid.appendChild(surahCard);
    });
}

// ৩. লাইভ সার্চ / ফিল্টার ফাংশন
function filterSurahs() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    
    const filteredSurahs = allSurahsData.filter(surah => {
        const nameEn = surah.englishName.toLowerCase();
        const translation = surah.englishNameTranslation.toLowerCase();
        const number = surah.number.toString();

        return nameEn.includes(input) || translation.includes(input) || number.includes(input);
    });

    renderSurahGrid(filteredSurahs);
}

// ৪. নির্দিষ্ট সূরা ওপেন করে আয়াত ও বাংলা অনুবাদ দেখানো (নাইট মোড ফ্রেন্ডলি)
async function openSurah(surahNumber, title, meaning, versesCount) {
    // ভিউ পরিবর্তন
    document.getElementById('surahGrid').style.display = 'none';
    document.getElementById('controlsBar').style.display = 'none';
    document.getElementById('readerView').style.display = 'block';

    // হেডার তথ্য আপডেট
    document.getElementById('activeSurahTitle').innerText = title;
    document.getElementById('activeSurahMeta').innerText = `${meaning} • ${versesCount}`;

    const container = document.getElementById('versesContainer');
    const bismillahHeader = document.querySelector('.bismillah');
    
    // সূরা তওবা (Surah 9) হলে বিসমিল্লাহ লুকানো, বাকি সব সূরায় দেখানো
    if (bismillahHeader) {
        if (surahNumber === 9) {
            bismillahHeader.style.display = 'none';
        } else {
            bismillahHeader.style.display = 'block';
        }
    }

    // লোডিং নির্দেশক দেখানো
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p style="margin-top: 1rem;">সূরা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,bn.bengali`);
        const data = await response.json();

        if (data.code === 200) {
            const arabicVerses = data.data[0].ayahs;
            const bengaliVerses = data.data[1].ayahs;

            container.innerHTML = ''; // লোডিং মেসেজ মুছে ফেলা

            arabicVerses.forEach((verse, index) => {
                let arabicText = verse.text;
                const bengaliText = bengaliVerses[index].text;

                // সূরা ফাতিহা (1) এবং সূরা তওবা (9) ছাড়া বাকি সূরার ১ম আয়াত থেকে বিসমিল্লাহ বাদ দেওয়া
                if (surahNumber !== 1 && surahNumber !== 9 && index === 0) {
                    arabicText = arabicText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
                    arabicText = arabicText.replace(/^بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\s*/, '');
                    arabicText = arabicText.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '');
                }

                // আপনার CSS ফাইল অনুযায়ী ডার্ক/লাইট মোড সাপোর্টেড আয়াত কার্ড
                const verseHTML = `
                    <div class="verse-item">
                        <div class="verse-top">
                            <span class="verse-badge">${verse.numberInSurah}</span>
                            <div class="verse-actions">
                                <button class="v-action-btn" title="আয়াত কপি করুন" onclick="copyVerse(\`${arabicText.replace(/'/g, "\\'")}\`, \`${bengaliText.replace(/'/g, "\\'")}\`)">
                                    <i class="fa-regular fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- আরবি আয়াত -->
                        <div class="arabic-verse" dir="rtl" lang="ar">
                            ${arabicText}
                        </div>
                        
                        <!-- বাংলা অনুবাদ -->
                        <div class="verse-translation">
                            ${bengaliText}
                        </div>
                    </div>
                `;
                container.innerHTML += verseHTML;
            });
        } else {
            container.innerHTML = `<p style="text-align: center; color: red;">তথ্য লোড করতে সমস্যা হয়েছে।</p>`;
        }
    } catch (error) {
        container.innerHTML = `<p style="text-align: center; color: red;">ইন্টারনেট সংযোগ চেক করুন এবং পুনরায় চেষ্টা করুন।</p>`;
    }
}

// ৫. সূচিপত্রে ফিরে যাওয়ার ফাংশন
function closeReader() {
    document.getElementById('readerView').style.display = 'none';
    document.getElementById('surahGrid').style.display = 'grid';
    document.getElementById('controlsBar').style.display = 'flex';
}

// ৬. ক্লিপবোর্ডে কপি করার ফাংশন
function copyVerse(arabic, translation) {
    const textToCopy = `${arabic}\n\nঅর্থ: ${translation}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("আয়াত ও অর্থ কপি করা হয়েছে!");
    });
}