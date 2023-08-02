// Bogus import to prevent "module error"
import _ from "lodash";
import { StreamProvider, createExternalExtensionProvider } from "@metamask/providers";
import { SNAP_ID, SNAP_VERSION } from "../config";

let activeTabId: number,
  activeWindowId: number,
  initialSync = false;

/// Begin snap functions
let provider: StreamProvider | undefined = undefined;
try {
  provider = createExternalExtensionProvider("flask");
} catch (err) {
  console.log("Error creating provider", err);
}

/**
 * Request user to log into their MetaMask if they are not connected to this extension
 */
const checkProviderStatus = async () => {
  if (!provider || !provider.chainId) {
    try {
      provider = createExternalExtensionProvider("flask");
    } catch (err) {
      console.log("Error creating provider", err);
    }
  }
  if (provider && !provider.isConnected()) {
    console.log(provider);
    // FREDERIK: The following lines have been added as an attempt to force a popup window so the user
    // will unlock MetaMask. I tried two different ways (one uncommented, one commented). Neither seems
    // to do the trick on browser restart without reinstalling my extension.
    await provider.request({ method: "eth_requestAccounts" }).catch((err) => console.log(err));
    // await provider
    //   .request({
    //     method: "wallet_requestPermissions",
    //     params: [
    //       {
    //         eth_accounts: {}
    //       }
    //     ]
    //   })
    //   .catch((err) => console.log(err));
  }

  return provider && provider.isConnected();
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (snapId: string = SNAP_ID, params: Record<"version" | string, unknown> = {}) => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: params
      }
    });
  }
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
const getSnaps = async () => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_getSnaps"
    });
  }
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

    return Object.values(snaps).find((snap: any) => snap.id === SNAP_ID && (!version || snap.version === version));
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
  await checkProviderStatus();
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
  const success = await checkProviderStatus();
  if (!success) {
    return undefined;
  }
  if (provider) {
    if (!initialSync) {
      const success = await sync();
      if (success) {
        initialSync = true;
      }
    }
    return await provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: SNAP_ID,
        request: { method: "get_password", params: { website: url } }
      }
    });
  } else {
    return undefined;
  }
};

/**
 * Gets the exported state, in encrypted form.
 *
 * @returns
 */
const exportState = async () => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: SNAP_ID,
        request: {
          method: "export"
        }
      }
    });
  } else {
    return undefined;
  }
};

/**
 * Import the data provided by the file provided by the user.
 *
 * @param data - Data extracted from the file provided by the user.
 * @returns
 */
const importState = async (data: { nonce: string; data: string }) => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: SNAP_ID,
        request: {
          method: "import",
          params: {
            data
          }
        }
      }
    });
  } else {
    return undefined;
  }
};

/**
 * Update the password state for a given URL, username, and password combination.
 * @param {*} url The URL to set a password for.
 * @param {*} username The username to set a password for.
 * @param {*} password The password to set.
 * @param {*} controlled Whether or not this entry is controlled by an API.
 * @returns
 */
const setPassword = async (url: string, username: string, password: string, controlled?: boolean) => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: SNAP_ID,
        request: {
          method: "set_password",
          params: { website: url, username: username, password: password, controlled: controlled }
        }
      }
    });
  }
};

/**
 * Remove a password entry from a URL's state given its corresponding username.
 * @param {*} url The URL to remove a password from.
 * @param {*} username The username to remove a password for.
 * @returns
 */
const removePassword = async (url: string, username: string) => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: SNAP_ID,
        request: {
          method: "remove_password",
          params: { website: url, username: username }
        }
      }
    });
  }
};

/**
 * Sync local password state with remote Arweave state.
 * @returns
 */
const sync = async () => {
  await checkProviderStatus();
  if (provider) {
    return await provider
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: SNAP_ID,
          request: {
            method: "sync"
          }
        }
      })
      .catch(() => {
        return false;
      });
  }
};

/**
 * Set the remote sync location for the snap.
 *
 * @returns
 */
const setSyncTo = async (syncTo: string) => {
  await checkProviderStatus();
  if (provider) {
    return await provider
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: SNAP_ID,
          request: {
            method: "set_sync_to",
            params: { data: syncTo }
          }
        }
      })
      .catch(() => {
        return null;
      });
  }
};

/**
 * Get the remote sync location from the keychain snap.
 *
 * @returns
 */
const getSyncTo = async () => {
  await checkProviderStatus();
  if (provider) {
    return await provider
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: SNAP_ID,
          request: {
            method: "get_sync_to"
          }
        }
      })
      .catch(() => {
        return null;
      });
  }
};

/**
 * Set whether or not we should save passwords for a given url.
 * @param {*} url URL for state we are trying to update.
 * @param {*} neverSave Boolean value for whether or not we should save the password state.
 * @returns
 */
const setNeverSave = async (url: string, neverSave: string) => {
  await checkProviderStatus();
  if (provider) {
    return await provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: SNAP_ID,
        request: {
          method: "set_neversave",
          params: { website: url, neverSave: neverSave }
        }
      }
    });
  }
};

/**
 * Clears the keychain dataset values set on forms that have been processed.
 */
function clearAllFormsKeychainDataset() {
  chrome.tabs.sendMessage(
    activeTabId,
    {
      type: "CLEAR_FORM_DATASET"
    },
    () => {}
  );
}

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

  // Only interact with messages initiated from the chrome extension origin
  if (
    !sender.origin.startsWith("chrome-extension") &&
    (message.type === "CONNECT_SNAP" ||
      message.type === "GET_SNAP" ||
      message.type === "IS_FLASK" ||
      message.type === "EXPORT" ||
      message.type === "IMPORT" ||
      message.type === "SET_SYNC_TO")
  ) {
    console.log("Ignoring message.");
    return;
  }

  if (message.type === "PERSIST") {
    clearAllFormsKeychainDataset();
    // This gets called from notifications.js when the user clicks "Save" on the banner
    chrome.tabs.sendMessage(
      activeTabId,
      {
        type: "PERSIST",
        data: message.data
      },
      (res) => sendResponse(res)
    );

    return true;
  } else if (message.type === "NEVER_SAVE") {
    clearAllFormsKeychainDataset();
    // This gets called from notifications.js when the user clicks "Never Save" on the banner
    chrome.tabs.sendMessage(
      activeTabId,
      {
        type: "SET_NEVER_SAVE",
        data: { ...message.data, neverSave: true }
      },
      (res) => sendResponse(res)
    );

    return true;
  } else if (message.type === "FORM_SUBMIT") {
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
        chrome.storage.local
          .set({
            pending: Object.assign({}, obj, {
              [message.url]: { username: message.username, password: message.password, update: idxU >= 0 }
            })
          })
          .then(() => {
            updatePending();
          });
      } else {
        // Same username/password combo was entered that is already saved.
        // Reset the form flags in case the user enters another username/password combo.
        clearAllFormsKeychainDataset();
      }
    });
  } else if (message.type === "CLEAR_PENDING_FOR_SITE") {
    clearAllFormsKeychainDataset();
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
          updatePending(obj);
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
      try {
        connectSnap(`${SNAP_ID}`, { version: SNAP_VERSION })
          .then(() => {
            resolve("Snap connect request completed");
          })
          .catch((err) => {
            resolve("Failed to connect snap: " + err ? err.message : "Unknown error");
          });
      } catch (err: any) {
        resolve("Errored out: " + err ? err.message : "unknown");
      }
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
  } else if (message.type === "EXPORT") {
    exportState().then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "IMPORT") {
    importState(message.data).then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "SET_PASSWORD") {
    clearAllFormsKeychainDataset();
    setPassword(message.data.url, message.data.username, message.data.password, message.data.controlled).then((res) => {
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
  } else if (message.type === "SET_SYNC_TO") {
    setSyncTo(message.data.syncTo).then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "GET_SYNC_TO") {
    getSyncTo().then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "SET_NEVER_SAVE") {
    clearAllFormsKeychainDataset();
    setNeverSave(message.data.url, message.data.neverSave).then((res) => {
      sendResponse({ data: res });
    });
    return true;
  } else if (message.type === "GET_ACTIVE_URL") {
    getTabBaseUrl(activeTabId)
      .then((tabUrl) => getBaseUrl(tabUrl))
      .then((res) => sendResponse({ data: res }));
    return true;
  } else {
    sendResponse(message.type + " method not supported.");
  }
}

if (!chrome.runtime.onMessage.hasListeners()) {
  chrome.runtime.onMessage.addListener(listener);
}

async function updatePending(pending?: any) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }
  if (!activeTabId) {
    return;
  }

  if (!pending) {
    pending = await chrome.storage.local.get("pending").then((obj) => {
      if (!obj) {
        obj = {};
      } else {
        obj = obj.pending;
      }

      return obj;
    });
  }

  chrome.tabs.sendMessage(activeTabId, {
    type: "UPDATE_PENDING",
    data: pending ? pending[getBaseUrl(await getTabBaseUrl(activeTabId))] : undefined
  });
}

function getBaseUrl(url: string) {
  let baseUrl = url.toString().slice(0, url.toString().indexOf("?") ?? url.toString().length);
  // Remove trailing slash in url
  if (baseUrl.at(url.length - 1) === "/") {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  return baseUrl;
}

/**
 * Get tab URL
 * @param tabId Tab ID to get the URL for
 * @returns
 */
async function getTabBaseUrl(tabId: number) {
  return new Promise<string>((resolve, reject) => {
    try {
      chrome.tabs.get(tabId, function (tab) {
        resolve(tab.url ?? "");
      });
    } catch (err) {
      resolve("");
    }
  });
}

/**
 * Update the icon of the extension depending on current pending status
 * @param tabUrl Current URL to check pending status for
 */
async function updateExtensionIcon(tabUrl: string) {
  const obj = (await chrome.storage.local.get("pending")) ?? {};
  let url = getBaseUrl(tabUrl);
  if (obj.pending && obj.pending[url]) {
    chrome.action.setTitle({ title: "Open Keychain" });
    chrome.action.setIcon({ path: "/images.png" });
  } else {
    chrome.action.setTitle({ title: "Keychain Alert" });
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
  // updatePending();
});

/**
 * Listen for when a tab updates
 */
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (activeTabId === tabId && tab.active && changeInfo.status === "complete") {
    if (!tab.url?.startsWith("chrome")) {
      updateExtensionIcon(await getTabBaseUrl((activeTabId = tabId)));
      updatePending();
    }
  }
});

/**
 * Listen for window changes (to get the current focused tab)
 */
chrome.windows.onFocusChanged.addListener(async function (windowId: number) {
  if (windowId !== chrome.windows.WINDOW_ID_NONE && windowId !== activeWindowId) {
    activeWindowId = windowId;
    const [tab] = await chrome.tabs.query({
      active: true,
      windowId: windowId
    });
    updateExtensionIcon((tab && tab.url) ?? "");
    if (tab && !tab.url?.startsWith("chrome")) {
      activeTabId = tab && tab.id ? tab.id : activeTabId;
      updatePending();
    }
  }
});
