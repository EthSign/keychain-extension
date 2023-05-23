import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from "../ui/forms/Button";

interface CredentialRowProps {
  credential: { username: string; password: string | undefined | null };
  removeCredential: (username: string) => void;
}

function CredentialRow(props: CredentialRowProps) {
  const { credential, removeCredential } = props;

  const [showPassword, handleShowPassword] = useState(false);

  return (
    <div className="flex flex-row justify-between">
      <div className="my-auto">{credential.username}</div>
      <div className="flex flex-row flex-nowrap">
        <CopyToClipboard text={credential.password ?? ""}>
          <div className="my-auto">
            {showPassword ? credential.password : new Array((credential.password?.length ?? 0) + 1).join("*")}
          </div>
        </CopyToClipboard>
        <Button onClick={() => handleShowPassword(!showPassword)}>{showPassword ? "H" : "S"}</Button>
        <Button
          onClick={() => {
            removeCredential(credential.username);
          }}
        >
          D
        </Button>
      </div>
    </div>
  );
}

export default CredentialRow;
