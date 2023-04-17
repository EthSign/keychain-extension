const DEFAULT_SNAP_ID = "npm:w3ptestsnap";
const SNAP_VERSION = "0.1.3";

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion)?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
const connectSnap = async (
  snapId = DEFAULT_SNAP_ID,
  params = {}
) => {
  console.log("window.ethereum: " + window.ethereum);
  await window.ethereum.request({
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
  return (await window.ethereum.request({
    method: "wallet_getSnaps"
  }));
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
const getSnap = async (version) => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find((snap) => snap.id === DEFAULT_SNAP_ID && (!version || snap.version === version));
  } catch (e) {
    console.log("Failed to obtain installed snap", e);
    return undefined;
  }
};

/**
 * Gets the password state for a given URL.
 * @param {*} url The URL to get the password state for.
 * @returns 
 */
const getPassword = async (url) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: { method: 'get_password', params: { website: url } },
    },
  });
}

/**
 * Update the password state for a given URL, username, and password combination.
 * @param {*} url The URL to set a password for.
 * @param {*} username The username to set a password for.
 * @param {*} password The password to set.
 * @returns 
 */
const setPassword = async (url, username, password) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'set_password',
        params: { website: url, username: username, password: password },
      },
    },
  });
}

/**
 * Remove a password entry from a URL's state given its corresponding username.
 * @param {*} url The URL to remove a password from.
 * @param {*} username The username to remove a password for.
 * @returns 
 */
const removePassword = async (url, username) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'remove_password',
        params: { website: url, username: username },
      },
    },
  });
}

/**
 * Sync local password state with remote Arweave state.
 * @returns
 */
const sync = async () => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'sync',
      },
    },
  });
}

/**
 * Set whether or not we should save passwords for a given url.
 * @param {*} url URL for state we are trying to update.
 * @param {*} neverSave Boolean value for whether or not we should save the password state.
 * @returns 
 */
const setNeverSave = async (url, neverSave) => {
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
}

/**
 * Listen for messages from our content script
 */
window.addEventListener("message", function (event) {
  if(event.data.type && event.data.type === "EthSignKeychainEvent") {
    switch(event.data.text) {
      case "IS_FLASK":
        isFlask().then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "IS_FLASK", text: res})
        }).catch(() => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "IS_FLASK", text: false})
        });
        break;
      case "CONNECT_SNAP":
        connectSnap(`${DEFAULT_SNAP_ID}`, { version: SNAP_VERSION }).then(() => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "CONNECT_SNAP", text: "Snap connect request completed"});
        }).catch((err) => {this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "CONNECT_SNAP", text: "Failed to connect snap: " + err ? err.message : "Unknown error"});});
        break;
      case "GET_SNAP":
        getSnap(SNAP_VERSION).then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "GET_SNAP", text: res})
        });
        break;
      case "GET_PASSWORD":
        getPassword(event.data.url).then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "GET_PASSWORD", text: res})
        }).catch((err) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "GET_PASSWORD", text: err.message})
        });
        break;
      case "SET_PASSWORD":
        setPassword(event.data.url, event.data.username, event.data.password).then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "SET_PASSWORD", text: res})
        });
        break;
      case "REMOVE_PASSWORD":
        removePassword(event.data.url, event.data.username).then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "REMOVE_PASSWORD", text: res})
        });
        break;
      case "SYNC":
        sync().then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "SYNC", text: res})
        });
        break;
      case "SET_NEVER_SAVE":
        setNeverSave(event.data.url, event.data.neverSave).then((res) => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "SET_NEVER_SAVE", text: res})
        });
        break;
      default: break;
    }
    console.log("page javascript got message:", event);
  }
});
