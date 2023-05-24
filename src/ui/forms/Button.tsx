import { ReactElement } from "react";

interface ButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  filled?: boolean;
  rounded?: boolean;
  style?: "primary" | "secondary" | "tertiary" | "danger" | "success" | "none";
  shadow?: boolean;
  customSizing?: boolean;
  customFont?: boolean;
  disabled?: boolean;
  loading?: boolean;
  grouped?: boolean;
  groupedSelected?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  icon?: ReactElement;
  children?: React.ReactElement | string;
  childElement?: JSX.Element;
  className?: string;
  tabIndex?: number;
  type?: "button" | "submit" | "reset";
  stopPropagation?: boolean;
  id?: string;
}

function Button(props: ButtonProps) {
  const {
    onClick,
    onBlur,
    filled = true,
    rounded = false,
    shadow = true,
    style = "primary",
    customSizing = false,
    customFont = false,
    disabled = false,
    loading = false,
    grouped = false,
    groupedSelected = false,
    size = "md",
    icon,
    children,
    childElement,
    className,
    tabIndex = -1,
    type,
    stopPropagation = true,
    id
  } = props;

  const bgAndBorderColor = () => {
    if (!filled) {
      return "border-white hover:border-white";
    }

    if (disabled) {
      return `bg-gray-24 border-transparent`;
    }
    switch (style) {
      case "primary":
        return "bg-orange-500 border-primary-600";
      case "secondary":
        return "bg-white hover:bg-gray-21 active:bg-gray-23";
      case "tertiary":
        return "bg-black/0 border-transparent hover:bg-black/5 active:bg-black/10";
      case "danger":
        return "bg-rose-500 hover:bg-rose-600 border-transparent";
      case "success":
        return "bg-emerald-500 hover:bg-emerald-600 border-transparent";
    }
  };

  const textColor = () => {
    switch (style) {
      case "primary":
        if (filled) {
          return "text-white";
        }
        return "text-blue-300 hover:text-opacity-90 active:text-opacity-80";
      case "secondary":
        if (grouped && !groupedSelected) {
          return "text-slate-600";
        }
        return "text-black";
      case "tertiary":
        if (grouped && groupedSelected) {
          return "text-black";
        }
        return "text-black";
      case "danger":
        if (filled) {
          return "text-white";
        }
        return "text-rose-500";
      case "success":
        if (filled) {
          return "text-white";
        }
        return "text-emerald-500";
    }
  };

  const padding = () => {
    if (customSizing) {
      return "";
    }

    if (rounded) {
      switch (size) {
        case "xs":
          return "px-3 py-0.5";
        case "sm":
          return "px-3 py-1";
        case "md":
          return "px-4 py-2";
        case "lg":
          return "px-5 py-3";
      }
    }
    switch (size) {
      case "xs":
        return "px-2 py-0.5";
      case "sm":
        return "px-2 py-1";
      case "md":
        return "px-3 py-2";
      case "lg":
        return "px-4 py-3";
    }
  };

  const groupedStyles = () => {
    if (rounded) {
      return `rounded-none first:rounded-l-full last:rounded-r-full`;
    }
    return `rounded-none first:rounded-l last:rounded-r`;
  };

  const disabledLoading = () => {
    if (filled) {
      return "disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none";
    } else {
      return "disabled:text-opacity-80 disabled:cursor-not-allowed";
    }
  };

  let classes = `select-none${
    !customFont ? " font-medium text-sm" : ""
  } inline-flex items-center justify-center border-2 ${rounded ? "rounded-full" : "rounded-md"} leading-5${
    shadow ? " shadow-sm " : ""
  }transition duration-150 ease-in-out`;
  classes += " " + bgAndBorderColor() + " " + textColor() + " " + padding() + " " + disabledLoading();

  if (grouped) {
    classes += " " + groupedStyles();
  }

  if (className) {
    classes += " " + className;
  }

  if (style === "none") {
    classes = className ? className : "";
  }

  return (
    <button
      onClick={(e: React.MouseEvent) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
        if (onClick) {
          onClick(e);
        }
      }}
      onBlur={onBlur}
      className={classes}
      disabled={disabled || loading}
      tabIndex={tabIndex}
      type={type}
      id={id}
    >
      {loading ? (
        <div className={children ? "mr-2" : ""}>
          <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        </div>
      ) : icon ? (
        <div className={children ? "mr-2" : ""}>{icon}</div>
      ) : null}
      {children ? children : ""}
      {childElement ? childElement : null}
    </button>
  );
}

export default Button;
