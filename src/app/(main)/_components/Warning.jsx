import Link from 'next/link';

export default function Warning({ message }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-70vh space-y-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
        <g fill="none" stroke="orange" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path strokeDasharray="60" strokeDashoffset="60" d="M12 3L21 20H3L12 3Z">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0" />
          </path>
          <path strokeDasharray="6" strokeDashoffset="6" d="M12 10V14">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0" />
            <animate
              attributeName="stroke-width"
              begin="1s"
              dur="3s"
              keyTimes="0;0.1;0.2;0.3;1"
              repeatCount="indefinite"
              values="2;3;3;2;2"
            />
          </path>
        </g>
        <circle cx="12" cy="17" r="1" fill="orange" fillOpacity="0">
          <animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1" />
          <animate
            attributeName="r"
            begin="1.3s"
            dur="3s"
            keyTimes="0;0.1;0.2;0.3;1"
            repeatCount="indefinite"
            values="1;2;2;1;1"
          />
        </circle>
      </svg>
      <p className="font-semibold">{message}</p>
      <Link href={'/'} className="border p-2 border-black rounded">
        홈으로 가기
      </Link>
    </div>
  );
}
