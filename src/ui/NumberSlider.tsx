import { ReactNode } from "react";

export function NumberSlider({
  value,
  setValue,
  min = 0,
  max = 1,
  step = 0.01,
  // label,
  icon,
}: {
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  icon: ReactNode;
}) {
  return (
    <label className="block w-full text-center">
      <div className="flex justify-between">
        <span className="block text-xs">({value.toFixed(2)})</span>
      </div>
      <div
        className="relative"
        style={{
          /* eslint-disable @typescript-eslint/no-explicit-any */
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ["--left" as any]: `calc(${((value - min) / (max - min)) * 100}%)`,
          /* eslint-enable @typescript-eslint/no-explicit-any */
        }}
      >
        <input
          type="range"
          className="block w-full h-14 border-2 border-black opacity-0 appearance-none cursor-pointer"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            setValue(parseFloat(event.target.value));
          }}
        />

        <div className="overflow-hidden absolute inset-0 rounded-xl border-2 border-black pointer-events-none">
          <div className="absolute top-0 left-0 bottom-0 w-[--left] bg-gray-300" />
        </div>
        <div className="absolute top-0 left-[--left] w-14 h-14 text-[3rem] rounded-full pointer-events-none">
          <span className="block translate-y-[0.4em] -translate-x-1/2">
            {icon}
          </span>
        </div>
      </div>
    </label>
  );
}
