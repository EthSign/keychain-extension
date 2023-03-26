export type DOMMessage = {
  type:
    | "GET_DOM"
    | "FORM_SUBMIT"
    | "PERSIST"
    | "REMOVE"
    | "CLEAR_PENDING_FOR_SITE"
    | "REQUEST_CREDENTIALS"
    | "NEVER_SAVE_FOR_SITE"
    | "ENABLE_SAVE_FOR_SITE"
    | "CONNECT_SNAP"
    | "GET_SNAP"
    | "IS_FLASK";
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

export type Credential = {
  timestamp: number;
  neverSave?: boolean;
  logins: { address?: string; timestamp: number; url: string; username: string; password: string }[];
};
