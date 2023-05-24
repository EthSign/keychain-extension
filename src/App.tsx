import { useContext, useEffect, useState } from "react";
import "./App.css";
import DisplayCredentials from "./components/DisplayCredentials";
import NeverSave from "./pages/NeverSave";
import { MetaMaskActions, MetaMaskContext } from "./hooks";
import { Credential } from "./types";
import Button from "./ui/forms/Button";
import { connectSnap, getSnap, requestCredentials, sendAutofill, sendSync } from "./utils/snap";
import TopBar from "./components/TopBar";
import { KeychainLogo } from "./components/icons/KeychainLogo";
import { Chain } from "./components/icons/Chain";
import { SNAP_ID } from "./config";
import Connect from "./pages/Connect";
import Credentials from "./pages/Credentials";
import Pending from "./pages/Pending";

function App() {
  const [pending, handlePending] =
    useState<Record<string, { url: string; username: string; password: string; update?: boolean }>>();
  const [url, handleUrl] = useState<string>();
  const [credentials, handleCredentials] = useState<Credential | null>();
  const [state, dispatch] = useContext(MetaMaskContext);
  const [loading, handleLoading] = useState(false);

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
      handleLoading(true);
      const creds = await requestCredentials(url);
      handleCredentials(creds);
      handleLoading(false);
    })();
  }, [state.installedSnap, state.isFlask, url]);

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
    handleLoading(true);
    const res = await sendSync();
    if (url) {
      const creds = await requestCredentials(url);
      handleCredentials(creds);
    }
    handleLoading(false);
    return res;
  };

  return (
    <div className="font-plex">
      <div className="p-8">
        {Object.keys(state.installedSnap ?? {}).length === 0 ? (
          <>
            <Connect state={state} connectToMetaMask={connectToMetaMask} />
          </>
        ) : pending && url && pending[url] ? (
          <>
            <Pending url={url} pending={pending} handlePending={handlePending} />
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
              handleCredentials={handleCredentials}
              handleSync={handleSync}
              loading={loading}
              selectCallback={(credential: {
                address?: string | undefined;
                timestamp: number;
                url: string;
                username: string;
                password: string;
              }) => {
                sendAutofill(credential.username, credential.password).then(() => window.close());
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
