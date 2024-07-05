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
      <header className="flex items-center absolute bottom-full gap-4 justify-between p-4 py-6 w-full bg-white mb-[-1px] border-2 border-black">
        <span className="text-[3rem]  translate-y-[-15%]">{icon}</span>
        <span className="flex-grow tracking-wider text-[1.25rem]  ">
          {title}
        </span>
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
        <div className="flex flex-wrap justify-stretch gap-6 items-center px-8 pb-6 pt-8 text-center w-[14rem] md:w-[18rem]">
          {children}
        </div>
      </section>
    </motion.div>
  );
}
