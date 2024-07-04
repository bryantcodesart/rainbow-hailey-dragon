// import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/WebglCanvas";
// import { CircleMerge } from "./CircleMergeShader/CircleMerge";

import { RepeatedlyReMountForTesting } from "./utility/RepeatedlyReMountForTesting";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";
import { HaileyDragon } from "./Sprite/HaileyDragon";
import { Background } from "./Sprite/Background";

function App() {
  return (
    <ErrorModalBoundary>
      <WebGLCanvas>
        <Background />
        {Array.from({ length: 100 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <HaileyDragon key={i} offset={i * 0.01} />
        ))}
      </WebGLCanvas>
      {/* <UI /> */}
    </ErrorModalBoundary>
  );
}

export default App;
