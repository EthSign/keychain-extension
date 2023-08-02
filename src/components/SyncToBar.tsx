import Radio from "../ui/forms/Radio";

interface SyncToBarProps {
  syncTo?: string | null;
  handleSetSyncTo: (syncTo: string) => void;
}

function SyncToBar(props: SyncToBarProps) {
  const { syncTo, handleSetSyncTo } = props;
  return (
    <div className="flex justify-center text-center">
      <Radio
        checked={syncTo === "aws" || syncTo === null || syncTo === undefined}
        groupName="syncto"
        value="aws"
        label="AWS"
        onClick={() => handleSetSyncTo("aws")}
      />
      <Radio
        checked={syncTo === "arweave"}
        groupName="syncto"
        value="arweave"
        label="Arweave"
        onClick={() => handleSetSyncTo("arweave")}
      />
      <Radio
        checked={syncTo === "none"}
        groupName="syncto"
        value="none"
        label="None"
        onClick={() => handleSetSyncTo("none")}
      />
    </div>
  );
}

export default SyncToBar;
