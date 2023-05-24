interface NeverSaveBarProps {
  neverSave: () => void;
}

function NeverSaveBar(props: NeverSaveBarProps) {
  const { neverSave } = props;
  return (
    <div className="flex justify-center text-center">
      <div className="text-base text-gray-900 dark:text-white">
        Disable popup for this website?{" "}
        <span className="text-orange-500 cursor-pointer underline" onClick={neverSave}>
          Never for this website
        </span>
      </div>
    </div>
  );
}

export default NeverSaveBar;
