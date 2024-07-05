// import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/WebglCanvas";
// import { CircleMerge } from "./CircleMergeShader/CircleMerge";

// import { RepeatedlyReMountForTesting } from "./utility/RepeatedlyReMountForTesting";
import { motion } from "framer-motion";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./HaileyDragon/HaileyDragon";
import tunnel from "tunnel-rat";
import { useEffect, useState } from "react";
import { AccordionContainer } from "./ui/AccordionContainer";

export const ControlsTunnel = tunnel();
export const CodeTunnel = tunnel();

const useTrueAfterDelay = (ms: number): boolean => {
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(true);
    }, ms);

    return () => clearTimeout(timer);
  }, [ms]);

  return value;
};

function App() {
  const showWebGL = useTrueAfterDelay(1000);
  const showTitle = useTrueAfterDelay(100);
  const showControls = useTrueAfterDelay(3000);
  return (
    <ErrorModalBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showWebGL ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <WebGLCanvas>
          <HaileyDragon />
        </WebGLCanvas>
      </motion.div>
      <motion.h1
        className="fixed top-0 left-0 w-full text-center z-[9999] text-white font-mono p-6 text-[2rem] md:text-[3rem] bg-black/30 leading-none"
        initial={{ y: "-100%" }}
        animate={{ y: showTitle ? "0%" : "-100%" }}
      >
        Rainbow Hailey Dragon <span className="text-[1rem]">(0.1)</span>
      </motion.h1>
      <motion.div
        className="fixed bottom-0 left-0 z-[9999]"
        initial={{ y: "200%" }}
        animate={{ y: showControls ? "0%" : "200%" }}
      >
        <AccordionContainer icon="⚙️" title="controls" defaultOpen>
          <ControlsTunnel.Out />
        </AccordionContainer>
      </motion.div>
    </ErrorModalBoundary>
  );
}

export default App;
