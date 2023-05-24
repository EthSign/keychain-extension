import DisplayCredentials from "../components/DisplayCredentials";
import SyncPasswordsBar from "../components/SyncPasswordsBar";
import TopBar from "../components/TopBar";
import { Credential } from "../types";

interface CredentialsProps {
  url?: string;
  credentials?: Credential | null;
  handleCredentials: (cred: Credential | null) => void;
  handleSync: () => Promise<boolean | undefined>;
  loading: boolean;
  selectCallback?: (credential: {
    address?: string | undefined;
    timestamp: number;
    url: string;
    username: string;
    password: string;
  }) => void;
}

function Credentials(props: CredentialsProps) {
  const { url, credentials, handleCredentials, handleSync, loading, selectCallback } = props;

  return (
    <>
      <TopBar />
      <div className="my-8 flex flex-col items-center">
        <div className="rounded-full border border-gray-200 text-base text-gray-900 py-2 px-6 text-center">{url}</div>
        <div className="text-2xl font-semibold mt-4">EthSign Keychain</div>
        <div className="mt-4 text-base">Select a password to autofill</div>
      </div>

      <div
        className={`mb-8 rounded-lg${!credentials || credentials.logins.length === 0 ? "" : " border border-gray-200"}`}
      >
        <DisplayCredentials
          url={url}
          credentials={credentials}
          handleCredentials={handleCredentials}
          loading={loading}
          selectCallback={selectCallback}
        />
      </div>

      <SyncPasswordsBar syncPasswords={handleSync} />
    </>
  );
}

export default Credentials;
