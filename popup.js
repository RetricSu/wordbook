
document.getElementById('go-to-options').onclick = openOps;

function openOps() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
};

document.getElementById('about').onclick = openObt;

function openObt() {
  window.open(chrome.runtime.getURL('about.html'));
};

document.getElementById('export').onclick = openExport;

function openExport() {
  window.open(chrome.runtime.getURL('export.html'));
};
