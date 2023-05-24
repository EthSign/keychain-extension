interface SyncPasswordsBarProps {
  syncPasswords: () => void;
}

function SyncPasswordsBar(props: SyncPasswordsBarProps) {
  const { syncPasswords } = props;
  return (
    <div className="flex justify-center text-center">
      <div className="text-base text-gray-900">
        Saved passwords before?{" "}
        <span className="text-orange-500 cursor-pointer underline" onClick={syncPasswords}>
          Sync passwords
        </span>
      </div>
    </div>
  );
}

export default SyncPasswordsBar;
