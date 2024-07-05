// import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/WebglCanvas";
// import { CircleMerge } from "./CircleMergeShader/CircleMerge";

// import { RepeatedlyReMountForTesting } from "./utility/RepeatedlyReMountForTesting";
import { motion } from "framer-motion";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./HaileyDragon/HaileyDragon";
import tunnel from "tunnel-rat";
import { useEffect, useState } from "react";

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
  const showTitle = true; //useTrueAfterDelay(1500);
  // const showControls = useTrueAfterDelay(2500);
  return (
    <ErrorModalBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showWebGL ? 1 : 0 }}
        transition={{ duration: 2 }}
      >
        <WebGLCanvas>
          <HaileyDragon />
        </WebGLCanvas>
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-full text-center z-[9999] text-white font-mono p-4 text-[1.5rem] md:text-[2rem] bg-black/30 leading-none"
        initial={{ y: "-100%" }}
        animate={{ y: showTitle ? "0%" : "-100%" }}
      >
        <h1>
          Rainbow Hailey Dragon <span className="text-[1rem]">(0.1)</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 items-center px-4 pt-6 pb-2 text-center max-w-[50rem] w-full m-auto">
          <ControlsTunnel.Out />
        </div>
      </motion.div>
    </ErrorModalBoundary>
  );
}

export default App;
