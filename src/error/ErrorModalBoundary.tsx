import { ErrorMessage } from "./ErrorMessage";
import { ErrorBoundary } from "react-error-boundary";

export function ErrorModalBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <ErrorMessage.Modal>
          <ErrorMessage.Title>Something went wrong!</ErrorMessage.Title>
          <ErrorMessage.Body>{error.message}</ErrorMessage.Body>
        </ErrorMessage.Modal>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
