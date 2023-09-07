interface OriginPillProps {
  url?: string;
}

function OriginPill(props: OriginPillProps) {
  const { url } = props;
  return (
    <>
      <div className="rounded-full border border-gray-200 dark:border-gray-700 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 py-2 px-6 text-center">
        {url}
      </div>
    </>
  );
}

export default OriginPill;
