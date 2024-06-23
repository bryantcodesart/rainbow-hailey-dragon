import { UI } from "./ui/UI";
import { WebGLCanvas } from "./webgl-util/WebglCanvas";
import { CircleMerge } from "./CircleMergeShader/CircleMerge";

import { RepeatedlyMountForTesting } from "./utility/RepeatedlyMountForTesting";
import { ErrorModalBoundary } from "./error/ErrorModalBoundary";

function App() {
  return (
    <ErrorModalBoundary>
      <WebGLCanvas>
        <RepeatedlyMountForTesting duration={200} active={false}>
          <CircleMerge />
        </RepeatedlyMountForTesting>
      </WebGLCanvas>
      <UI />
    </ErrorModalBoundary>
  );
}

export default App;
