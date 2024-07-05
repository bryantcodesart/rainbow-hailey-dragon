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
      <span className="text-[2rem] md:text-[3rem]">{icon}</span>{" "}
      <span className="text-xs">({value.toFixed(2)})</span>
      <input
        type="range"
        className="block w-full border-2 border-black"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          setValue(parseFloat(event.target.value));
        }}
      />
    </label>
  );
}
