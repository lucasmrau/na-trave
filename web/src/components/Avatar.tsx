import { SVGProps } from "react";

export function Avatar({...props}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // width="32"
      // height="32"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.322 3.768a10 10 0 11-.963 15.71l-.016-.014a10 10 0 01.98-15.696zm-.353 13.49A8.489 8.489 0 0112 14.75a8.49 8.49 0 016.03 2.507 8 8 0 10-12.06 0zm10.566 1.334A7.966 7.966 0 0112 20h-.003a7.967 7.967 0 01-4.534-1.408 6.489 6.489 0 014.535-1.842H12a6.488 6.488 0 014.535 1.842zm-4.536-3.842H12v1l-.001-1zm0-7a2 2 0 100 4 2 2 0 000-4zm-2.828-.828a4 4 0 115.657 5.657 4 4 0 01-5.657-5.657z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}