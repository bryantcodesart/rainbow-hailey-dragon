// import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/WebglCanvas";
// import { CircleMerge } from "./CircleMergeShader/CircleMerge";

// import { RepeatedlyReMountForTesting } from "./utility/RepeatedlyReMountForTesting";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./HaileyDragon/HaileyDragon";
import tunnel from "tunnel-rat";
import { Controls } from "./ui/Controls";

export const ControlsTunnel = tunnel();
export const CodeTunnel = tunnel();

function App() {
  return (
    <ErrorModalBoundary>
      <WebGLCanvas>
        <HaileyDragon />
      </WebGLCanvas>
      <div className="fixed bottom-0 left-0 z-[9999]">
        <Controls.AccordionContainer title="controls" defaultOpen>
          <ControlsTunnel.Out />
        </Controls.AccordionContainer>
      </div>
    </ErrorModalBoundary>
  );
}

export default App;
