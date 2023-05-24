import { Credential, DOMMessage } from "../types";
import Button from "../ui/forms/Button";
import _ from "lodash";
import CredentialRow from "./CredentialRow";
import { Locked } from "./icons/Locked";

interface DisplayCredentialsProps {
  url?: string;
  credentials?: Credential | null;
  handleCredentials: (creds: Credential) => void;
  handleSync: () => Promise<boolean | undefined>;
  loading?: boolean;
}

function DisplayCredentials(props: DisplayCredentialsProps) {
  const { url, credentials, handleCredentials, handleSync, loading = false } = props;

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

  if (loading) {
    return (
      <div className="flex justify-center w-full py-4">
        <svg className="animate-spin w-8 h-8 fill-blue-300 shrink-0" viewBox="0 0 16 16">
          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* <Button onClick={handleSync} className="mr-auto mt-2">
        Sync
      </Button> */}
      {credentials && credentials.logins && credentials.logins.length > 0 ? (
        <div>
          {credentials.logins.map((cred, idx) => (
            <CredentialRow key={`cred-${idx}`} credential={cred} removeCredential={removeCredential} />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Locked className="h-12 w-12" />
          </div>
          <div className="text-base text-gray-400 text-center">No passwords saved yet.</div>
        </>
      )}
    </div>
  );
}

export default DisplayCredentials;
