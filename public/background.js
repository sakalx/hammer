const changeBadgeText = text => chrome.browserAction.setBadgeText({text});

const sendMessage = message => {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {message});
  });
};

chrome.browserAction.onClicked.addListener(() => {
  chrome.browserAction.getBadgeText({}, badgeText => {
    if (badgeText === 'OFF') {
      sendMessage('initialize extension');
      changeBadgeText('ON');
    } else {
      sendMessage('terminate extension');
      changeBadgeText('OFF');
    }
  })
});


chrome.runtime.onMessage.addListener(
  request =>
    request.message === 'terminate' && changeBadgeText('OFF')
);

changeBadgeText('OFF');