import { Credential, DOMMessage, DOMMessageResponse } from "../types";
import Button from "../ui/forms/Button";

interface NeverSaveProps {
  url?: string;
  credentials: Credential;
  handleCredentials: React.Dispatch<React.SetStateAction<Credential | undefined | null>>;
}

function NeverSave(props: NeverSaveProps) {
  const { url, credentials, handleCredentials } = props;

  const enablePasswordSaving = () => {
    if (!url) {
      return;
    }

    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "ENABLE_SAVE_FOR_SITE", data: { url: url } } as DOMMessage,
            (response: DOMMessageResponse) => {
              if (response.success) {
                // Set neverSave to false locally since we successfully changed the db
                handleCredentials(Object.assign({}, credentials, { neverSave: false }));
              }
            }
          );
        }
      );
  };

  return (
    <div className="flex flex-col">
      <div>
        You have chosen to never save passwords for this site. Would you like to enable password saving for this site?
      </div>
      <div className="flex flex-row">
        <Button onClick={() => enablePasswordSaving()}>Enable</Button>
      </div>
    </div>
  );
}

export default NeverSave;
