import { useUIStore } from "./useUIStore";

function ColorValueInput(props: {
  colorValue: number;
  setColorValue: (val: number) => void;
}) {
  return (
    <input
      type="range"
      className="block border-2 border-black"
      value={props.colorValue}
      min={0}
      max={255}
      onChange={(event) => {
        props.setColorValue(parseFloat(event.target.value));
      }}
    />
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// biome-ignore lint/suspicious/noExplicitAny: The only way I've found to do this
type CustomCssPropertyAny = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

function ColorVisualizer({
  red,
  blue,
  green,
}: {
  red: number;
  green: number;
  blue: number;
}) {
  const hex = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  return (
    <div
      className="w-20 h-20 border-2 border-black bg-[--hex]"
      style={{
        ["--hex" as CustomCssPropertyAny]: hex,
      }}
    />
  );
}
export function UI() {
  const { red, green, blue, setRed, setGreen, setBlue } = useUIStore();

  return (
    <div className="flex fixed top-0 right-0 gap-2 items-center p-2 font-mono text-xs text-center">
      <div>
        <label className="block">
          Red
          <ColorValueInput colorValue={red} setColorValue={setRed} />
        </label>
        <label className="block">
          Green
          <ColorValueInput colorValue={green} setColorValue={setGreen} />
        </label>
        <label className="block">
          Blue
          <ColorValueInput colorValue={blue} setColorValue={setBlue} />
        </label>
      </div>
      <ColorVisualizer red={red} green={green} blue={blue} />
    </div>
  );
}
