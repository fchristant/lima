import { createContext, useContext, useState } from "react";

//const RenderContext = createContext();
const RenderContext = createContext({
  renderFull: true,
  toggleRenderMode: () => {},
});

interface RenderProviderProps {
  children: React.ReactNode;
}

const RenderProvider = ({ children }: RenderProviderProps) => {
  const [renderFull, setRenderFull] = useState(true);
  const toggleRenderMode = () => setRenderFull(!renderFull);

  return (
    <RenderContext.Provider value={{ renderFull, toggleRenderMode }}>
      {children}
    </RenderContext.Provider>
  );
};
const useRender = () => {
  const context = useContext(RenderContext);
  if (context === undefined) {
    throw new Error("useRender must be used within a ThemeProvider");
  }
  return context;
};
export { RenderProvider, useRender };
