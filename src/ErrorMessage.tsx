import { ReactNode } from "react";
function Modal({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-[black] bg-opacity-50 z-[99999999] grid place-items-center"
      key="error-modal2"
    >
      <div className="bg-[red] text-white p-4 font-[monospace] max-w-[80vw] max-h-[80vh] overflow-y-auto grid gap-[1rem] items-start">
        {children}
      </div>
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className="text-[2rem] text-[white]">{children}</h2>;
}

function Body({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[black] text-[pink] p-4 font-[monospace] overflow-x-auto">
      {children}
    </div>
  );
}

export const ErrorMessage = {
  Modal,
  Title,
  Body,
};
