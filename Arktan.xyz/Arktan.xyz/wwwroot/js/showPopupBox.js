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