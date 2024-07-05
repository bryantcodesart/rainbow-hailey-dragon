import { ReactNode } from "react";

export function NumberSlider({
  value,
  setValue,
  min = 0,
  max = 1,
  step = 0.01,
  label,
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
    <label className="block text-center">
      <span className="sr-only">{label}</span>
      <div
        className="relative group"
        style={{
          /* eslint-disable @typescript-eslint/no-explicit-any */
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ["--left" as any]: `calc(${((value - min) / (max - min)) * 100}%)`,
          /* eslint-enable @typescript-eslint/no-explicit-any */
        }}
      >
        <input
          type="range"
          className="block w-full h-12 border-2 border-black opacity-0 appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-16 [&::-webkit-slider-thumb]:w-16 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-black"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            setValue(parseFloat(event.target.value));
          }}
        />

        <div className="overflow-hidden absolute inset-0 rounded-xl border-2 border-white pointer-events-none">
          <div className="absolute top-0 left-0 bottom-0 w-[--left] bg-gray-400 group-hover:bg-gray-200" />
        </div>
        <div className="absolute top-0 left-[--left] w-14 h-14 text-[3rem] rounded-full pointer-events-none">
          <span className="block translate-y-[0em] -translate-x-1/2 group-hover:scale-[1.5] transition-transform duration-[50ms]">
            {icon}
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        <span className="block w-full text-xs text-center">
          {label} ({value.toFixed(2)})
        </span>
      </div>
    </label>
  );
}
