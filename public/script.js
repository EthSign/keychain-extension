const DEFAULT_SNAP_ID = "npm:w3ptestsnap";

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

const getPassword = async (url) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: { method: 'get_password', params: { website: url } },
    },
  });
}

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
        connectSnap("npm:w3ptestsnap").then(() => {
          this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "CONNECT_SNAP", text: "Snap connect request completed"});
        }).catch((err) => {this.window.postMessage({type: "ETHSIGN_KEYCHAIN_EVENT", filter: "CONNECT_SNAP", text: "Failed to connect snap: " + err ? err.message : "Unknown error"});});
        break;
      case "GET_SNAP":
        getSnap().then((res) => {
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
      default: break;
    }
    console.log("page javascript got message:", event);
  }
});
