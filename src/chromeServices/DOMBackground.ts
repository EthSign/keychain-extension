// Bogus import to prevent "module error"
import { useState } from "react";

let activeTabId: number;
const credentials: Record<string, { url: string; username: string; password: string }> = {};

// Handle requests for passwords
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  console.log("[background.js]. Message received", request);
  if (request.type === "FORM_SUBMIT") {
    chrome.action.setIcon({ path: "/images.png" });
    const obj = (await chrome.storage.local.get("pending")) ?? {};
    chrome.storage.local.set({
      pending: Object.assign({}, obj.pending, {
        [request.url]: { username: request.username, password: request.password }
      })
    });
  } else if (request.type === "PERSIST") {
    console.log(request);
    credentials[request.data.url] = {
      url: request.data.url,
      username: request.data.username,
      password: request.data.password
    };
  } else if (request.type === "REQUEST_CREDENTIALS") {
    sendResponse({ data: credentials[request.data.url] });
  }
});

// Get tab URL
async function getTabBaseUrl(tabId: number) {
  return new Promise<string>((resolve, reject) => {
    chrome.tabs.get(tabId, function (tab) {
      resolve(tab.url ?? "");
    });
  });
}

// Update the icon of the extension depending on status
async function updateExtensionIcon(tabUrl: string) {
  const obj = (await chrome.storage.local.get("pending")) ?? {};
  let url = tabUrl.toString().slice(0, tabUrl.toString().indexOf("?") ?? tabUrl.toString().length);
  if (obj.pending && obj.pending[url]) {
    chrome.action.setTitle({ title: "Open Web3Pass" });
    chrome.action.setIcon({ path: "/images.png" });
  } else {
    chrome.action.setTitle({ title: "Web3Pass Alert" });
    chrome.action.setIcon({
      path: "/images2.png"
    });
  }
}

// Listen for when a tab activates
chrome.tabs.onActivated.addListener(async function (activeInfo) {
  console.log("tab activated");
  updateExtensionIcon(await getTabBaseUrl((activeTabId = activeInfo.tabId)));
});

// Listen for when a tab updates
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (activeTabId === tabId) {
    updateExtensionIcon(await getTabBaseUrl((activeTabId = tabId)));
  }
});

// Listen for window changes (to get the current focused tab)
chrome.windows.onFocusChanged.addListener(async function (windowId: number) {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    const [tab] = await chrome.tabs.query({ active: true, windowId: windowId });
    updateExtensionIcon((tab && tab.url) ?? "");
  }
});
