import { Credential, DOMMessage } from "../types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../ui/forms/Button";
import _ from "lodash";
import CredentialRow from "./CredentialRow";
import { sendSync } from "../utils/snap";

interface DisplayCredentialsProps {
  url?: string;
  credentials?: Credential | null;
  handleCredentials: (creds: Credential) => void;
}

function DisplayCredentials(props: DisplayCredentialsProps) {
  const { url, credentials, handleCredentials } = props;

  const removeCredential = async (username: string) => {
    chrome.tabs &&
      chrome.tabs.query(
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
              if (response?.data === "OK") {
                const tmpCred = Object.assign({}, credentials);
                if (tmpCred && tmpCred.logins) {
                  const idx = _.findIndex(tmpCred.logins, { username: username });
                  if (idx >= 0) {
                    tmpCred.logins.splice(idx, 1);
                  }
                }
                handleCredentials(tmpCred);
              }
            }
          );
        }
      );
  };

  return (
    <div className="flex flex-col">
      <Button onClick={sendSync}>Sync</Button>
      {credentials && credentials.logins && credentials.logins.length > 0 ? (
        <div>
          {credentials.logins.map((cred, idx) => (
            <CredentialRow key={`cred-${idx}`} credential={cred} removeCredential={removeCredential} />
          ))}
        </div>
      ) : (
        <div>No logins saved for this site.</div>
      )}
    </div>
  );
}

export default DisplayCredentials;
