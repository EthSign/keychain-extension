import Button from "../ui/forms/Button";
import { AWSIcon } from "./icons/AWSIcon";
import { ArweaveIcon } from "./icons/ArweaveIcon";

interface SyncToBarProps {
  syncTo?: string | null;
  handleSetSyncTo: (syncTo: string) => void;
}

function SyncToBar(props: SyncToBarProps) {
  const { syncTo, handleSetSyncTo } = props;
  return (
    <div className="flex flex-col">
      <div className="text-gray-900 dark:text-white text-base mb-2">Sync credentials to</div>
      <div className="flex justify-center text-center gap-4">
        <Button
          style="none"
          customSizing
          className={`flex-1 select-none font-medium text-sm inline-flex items-center justify-center rounded-md leading-5 shadow-sm transition duration-150 ease-in-out py-2 px-3 dark:bg-gray-800 hover:dark:bg-gray-700 border ${
            syncTo === "aws" || syncTo === null || syncTo === undefined
              ? "border-orange-500 dark:border-primary-900 dark:text-white"
              : "border-gray-700 dark:text-gray-400"
          }`}
          icon={<AWSIcon />}
          onClick={() => handleSetSyncTo("aws")}
        >
          AWS
        </Button>
        <Button
          style="none"
          customSizing
          className={`flex-1 select-none font-medium text-sm inline-flex items-center justify-center rounded-md leading-5 shadow-sm transition duration-150 ease-in-out py-2 px-3 dark:bg-gray-800 hover:dark:bg-gray-700 border ${
            syncTo === "arweave"
              ? "border-orange-500 dark:border-primary-900 dark:text-white"
              : "border-gray-700 dark:text-gray-400"
          }`}
          icon={<ArweaveIcon />}
          onClick={() => handleSetSyncTo("arweave")}
        >
          Arweave
        </Button>
        <Button
          style="none"
          customSizing
          className={`flex-1 select-none font-medium text-sm inline-flex items-center justify-center rounded-md leading-5 shadow-sm transition duration-150 ease-in-out py-2 px-3 dark:bg-gray-800 hover:dark:bg-gray-700 border ${
            syncTo === "none"
              ? "border-orange-500 dark:border-primary-900 dark:text-white"
              : "border-gray-700 dark:text-gray-400"
          }`}
          onClick={() => handleSetSyncTo("none")}
        >
          None
        </Button>
      </div>
    </div>
  );
}

export default SyncToBar;
