import { useState, useEffect } from "react";

export const RepeatedlyMountForTesting = ({
  duration = 200,
  children,
  active = true,
}: {
  duration?: number;
  children: React.ReactNode;
  active?: boolean;
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active) {
      interval = setInterval(() => {
        setShow((prev) => !prev);
      }, duration);
    }

    return () => {
      if (active) {
        clearInterval(interval);
      }
    };
  }, [duration, active]);

  return <>{show && children}</>;
};
