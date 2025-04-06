window.showPopupBox = function() {
    var popupBox = document.getElementById("popup-box");
    if (popupBox) {
        popupBox.classList.add("show");

        setTimeout(function() {
            popupBox.classList.remove("show");
        }, 5000); // Hide after 5 seconds
    }
};

window.closePopupBox = function() {
    var popupBox = document.getElementById("popup-box");
    if (popupBox) {
        popupBox.style.display = "none";
    }
};

window.disableShaders = function() {
    const canvas = document.getElementById("shaderCanvas");
    if (canvas) {
        canvas.style.display = "none";
    }
    const messageElement = document.getElementById("shader-message");
    if (messageElement) {
        messageElement.style.display = "block";
    }
};

window.showShaderMessage = function() {
    const messageElement = document.getElementById("shader-message");
    if (messageElement) {
        messageElement.style.display = "block";
    }
};