import { useState } from "react";
import { Locked2 } from "./icons/Locked2";
import { Eyeball } from "./icons/Eyeball";
import { EyeballHide } from "./icons/EyeballHide";

interface EntryContentProps {
  username?: string;
  password?: string;
}

function EntryContent(props: EntryContentProps) {
  const { username, password } = props;

  const [showPassword, handleShowPassword] = useState(false);
  return (
    <>
      <div className="flex">
        <div className="my-auto">
          <Locked2 className="h-8 w-8" />
        </div>
        <div className="flex flex-col my-auto ml-2">
          <div className="select-none font-medium text-gray-500">{username}</div>
          <div className="select-none">
            {showPassword ? (
              <span className="text-gray-700">{password}</span>
            ) : (
              <span className="text-gray-400">{new Array((password?.length ?? 0) + 1).join("*")}</span>
            )}
            <span
              className="relative cursor-pointer inline-block my-auto ml-1 align-middle"
              onClick={() => handleShowPassword(!showPassword)}
            >
              <div className="">{showPassword ? <Eyeball /> : <EyeballHide />}</div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default EntryContent;
