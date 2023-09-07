import { useEffect, useState } from "react";
import OriginPill from "../components/OriginPill";
import TopBar from "../components/TopBar";
import { Locked2 } from "../components/icons/Locked2";
import { Locked2Dark } from "../components/icons/Locked2Dark";
import Button from "../ui/forms/Button";
import { AvatarIcon } from "../components/icons/AvatarIcon";
import { AvatarIconDark } from "../components/icons/AvatarIconDark";

interface EditEntryProps {
  url: string;
  newEntry?: boolean;
  credential: {
    url: string;
    username: string;
    password: string;
    update?: boolean | undefined;
    controlled?: string;
  };
  cancel: () => void;
  persistEntry: (cred: { address?: string; url: string; username: string; password: string }) => void;
}

function EditEntry(props: EditEntryProps) {
  const { url, credential, persistEntry, cancel } = props;

  const [cred, handleCred] = useState(credential);
  const [highlight, handleHighlight] = useState(-1);

  useEffect(() => {
    if (credential.username.length > 0) {
      document.getElementById("input-password-edit")?.focus();
    } else {
      document.getElementById("input-username-edit")?.focus();
    }
  }, [credential]);

  return (
    <>
      <TopBar />
      <div className="my-8 flex flex-col items-center">
        <OriginPill url={url} />
        <div className="text-2xl font-semibold mt-4 text-center">
          {credential ? "Edit Credential" : "Create Credential"}
        </div>
      </div>

      <div className={`mb-8 rounded-lg w-full`}>
        <div
          className={`border dark:border-white/20 rounded-t-lg flex p-3 ${
            highlight === 0 ? "border-primary-600 shadow-glow" : "border-gray-200"
          }`}
        >
          <div className="my-auto dark:hidden">
            <AvatarIcon className="h-8 w-8" />
          </div>
          <div className="my-auto hidden dark:block">
            <AvatarIconDark className="h-8 w-8" />
          </div>
          <div className="flex flex-col my-auto ml-2 mr-auto">
            <div className="select-none font-medium text-gray-500">Username</div>
            <div className="select-none flex">
              <input
                id="input-username-edit"
                className="font-medium text-gray-900 dark:text-primary-25 bg-transparent focus:ring-0 border-0 active:ring-0 outline-none p-0"
                value={cred.username}
                disabled={credential.username.length > 0}
                onChange={(e) => handleCred({ ...cred, username: e.target.value })}
                onFocus={() => handleHighlight(0)}
                onBlur={() => handleHighlight(-1)}
              />
            </div>
          </div>
        </div>
        <div
          className={`border dark:border-white/20 rounded-b-lg flex p-3 ${
            highlight === 1 ? "border-primary-600 shadow-glow" : "border-gray-200"
          }`}
        >
          <div className="my-auto dark:hidden">
            <Locked2 className="h-8 w-8" />
          </div>
          <div className="my-auto hidden dark:block">
            <Locked2Dark className="h-8 w-8" />
          </div>
          <div className="flex flex-col my-auto ml-2 mr-auto">
            <div className="select-none font-medium text-gray-500">Password</div>
            <div className="select-none flex">
              <input
                id="input-password-edit"
                className="font-medium text-gray-900 dark:text-primary-25 bg-transparent focus:ring-0 border-0 active:ring-0 outline-none p-0"
                value={cred.password}
                onChange={(e) => handleCred({ ...cred, password: e.target.value })}
                onFocus={() => handleHighlight(1)}
                onBlur={() => handleHighlight(-1)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 mb-8">
        <Button className="w-full py-3" style="secondary" customSizing onClick={cancel}>
          Cancel
        </Button>
        <Button className="w-full py-3" customSizing onClick={() => persistEntry(cred)}>
          Save Password
        </Button>
      </div>
    </>
  );
}

export default EditEntry;
