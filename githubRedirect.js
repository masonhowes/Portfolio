document.addEventListener("DOMContentLoaded", function() {
    const helpButton = document.getElementById('repo');
    const helpModal = document.getElementById('repoModal');
    const okButton = document.getElementById('okButton');
    const modalContent = document.querySelector('.modalContent');

    let isOutOfModal = true;

    modalContent.addEventListener('click', function() {
        isOutOfModal = false;
    });

    helpModal.addEventListener('click', function() {
        if (isOutOfModal === true) {
            closeWindow();
        }
        isOutOfModal = true;
    });

    helpButton.addEventListener('click', function() {
        helpModal.style.display = 'flex';
    });

    okButton.addEventListener('click', function() {
        closeWindow();
    });


    /* Helper Functions */
    function closeWindow() {
        modalContent.style.animationName = 'slideOut';
        modalContent.style.animationDuration = '0.2s';
        setTimeout(() => {
            helpModal.style.display = 'none';
            modalContent.style.animationName = 'slideIn';
        }, 200);
    }

});
