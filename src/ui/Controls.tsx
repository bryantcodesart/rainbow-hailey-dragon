import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
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
      <span className="text-[3rem]">{icon}</span>{" "}
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

function AccordionContainer({
  title,
  children,
  icon,
  defaultOpen = false,
}: {
  title: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  icon: ReactNode;
}) {
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
      <header className="flex items-center absolute bottom-full gap-4 justify-between p-4 w-full bg-white mb-[-1px] border-2 border-black">
        <span className="text-[3rem]  translate-y-[-15%]">{icon}</span>
        <span className="flex-grow tracking-wider text-[1.25rem]">{title}</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="text-[1.5rem]"
        >
          <span className="absolute inset-0" />
          <span className="translate-y-[-15%] block">
            {isOpen ? "▼" : "▶︎"}
          </span>
        </button>
      </header>
      <section className="overflow-hidden border-2 border-black">
        <div className="flex flex-wrap justify-stretch gap-6 items-center px-4 pb-6 pt-8 text-center max-w-[16rem]">
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
