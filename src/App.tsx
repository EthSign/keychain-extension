import { useContext, useEffect, useState } from "react";
import "./App.css";
import DisplayCredentials from "./components/DisplayCredentials";
import NeverSave from "./components/NeverSave";
import Pending from "./components/Pending";
import { MetaMaskActions, MetaMaskContext } from "./hooks";
import { Credential, DOMMessage } from "./types";
import Button from "./ui/forms/Button";
import { connectSnap, getSnap } from "./utils/snap";

function App() {
  const [pending, handlePending] = useState<Record<string, { url: string; username: string; password: string }>>();
  const [url, handleUrl] = useState<string>();
  const [credentials, handleCredentials] = useState<Credential | null>();
  const [state, dispatch] = useContext(MetaMaskContext);

  useEffect(() => {
    loadPending();
    loadCurrentUrl();
  }, []);

  useEffect(() => {
    if (!url) {
      handleCredentials(undefined);
      return;
    }

    (async () => {
      const creds = await requestCredentials(url);
      handleCredentials(creds);
    })();
  }, [url]);

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
      });
  };

  const loadCurrentUrl = () => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tabs[0].url ?? "";
        const idx = url.toString().indexOf("?");
        url = url.toString().slice(0, idx >= 0 ? idx : url.toString().length);
        handleUrl(url);
      });
  };

  const requestCredentials = async (url: string) => {
    return new Promise<Credential | undefined>((resolve) => {
      chrome.tabs
        ? chrome.tabs.query(
            {
              active: true,
              currentWindow: true
            },
            (tabs) => {
              chrome.tabs.sendMessage(
                tabs[0].id || 0,
                {
                  type: "REQUEST_CREDENTIALS",
                  data: { url: url }
                } as DOMMessage,
                (response: Credential) => {
                  resolve(response);
                }
              );
            }
          )
        : resolve(undefined);
    });
  };

  if (pending && url && pending[url]) {
    return (
      <div className="">
        <h1>{url}</h1>

        <Pending
          url={url}
          username={pending[url].username}
          password={pending[url].password}
          pending={pending}
          handlePending={handlePending}
        />
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
      <h1>{url}</h1>
      {/* disabled={!state.isFlask} */}
      {!state.installedSnap && <Button onClick={connectToMetaMask}>Connect Snap</Button>}

      <div className="">
        <DisplayCredentials url={url} credentials={credentials} handleCredentials={handleCredentials} />
      </div>
    </div>
  );
}

export default App;
