import { useEffect, useState } from "react";
import "./App.css";
import { DOMMessage, DOMMessageResponse } from "./types";

function App() {
  const [pending, handlePending] = useState<Record<string, { url: string; username: string; password: string }>>();
  const [url, handleUrl] = useState<string>();

  useEffect(() => {
    loadPending();
    loadCurrentUrl();
  }, []);

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

  const persistPending = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {
          if (!pending || !url || !pending[url]) {
            return;
          }
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "PERSIST", data: { url: url, user: pending[url] } } as DOMMessage,
            (response: DOMMessageResponse) => {
              const tempPending = Object.assign({}, pending, { url: undefined });
              handlePending(tempPending);
            }
          );
        }
      );
  };

  return (
    <div className="App">
      <h1>{url}</h1>

      <ul className="SEOForm">
        {pending &&
          Object.keys(pending).map((p, i) => {
            if (p !== url) {
              return null;
            }
            return (
              <li key={`pending-${i}`}>
                {pending[p].username}: {pending[p].password}
                <button onClick={() => persistPending()}>Save</button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
