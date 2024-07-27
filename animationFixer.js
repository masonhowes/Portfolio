document.addEventListener("DOMContentLoaded", function() {

    /* Avoids user seeing initial animation positioning */
    setTimeout(() => {
        const buttons = document.querySelectorAll('.textContainer, .textContainerNB, .buttonOne, .buttonTwo, .buttonThree, .buttonFour, .buttonFive, .buttonSix, .buttonSeven');
        
        buttons.forEach(button => {
            button.style.animationDuration = '0.15s';
        });
    }, 150);

});