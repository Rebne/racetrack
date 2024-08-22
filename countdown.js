function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateCountdown(timeRemaining) {
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = formatTime(timeRemaining.seconds);

    if (timeRemaining.seconds > 0) {
        timeRemaining.seconds--;
        setTimeout(function() {
            updateCountdown(timeRemaining);
        }, 1000);
    } else {
        countdownElement.textContent = "Race Over";
    }
}
