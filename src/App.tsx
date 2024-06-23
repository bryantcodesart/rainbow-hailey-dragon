import { ErrorMessage } from "./ErrorMessage";
import { UI } from "./UI";
import { ErrorBoundary } from "react-error-boundary";
import { WebGLCanvas } from "./WebglCanvas";
import { CircleMergeShader } from "./CircleMergeShader";

import { RepeatedlyMountForTesting } from "./RepeatedlyMountForTesting";

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <ErrorMessage.Modal>
          <ErrorMessage.Title>Something went wrong!</ErrorMessage.Title>
          <ErrorMessage.Body>{error.message}</ErrorMessage.Body>
        </ErrorMessage.Modal>
      )}
    >
      <WebGLCanvas>
        <RepeatedlyMountForTesting duration={200} active={false}>
          <CircleMergeShader />
        </RepeatedlyMountForTesting>
      </WebGLCanvas>
      <UI />
    </ErrorBoundary>
  );
}

export default App;
