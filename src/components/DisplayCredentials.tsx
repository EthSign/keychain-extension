import { Credential } from "../types";
import { Locked } from "./icons/Locked";
import EntryContent from "./EntryContent";
import { LockedDark } from "./icons/LockedDark";
import Button from "../ui/forms/Button";
import { PlusIcon } from "./icons/PlusIcon";

interface DisplayCredentialsProps {
  url?: string;
  credentials?: Credential | null;
  handleCredentials: (creds: Credential) => void;
  selectCallback?: (credential: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
    controlled?: string;
  }) => void;
  handleEditCredential?: (cred?: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
    controlled?: string | undefined;
  }) => void;
  removeCredential?: (username: string) => Promise<void>;
}

function DisplayCredentials(props: DisplayCredentialsProps) {
  const { credentials, selectCallback, handleEditCredential, removeCredential } = props;

  return (
    <>
      <div className="flex flex-col items-center w-full">
        {credentials && credentials.logins && credentials.logins.length > 0 ? (
          <div className="flex flex-col w-full gap-4">
            {credentials.logins.map((cred, idx) => (
              <EntryContent
                key={`cred-${idx}`}
                credential={cred}
                removeCredential={removeCredential}
                selectCallback={selectCallback}
                handleEditCredential={handleEditCredential}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 dark:hidden">
              <Locked className="h-12 w-12" />
            </div>
            <div className="mb-4 hidden dark:block">
              <LockedDark className="h-12 w-12" />
            </div>
            <div className="text-base text-gray-400 dark:text-gray-400 text-center">No passwords saved yet.</div>
          </>
        )}
      </div>
      <div className="mt-2 mb-8 flex">
        {credentials && credentials.logins && credentials.logins.length > 0 ? (
          <Button
            className="text-base inline-flex items-center justify-center text-orange-500 hover:text-primary-800 active:text-orange-500 select-none"
            style="none"
            icon={<PlusIcon />}
            onClick={() =>
              handleEditCredential &&
              handleEditCredential({
                url: "",
                username: "",
                password: ""
              })
            }
          >
            Add Credential
          </Button>
        ) : (
          <Button
            className="px-8 py-3 mx-auto mt-2"
            onClick={() =>
              handleEditCredential &&
              handleEditCredential({
                url: "",
                username: "",
                password: ""
              })
            }
            customSizing={true}
            icon={<PlusIcon />}
          >
            Add Credential
          </Button>
        )}
      </div>
    </>
  );
}

export default DisplayCredentials;
