interface RadioProps {
  disabled?: boolean;
  groupName: string;
  defaultChecked?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  checked?: boolean;
  value?: string;
  size?: "sm" | "md" | "lg";
}

function Radio(props: RadioProps) {
  const { size = "md" } = props;

  const fontSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-md";
    }
  };

  const classes =
    `focus:ring-0 focus:outline-0 focus:ring-offset-0 bg-white hover:text-primary-700 text-orange-500 dark:text-primary-900 disabled:bg-primary-200` +
    fontSize();
  return (
    <label className="flex items-center">
      <input
        type="radio"
        name={props.groupName}
        className={`${classes}`}
        disabled={props.disabled}
        defaultChecked={props.defaultChecked}
        onClick={props.onClick}
        checked={props.checked}
        value={props.value}
        onChange={() => {}}
      />
      {props.label && <span className={`ml-2 ${fontSize()}`}>{props.label}</span>}
    </label>
  );
}

export default Radio;
