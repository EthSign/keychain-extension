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
          className="text-primary-700 hover:text-primary-800 active:text-primary-700 cursor-pointer underline select-none"
          onClick={syncPasswords}
        >
          Sync passwords
        </span>
      </div>
    </div>
  );
}

export default SyncPasswordsBar;
