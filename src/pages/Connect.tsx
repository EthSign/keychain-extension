import TopBar from "../components/TopBar";
import { Chain } from "../components/icons/Chain";
import { KeychainLogo } from "../components/icons/KeychainLogo";
import { MetaMaskState } from "../hooks";
import Button from "../ui/forms/Button";

interface ConnectProps {
  state: MetaMaskState;
  connectToMetaMask: () => Promise<void>;
}

function Connect(props: ConnectProps) {
  const { state, connectToMetaMask } = props;

  return (
    <>
      <TopBar />
      <div className="flex flex-col mt-8 items-center">
        <div className="text-2xl font-semibold">EthSign Keychain</div>
        <div className="mt-4 text-base">Little do you know, I send everything to the CIA</div>
        <div className="my-8">
          <KeychainLogo className="h-24 w-24" />
        </div>
        <Button className="px-8 py-3 mb-8" onClick={connectToMetaMask} customSizing={true} icon={<Chain />}>
          Connect MetaMask
        </Button>
      </div>
    </>
  );
}

export default Connect;
