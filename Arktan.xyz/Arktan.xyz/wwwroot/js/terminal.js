window.focusTerminalInput = function() {
    const input = document.querySelector("input");
    if (input) {
        input.focus();
    }
};

window.scrollToBottom = function () {
    const terminalOutput = document.getElementById("terminal-output");
    if (terminalOutput) {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else {
        console.warn("scrollToBottom: Terminal output div not found!");
    }
};

window.redirectToArtPage = function() {
    window.location.href = "/art";
};

