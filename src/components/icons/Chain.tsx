import { SVGProps } from "react";

export function Chain(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="9" viewBox="0 0 15 9" fill="none" {...props}>
      <path
        d="M4.49992 1.24365H4.16659C2.32564 1.24365 0.833252 2.73604 0.833252 4.57699C0.833252 6.41794 2.32564 7.91032 4.16659 7.91032H5.49992C7.34087 7.91032 8.83325 6.41794 8.83325 4.57699M10.4999 7.91032H10.8333C12.6742 7.91032 14.1666 6.41794 14.1666 4.57699C14.1666 2.73604 12.6742 1.24365 10.8333 1.24365H9.49992C7.65897 1.24365 6.16659 2.73604 6.16659 4.57699"
        stroke="white"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
