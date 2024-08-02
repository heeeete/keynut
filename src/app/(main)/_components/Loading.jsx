export default function Loading() {
  return (
    <div className="flex fixed left-0 top-0 w-screen custom-dvh items-center justify-center bg-black z-50 opacity-40">
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" viewBox="0 0 24 24">
        <path
          fill="#a599ff"
          d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
          opacity="0.5"
        />
        <path fill="#a599ff" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            from="0 12 12"
            repeatCount="indefinite"
            to="360 12 12"
            type="rotate"
          />
        </path>
      </svg> */}
      <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
        <defs>
          <symbol id="lineMdCogFilledLoop0">
            <path
              fill="#fff"
              d="M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 16.57 6.05 16.57 6.05C16.64 6.1 16.71 6.16 16.77 6.22C18.14 7.34 19.09 8.94 19.4 10.75C19.41 10.84 19.42 10.92 19.43 11C19.43 11 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z"
            >
              <animate
                fill="freeze"
                attributeName="d"
                begin="0.5s"
                dur="0.2s"
                values="M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 16.57 6.05 16.57 6.05C16.64 6.1 16.71 6.16 16.77 6.22C18.14 7.34 19.09 8.94 19.4 10.75C19.41 10.84 19.42 10.92 19.43 11C19.43 11 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z;M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 19.09 5.04 19.09 5.04C19.25 4.98 19.52 5.01 19.6 5.17C19.6 5.17 21.67 8.75 21.67 8.75C21.77 8.92 21.73 9.2 21.6 9.32C21.6 9.32 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z"
              />
            </path>
          </symbol>
          <mask id="lineMdCogFilledLoop1">
            <path
              fill="none"
              stroke="#fff"
              strokeDasharray="36"
              strokeDashoffset="36"
              strokeWidth="5"
              d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7z"
            >
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="36;0" />
              <set attributeName="opacity" begin="0.4s" to="0" />
            </path>
            <g opacity="0">
              <use href="#lineMdCogFilledLoop0" />
              <use href="#lineMdCogFilledLoop0" transform="rotate(60 12 12)" />
              <use href="#lineMdCogFilledLoop0" transform="rotate(120 12 12)" />
              <use href="#lineMdCogFilledLoop0" transform="rotate(180 12 12)" />
              <use href="#lineMdCogFilledLoop0" transform="rotate(240 12 12)" />
              <use href="#lineMdCogFilledLoop0" transform="rotate(300 12 12)" />
              <set attributeName="opacity" begin="0.4s" to="1" />
              <animateTransform
                attributeName="transform"
                dur="30s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </g>
            <circle cx="12" cy="12" r="3.5" />
          </mask>
        </defs>
        <rect width="24" height="24" fill="#a599ff" mask="url(#lineMdCogFilledLoop1)" />
      </svg>
    </div>
  );
}
