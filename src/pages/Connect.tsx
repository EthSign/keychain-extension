import TopBar from "../components/TopBar";
import { Chain } from "../components/icons/Chain";
import { LogoFull } from "../components/icons/LogoFull";
import { LogoFullDark } from "../components/icons/LogoFullDark";
import { MetaMaskState } from "../hooks";
import Button from "../ui/forms/Button";

interface ConnectProps {
  state: MetaMaskState;
  connectToMetaMask: () => Promise<void>;
}

function Connect(props: ConnectProps) {
  const { connectToMetaMask } = props;

  return (
    <>
      <TopBar />
      <div className="flex flex-col mt-8 items-center">
        <div className="block dark:hidden">
          <LogoFull className="h-auto w-44" />
        </div>
        <div className="hidden dark:block">
          <LogoFullDark className="h-auto w-44" />
        </div>
        <div className="my-8 text-base text-center">Store and protect login credentials with your MetaMask wallet.</div>
        <Button className="px-8 py-3" onClick={connectToMetaMask} customSizing={true} icon={<Chain />}>
          Connect MetaMask
        </Button>
      </div>
    </>
  );
}

export default Connect;
