import { useContext, useEffect, useState } from "react";
import "./App.css";
import DisplayCredentials from "./components/DisplayCredentials";
import NeverSave from "./components/NeverSave";
import Pending from "./components/Pending";
import { MetaMaskActions, MetaMaskContext } from "./hooks";
import { Credential } from "./types";
import Button from "./ui/forms/Button";
import { connectSnap, getSnap, requestCredentials, sendSync } from "./utils/snap";
import { DEFAULT_SNAP_ID } from "./chromeServices/DOMBackground";

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
        let url = tabs[0].url ?? "";
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

  if (pending && url && pending[url]) {
    return (
      <div className="">
        <h1>{url}</h1>

        <Pending url={url} pending={pending} handlePending={handlePending} />
      </div>
    );
  }

  if (credentials?.neverSave) {
    return (
      <div className="">
        <h1>{url}</h1>

        <div className="">
          <NeverSave url={url} credentials={credentials} handleCredentials={handleCredentials} />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="border-b border-black w-full">{url}</h1>
      {(Object.keys(state.installedSnap ?? {}).length === 0 || DEFAULT_SNAP_ID.startsWith("local")) && (
        <Button onClick={connectToMetaMask} disabled={!state.isFlask} className="mt-2">
          Connect Snap
        </Button>
      )}

      <div className="">
        <DisplayCredentials
          url={url}
          credentials={credentials}
          handleCredentials={handleCredentials}
          handleSync={handleSync}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
