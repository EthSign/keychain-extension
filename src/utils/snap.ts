import { DOMMessage } from "../types";

/**
 * Call to content script for connecting to our snap.
 * @returns
 */
export const connectSnap = async () => {
  return new Promise<any | undefined>((resolve) => {
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
                type: "CONNECT_SNAP"
              } as DOMMessage,
              (response: any) => {
                resolve(response);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Call to our content script for getting our snap.
 * @returns
 */
export const getSnap = async () => {
  return new Promise<any | undefined>((resolve) => {
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
                type: "GET_SNAP"
              } as DOMMessage,
              (response: any) => {
                resolve(response);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Call to our content script to determine if MetaMask Flask is installed.
 * @returns
 */
export const isFlask = async () => {
  return new Promise<boolean | undefined>((resolve) => {
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
                type: "IS_FLASK"
              } as DOMMessage,
              (response: any) => {
                resolve(response?.data ?? false);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Call to our content script to sync local state with remote Arweave state.
 * @returns
 */
export const sendSync = async () => {
  return new Promise<boolean | undefined>((resolve) => {
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
                type: "SYNC"
              } as DOMMessage,
              (response: any) => {
                resolve(response);
                // resolve(response?.data ?? false);
              }
            );
          }
        )
      : resolve(undefined);
  });
};
