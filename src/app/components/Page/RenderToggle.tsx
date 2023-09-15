import { useRender } from "@components/Page/RenderProvider";

export default function RenderToggle() {
  const { renderFull, toggleRenderMode } = useRender();

  return (
    <button onClick={toggleRenderMode}>
      {renderFull ? "Compact" : "Full"}
    </button>
  );
}
