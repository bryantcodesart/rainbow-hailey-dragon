import { useEffect, useState } from "react";

export const useTrueAfterDelay = (ms: number): boolean => {
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(true);
    }, ms);

    return () => clearTimeout(timer);
  }, [ms]);

  return value;
};
