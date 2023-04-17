// Bogus import to prevent "module error"
import _ from "lodash";
import { Credential } from "../types";

let activeTabId: number;

/**
 * Handle requests for passwords
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("[background.js]. Message received", request);
  if (request.type === "FORM_SUBMIT") {
    chrome.storage.local.get("pending").then((obj) => {
      if (!obj) {
        obj = {};
      } else {
        obj = obj.pending;
      }
      const idx =
        request.credentials && request.credentials.logins
          ? _.findIndex(request.credentials.logins, { username: request.username, password: request.password })
          : -1;
      const idxU =
        request.credentials && request.credentials.logins
          ? _.findIndex(request.credentials.logins, { username: request.username })
          : -1;
      if (idx < 0) {
        chrome.action.setIcon({ path: "/images.png" });
        chrome.storage.local.set({
          pending: Object.assign({}, obj, {
            [request.url]: { username: request.username, password: request.password, update: idxU >= 0 }
          })
        });
      }
    });
  } else if (request.type === "CLEAR_PENDING_FOR_SITE") {
    chrome.storage.local.get("pending").then((obj) => {
      if (!obj) {
        obj = {};
      } else {
        obj = obj.pending;
      }
      if (obj[request.data.url]) {
        obj[request.data.url] = undefined;
        chrome.storage.local.set({ pending: obj }).then(() => {
          updateExtensionIcon(request.data.url);
        });
      }
      if (request.data.return) {
        sendResponse({ success: true });
      }
    });

    if (request.data.return) {
      return true;
    }
  } else if (request.type === "UPDATE_ICON") {
    updateExtensionIcon(request.data.url);
  } else {
    sendResponse(request.type + " method not supported.");
  }
});

/**
 * Get tab URL
 * @param tabId Tab ID to get the URL for
 * @returns
 */
async function getTabBaseUrl(tabId: number) {
  return new Promise<string>((resolve, reject) => {
    chrome.tabs.get(tabId, function (tab) {
      resolve(tab.url ?? "");
    });
  });
}

/**
 * Update the icon of the extension depending on current pending status
 * @param tabUrl Current URL to check pending status for
 */
async function updateExtensionIcon(tabUrl: string) {
  const obj = (await chrome.storage.local.get("pending")) ?? {};
  let url = tabUrl.toString().slice(0, tabUrl.toString().indexOf("?") ?? tabUrl.toString().length);
  // Remove trailing slash in url
  if (url.at(url.length - 1) === "/") {
    url = url.substring(0, url.length - 1);
  }
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

/**
 * Listen for when a tab activates
 */
chrome.tabs.onActivated.addListener(async function (activeInfo) {
  updateExtensionIcon(await getTabBaseUrl((activeTabId = activeInfo.tabId)));
});

/**
 * Listen for when a tab updates
 */
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (activeTabId === tabId) {
    updateExtensionIcon(await getTabBaseUrl((activeTabId = tabId)));
  }
});

/**
 * Listen for window changes (to get the current focused tab)
 */
chrome.windows.onFocusChanged.addListener(async function (windowId: number) {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    const [tab] = await chrome.tabs.query({ active: true, windowId: windowId });
    updateExtensionIcon((tab && tab.url) ?? "");
  }
});
