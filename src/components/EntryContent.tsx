import { useState } from "react";
import { Eyeball } from "./icons/Eyeball";
import { EyeballHide } from "./icons/EyeballHide";
import Pill from "./Pill";
import { DeleteIcon } from "./icons/DeleteIcon";
import { EditIcon } from "./icons/EditIcon";

interface EntryContentProps {
  credential: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
    controlled?: string;
  };
  removeCredential?: (username: string) => Promise<void>;
  selectCallback?: (credential: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
  }) => void;
  handleEditCredential?: (cred?: {
    address?: string | undefined;
    url: string;
    username: string;
    password: string;
    controlled?: string | undefined;
  }) => void;
}

function EntryContent(props: EntryContentProps) {
  const { credential, removeCredential, selectCallback, handleEditCredential } = props;

  const [showPassword, handleShowPassword] = useState(false);
  return (
    <>
      <div
        className="flex p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-600 dark:hover:border-gray-600 hover:shadow-glow cursor-pointer"
        onClick={() => selectCallback && selectCallback(credential)}
      >
        <div className="flex flex-col my-auto mr-auto">
          <div className="text-base select-none font-medium text-gray-500 dark:text-primary-25">
            {credential.username}
          </div>
          <div className="select-none flex">
            {showPassword ? (
              <span className="text-gray-500 dark:text-primary-25">{credential.password}</span>
            ) : (
              <span className="text-gray-500 dark:text-primary-25">
                {new Array((credential.password?.length ?? 0) + 1).join("*")}
              </span>
            )}
            <span
              className={`relative cursor-pointer inline-block my-auto ml-1 align-middle${
                credential.controlled ? " mr-2" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleShowPassword(!showPassword);
              }}
            >
              <div className="">
                {showPassword ? (
                  <Eyeball className="text-gray-500 hover:text-gray-400 dark:text-gray-500" />
                ) : (
                  <EyeballHide className="text-gray-500 hover:text-gray-400 dark:text-gray-500" />
                )}
              </div>
            </span>
            {/* Note that credential.controlled is the origin string, so we can show this to users as needed. */}
            {credential.controlled ? <Pill text="API Controlled" /> : null}
          </div>
        </div>

        {removeCredential ? (
          <DeleteIcon
            className="my-auto text-gray-500 hover:text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              removeCredential && removeCredential(credential.username);
            }}
          />
        ) : null}

        {handleEditCredential ? (
          <EditIcon
            className="my-auto text-gray-500 hover:text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCredential(credential);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export default EntryContent;
