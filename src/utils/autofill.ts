import { AutofillInput, Credential, FormData } from "../types";

/**
 * Determines if an input has password-like attributes
 *
 * @param input - The HTMLInputElement that we are checking.
 * @returns Boolean value represting whether or not the input is password like.
 */
export function isPasswordLike(input: HTMLInputElement) {
  const valuePasswordLike = (value: string) => {
    if (value == null) {
      return false;
    }

    // Remove all whitespace, _ and - characters
    const cleanValue = value.toLowerCase().replace(/[\s_-]/g, "");
    if (cleanValue.indexOf("password") >= 0) {
      return true;
    }

    return false;
  };

  if (input.type !== "text") {
    return false;
  }

  return valuePasswordLike(input.id) || valuePasswordLike(input.name) || valuePasswordLike(input.placeholder);
}

/**
 * Find password inputs in a given HTMLFormElement.
 *
 * @param form - The HTMLFormElement that may contain password inputs.
 * @returns
 */
export const findPasswordInputs = (form?: HTMLFormElement) => {
  let inputs: HTMLCollectionOf<HTMLInputElement> | null = (form ?? document).getElementsByTagName("input");
  const ret: AutofillInput[] = [];
  if (!inputs) {
    return [];
  }

  for (let idx = 0; idx < inputs.length; idx++) {
    const input = inputs[idx];
    const isPassword = input.type === "password";
    if (!input.disabled && (isPassword || isPasswordLike(input))) {
      ret.push({ elementNumber: idx, input });
    }
  }

  return ret;
};

/**
 * Find the most likely input that is a username input for a given password input.
 *
 * @param passwordInput - The password input that corresponds to the username input we are looking for.
 * @returns The corresponding username input if it exists, or null otherwise.
 */
export function findUsernameInput(passwordInput: AutofillInput): HTMLInputElement | null {
  if (!passwordInput) {
    return null;
  }

  let usernameField: HTMLInputElement | null = null;

  let inputs: HTMLCollectionOf<HTMLInputElement> | null = document.getElementsByTagName("input");
  for (let idx = 0; idx < inputs.length; idx++) {
    const input = inputs[idx];
    // Terminate if we are looking for username fields after password fields.
    if (idx >= passwordInput.elementNumber) {
      break;
    }

    if (!input.disabled && (input.type === "text" || input.type === "email" || input.type === "tel")) {
      usernameField = input;
      if (
        inputPropertyMatchSearch(input, [
          "username",
          "user name",
          "email",
          "email address",
          "e-mail",
          "e-mail address",
          "userid",
          "user id",
          "customer id",
          "login id"
        ])
      ) {
        break;
      }
    }
  }

  return usernameField;
}

/**
 * Get a list of HTMLFormElement objects that contain at least one password input.
 *
 * @returns A list of HTMLFormElement.
 */
export function getFormsWithPasswordInputs() {
  const formData: FormData[] = [];
  const passwordInputs = findPasswordInputs();

  if (passwordInputs.length === 0) {
    return formData;
  }

  const forms: HTMLCollectionOf<HTMLFormElement> | null = document.getElementsByTagName("form");
  for (let idx = 0; idx < forms.length; idx++) {
    const formPasswordInputs = passwordInputs.filter(
      (input: AutofillInput) => input && input.input.closest("form") === forms[idx]
    );

    if (formPasswordInputs.length > 0) {
      const usernameInput = findUsernameInput(formPasswordInputs[0]);
      formData.push({
        form: forms[idx],
        password: formPasswordInputs[0],
        username: usernameInput
      });
    }
  }

  return formData;
}

/**
 * Check if input properties contain one of the given values.
 *
 * @param input - HTMLInputElement we are checking the properties of.
 * @param values - Values we are looking for in the properties of the given input.
 * @returns Boolean value representing a property match.
 */
export function inputPropertyMatchSearch(input: HTMLInputElement, values: string[]): boolean {
  for (const value of values) {
    if (
      input.id?.toLowerCase() === value ||
      input.name?.toLowerCase() === value ||
      input.ariaLabel?.toLowerCase() === value ||
      input.tagName?.toLowerCase() === value ||
      input.placeholder?.toLowerCase() === value
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Clears all keychain dataset values on the forms in the page.
 */
export function clearAllFormsKeychainDataset() {
  const forms: HTMLCollectionOf<HTMLFormElement> | null = document.getElementsByTagName("form");
  for (let idx = 0; idx < forms.length; idx++) {
    forms[idx].dataset.keychainProcessed = undefined;
  }
}

/**
 * Adds a listener to the most likely submit button for a given form.
 *
 * @param form - HTMLFormElement corresponding to the form we are interacting with.
 */
export function listenToSubmitButton(form: HTMLFormElement) {
  const submitButton = getSubmitButton(form);
  if (submitButton) {
    submitButton.removeEventListener("click", formSubmitted, false);
    submitButton.addEventListener("click", formSubmitted, false);
  }
}

/**
 * Listener for form submissions.
 *
 * @param event - SubmitEvent or ClickEvent.
 * @returns
 */
export async function formSubmitted(event: Event) {
  // Get window URL and existing credentials (assumes credentials is a single username/password combo)
  const qIdx = window.location.toString().indexOf("?");
  let url = window.location.toString().slice(0, qIdx >= 0 ? qIdx : window.location.toString().length);
  // Remove trailing slash in url
  if (url.at(url.length - 1) === "/") {
    url = url.substring(0, url.length - 1);
  }
  const creds: Credential | null = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_PASSWORD", data: { url: url } }, (res) => resolve(res ? res.data : res));
  });

  if (!creds || !creds.neverSave) {
    let form: HTMLFormElement | null = null;
    let clickedElement: HTMLElement | null = null;
    if (event.type === "click") {
      clickedElement = event.target as HTMLElement;
      form = clickedElement.closest("form");

      if (!form) {
        let parent = clickedElement.closest("div.modal");
        if (parent) {
          const forms = parent.querySelectorAll("form");
          if (forms.length > 0) {
            form = forms[0];
          }
        }
      }
    } else {
      form = event.target as HTMLFormElement;
    }

    if (!form || form.dataset?.keychainProcessed === "1") {
      return;
    }

    form.dataset.keychainProcessed = "1";
    const passwordFields = findPasswordInputs(form);
    let username: string = "",
      password: string = "";
    if (passwordFields.length > 0) {
      password = passwordFields[0].input.value;
    }
    username = findUsernameInput(passwordFields[0])?.value ?? "";

    // Log url/username/password combo on form submit
    chrome.runtime.sendMessage({
      type: "FORM_SUBMIT",
      url: url,
      username: username,
      password: password,
      credentials: creds
    });
  }
}

/**
 * Gets the submit button of a given HTMLElement.
 *
 * @param container - Container we are looking for a submit button in.
 * @returns HTMLElement of the submit button or null.
 */
export function getSubmitButton(container: HTMLElement): HTMLElement | null {
  if (!container) {
    return null;
  }

  const querySelectors = ['button[type="submit"]', 'input[type="submit"]', 'input[type="image"]'].join(", ");

  let submitButton: HTMLElement | null = container.querySelector(querySelectors) as HTMLElement;

  // No submit button found and we are in a form
  if (submitButton === null && container.tagName.toLowerCase() === "form") {
    submitButton = container.querySelector("button:not([type])") as HTMLElement;
    if (submitButton !== null) {
      // Make sure button we found is not a cancel button
      const text =
        submitButton.tagName.toLowerCase() === "input"
          ? (submitButton as HTMLInputElement).value
          : submitButton.innerText;
      if (text !== null && ["cancel", "close", "back"].includes(text.toLowerCase().trim())) {
        submitButton = null;
      }
    }
  }

  // Look for most likely button to be our submit button
  if (submitButton === null) {
    const possibleButtons = Array.from(
      container.querySelectorAll(`a, span, button[type="button"], input[type="button"], button:not([type])`)
    ) as HTMLElement[];
    let foundButton: HTMLElement | null = null;
    possibleButtons.forEach((button) => {
      if (submitButton !== null || button === null || button.tagName === null) {
        return;
      }

      const text = button.tagName.toLowerCase() === "input" ? (button as HTMLInputElement).value : button.innerText;
      if (text) {
        if (
          foundButton &&
          button.tagName.toLowerCase() === "button" &&
          !button.getAttribute("type") &&
          !["cancel", "close", "back"].includes(text.toLowerCase().trim())
        ) {
          foundButton = button;
        } else if (
          [
            "log in",
            "sign in",
            "login",
            "go",
            "submit",
            "continue",
            "next",
            "save password",
            "update password",
            "change password",
            "change",
            "save"
          ].includes(text.toLowerCase().trim())
        ) {
          submitButton = foundButton;
        }
      }
    });

    if (!submitButton && foundButton) {
      submitButton = foundButton;
    }
  }

  // Fallback to parent div if we are in a form and couldn't find a submit button
  if (!submitButton && container.tagName.toLowerCase() === "form") {
    // See if we are in a type of modal
    let parent: HTMLElement | null = container.closest("div.modal") as HTMLElement;
    if (parent) {
      const parentForms = parent.querySelectorAll("form");
      if (parentForms.length === 1) {
        submitButton = getSubmitButton(parent);
      }
    }

    // If we still have no button, recursively check the parent div for a submit button
    if (!submitButton) {
      parent = container.parentElement;
      if (parent) {
        submitButton = getSubmitButton(parent);
      }
    }
  }

  return submitButton;
}
