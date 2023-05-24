import { SVGProps } from "react";

export function Locked(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none" {...props}>
      <g filter="url(#filter0_b_29_15754)">
        <rect y="0.577148" width="48" height="48" rx="24" fill="#EAECF0" />
        <path
          d="M29 22.5771V20.5771C29 17.8157 26.7614 15.5771 24 15.5771C21.2386 15.5771 19 17.8157 19 20.5771V22.5771M24 27.0771V29.0771M20.8 33.5771H27.2C28.8802 33.5771 29.7202 33.5771 30.362 33.2502C30.9265 32.9625 31.3854 32.5036 31.673 31.9391C32 31.2974 32 30.4573 32 28.7771V27.3771C32 25.697 32 24.8569 31.673 24.2152C31.3854 23.6507 30.9265 23.1917 30.362 22.9041C29.7202 22.5771 28.8802 22.5771 27.2 22.5771H20.8C19.1198 22.5771 18.2798 22.5771 17.638 22.9041C17.0735 23.1917 16.6146 23.6507 16.327 24.2152C16 24.8569 16 25.697 16 27.3771V28.7771C16 30.4573 16 31.2974 16.327 31.9391C16.6146 32.5036 17.0735 32.9625 17.638 33.2502C18.2798 33.5771 19.1198 33.5771 20.8 33.5771Z"
          stroke="#98A2B3"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_29_15754"
          x="-8"
          y="-7.42285"
          width="64"
          height="64"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_29_15754" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_29_15754" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
