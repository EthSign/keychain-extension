// Bogus import to prevent "module error"
import _ from "lodash";
import { createExternalExtensionProvider } from "@metamask/providers";

const DEFAULT_SNAP_ID = "local:http://localhost:8081";
const SNAP_VERSION = "0.2.0";
let activeTabId: number;

/// Begin snap functions
const provider = createExternalExtensionProvider();

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = DEFAULT_SNAP_ID,
  params: Record<"version" | string, unknown> = {}
) => {
  await provider.request({
    method: "wallet_requestSnaps",
    params: {
      [snapId]: params
    }
  });
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
const getSnaps = async () => {
  return await provider.request({
    method: "wallet_getSnaps"
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
const getSnap = async (version: string) => {
  try {
    const snaps: any = await getSnaps();

    return Object.values(snaps).find(
      (snap: any) => snap.id === DEFAULT_SNAP_ID && (!version || snap.version === version)
    );
  } catch (e) {
    console.log("Failed to obtain installed snap", e);
    return undefined;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
const isFlask = async () => {
  try {
    const clientVersion = await provider?.request({
      method: "web3_clientVersion"
    });

    // @ts-ignore
    const isFlaskDetected = clientVersion?.includes("flask");

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

/**
 * Gets the password state for a given URL.
 * @param {*} url The URL to get the password state for.
 * @returns
 */
const getPassword = async (url: string) => {
  return await provider.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: { method: "get_password", params: { website: url } }
    }
  });
};

/**
 * Update the password state for a given URL, username, and password combination.
 * @param {*} url The URL to set a password for.
 * @param {*} username The username to set a password for.
 * @param {*} password The password to set.
 * @returns
 */
const setPassword = async (url: string, username: string, password: string) => {
  return await provider.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: "set_password",
        params: { website: url, username: username, password: password }
      }
    }
  });
};

/**
 * Remove a password entry from a URL's state given its corresponding username.
 * @param {*} url The URL to remove a password from.
 * @param {*} username The username to remove a password for.
 * @returns
 */
const removePassword = async (url: string, username: string) => {
  return await provider.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: "remove_password",
        params: { website: url, username: username }
      }
    }
  });
};

/**
 * Sync local password state with remote Arweave state.
 * @returns
 */
const sync = async () => {
  return await provider.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: "sync"
      }
    }
  });
};

/**
 * Set whether or not we should save passwords for a given url.
 * @param {*} url URL for state we are trying to update.
 * @param {*} neverSave Boolean value for whether or not we should save the password state.
 * @returns
 */
const setNeverSave = async (url: string, neverSave: string) => {
  return await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: "set_neversave",
        params: { website: url, neverSave: neverSave }
      }
    }
  });
};

/**
 * Handle requests for passwords
 */
function listener(message: any, sender: any, sendResponse: Function) {
  console.log("[background.js]. Message received", message);

  // Make sure only our extension can send messages
  if (sender.id !== chrome.runtime.id) {
    console.log(sender.id);
    return;
  }

  if (message.type === "FORM_SUBMIT") {
    chrome.storage.local.get("pending").then((obj) => {
      if (!obj) {
        obj = {};
      } else {
        obj = obj.pending;
      }
      const idx =
        message.credentials && message.credentials.logins
          ? _.findIndex(message.credentials.logins, { username: message.username, password: message.password })
          : -1;
      const idxU =
        message.credentials && message.credentials.logins
          ? _.findIndex(message.credentials.logins, { username: message.username })
          : -1;
      if (idx < 0) {
        chrome.action.setIcon({ path: "/images.png" });
        chrome.storage.local.set({
          pending: Object.assign({}, obj, {
            [message.url]: { username: message.username, password: message.password, update: idxU >= 0 }
          })
        });
      }
    });
  } else if (message.type === "CLEAR_PENDING_FOR_SITE") {
    chrome.storage.local.get("pending").then((obj) => {
      if (!obj) {
        obj = {};
      } else {
        obj = obj.pending;
      }
      if (obj[message.data.url]) {
        obj[message.data.url] = undefined;
        chrome.storage.local.set({ pending: obj }).then(() => {
          updateExtensionIcon(message.data.url);
        });
      }
      if (message.data.return) {
        sendResponse({ success: true });
      }
    });

    if (message.data.return) {
      return true;
    }
  } else if (message.type === "UPDATE_ICON") {
    updateExtensionIcon(message.data.url);
  } else if (message.type === "CONNECT_SNAP") {
    new Promise<string>((resolve) => {
      connectSnap(`${DEFAULT_SNAP_ID}`, { version: SNAP_VERSION })
        .then(() => {
          resolve("Snap connect request completed");
        })
        .catch((err) => {
          resolve("Failed to connect snap: " + err ? err.message : "Unknown error");
        });
    }).then((res) => sendResponse({ data: res }));
    return true;
  } else if (message.type === "GET_SNAP") {
    getSnap(SNAP_VERSION).then((res: any) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "IS_FLASK") {
    isFlask()
      .then((res) => {
        sendResponse({ data: res });
      })
      .catch(() => {
        sendResponse({ data: false });
      });
    return true;
  } else if (message.type === "GET_PASSWORD") {
    getPassword(message.data.url)
      .then((res) => {
        sendResponse({ data: res });
      })
      .catch((err) => {
        sendResponse({ data: err.message });
      });
    return true;
  } else if (message.type === "SET_PASSWORD") {
    setPassword(message.data.url, message.data.username, message.data.password).then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "REMOVE_PASSWORD") {
    removePassword(message.data.url, message.data.username).then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "SYNC") {
    sync().then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "SET_NEVER_SAVE") {
    setNeverSave(message.data.url, message.data.neverSave).then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else {
    sendResponse(message.type + " method not supported.");
  }
}

if (!chrome.runtime.onMessage.hasListeners()) {
  chrome.runtime.onMessage.addListener(listener);
}

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
