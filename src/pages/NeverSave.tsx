import SyncPasswordsBar from "../components/SyncPasswordsBar";
import TopBar from "../components/TopBar";
import { Credential } from "../types";
import Button from "../ui/forms/Button";
import { enablePasswordSavingForSite } from "../utils/snap";

interface NeverSaveProps {
  url?: string;
  credentials: Credential;
  handleCredentials: React.Dispatch<React.SetStateAction<Credential | undefined | null>>;
  handleSync: () => void;
}

function NeverSave(props: NeverSaveProps) {
  const { url, credentials, handleCredentials, handleSync } = props;

  /**
   * Sets neverSave to false for the current URL.
   *
   * @returns
   */
  const enablePasswordSaving = () => {
    if (!url) {
      return;
    }

    enablePasswordSavingForSite(url).then((response) => {
      if (response?.data === "OK") {
        // Set neverSave to false locally since we successfully changed the db
        handleCredentials(Object.assign({}, credentials, { neverSave: false }));
      }
    });
  };

  return (
    <>
      <TopBar />
      <div className="my-8 flex flex-col items-center">
        <div className="rounded-full border border-gray-200 text-base text-gray-900 dark:text-white py-2 px-6 text-center">
          {url}
        </div>
        <div className="text-2xl font-semibold mt-4 text-center">
          You disabled EthSign Keychain.
          <br />
          Click the button to enable it.
        </div>
        <div className="flex flex-row my-8">
          <Button className="py-3 px-24" customSizing onClick={() => enablePasswordSaving()}>
            Enable Keychain
          </Button>
        </div>

        <SyncPasswordsBar syncPasswords={handleSync} />
      </div>
    </>
  );
}

export default NeverSave;
