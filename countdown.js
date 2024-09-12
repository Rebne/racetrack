function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateCountdown(time) {
    const countdownElement = document.getElementById('countdown');
    if (time > 0) {
        countdownElement.textContent = formatTime(time);
    } else {
        countdownElement.textContent = "Race Over";
    }
}
