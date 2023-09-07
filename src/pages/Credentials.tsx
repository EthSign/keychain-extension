import { useState } from "react";
import DisplayCredentials from "../components/DisplayCredentials";
import ExportStateBar from "../components/ExportStateBar";
import ImportStateBar from "../components/ImportStateBar";
import SyncPasswordsBar from "../components/SyncPasswordsBar";
import TopBar from "../components/TopBar";
import { Credential } from "../types";
import FileDropzone from "../components/FileDropzone";
import SyncToBar from "../components/SyncToBar";
import OriginPill from "../components/OriginPill";

interface CredentialsProps {
  url?: string;
  credentials?: Credential | null;
  syncTo?: string | null;
  handleCredentials: (cred: Credential | null) => void;
  handleSync: () => Promise<boolean | undefined>;
  selectCallback?: (credential: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
  }) => void;
  handleExportState: () => void;
  handleImportState: (state: { nonce: string; data: string }) => void;
  handleSetSyncTo: (syncTo: string) => Promise<void>;
  handleEditCredential: (cred?: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
    controlled?: string | undefined;
  }) => void;
  removeCredential?: (username: string) => Promise<void>;
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
    handleSetSyncTo,
    handleEditCredential,
    removeCredential
  } = props;

  const [importing, handleImporting] = useState(false);

  if (importing) {
    return (
      <>
        <TopBar />
        <div className="my-8 flex flex-col items-center">
          <OriginPill url={url} />
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
        <OriginPill url={url} />
        <div className="text-2xl font-semibold mt-4">Credentials</div>
        {/* <div className="mt-4 text-base">Select a password to autofill</div> */}
        <div className="mt-2">
          <SyncPasswordsBar syncPasswords={handleSync} />
        </div>
      </div>

      <DisplayCredentials
        url={url}
        credentials={credentials}
        handleCredentials={handleCredentials}
        selectCallback={selectCallback}
        handleEditCredential={handleEditCredential}
        removeCredential={removeCredential}
      />

      <SyncToBar syncTo={syncTo} handleSetSyncTo={handleSetSyncTo} />

      <div className="mt-8 pt-4 border-t border-black/10 dark:border-white/20">
        <ExportStateBar exportState={handleExportState} />
        <div className="mt-1">
          <ImportStateBar handleImporting={handleImporting} />
        </div>
      </div>
    </>
  );
}

export default Credentials;
