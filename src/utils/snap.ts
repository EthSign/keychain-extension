import { Credential, DOMMessage, DOMMessageResponse } from "../types";

/**
 * Call to content script for connecting to our snap.
 *
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
 *
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
 *
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
 *
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
                resolve(response?.data ?? false);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Call to our content script to export the local password state.
 *
 * @returns JSON file to be downloaded to the user's computer.
 */
export const sendExportState = async () => {
  return new Promise<{ success: boolean; data?: string; message?: string } | undefined>((resolve) => {
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
                type: "EXPORT"
              } as DOMMessage,
              (response: any) => {
                resolve(response?.data ?? undefined);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Call to our content script to import the data extracted from a JSON file on the user's machine.
 *
 * @param state - Data retrieved from the file provided by the user.
 * @returns 'OK' if successfully imported or { success: boolean, message: string } if import failed.
 */
export const sendImportState = async (state: { nonce: string; data: string }) => {
  return new Promise<{ success: boolean; data?: string; message?: string } | undefined>((resolve) => {
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
                type: "IMPORT",
                data: JSON.stringify(state)
              } as DOMMessage,
              (response: any) => {
                resolve(response?.data ?? undefined);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Call to our content script to autofill a particular credential.
 *
 * @returns
 */
export const sendAutofill = async (username?: string, password?: string) => {
  return new Promise<string | undefined>((resolve) => {
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
                type: "AUTOFILL",
                data: {
                  username,
                  password
                }
              } as DOMMessage,
              (response: any) => {
                resolve(response?.data ?? "");
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Requests credentials for the provided URL.
 *
 * @param url - URL to get credentials for.
 * @returns
 */
export const requestCredentials = async (url: string) => {
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
                resolve(response?.data ?? undefined);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Persists the pending entry for the provided URL.
 *
 * @param url - URL we will clear pending entries for.
 * @returns
 */
export const clearPendingForSite = (url: string) => {
  return new Promise<any | undefined>((resolve) => {
    chrome.tabs
      ? chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          (tabs) => {
            if (!url) {
              resolve(undefined);
            }
            chrome.tabs.sendMessage(
              tabs[0].id || 0,
              {
                type: "CLEAR_PENDING_FOR_SITE",
                data: { url: url }
              } as DOMMessage,
              (response) => {
                if (response?.success) {
                  resolve({ success: true });
                }
                resolve(undefined);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Persists the pending entry for the provided URL.
 *
 * @param url - URL we are persisting the pending entry for.
 * @param user - Data we will persist.
 * @returns
 */
export const persistPendingForSite = (
  url: string,
  user: {
    url: string;
    username: string;
    password: string;
    update?: boolean | undefined;
    controlled?: string | undefined;
  }
) => {
  return new Promise<any | undefined>((resolve) => {
    chrome.tabs
      ? chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          (tabs) => {
            if (!url) {
              resolve(undefined);
            }
            chrome.tabs.sendMessage(
              tabs[0].id || 0,
              { type: "PERSIST", data: { url: url, user: user, controlled: false } } as DOMMessage,
              (response: DOMMessageResponse | any) => {
                resolve(response);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Sets neverSave to true for the provided URL.
 *
 * @param url - URL we are setting neverSave to true for.
 * @returns
 */
export const neverSaveForSite = (url: string) => {
  return new Promise<any | undefined>((resolve) => {
    chrome.tabs
      ? chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          async (tabs) => {
            if (!url) {
              resolve(undefined);
            }
            await chrome.tabs.sendMessage(
              tabs[0].id || 0,
              { type: "SET_NEVER_SAVE", data: { url: url, neverSave: true } } as DOMMessage,
              (response: DOMMessageResponse) => {
                resolve(response);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Sets neverSave to false for the provided URL.
 *
 * @param url - URL we are setting neverSave to false for.
 * @returns
 */
export const enablePasswordSavingForSite = (url: string) => {
  return new Promise<any | undefined>((resolve) => {
    if (!url) {
      return undefined;
    }
    chrome.tabs
      ? chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          (tabs) => {
            chrome.tabs.sendMessage(
              tabs[0].id || 0,
              { type: "SET_NEVER_SAVE", data: { url: url, neverSave: false } } as DOMMessage,
              (response: DOMMessageResponse) => {
                resolve(response);
              }
            );
          }
        )
      : resolve(undefined);
  });
};

/**
 * Removes a credential entry for the provided URL.
 *
 * @param url - URL we will remove a credential entry from.
 * @param username - Username of the credential entry to be removed.
 * @returns
 */
export const removeCredentialForSite = (url: string, username: string) => {
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
                type: "REMOVE",
                data: { url: url, username: username }
              } as DOMMessage,
              (response) => {
                resolve(response);
              }
            );
          }
        )
      : resolve(undefined);
  });
};
