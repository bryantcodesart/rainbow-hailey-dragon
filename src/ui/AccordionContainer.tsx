import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

export function AccordionContainer({
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
      <header className="flex items-center absolute bottom-full gap-4 justify-between p-4 py-4 w-full bg-white mb-[-1px] border-2 border-black">
        <span className="text-[2.5rem]  translate-y-[-5%]">{icon}</span>
        <span className="flex-grow tracking-wider text-[1rem]  ">{title}</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="text-[1.25rem]"
        >
          <span className="absolute inset-0" />
          <span className="translate-y-[-15%] block">
            {isOpen ? "▼" : "▶︎"}
          </span>
        </button>
      </header>
      <section className="border-2 border-black">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 items-center px-6 pt-6 pb-2 text-center w-[80vw] ">
          {children}
        </div>
      </section>
    </motion.div>
  );
}
