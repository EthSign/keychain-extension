import { SVGProps } from "react";

export function AvatarIconDark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" {...props}>
      <rect x="2" y="2" width="32" height="32" rx="16" fill="#1D2939" />
      <path
        d="M23.3337 24C23.3337 23.0696 23.3337 22.6044 23.2188 22.2259C22.9603 21.3736 22.2934 20.7067 21.4411 20.4482C21.0626 20.3333 20.5974 20.3333 19.667 20.3333H16.3337C15.4033 20.3333 14.9381 20.3333 14.5596 20.4482C13.7073 20.7067 13.0404 21.3736 12.7818 22.2259C12.667 22.6044 12.667 23.0696 12.667 24M21.0003 15C21.0003 16.6569 19.6572 18 18.0003 18C16.3435 18 15.0003 16.6569 15.0003 15C15.0003 13.3431 16.3435 12 18.0003 12C19.6572 12 21.0003 13.3431 21.0003 15Z"
        stroke="#98A2B3"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect x="2" y="2" width="32" height="32" rx="16" stroke="#344054" stroke-width="4" />
    </svg>
  );
}
