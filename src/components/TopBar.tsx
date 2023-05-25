import { Close } from "./icons/Close";
import { Logo } from "./icons/Logo";

function TopBar() {
  return (
    <div className="w-full flex justify-between">
      <div className="my-auto">
        <Logo />
      </div>
      <div className="my-auto cursor-pointer" onClick={() => window.close()}>
        <Close className="fill-gray-400 hover:fill-gray-500 active:fill-gray-400" />
      </div>
    </div>
  );
}

export default TopBar;
