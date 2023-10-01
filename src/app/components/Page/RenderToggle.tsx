import { useRender } from "@components/Page/RenderProvider";
import "@styles/components/rendertoggle.css";

export default function RenderToggle() {
  const { renderFull, setFullMode, setCompactMode } = useRender();

  return (
    <div className="render-toggle">
      <button
        className={`render-toggle-button left ${
          !renderFull ? " toggle-active" : ""
        }`}
        onClick={setCompactMode}
        disabled={!renderFull}
      >
        Compact
      </button>
      <button
        className={`render-toggle-button right ${
          renderFull ? " toggle-active" : ""
        }`}
        onClick={setFullMode}
        disabled={renderFull}
      >
        Full
      </button>
    </div>
  );
}
