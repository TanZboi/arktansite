window.focusTerminalInput = function() {
    const input = document.querySelector("input");
    if (input) {
        input.focus();
    }
};

window.scrollToBottom = function () {
    let outputDiv = document.querySelector(".output");
    if (outputDiv) {
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
};

window.redirectToArtPage = function() {
    window.location.href = "/art";
};

window.focusInput = function() {
    let inputField = document.querySelector(".input");
    if (inputField) {
        inputField.focus();
    }
};

window.redirectTo = function(url) {
    window.location.href = url;
};

window.randomlyPositionHelpButtons = function() {
    const container = document.querySelector('.command-buttons');
    const buttons = container.querySelectorAll('button');

    buttons.forEach(button => {
        button.style.transition = 'left 4s ease-in-out, top 4s ease-in-out'; // Increased transition duration to 4 seconds
        button.style.position = 'absolute'; // Ensure buttons are positioned absolutely
    });

    const moveButtons = () => {
        buttons.forEach(button => {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;

            const maxX = containerWidth - buttonWidth;
            const maxY = containerHeight - buttonHeight;

            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;

            button.style.left = `${randomX}px`;
            button.style.top = `${randomY}px`;
        });
    };

    // Initial positioning
    moveButtons();

    // Move buttons every 2 seconds (adjust as needed)
    setInterval(moveButtons, 2000);
};
