interface PillProps {
  text: string;
}

function Pill(props: PillProps) {
  const { text } = props;
  return (
    <>
      <div className="rounded-full bg-blue-50 text-blue-700 py-1 px-2 text-[0.5rem] font-medium">{text}</div>
    </>
  );
}

export default Pill;
