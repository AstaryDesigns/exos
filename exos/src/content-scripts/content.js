// Content script for EXOS
let currentBox = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'simulateClick') {
    if (currentBox) {
      currentBox.remove();
      currentBox = null;
    }
    
    if (message.box) {
      highlightElement(message.box);
    }
  }
  return true;
});

// Function to highlight elements
function highlightElement(box) {
  currentBox = document.createElement('div');
  currentBox.style.position = 'fixed';
  currentBox.style.border = '2px solid #4299e1';
  currentBox.style.backgroundColor = 'rgba(66, 153, 225, 0.1)';
  currentBox.style.zIndex = '10000';
  currentBox.style.pointerEvents = 'none';
  
  currentBox.style.left = box.left + 'px';
  currentBox.style.top = box.top + 'px';
  currentBox.style.width = box.width + 'px';
  currentBox.style.height = box.height + 'px';
  
  document.body.appendChild(currentBox);
}

// Function to interact with elements
function interactWithElement(selector, action) {
  const element = document.querySelector(selector);
  if (!element) return false;

  switch (action) {
    case 'click':
      element.click();
      break;
    case 'focus':
      element.focus();
      break;
    case 'scroll':
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      break;
    default:
      return false;
  }
  
  return true;
}

// Export functions for external use
window.exosHelper = {
  interactWithElement,
  highlightElement
};
