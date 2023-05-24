import { Close } from "./icons/Close";
import { Logo } from "./icons/Logo";

function TopBar() {
  return (
    <div className="w-full flex justify-between">
      <div className="my-auto">
        <Logo />
      </div>
      <div className="my-auto cursor-pointer" onClick={() => window.close()}>
        <Close />
      </div>
    </div>
  );
}

export default TopBar;
