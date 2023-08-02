export type DOMMessage = {
  type:
    | "GET_DOM"
    | "FORM_SUBMIT"
    | "PERSIST"
    | "REMOVE"
    | "CLEAR_PENDING_FOR_SITE"
    | "REQUEST_CREDENTIALS"
    | "SET_NEVER_SAVE"
    | "CONNECT_SNAP"
    | "GET_SNAP"
    | "IS_FLASK"
    | "SYNC"
    | "AUTOFILL"
    | "CLEAR_FORM_DATASET"
    | "UPDATE_PENDING"
    | "EXPORT"
    | "IMPORT"
    | "SET_SYNC_TO"
    | "GET_SYNC_TO";
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
  logins: {
    address?: string;
    timestamp: number;
    url: string;
    username: string;
    password: string;
    controlled?: string;
  }[];
};
