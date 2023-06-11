export * from "./DOMMessages";
export { type GetSnapsResponse, type Snap } from "./snap";

export type AutofillInput = {
  elementNumber: number;
  input: HTMLInputElement;
};

export type FormData = {
  form: HTMLFormElement;
  password: AutofillInput;
  username: HTMLInputElement | null;
};
