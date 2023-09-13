import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { Chain } from "../components/icons/Chain";
import { LogoFull } from "../components/icons/LogoFull";
import { LogoFullDark } from "../components/icons/LogoFullDark";
import { MetaMaskState } from "../hooks";
import Button from "../ui/forms/Button";
import { checkProviderStatus } from "../utils/snap";

interface ConnectProps {
  state: MetaMaskState;
  connectToMetaMask: () => Promise<void>;
}

function Connect(props: ConnectProps) {
  const { connectToMetaMask } = props;
  const [metaMaskDetected, handleMetaMaskDetected] = useState<boolean>();

  useEffect(() => {
    (async () => {
      const val = await checkProviderStatus();
      handleMetaMaskDetected(val);
    })();
  }, []);

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
        <Button
          className="px-8 py-3"
          onClick={connectToMetaMask}
          customSizing={true}
          icon={<Chain />}
          disabled={!metaMaskDetected}
        >
          Connect MetaMask
        </Button>
        {metaMaskDetected === false ? (
          <>
            <div className="text-red-400">MetaMask not detected.</div>
          </>
        ) : null}

        {metaMaskDetected === undefined ? (
          <>
            <div className="text-red-400">MetaMask not detected. Please refresh your page.</div>
          </>
        ) : null}

        {!metaMaskDetected ? (
          <>
            <div className="mt-4 flex flex-row gap-2">
              <div
                className="text-orange-500 hover:text-primary-800 active:text-orange-500 cursor-pointer select-none"
                onClick={() => {
                  window.open(
                    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
                    "_blank"
                  );
                }}
              >
                Install MetaMask
              </div>
              <div className="border-l border-black/10 dark:border-white/20"></div>
              <div
                className="text-orange-500 hover:text-primary-800 active:text-orange-500 cursor-pointer select-none"
                onClick={() => {
                  window.open(
                    "https://docs.ethsign.xyz/ethsign-keychain/faqs#why-is-the-connect-metamask-button-disabled",
                    "_blank"
                  );
                }}
              >
                Help
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default Connect;
