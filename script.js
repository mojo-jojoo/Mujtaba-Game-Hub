function openGame(gameUrl) {
    const newWindow = window.open("", "_blank");
    newWindow.location.href = gameUrl;
    newWindow.opener = null;
}
