import { useEffect, useRef, useState } from 'react';

export default function CustomDropdownMenu({ placeholder, values, onChange = () => {} }) {
  const [isDropDown, setIsDropDown] = useState(false);
  const [state, setState] = useState(0);
  const posY = useRef(0);

  useEffect(() => {
    posY.current = window.scrollY;
    document.documentElement.style.setProperty('--posY', `-${posY.current}px`);
    document.body.classList.add('fixed');
    return () => {
      document.body.classList.remove('fixed');
      window.scrollTo(0, posY.current);
    };
  }, []);

  return (
    <div
      className="relative flex border justify-between items-center p-2 pr-0 rounded cursor-pointer"
      onClick={() => setIsDropDown(!isDropDown)}
    >
      <p className={`${state === 0 ? 'text-gray-400' : 'font-semibold'}`}>
        {state === 0 ? placeholder : values[state - 1]}
      </p>
      <div className="flex h-full px-1 items-center justify-center border-l">
        {isDropDown ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
            <path
              fill="darkgray"
              d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
            <path
              fill="darkgray"
              d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
            />
          </svg>
        )}
      </div>
      {isDropDown && (
        <div className="absolute w-full top-10 left-0 bg-white rounded-b-xl z-10 shadow-lg">
          {values.map((value, idx) => (
            <p
              key={idx}
              className={`${state === idx + 1 ? 'text-black bg-gray-100' : 'text-gray-400'} ${
                values.length === idx + 1 && 'rounded-b-xl'
              } ${idx === 0 && 'border-t'} p-2 border-x border-b hover:bg-gray-100 `}
              onClick={() => {
                setState(idx + 1);
                onChange(idx + 1);
              }}
            >
              {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
