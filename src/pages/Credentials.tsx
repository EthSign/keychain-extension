import { useState } from "react";
import DisplayCredentials from "../components/DisplayCredentials";
import ExportStateBar from "../components/ExportStateBar";
import ImportStateBar from "../components/ImportStateBar";
import SyncPasswordsBar from "../components/SyncPasswordsBar";
import TopBar from "../components/TopBar";
import { Credential } from "../types";
import FileDropzone from "../components/FileDropzone";
import SyncToBar from "../components/SyncToBar";

interface CredentialsProps {
  url?: string;
  credentials?: Credential | null;
  syncTo?: string | null;
  handleCredentials: (cred: Credential | null) => void;
  handleSync: () => Promise<boolean | undefined>;
  selectCallback?: (credential: {
    address?: string | undefined;
    timestamp: number;
    url: string;
    username: string;
    password: string;
  }) => void;
  handleExportState: () => void;
  handleImportState: (state: { nonce: string; data: string }) => void;
  handleSetSyncTo: (syncTo: string) => Promise<void>;
}

function Credentials(props: CredentialsProps) {
  const {
    url,
    credentials,
    syncTo,
    handleCredentials,
    handleSync,
    selectCallback,
    handleExportState,
    handleImportState,
    handleSetSyncTo
  } = props;

  const [importing, handleImporting] = useState(false);

  if (importing) {
    return (
      <>
        <TopBar />
        <div className="my-8 flex flex-col items-center">
          <div className="rounded-full border border-gray-200 text-base text-gray-900 dark:text-white py-2 px-6 text-center">
            {url}
          </div>
          <div className="text-2xl font-semibold mt-4">Import Credentials</div>
          <FileDropzone
            handleImportState={(state) => {
              handleImporting(false);
              handleImportState(state);
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="my-8 flex flex-col items-center">
        <div className="rounded-full border border-gray-200 text-base text-gray-900 dark:text-white py-2 px-6 text-center">
          {url}
        </div>
        <div className="text-2xl font-semibold mt-4">EthSign Keychain</div>
        <div className="mt-4 text-base">Select a password to autofill</div>
      </div>

      <div
        className={`mb-8 rounded-lg${
          !credentials || credentials.logins.length === 0
            ? ""
            : " border border-gray-200 dark:border-white/20 dark:bg-[#222123]"
        }`}
      >
        <DisplayCredentials
          url={url}
          credentials={credentials}
          handleCredentials={handleCredentials}
          selectCallback={selectCallback}
        />
      </div>

      <SyncPasswordsBar syncPasswords={handleSync} />

      <ExportStateBar exportState={handleExportState} />
      <ImportStateBar handleImporting={handleImporting} />
      <SyncToBar syncTo={syncTo} handleSetSyncTo={handleSetSyncTo} />
    </>
  );
}

export default Credentials;
