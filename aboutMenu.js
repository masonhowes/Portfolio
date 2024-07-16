document.addEventListener("DOMContentLoaded", function() {
    const helpButton = document.getElementById('help');
    const helpModal = document.getElementById('helpModal');
    const okButton = document.getElementById('okButton');
    const modalContent = document.querySelector('.modalContent');

    const pageOne = document.getElementById('1');
    const pageTwo = document.getElementById('2');
    const pageThree = document.getElementById('3');
    const pageFour = document.getElementById('4');

    const pageText = document.getElementById('helpText');
    const progCont = document.getElementById('programContainer');

    const letterGrid = document.getElementById('lg');
    const speechTrans = document.getElementById('st');
    const particMap = document.getElementById('pm');
    const drawTool = document.getElementById('dt');

    const letterGridAb = document.getElementById('lgAb');
    const speechTransAb = document.getElementById('stAb');
    const particMapAb = document.getElementById('pmAb');
    const drawToolAb = document.getElementById('dtAb');

    const progConts = document.getElementById('progs');

    const okProgButtons = document.querySelectorAll('.okProg');

    let isOutOfModal = true;

    modalContent.addEventListener('click', function() {
        isOutOfModal = false;
    });

    helpModal.addEventListener('click', function() {
        if (isOutOfModal === true) {
            closeWindow();
            setTimeout(() => {
                pageTwo.classList.remove('active');
                pageThree.classList.remove('active');
                pageFour.classList.remove('active');
                pageOne.classList.add('active');
            }, 200);
        }
        isOutOfModal = true;
    });

    helpButton.addEventListener('click', function() {
        helpModal.style.display = 'flex';
    });

    okButton.addEventListener('click', function() {
        switchPage();
        if (checkLast()) {
            okButton.innerHTML = "CLOSE";
        }
    });

    letterGrid.addEventListener('click', function() {
        closeProg();
        letterGridAb.classList.add('active');
        hideProg();
    });

    particMap.addEventListener('click', function() {
        closeProg();
        particMapAb.classList.add('active');
        hideProg();
    });

    speechTrans.addEventListener('click', function() {
        closeProg();
        speechTransAb.classList.add('active');
        hideProg();
    });

    drawTool.addEventListener('click', function() {
        closeProg();
        drawToolAb.classList.add('active');
        hideProg();
    });

    okProgButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeProg();
        });
    });

    /* Helper Functions */
    function closeWindow() {
        modalContent.style.animationName = 'slideOut';
        modalContent.style.animationDuration = '0.2s';
        setTimeout(() => {
            helpModal.style.display = 'none';
            modalContent.style.animationName = 'slideIn';
            setTimeout(() => {
                if (!checkLast()) {
                    okButton.innerHTML = "NEXT";
                }
                closeProg();
                pageFour.classList.remove('active');
                pageOne.classList.add('active');
                pageText.innerHTML=`<h2>ABOUT MASON'S PORTFOLIO</h2>
                    <p>
                        During my time studying for a Data Science degree at the University
                        of Washington, I had the incredible opportunity to expand my
                        programming abilities across multiple coding languages, as well as
                        learned how to hone each of them to accomplish any challenge I am faced with.<br><br>

                        Whether the programs I made were for class assignments or as passion
                        projects, I started to realize that compiling them into a central
                        website (even if its just in the form of a portfolio) would be a much
                        better fate for them than if they were left to collect e-dust in my
                        computer's hard drive.
                    </p>`
                pageText.style.display = 'block';
                progCont.style.display = 'none';
            }, 200);
        }, 200);
    }

    function checkLast() {
        return pageFour.classList.contains('active');
    }

    function closeProg() {
        letterGridAb.classList.remove('active');
        speechTransAb.classList.remove('active');
        particMapAb.classList.remove('active');
        drawToolAb.classList.remove('active');

        letterGrid.style.display = 'flex';
        speechTrans.style.display = 'flex';
        particMap.style.display = 'flex';
        drawTool.style.display = 'flex';
    }

    function hideProg() {
        letterGrid.style.display = 'none';
        speechTrans.style.display = 'none';
        particMap.style.display = 'none';
        drawTool.style.display = 'none';
    }

    function switchPage() {
        if (pageOne.classList.contains('active')) {
            pageOne.classList.remove('active');
            pageTwo.classList.add('active');
            pageText.innerHTML = `<h2>ABOUT MASON'S PORTFOLIO</h2>
            <p>
                The programs on this website are not exhaustive of every
                programming project that I have created. Since JavaScript
                is practically the only supported language for coding
                websites, in order to port all of the programs I have made
                to it, it requires me to re-code them from their original
                language to JavaScript which is very time consuming and in
                some cases impossible.<br><br>
                
                Therefore, what you see on this website and what will
                continually be updated and added to it are programs that
                I've found work well when ported and don't rely on language
                specific libraries (Looking at you, Python).
            </p>`;
        } else if (pageTwo.classList.contains('active')) {
            pageTwo.classList.remove('active');
            pageThree.classList.add('active');
            pageText.innerHTML = `<h2>ABOUT MASON'S PORTFOLIO</h2>
            <p>
                In the section of my resume that directs you to this portfolio,
                I classify this as a "Product Portfolio", as I want there to
                be a focus on "Completed" programs, or ones that don't require
                you to download a program and run it and scroll through it.<br><br>

                Eventually I will likely add a section for downloads for things
                that I simply cannot port over but still want to showcase, likely
                in the form of Jupyter Notebooks.<br><br>

                On the following page, specific information for each of
                the programs on this website will be displayed that you
                can click through and view.
            </p>`;
        } else if (pageThree.classList.contains('active')) {
            pageThree.classList.remove('active');
            pageFour.classList.add('active');
            pageText.style.display = 'none';
            progCont.style.display = 'flex';
        } else {
            closeWindow();
        }
    }
});
