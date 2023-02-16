export type DOMMessage = {
  type: "GET_DOM" | "FORM_SUBMIT" | "PERSIST" | "REMOVE" | "CLEAR_PENDING" | "REQUEST_CREDENTIALS";
  login: any;
  action: any;
  settings: any;
  data: any;
};

export type DOMMessageResponse = {
  status?: string;
  message?: string;
  files?: any;
  settings?: any;
  login?: any;
  filledFields?: any;
  title?: any;
  headlines?: any;
  data?: string;
  [key: string]: any;
};
