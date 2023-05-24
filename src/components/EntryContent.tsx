import { useState } from "react";
import { Locked2 } from "./icons/Locked2";
import { Eyeball } from "./icons/Eyeball";
import { EyeballHide } from "./icons/EyeballHide";
import Button from "../ui/forms/Button";

interface EntryContentProps {
  credential: {
    address?: string | undefined;
    timestamp: number;
    url: string;
    username: string;
    password: string;
  };
  removeCredential?: (username: string) => Promise<void>;
  selectCallback?: (credential: {
    address?: string | undefined;
    timestamp: number;
    url: string;
    username: string;
    password: string;
  }) => void;
}

function EntryContent(props: EntryContentProps) {
  const { credential, removeCredential, selectCallback } = props;

  const [showPassword, handleShowPassword] = useState(false);
  return (
    <>
      <div className="flex p-3">
        <div className="my-auto">
          <Locked2 className="h-8 w-8" />
        </div>
        <div className="flex flex-col my-auto ml-2 mr-auto">
          <div className="select-none font-medium text-gray-500">{credential.username}</div>
          <div className="select-none">
            {showPassword ? (
              <span className="text-gray-700">{credential.password}</span>
            ) : (
              <span className="text-gray-400">{new Array((credential.password?.length ?? 0) + 1).join("*")}</span>
            )}
            <span
              className="relative cursor-pointer inline-block my-auto ml-1 align-middle"
              onClick={() => handleShowPassword(!showPassword)}
            >
              <div className="">{showPassword ? <Eyeball /> : <EyeballHide />}</div>
            </span>
          </div>
        </div>
        {selectCallback ? (
          <>
            <Button filled={false} shadow={false} onClick={() => selectCallback(credential)}>
              Select
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
}

export default EntryContent;
