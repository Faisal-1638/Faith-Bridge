// function openPillar(evt, pillarName) {
//         let i, tabcontent, tablinks;
        
//         tabcontent = document.getElementsByClassName("pillar-tab-content");
//         for (i = 0; i < tabcontent.length; i++) {
//             tabcontent[i].classList.remove("active");
//         }

//         tablinks = document.getElementsByClassName("tab-btn");
//         for (i = 0; i < tablinks.length; i++) {
//             tablinks[i].classList.remove("active");
//         }

//         document.getElementById(pillarName).classList.add("active");
//         evt.currentTarget.classList.add("active");
//     }
function goTo(page) {
    window.location.href = page;
}

// <!-- Theme Toggle JavaScript -->
    const themeToggleBtn = document.getElementById('themeToggle');
        const themeIcon = themeToggleBtn.querySelector('i');

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.className = 'fa-solid fa-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fa-solid fa-sun';
            }
        });

        // js dua and sura moving

        