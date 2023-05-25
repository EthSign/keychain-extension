interface NeverSaveBarProps {
  neverSave: () => void;
}

function NeverSaveBar(props: NeverSaveBarProps) {
  const { neverSave } = props;
  return (
    <div className="flex justify-center text-center">
      <div className="text-base text-gray-900 dark:text-white">
        Disable popup for this website?{" "}
        <span
          className="text-primary-700 hover:text-primary-800 active:text-primary-700 cursor-pointer underline select-none"
          onClick={neverSave}
        >
          Never for this website
        </span>
      </div>
    </div>
  );
}

export default NeverSaveBar;
