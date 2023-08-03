import { useContext, useEffect, useState } from "react";
import "./App.css";
import NeverSave from "./pages/NeverSave";
import { MetaMaskActions, MetaMaskContext } from "./hooks";
import { Credential } from "./types";
import {
  clearPendingForSite,
  connectSnap,
  getSnap,
  getSyncTo,
  neverSaveForSite,
  persistPendingForSite,
  requestCredentials,
  sendAutofill,
  sendExportState,
  sendImportState,
  sendSync,
  setSyncTo
} from "./utils/snap";
import Connect from "./pages/Connect";
import Credentials from "./pages/Credentials";
import Pending from "./pages/Pending";
import { Spinner } from "./components/icons/Spinner";
import { download } from "./utils/files";

function App() {
  const [pending, handlePending] =
    useState<
      Record<string, { url: string; username: string; password: string; update?: boolean; controlled?: string }>
    >();
  const [url, handleUrl] = useState<string>();
  const [credentials, handleCredentials] = useState<Credential | null>();
  const [state, dispatch] = useContext(MetaMaskContext);
  const [loading, handleLoading] = useState(false);
  const [loadingMessage, handleLoadingMessage] = useState("Loading...");
  const [syncTo, handleSyncTo] = useState<string | null | undefined>("");

  useEffect(() => {
    loadPending();
    loadCurrentUrl();
  }, []);

  useEffect(() => {
    if (!url || !state.installedSnap || Object.keys(state.installedSnap).length === 0 || !state.isFlask) {
      handleCredentials(undefined);
      return;
    }

    (async () => {
      handleLoadingMessage("Retrieving Credentials...");
      handleLoading(true);
      const creds = await requestCredentials(url);
      handleCredentials(creds);

      const syncLoc = await getSyncTo();
      if (syncLoc) {
        handleSyncTo(syncLoc.toLowerCase());
      } else {
        handleSyncTo(syncLoc);
      }
      handleLoading(false);
    })();
  }, [state.installedSnap, state.isFlask, url]);

  const handleSetSyncTo = async (syncTo: string) => {
    const res = await setSyncTo(syncTo);
    if (res) {
      handleSyncTo(res.toLowerCase());
    }
  };

  const connectToMetaMask = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();
      console.log(installedSnap);
      dispatch({
        type: MetaMaskActions.SetInstalled,
        payload: installedSnap
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetaMaskActions.SetError, payload: e });
    }
  };

  const loadPending = () => {
    chrome.storage &&
      chrome.storage.local.get("pending").then((pending) => {
        handlePending(pending.pending);
        // console.log(pending.pending);
      });
  };

  const loadCurrentUrl = () => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tabs ? tabs[0]?.url ?? "" : "";
        const idx = url.toString().indexOf("?");
        url = url.toString().slice(0, idx >= 0 ? idx : url.toString().length);

        // Remove trailing slash
        if (url.at(url.length - 1) === "/") {
          url = url.substring(0, url.length - 1);
        }
        handleUrl(url);
      });
  };

  /**
   * Syncs the Snap's local state with the remote state and then retrieves the credentials for the current site. Updates loading state as necessary.
   *
   * @returns Boolean value representing a successful sync.
   */
  const handleSync = async () => {
    handleLoadingMessage("Syncing...");
    handleLoading(true);
    const res = await sendSync();
    if (url) {
      const creds = await requestCredentials(url);
      handleCredentials(creds);
    }
    handleLoading(false);
    return res;
  };

  /**
   * Exports the user's state to a file and updates the extension's loading message accordingly.
   */
  const handleExportState = async () => {
    handleLoadingMessage("Exporting...");
    handleLoading(true);
    const res = await sendExportState();
    handleLoading(false);
    if (res?.success) {
      download(res.data ?? "");
    }
  };

  /**
   * Imports a password state to the user's local machine. Updates the extension's loading message accordingly.
   *
   * @param state - The imported state, parsed from a json file on the user's machine.
   */
  const handleImportState = async (state: { nonce: string; data: string }) => {
    handleLoadingMessage("Importing...");
    handleLoading(true);
    const res = await sendImportState(state);
    handleLoading(false);
    if (res?.success) {
      download(res.data ?? "");
    }
  };

  /**
   * Clears pending entry for the current URL.
   *
   * @returns
   */
  const clearPending = () => {
    if (!pending || !url || !pending[url]) {
      return;
    }

    clearPendingForSite(url).then((res) => {
      if (res) {
        handlePending(Object.assign({}, pending, { [url]: undefined }));
        window.close();
      }
    });
  };

  /**
   * Persists the pending entry for the current URL.
   *
   * @returns
   */
  const persistPending = () => {
    if (!pending || !url || !pending[url]) {
      return;
    }
    persistPendingForSite(url, pending[url]).then((response) => {
      if (response?.data === "OK") {
        requestCredentials(url).then((creds) => handleCredentials(creds));
        const tempPending = Object.assign({}, pending, { [url]: undefined });
        handlePending(tempPending);
        window.close();
      }
    });
  };

  /**
   * Sets neverSave to true for the current URL.
   *
   * @returns
   */
  const neverSave = () => {
    if (!pending || !url || !pending[url]) {
      return;
    }
    neverSaveForSite(url).then((response) => {
      if (response?.data === "OK") {
        requestCredentials(url).then((creds) => handleCredentials(creds));
        const tempPending = Object.assign({}, pending, { [url]: undefined });
        handlePending(tempPending);
        window.close();
      }
    });
  };

  return (
    <div className="font-plex dark:bg-black-900 dark:text-white">
      <div className="p-8">
        {Object.keys(state.installedSnap ?? {}).length === 0 ? (
          <>
            <Connect state={state} connectToMetaMask={connectToMetaMask} />
          </>
        ) : pending && url && pending[url] ? (
          <>
            <Pending
              url={url}
              pending={pending}
              handlePending={handlePending}
              clearPendingForSite={clearPending}
              persistPending={persistPending}
              neverSaveForSite={neverSave}
            />
          </>
        ) : credentials?.neverSave ? (
          <>
            <NeverSave
              url={url}
              credentials={credentials}
              handleCredentials={handleCredentials}
              handleSync={handleSync}
            />
          </>
        ) : (
          <>
            <Credentials
              url={url}
              credentials={credentials}
              syncTo={syncTo}
              handleCredentials={handleCredentials}
              handleSync={handleSync}
              handleSetSyncTo={handleSetSyncTo}
              selectCallback={(credential: {
                address?: string | undefined;
                timestamp: number;
                url: string;
                username: string;
                password: string;
              }) => {
                sendAutofill(credential.username, credential.password).then(() => window.close());
              }}
              handleExportState={handleExportState}
              handleImportState={handleImportState}
            />
          </>
        )}
      </div>
      {loading ? (
        <>
          <div className="absolute inset-0 bg-[#757575]/80 dark:bg-[#000000]/80">
            <div className="flex flex-col h-full w-full justify-center items-center">
              <div className="flex justify-center w-full py-4">
                <Spinner className="animate-spin" />
              </div>
              <div className="font-semibold text-white text-2xl text-center mt-2">{loadingMessage}</div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default App;
