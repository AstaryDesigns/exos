// Background service worker
let isOpen = false;
let port = null;
let messageQueue = [];

function sendMessage(message) {
  if (port) {
    port.postMessage(message);
  } else {
    messageQueue.push(message);
  }
}

// Handle connection from sidebar
chrome.runtime.onConnect.addListener((connectionPort) => {
  port = connectionPort;
  
  if (connectionPort.name === 'sidebar') {
    // Send queued messages
    for (const message of messageQueue) {
      sendMessage(message);
    }
    messageQueue = [];
    isOpen = true;

    // Handle sidebar disconnection
    connectionPort.onDisconnect.addListener(async () => {
      port = null;
      isOpen = false;
      
      // Cleanup on disconnect
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          try {
            await chrome.debugger.detach({tabId: tab.id});
          } catch {}
          await chrome.tabs.sendMessage(tab.id, {
            action: "simulateClick",
            box: null
          });
        } catch (err) {
          console.error("Error sending simulateClick:", err);
        }
      }
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentTabId") {
    sendResponse({tabId: sender.tab?.id});
  } else if (message.type === "open_side_panel") {
    chrome.sidePanel.open({tabId: sender.tab?.id});
  }
  return true;
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(function(command, tab) {
  if (command === "toggle-sidebar") {
    if (isOpen) {
      port?.postMessage({action: "close"});
    } else {
      chrome.sidePanel.open({tabId: tab.id});
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({tabId: tab.id});
});

// Handle omnibox
let currentTabId;

chrome.omnibox.onInputStarted.addListener(async () => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  currentTabId = tabs[0]?.id;
  
  // Handle special URLs
  if (
    tabs[0]?.url?.startsWith("chrome") ||
    tabs[0]?.url?.includes("chromewebstore.google.com") ||
    tabs[0]?.url?.startsWith("edge://")
  ) {
    await chrome.tabs.update(currentTabId, {url: "about:blank"});
  }
});

chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.sidePanel.open({tabId: currentTabId});
  sendMessage({action: "request", msg: text});
});
