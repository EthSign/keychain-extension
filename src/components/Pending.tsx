import { useState } from "react";
import { DOMMessage, DOMMessageResponse } from "../types";
import Button from "../ui/forms/Button";

interface PendingProps {
  url: string;
  pending: Record<
    string,
    {
      url: string;
      username: string;
      password: string;
      update?: boolean;
    }
  >;
  handlePending: (
    pending: Record<
      string,
      {
        url: string;
        username: string;
        password: string;
        update?: boolean;
      }
    >
  ) => void;
}

function Pending(props: PendingProps) {
  const { url, pending, handlePending } = props;
  const [showPassword, handleShowPassword] = useState(false);

  const clearPendingForSite = () => {
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
            {
              type: "CLEAR_PENDING_FOR_SITE",
              data: { url: url }
            } as DOMMessage,
            (response) => {
              if (response?.success) {
                handlePending(Object.assign({}, pending, { [url]: undefined }));
                window.close();
              }
            }
          );
        }
      );
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
            (response: DOMMessageResponse | any) => {
              if (response?.data === "OK") {
                const tempPending = Object.assign({}, pending, { [url]: undefined });
                handlePending(tempPending);
                window.close();
              }
            }
          );
        }
      );
  };

  const neverSaveForSite = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        async (tabs) => {
          if (!pending || !url || !pending[url]) {
            return;
          }
          await chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "SET_NEVER_SAVE", data: { url: url, neverSave: true } } as DOMMessage,
            (response: DOMMessageResponse) => {
              if (response?.data === "OK") {
                const tempPending = Object.assign({}, pending, { [url]: undefined });
                handlePending(tempPending);
                window.close();
              }
            }
          );
        }
      );
  };

  return (
    <div className="flex flex-col">
      <div>
        {pending[url].update
          ? "Would you like to update your password for this site?"
          : "Would you like to save your password for this site?"}
      </div>
      <div className="flex flex-row">
        <div className="w-1/2">{pending[url].username}</div>
        <div className="w-1/2 flex flex-row">
          <div>
            {showPassword ? pending[url].password : new Array((pending[url].password?.length ?? 0) + 1).join("*")}
          </div>
          <Button onClick={() => handleShowPassword(!showPassword)}>{showPassword ? "H" : "S"}</Button>
        </div>
      </div>
      <div className="flex flex-row">
        {!pending[url].update ? (
          <Button className="mr-auto" style="tertiary" onClick={() => neverSaveForSite()}>
            Never for This Website
          </Button>
        ) : null}
        <Button style="secondary" onClick={() => clearPendingForSite()}>
          Not Now
        </Button>
        <Button onClick={() => persistPending()}>{pending[url].update ? "Update Password" : "Save Password"}</Button>
      </div>
    </div>
  );
}

export default Pending;
