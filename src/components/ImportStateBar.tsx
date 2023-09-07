interface ImportStateBarProps {
  handleImporting: (importing: boolean) => void;
}

function ImportStateBar(props: ImportStateBarProps) {
  const { handleImporting } = props;
  return (
    <div className="flex justify-center text-center">
      <div className="text-base text-gray-900 dark:text-white">
        <span
          className="text-orange-500 hover:text-primary-800 active:text-orange-500 cursor-pointer select-none"
          onClick={() => handleImporting(true)}
        >
          Import credentials
        </span>
      </div>
    </div>
  );
}

export default ImportStateBar;
