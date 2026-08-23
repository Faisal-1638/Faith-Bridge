        let userLat = 23.8103;  // Default fallback (Dhaka)
        let userLng = 90.4125;
        let prayerTimings = {};

        // Request location on load
        window.addEventListener('DOMContentLoaded', () => {
            requestLocation();
        });

        function requestLocation() 
        {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        userLat = pos.coords.latitude;
                        userLng = pos.coords.longitude;
                        fetchPrayerTimes(userLat, userLng);
                        calculateQibla(userLat, userLng);
                    },
                    (err) => {
                        console.warn('Geolocation denied or failed. Loading defaults.');
                        fetchPrayerTimes(userLat, userLng);
                        calculateQibla(userLat, userLng);
                    }
                );
            } else {
                fetchPrayerTimes(userLat, userLng);
                calculateQibla(userLat, userLng);
            }
        }

        // Fetch prayer data from AlAdhan API
        async function fetchPrayerTimes(lat, lng) 
        {
            try {
                const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
                const data = await response.json();
                
                if (data.code === 200) {
                    prayerTimings = data.data.timings;
                    const dateMeta = data.data.date;

                    // Display Hijri Date & Location
                    document.getElementById('hijriDate').innerText = `${dateMeta.hijri.day} ${dateMeta.hijri.month.en} ${dateMeta.hijri.year} AH (${dateMeta.gregorian.date})`;
                    document.getElementById('cityName').innerHTML = `<i class="fa-solid fa-location-dot" style="color: var(--primary-accent);"></i> ${data.data.meta.timezone}`;

                    // Update UI cards
                    const list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                    list.forEach(prayer => {
                        if (document.getElementById(`time-${prayer}`)) {
                            document.getElementById(`time-${prayer}`).innerText = convertTo12Hr(prayerTimings[prayer]);
                        }
                    });

                    startPrayerCountdown();
                }
            } catch (err) {
                console.error('Error fetching prayer times:', err);
            }
        }

        // Convert 24hr string to 12hr format
        function convertTo12Hr(timeStr) 
        {
            const [hours, minutes] = timeStr.split(':');
            let h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return `${h}:${minutes} ${ampm}`;
        }

        // Qibla Direction Calculation
        function calculateQibla(lat, lng) 
        {
            const kaabaLat = 21.422487 * (Math.PI / 180);
            const kaabaLng = 39.826206 * (Math.PI / 180);
            const myLat = lat * (Math.PI / 180);
            const myLng = lng * (Math.PI / 180);

            const y = Math.sin(kaabaLng - myLng);
            const x = Math.cos(myLat) * Math.tan(kaabaLat) - Math.sin(myLat) * Math.cos(kaabaLng - myLng);
            
            let qibla = Math.atan2(y, x) * (180 / Math.PI);
            qibla = (qibla + 360) % 360;

            document.getElementById('qiblaDegree').innerText = `Qibla Angle: ${Math.round(qibla)}° from North`;
            document.getElementById('compassNeedle').style.transform = `rotate(${qibla}deg)`;
        }

        // Countdown Logic
        function startPrayerCountdown() 
        {
            setInterval(() => {
                const now = new Date();
                const list = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                let nextPrayer = null;
                let nextTime = null;

                for (let p of list) 
                {
                    const [h, m] = prayerTimings[p].split(':');
                    const pDate = new Date();
                    pDate.setHours(parseInt(h), parseInt(m), 0, 0);

                    if (pDate > now) {
                        nextPrayer = p;
                        nextTime = pDate;
                        break;
                    }
                }

                // If all prayers today have passed, target Fajr tomorrow
                if (!nextPrayer) 
                {
                    nextPrayer = 'Fajr';
                    const [h, m] = prayerTimings['Fajr'].split(':');
                    nextTime = new Date();
                    nextTime.setDate(nextTime.getDate() + 1);
                    nextTime.setHours(parseInt(h), parseInt(m), 0, 0);
                }
            
        document.querySelectorAll('.prayer-card').forEach(c => c.classList.remove('active'));
                if (document.getElementById(`card-${nextPrayer}`)) {
                    document.getElementById(`card-${nextPrayer}`).classList.add('active');
                }

                document.getElementById('nextPrayerName').innerText = nextPrayer;

                const diff = nextTime - now;
                const hrs = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                document.getElementById('countdown').innerText = 
                    `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }, 1000);
        }
