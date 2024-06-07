import { useUIStore } from "./useUIStore";

function ColorValueInput(props: {
  colorValue: number;
  setColorValue: (val: number) => void;
}) {
  return (
    <input
      type="number"
      className="font-mono text-center border-2 border-black"
      value={props.colorValue}
      min={0}
      max={255}
      onChange={(event) => {
        props.setColorValue(parseFloat(event.target.value));
      }}
    />
  );
}
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
      className="w-10 h-10 border-2 border-black bg-[--hex]"
      style={{
        ["--hex" as any]: hex,
      }}
    />
  );
}
export function UI() {
  const { red, green, blue, setRed, setGreen, setBlue } = useUIStore();

  return (
    <div className="flex fixed top-0 right-0 p-2">
      <ColorValueInput colorValue={red} setColorValue={setRed} />
      <ColorValueInput colorValue={green} setColorValue={setGreen} />
      <ColorValueInput colorValue={blue} setColorValue={setBlue} />
      <ColorVisualizer red={red} green={green} blue={blue} />
    </div>
  );
}
