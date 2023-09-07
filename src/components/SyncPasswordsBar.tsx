interface SyncPasswordsBarProps {
  syncPasswords: () => void;
}

function SyncPasswordsBar(props: SyncPasswordsBarProps) {
  const { syncPasswords } = props;
  return (
    <div className="flex justify-center text-center">
      <div className="text-base text-gray-900 dark:text-white">
        Saved passwords before?{" "}
        <span
          className="text-orange-500 hover:text-primary-800 active:text-orange-500 cursor-pointer select-none"
          onClick={syncPasswords}
        >
          Sync to this profile
        </span>
      </div>
    </div>
  );
}

export default SyncPasswordsBar;
