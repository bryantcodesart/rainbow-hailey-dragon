// import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/WebglCanvas";
// import { CircleMerge } from "./CircleMergeShader/CircleMerge";

// import { RepeatedlyReMountForTesting } from "./utility/RepeatedlyReMountForTesting";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./HaileyDragon/HaileyDragon";

function App() {
  return (
    <ErrorModalBoundary>
      <WebGLCanvas>
        <HaileyDragon />
      </WebGLCanvas>
    </ErrorModalBoundary>
  );
}

export default App;
