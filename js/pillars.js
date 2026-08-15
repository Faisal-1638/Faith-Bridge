 // Tab Switching Function
        function openPillar(evt, pillarName) {
            let tabcontent = document.getElementsByClassName("pillar-tab-content");
            for (let i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove("active");
            }

            let tablinks = document.getElementsByClassName("tab-btn");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove("active");
            }

            document.getElementById(pillarName).classList.add("active");
            if (evt) {
                evt.currentTarget.classList.add("active");
            }
        }

        // Trigger Tab Switcher from Dropdown or Footer Links
        function openPillarByName(pillarName) {
            const btnTarget = document.querySelector(`.tab-btn[onclick*="'${pillarName}'"]`);
            if (btnTarget) {
                btnTarget.click();
            }
        }
