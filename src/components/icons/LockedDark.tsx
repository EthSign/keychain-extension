import { SVGProps } from "react";

export function LockedDark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
      <g filter="url(#filter0_b_421_4797)">
        <rect width="48" height="48" rx="24" fill="#1D2939" />
        <path
          d="M29 22V20C29 17.2386 26.7614 15 24 15C21.2386 15 19 17.2386 19 20V22M24 26.5V28.5M20.8 33H27.2C28.8802 33 29.7202 33 30.362 32.673C30.9265 32.3854 31.3854 31.9265 31.673 31.362C32 30.7202 32 29.8802 32 28.2V26.8C32 25.1198 32 24.2798 31.673 23.638C31.3854 23.0735 30.9265 22.6146 30.362 22.327C29.7202 22 28.8802 22 27.2 22H20.8C19.1198 22 18.2798 22 17.638 22.327C17.0735 22.6146 16.6146 23.0735 16.327 23.638C16 24.2798 16 25.1198 16 26.8V28.2C16 29.8802 16 30.7202 16.327 31.362C16.6146 31.9265 17.0735 32.3854 17.638 32.673C18.2798 33 19.1198 33 20.8 33Z"
          stroke="#98A2B3"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_421_4797"
          x="-8"
          y="-8"
          width="64"
          height="64"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_421_4797" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_421_4797" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
