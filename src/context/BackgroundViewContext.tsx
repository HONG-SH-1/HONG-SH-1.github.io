import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type BackgroundViewContextValue = {
  backgroundOnly: boolean;
  toggleBackgroundOnly: () => void;
};

const BackgroundViewContext = createContext<BackgroundViewContextValue | null>(
  null
);

export function BackgroundViewProvider({ children }: { children: ReactNode }) {
  const [backgroundOnly, setBackgroundOnly] = useState(false);
  const toggleBackgroundOnly = useCallback(
    () => setBackgroundOnly((v) => !v),
    []
  );

  useEffect(() => {
    document.body.style.overflow = backgroundOnly ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [backgroundOnly]);

  return (
    <BackgroundViewContext.Provider
      value={{ backgroundOnly, toggleBackgroundOnly }}
    >
      {children}
    </BackgroundViewContext.Provider>
  );
}

export function useBackgroundView(): BackgroundViewContextValue {
  const ctx = useContext(BackgroundViewContext);
  if (!ctx) {
    throw new Error("useBackgroundView must be used within BackgroundViewProvider");
  }
  return ctx;
}
