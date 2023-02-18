import { useEffect, useState } from "react";
import "./App.css";
import NeverSave from "./components/NeverSave";
import Pending from "./components/Pending";
import { Credential, DOMMessage } from "./types";

function App() {
  const [pending, handlePending] = useState<Record<string, { url: string; username: string; password: string }>>();
  const [url, handleUrl] = useState<string>();
  const [credentials, handleCredentials] = useState<Credential | null>();

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
        url = url.toString().slice(0, url.toString().indexOf("?") ?? url.toString().length);
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

      <div className=""></div>
    </div>
  );
}

export default App;
