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




