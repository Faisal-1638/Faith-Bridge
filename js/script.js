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
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');
    const hamburgerIcon = hamburgerBtn.querySelector('i');

    function toggleMenu() {
        const isOpen = mobileNav.classList.toggle('open');
        navOverlay.classList.toggle('active', isOpen);
        
        // Swap hamburger and close (X) icons
        if (isOpen) {
            hamburgerIcon.className = 'fa-solid fa-xmark';
        } else {
            hamburgerIcon.className = 'fa-solid fa-bars';
        }
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Auto-close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
});
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

        