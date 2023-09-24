import { useRender } from "@components/Page/RenderProvider";
import "@styles/components/rendertoggle.css";

export default function RenderToggle() {
  const { renderFull, toggleRenderMode } = useRender();

  return (
    <button className="render-toggle" onClick={toggleRenderMode}>
      {renderFull ? "Compact" : "Full"}
    </button>
  );
}
