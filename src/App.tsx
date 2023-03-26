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
    if (!url || !state.installedSnap || !state.isFlask) {
      handleCredentials(undefined);
      return;
    }

    (async () => {
      const creds = await requestCredentials(url);
      console.log(creds);
      handleCredentials(creds);
    })();
  }, [state.installedSnap, state.isFlask, url]);

  const connectToMetaMask = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

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
        console.log(pending);
        handlePending(pending.pending);
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
                (response: {
                  data: {
                    timestamp: number;
                    neverSave?: boolean | undefined;
                    logins: {
                      address?: string;
                      timestamp: number;
                      url: string;
                      username: string;
                      password: string;
                    }[];
                  };
                }) => {
                  // TODO: Once I update the snap to return the entire Credential object for a given URL,
                  // instead of just the logins, change this back to:
                  // resolve(response?.data ?? undefined);
                  // @ts-ignore
                  resolve({ timestamp: 0, neverSave: false, logins: response?.data ?? [] });
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

  // TODO: Incorporate neverSave into new system
  // if (credentials?.neverSave) {
  //   return (
  //     <div className="">
  //       <h1>{url}</h1>

  //       <div className="">
  //         <NeverSave url={url} credentials={credentials} handleCredentials={handleCredentials} />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="">
      <h1>{url}</h1>
      {!state.installedSnap && (
        <Button onClick={connectToMetaMask} disabled={!state.isFlask}>
          Connect Snap
        </Button>
      )}

      <div className="">
        <DisplayCredentials url={url} credentials={credentials} handleCredentials={handleCredentials} />
      </div>
    </div>
  );
}

export default App;
