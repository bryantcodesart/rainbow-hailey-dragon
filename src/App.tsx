// import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/renderer/WebglCanvas";
// import { CircleMerge } from "./CircleMergeShader/CircleMerge";

// import { RepeatedlyReMountForTesting } from "./utility/RepeatedlyReMountForTesting";
import { motion } from "framer-motion";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./programs/HaileyDragon";
import { useTrueAfterDelay } from "./utility/useTrueAfterDelay";
import { ControlsTunnel } from "./tunnels/ControlsTunnel";

function App() {
  const showWebGL = useTrueAfterDelay(500);
  const showTitle = useTrueAfterDelay(2000);
  const showCodeLink = useTrueAfterDelay(4000);

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
          Rainbow Hailey Dragon{" "}
          <span className="text-[1rem]">(in progress)</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 items-center px-4 pt-6 pb-2 text-center max-w-[50rem] w-full m-auto">
          <ControlsTunnel.Out />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 text-[1.5rem] text-white font-mono"
        initial={{ y: "100%" }}
        animate={{ y: showCodeLink ? "0%" : "100%" }}
      >
        <a
          href="https://github.com/bryantcodesart/rainbow-hailey-dragon"
          className="block p-4"
          target="_blank"
          rel="noreferrer"
        >
          {"</>"}
        </a>
      </motion.div>
    </ErrorModalBoundary>
  );
}

export default App;
