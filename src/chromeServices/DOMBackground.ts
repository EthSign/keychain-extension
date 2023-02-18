// Bogus import to prevent "module error"
import _ from "lodash";
import { Credential } from "../types";

let activeTabId: number;
const credentials: Record<string, Credential> = {};

// Handle requests for passwords
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
        credentials[request.url] !== undefined
          ? _.findIndex(credentials[request.url].logins, { username: request.username, password: request.password })
          : -1;
      // TODO: Support updating a password (right now, it will flag as not saved and provide general prompt)
      if (idx < 0) {
        chrome.action.setIcon({ path: "/images.png" });
        chrome.storage.local.set({
          pending: Object.assign({}, obj, {
            [request.url]: { username: request.username, password: request.password }
          })
        });
      }
    });
  } else if (request.type === "PERSIST") {
    // Check if credentials exist for the current url (-2 if no credentials for current site)
    const idx = credentials[request.data.url]
      ? _.findIndex(credentials[request.data.url].logins, { username: request.data.username })
      : -2;
    if (idx === -2) {
      // Create new credential entry for current website
      credentials[request.data.url] = {
        url: request.data.url,
        neverSave: false,
        logins: [{ username: request.data.username, password: request.data.password }]
      };
    } else if (idx < 0) {
      // Add username/password pair to current credential entry
      credentials[request.data.url].logins.push({ username: request.data.username, password: request.data.password });
    } else {
      // Update password for current credential entry pair
      credentials[request.data.url].logins[idx].password = request.data.password;
    }

    // Clear pending for site
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

      sendResponse({ success: true });
    });

    sendResponse({ success: true });
  } else if (request.type === "REQUEST_CREDENTIALS") {
    // TODO: We may consider returning the credential logins in a particular order
    // so that the most used is at position 0. (We autofill element 0)
    sendResponse({
      url: credentials[request.data.url].url,
      neverSave: credentials[request.data.url].neverSave,
      logins: credentials[request.data.url].logins
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

      sendResponse({ success: true });
    });

    return true;
  } else if (request.type === "NEVER_SAVE_FOR_SITE") {
    // Clear pending
    chrome.storage.local.get("pending").then((obj) => {
      if (obj) {
        obj = obj.pending;
      }
      if (obj[request.data.url]) {
        obj[request.data.url] = undefined;
        chrome.storage.local.set({ pending: obj }).then(() => {
          updateExtensionIcon(request.data.url);
        });
      }

      // Mark neverSave as true and clear saved logins for url
      credentials[request.data.url] = { url: request.data.url, neverSave: true, logins: [] };

      sendResponse({ success: true });
    });
    return true;
  } else if (request.type === "ENABLE_SAVE_FOR_SITE") {
    // Mark neverSave as false
    credentials[request.data.url].neverSave = false;
    sendResponse({ success: true });
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
