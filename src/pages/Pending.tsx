import EntryContent from "../components/EntryContent";
import NeverSaveBar from "../components/NeverSaveBar";
import SyncPasswordsBar from "../components/SyncPasswordsBar";
import TopBar from "../components/TopBar";
import { DOMMessage, DOMMessageResponse } from "../types";
import Button from "../ui/forms/Button";

interface PendingProps {
  url: string;
  pending: Record<
    string,
    {
      url: string;
      username: string;
      password: string;
      update?: boolean | undefined;
    }
  >;
  handlePending: React.Dispatch<
    React.SetStateAction<
      | Record<
          string,
          {
            url: string;
            username: string;
            password: string;
            update?: boolean | undefined;
          }
        >
      | undefined
    >
  >;
}

function Pending(props: PendingProps) {
  const { url, pending, handlePending } = props;

  const clearPendingForSite = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {
          if (!pending || !url || !pending[url]) {
            return;
          }
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            {
              type: "CLEAR_PENDING_FOR_SITE",
              data: { url: url }
            } as DOMMessage,
            (response) => {
              if (response?.success) {
                handlePending(Object.assign({}, pending, { [url]: undefined }));
                window.close();
              }
            }
          );
        }
      );
  };

  const persistPending = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {
          if (!pending || !url || !pending[url]) {
            return;
          }
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "PERSIST", data: { url: url, user: pending[url] } } as DOMMessage,
            (response: DOMMessageResponse | any) => {
              if (response?.data === "OK") {
                const tempPending = Object.assign({}, pending, { [url]: undefined });
                handlePending(tempPending);
                window.close();
              }
            }
          );
        }
      );
  };

  const neverSaveForSite = () => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        async (tabs) => {
          if (!pending || !url || !pending[url]) {
            return;
          }
          await chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "SET_NEVER_SAVE", data: { url: url, neverSave: true } } as DOMMessage,
            (response: DOMMessageResponse) => {
              if (response?.data === "OK") {
                const tempPending = Object.assign({}, pending, { [url]: undefined });
                handlePending(tempPending);
                window.close();
              }
            }
          );
        }
      );
  };

  return (
    <>
      <TopBar />
      <div className="my-8 flex flex-col items-center">
        <div className="rounded-full border border-gray-200 text-base text-gray-900 py-2 px-6 text-center">{url}</div>
        <div className="text-2xl font-semibold mt-4 text-center">
          Would you like to save your password for this site?
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg mb-8">
        <EntryContent credential={{ ...pending[url ?? ""], timestamp: 0 }} />
      </div>

      <div className="flex flex-row gap-2 mb-8">
        <Button className="w-full py-3" style="secondary" customSizing onClick={clearPendingForSite}>
          Not Now
        </Button>
        <Button className="w-full py-3" customSizing onClick={persistPending}>
          Save Password
        </Button>
      </div>

      <NeverSaveBar neverSave={neverSaveForSite} />
    </>
  );
}

export default Pending;
