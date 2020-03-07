
chrome.runtime.onInstalled.addListener(function() {
    chrome.notifications.create(config.installation);
});

document.addEventListener('contextmenu', event => eventRightClic(event));
function eventRightClic(event){
    chrome.tabs.create({ url : 'https://www.twitch.tv/joj_'});
    event.preventDefault();
}
