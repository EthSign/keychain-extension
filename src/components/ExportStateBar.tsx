interface ExportStateBarProps {
  exportState: () => void;
}

function ExportStateBar(props: ExportStateBarProps) {
  const { exportState } = props;
  return (
    <div className="flex justify-center text-center">
      <div className="text-base text-gray-900 dark:text-white">
        <span
          className="text-primary-700 hover:text-primary-800 active:text-primary-700 cursor-pointer underline select-none"
          onClick={exportState}
        >
          Export all credentials
        </span>
      </div>
    </div>
  );
}

export default ExportStateBar;
