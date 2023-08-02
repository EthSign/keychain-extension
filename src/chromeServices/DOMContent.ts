import { Credential, DOMMessage, DOMMessageResponse } from "../types";
import {
  clearAllFormsKeychainDataset,
  formSubmitted,
  getFormsWithPasswordInputs,
  listenToSubmitButton
} from "../utils/autofill";
import { autofill } from "../utils/forms";

let pending: any;

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
  // @ts-ignore
  console.log("[content.js]. Message received", msg?.type === "UPDATE_PENDING" ? msg.type : msg);

  // Make sure only our extension can send messages
  if (sender.id !== chrome.runtime.id) {
    console.log(sender.id);
    return;
  }

  switch (msg.type) {
    case "PERSIST":
      let username: string | undefined = undefined,
        password: string | undefined = undefined,
        controlled: boolean | undefined = msg.data.controlled;
      if (msg.data.user) {
        username = msg.data.user.username;
        password = msg.data.user.password;
      } else if (pending) {
        username = pending.username;
        password = pending.password;
      }

      if (!username && !password) {
        return;
      }

      chrome.runtime.sendMessage(
        {
          type: "SET_PASSWORD",
          data: {
            url: msg.data.url,
            username: username,
            password: password,
            controlled: controlled
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
    case "EXPORT":
    case "GET_SYNC_TO":
      chrome.runtime.sendMessage({ type: msg.type }, (res) => sendResponse(res));
      return true;
    case "IMPORT":
    case "SET_SYNC_TO":
      chrome.runtime.sendMessage({ type: msg.type, data: msg.data }, (res) => sendResponse(res));
      return true;
    case "UPDATE_PENDING":
      pending = msg.data;
      const banner = document.getElementById("ethsign-keychain-banner");
      if (!pending) {
        banner && (banner.style.display = "none");
      } else {
        if (banner) {
          banner.style.display = "block";
          const message = banner.shadowRoot?.getElementById("ethsign-keychain-banner-message");
          message &&
            (message.textContent = `Would you like to save your credentials for '${pending.username}' on this site?`);
        }
      }
      break;
    case "AUTOFILL":
      const forms = document.forms;
      let inputs: HTMLCollectionOf<HTMLInputElement> | null = null;
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        inputs = form.getElementsByTagName<"input">("input");
        autofill(inputs, msg.data.username, msg.data.password);
      }
      sendResponse({ data: "OK" });
      break;
    case "CLEAR_FORM_DATASET":
      clearAllFormsKeychainDataset();
      sendResponse({ data: "OK" });
      break;
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
      if (url.startsWith("chrome")) {
        return;
      }
      // Get credentials for the current site
      const credentials: Credential | undefined = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "GET_PASSWORD", data: { url: url } }, (response) => {
          resolve(response?.data ?? undefined);
        });
      });
      // Get list of forms
      const forms = getFormsWithPasswordInputs();
      let inputs: HTMLCollectionOf<HTMLInputElement> | null = null;
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        // Get list of inputs from current form
        inputs = form.form.getElementsByTagName<"input">("input");
        // Attempt to autofill (if a credential exists for this site)
        autofill(
          inputs,
          credentials && credentials.logins && credentials.logins.length > 0
            ? credentials.logins[0].username
            : undefined,
          credentials && credentials.logins && credentials.logins.length > 0
            ? credentials.logins[0].password
            : undefined
        );

        // Add submit listener to the form and click listener to the submit button
        // that is most likely affiliated with the form
        form.form.removeEventListener("submit", formSubmitted, false);
        form.form.addEventListener("submit", formSubmitted, false);
        listenToSubmitButton(form.form);
      }
    }
  },
  false
);
