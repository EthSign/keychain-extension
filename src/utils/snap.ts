import { DOMMessage } from "../types";

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
                resolve(response?.data ?? false);
              }
            );
          }
        )
      : resolve(undefined);
  });
};
