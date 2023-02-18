import { Credential, DOMMessage } from "../types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../ui/forms/Button";
import _ from "lodash";

interface DisplayCredentialsProps {
  url?: string;
  credentials?: Credential | null;
  handleCredentials: (creds: Credential) => void;
}

function DisplayCredentials(props: DisplayCredentialsProps) {
  const { url, credentials, handleCredentials } = props;

  const removeCredential = async (url: string, username: string) => {
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
              if (response.success) {
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
      {credentials && credentials.logins && credentials.logins.length > 0 ? (
        <div>
          {credentials.logins.map((cred, idx) => (
            <div className="flex flex-row justify-between" key={`cred-${idx}`}>
              <div className="">{cred.username}</div>
              <div className="flex flex-row flex-nowrap">
                <div className="my-auto">{new Array((cred.password?.length ?? 0) + 1).join("*")}</div>
                <CopyToClipboard text={cred.password ?? ""}>
                  <div className="inline cursor-pointer my-auto">
                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.4375 0.1875H3.49219C3.41055 0.1875 3.34375 0.254297 3.34375 0.335938V1.375C3.34375 1.45664 3.41055 1.52344 3.49219 1.52344H12.6953V14.2891C12.6953 14.3707 12.7621 14.4375 12.8438 14.4375H13.8828C13.9645 14.4375 14.0312 14.3707 14.0312 14.2891V0.78125C14.0312 0.452832 13.7659 0.1875 13.4375 0.1875ZM11.0625 2.5625H1.5625C1.23408 2.5625 0.96875 2.82783 0.96875 3.15625V13.0032C0.96875 13.1609 1.03184 13.3112 1.14316 13.4226L4.35869 16.6381C4.39951 16.6789 4.4459 16.7123 4.496 16.7401V16.7754H4.57393C4.63887 16.7995 4.70752 16.8125 4.77803 16.8125H11.0625C11.3909 16.8125 11.6562 16.5472 11.6562 16.2188V3.15625C11.6562 2.82783 11.3909 2.5625 11.0625 2.5625ZM4.49414 14.8865L2.89658 13.2871H4.49414V14.8865ZM10.3203 15.4766H5.68164V12.8418C5.68164 12.4317 5.34951 12.0996 4.93945 12.0996H2.30469V3.89844H10.3203V15.4766Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </CopyToClipboard>
                <Button
                  onClick={() => {
                    removeCredential(url ?? "", cred.username);
                  }}
                >
                  D
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No logins saved for this site.</div>
      )}
    </div>
  );
}

export default DisplayCredentials;
