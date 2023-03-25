import { Credential, DOMMessage, DOMMessageResponse } from "../types";
import { defaultSnapOrigin } from "../config";
import { GetSnapsResponse, Snap } from "../types";

const credentials: Record<string, { url: string; username: string; password: string }> = {};

// Function called when a new message is received
const receiveMessage = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log("[content.js]. Message received", msg);

  // Make sure only our extension can send messages
  if (sender.id !== chrome.runtime.id) {
    console.log(sender.id);
    return;
  }

  switch (msg.type) {
    case "PERSIST":
      chrome.runtime.sendMessage(
        {
          type: msg.type,
          data: {
            url: msg.data.url,
            username: msg.data.user.username,
            password: msg.data.user.password
          }
        },
        (response) => sendResponse(response)
      );
      return true;
    case "REQUEST_CREDENTIALS":
    case "CLEAR_PENDING_FOR_SITE":
    case "NEVER_SAVE_FOR_SITE":
    case "ENABLE_SAVE_FOR_SITE":
      chrome.runtime.sendMessage({ type: msg.type, data: { url: msg.data.url } }, (response) => {
        sendResponse(response);
      });
      return true;
    case "REMOVE":
      chrome.runtime.sendMessage(
        { type: msg.type, data: { url: msg.data.url, username: msg.data.username } },
        (response) => {
          sendResponse(response);
        }
      );
      return true;
    case "CONNECT_SNAP":
      window.postMessage(
        { type: "EthSignKeychainEvent", text: "Hello from content_script.js!" },
        "*" /* targetOrigin: any */
      );
      // connectSnap("snap:w3ptestsnap").then(() =>
      //   sendResponse({
      //     data: "Snap connect request completed"
      //   })
      // );
      return true;
  }

  //   const headlines = Array.from(document.getElementsByTagName<"h1">("h1")).map((h1) => h1.innerText);

  // Prepare the response object with information about the site
  //   const response: DOMMessageResponse = {
  //     title: document.title,
  //     headlines: tags,
  //     forms: forms,
  //     inputs: inputs
  //   };

  //   sendResponse(response);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(receiveMessage);

// Listens for form submissions. Will check for inputs of name "username" and "password".
document.addEventListener(
  "readystatechange",
  async (event: any) => {
    if (event.target?.readyState === "complete") {
      // Get window URL and existing credentials (assumes credentials is a single username/password combo)
      const url = window.location
        .toString()
        .slice(0, window.location.toString().indexOf("?") ?? window.location.toString().length);
      const credentials: Credential | undefined = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "REQUEST_CREDENTIALS", data: { url: url } }, (response) => {
          resolve(response);
        });
      });
      // Get list of forms
      const forms = document.forms;
      let inputs: HTMLCollectionOf<HTMLInputElement> | null = null;
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        // Get list of inputs from current form
        inputs = form.getElementsByTagName<"input">("input");
        // Only modify onsubmit listener once for each form
        let listenerCreated = false;
        // Iterate through all inputs to find the username & password fields
        for (let j = 0; j < inputs.length; j++) {
          // Autofill
          if (
            credentials &&
            credentials.logins &&
            credentials.logins.length > 0 &&
            inputs[j].getAttribute("name") === "username"
          ) {
            inputs[j].value = credentials.logins[0].username;
          } else if (
            credentials &&
            credentials.logins &&
            credentials.logins.length > 0 &&
            (inputs[j].getAttribute("name") === "password" || inputs[j].type === "password")
          ) {
            inputs[j].value = credentials.logins[0].password;
          }

          // Create form submit listener
          if (
            !listenerCreated &&
            (inputs[j].getAttribute("name") === "username" || inputs[j].getAttribute("name") === "password")
          ) {
            listenerCreated = true;
            form.submitOrig = form.onsubmit;
            // eslint-disable-next-line no-loop-func
            form.onsubmit = async (event) => {
              const creds: Credential | undefined = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "REQUEST_CREDENTIALS", data: { url: url } }, (response) => {
                  resolve(response);
                });
              });
              if (!creds || !creds.neverSave) {
                const tmpInputs = form.getElementsByTagName<"input">("input");
                let username = "",
                  password = "";
                for (let j = 0; j < tmpInputs.length; j++) {
                  if (tmpInputs[j].getAttribute("name") === "username") {
                    username = tmpInputs[j].value;
                  } else if (tmpInputs[j].getAttribute("name") === "password" || tmpInputs[j].type === "password") {
                    password = tmpInputs[j].value;
                  }
                }
                // Log url/username/password combo on form submit
                chrome.runtime.sendMessage({
                  type: "FORM_SUBMIT",
                  url: url,
                  username: username,
                  password: password
                });
              }
            };
          }
        }
      }
    }
  },
  false
);

// Inject script
var s = document.createElement("script");
s.src = chrome.runtime.getURL("/script.js");
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
  s.remove();
};

// window.addEventListener("message", function (event) {
//   if (event.type === "EthSignKeychainEvent") {
//     console.log("Received ESKE");
//   }
// });
var port = chrome.runtime.connect();
window.addEventListener(
  "message",
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return;
    }

    if (event.data.type && event.data.type === "FROM_PAGE") {
      console.log("Content script received: " + event.data.text);
      port.postMessage(event.data.text);
    }
  },
  false
);

// Begin Snaps
/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: "wallet_getSnaps"
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<"version" | string, unknown> = {}
) => {
  console.log("window.ethereum: " + window.ethereum);
  await window.ethereum.request({
    method: "wallet_requestSnaps",
    params: {
      [snapId]: params
    }
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find((snap) => snap.id === defaultSnapOrigin && (!version || snap.version === version));
  } catch (e) {
    console.log("Failed to obtain installed snap", e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendSet = async () => {
  return await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: "set_password",
        params: { website: "localhost:8000", username: "username", password: "password" }
      }
    }
  });
};

export const sendGet = async () => {
  return await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: defaultSnapOrigin,
      request: { method: "get_password", params: { website: "localhost:8000" } }
    }
  });
};

export const sendRemove = async () => {
  return await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: "remove_password",
        params: { website: "localhost:8000", username: "username" }
      }
    }
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith("local:");
