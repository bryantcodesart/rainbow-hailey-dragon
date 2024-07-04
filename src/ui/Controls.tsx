import { motion } from "framer-motion";
import { useState } from "react";
// export function ColorValueInput(props: {
//   colorValue: number;
//   setColorValue: (val: number) => void;
// }) {
//   return (
//     <input
//       type="range"
//       className="block border-2 border-black"
//       value={props.colorValue}
//       min={0}
//       max={255}
//       onChange={(event) => {
//         props.setColorValue(parseFloat(event.target.value));
//       }}
//     />
//   );
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */
// // biome-ignore lint/suspicious/noExplicitAny: The only way I've found to do this
// type CustomCssPropertyAny = any;
// /* eslint-enable @typescript-eslint/no-explicit-any */

// export function ColorVisualizer({
//   red,
//   blue,
//   green,
// }: {
//   red: number;
//   green: number;
//   blue: number;
// }) {
//   const hex = `#${red.toString(16).padStart(2, "0")}${green
//     .toString(16)
//     .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

//   return (
//     <div
//       className="w-20 h-20 border-2 border-black bg-[--hex]"
//       style={{
//         ["--hex" as CustomCssPropertyAny]: hex,
//       }}
//     />
//   );
// }

function NumberSlider({
  value,
  setValue,
  min = 0,
  max = 1,
  step = 0.01,
  label,
}: {
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  return (
    <label className="block">
      {label} <span className="text-xs">({value.toFixed(2)})</span>
      <input
        type="range"
        className="block border-2 border-black"
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

interface AccordionContainerProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionContainer({
  title,
  children,
  defaultOpen = false,
}: AccordionContainerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className="font-mono text-sm bg-white"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { y: 0 },
        closed: { y: "100%" },
      }}
    >
      <header className="flex absolute bottom-full justify-between p-4 w-full bg-white mb-[-1px]">
        <span>{title}</span>
        <button onClick={() => setIsOpen(!isOpen)} type="button">
          <span className="absolute inset-0" />
          {isOpen ? "▼" : "▶︎"}
        </button>
      </header>
      <section className="overflow-hidden">
        <div className="flex flex-wrap gap-4 items-center p-4 text-center max-w-[50vw]">
          {children}
        </div>
      </section>
    </motion.div>
  );
}
export const Controls = {
  NumberSlider,
  AccordionContainer,
};
