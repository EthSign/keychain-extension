import { Credential } from "../types";
import _ from "lodash";
import { Locked } from "./icons/Locked";
import EntryContent from "./EntryContent";
import { LockedDark } from "./icons/LockedDark";
import { removeCredentialForSite } from "../utils/snap";

interface DisplayCredentialsProps {
  url?: string;
  credentials?: Credential | null;
  handleCredentials: (creds: Credential) => void;
  selectCallback?: (credential: {
    address?: string | undefined;
    timestamp: number;
    url: string;
    username: string;
    password: string;
    controlled?: string;
  }) => void;
}

function DisplayCredentials(props: DisplayCredentialsProps) {
  const { url, credentials, handleCredentials, selectCallback } = props;

  /**
   * Removes a credential entry for the current URL.
   *
   * @param username - Username of the entry we are removing.
   * @returns
   */
  const removeCredential = async (username: string) => {
    if (!url) {
      return;
    }

    removeCredentialForSite(url, username).then((response) => {
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
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {credentials && credentials.logins && credentials.logins.length > 0 ? (
        <div className="w-full divide-y divide-solid dark:divide-white/20">
          {credentials.logins.map((cred, idx) => (
            <EntryContent
              key={`cred-${idx}`}
              credential={cred}
              removeCredential={removeCredential}
              selectCallback={selectCallback}
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
          <div className="text-base text-gray-400 dark:text-gray-300 text-center">No passwords saved yet.</div>
        </>
      )}
    </div>
  );
}

export default DisplayCredentials;
