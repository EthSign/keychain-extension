import { Credential, DOMMessage, DOMMessageResponse } from "../types";

/**
 * Function called when a new message is received
 * @param msg Message we receive.
 * @param sender Sender of the message.
 * @param sendResponse Callback for sending a response message to sender.
 * @returns
 */
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
          type: "SET_PASSWORD",
          data: {
            url: msg.data.url,
            username: msg.data.user.username,
            password: msg.data.user.password
          }
        },
        (res) => {
          if (res?.data === "OK") {
            chrome.runtime.sendMessage({ type: "CLEAR_PENDING_FOR_SITE", data: { url: msg.data.url, return: false } });
          }
          sendResponse(res);
        }
      );
      return true;
    case "REQUEST_CREDENTIALS":
      chrome.runtime.sendMessage({ type: "UPDATE_ICON", data: { url: msg.data.url } });
      chrome.runtime.sendMessage({ type: "GET_PASSWORD", data: { url: msg.data.url } }, (response) => {
        sendResponse(response);
      });
      return true;
    case "CLEAR_PENDING_FOR_SITE":
      chrome.runtime.sendMessage({ type: msg.type, data: { url: msg.data.url, return: true } }, (response) => {
        sendResponse(response);
      });
      return true;
    case "SET_NEVER_SAVE":
      if (msg.data.neverSave) {
        chrome.runtime.sendMessage({ type: "CLEAR_PENDING_FOR_SITE", data: { url: msg.data.url, return: false } });
      }
      chrome.runtime.sendMessage(
        {
          type: "SET_NEVER_SAVE",
          data: { url: msg.data.url, neverSave: msg.data.neverSave }
        },
        (res) => sendResponse(res)
      );
      return true;
    case "REMOVE":
      chrome.runtime.sendMessage(
        { type: "REMOVE_PASSWORD", data: { url: msg.data.url, username: msg.data.username } },
        (res) => sendResponse(res)
      );
      return true;
    case "CONNECT_SNAP":
    case "GET_SNAP":
    case "IS_FLASK":
    case "SYNC":
      chrome.runtime.sendMessage({ type: msg.type }, (res) => sendResponse(res));
      return true;
  }
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
if (!chrome.runtime.onMessage.hasListeners()) {
  chrome.runtime.onMessage.addListener(receiveMessage);
}

/**
 * Listens for form submissions. Will check for inputs of name "username" and "password".
 */
document.addEventListener(
  "readystatechange",
  async (event: any) => {
    if (event.target?.readyState === "complete") {
      // Get window URL and existing credentials (assumes credentials is a single username/password combo)
      const qIdx = window.location.toString().indexOf("?");
      let url = window.location.toString().slice(0, qIdx >= 0 ? qIdx : window.location.toString().length);
      // Remove trailing slash in url
      if (url.at(url.length - 1) === "/") {
        url = url.substring(0, url.length - 1);
      }
      // TODO: This won't work for prod. Need to restructure the data.
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
            form.onsubmit = async (event: SubmitEvent) => {
              event.preventDefault();
              const creds: Credential | null = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "GET_PASSWORD", data: { url: url } }, (res) => resolve(res));
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
                  password: password,
                  credentials: creds
                });
              }
              form.submit();
            };
          }
        }
      }
    }
  },
  false
);
