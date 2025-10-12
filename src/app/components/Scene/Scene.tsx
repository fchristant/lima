import { useMemo } from "react";
import { HueScene } from "types/hue";
import { calculateSceneLampColor, polarToCartesian, describeArc } from "@utils/color";
import "@styles/components/scene.css";

interface SceneProps {
  scene: HueScene;
}

const SWATCH_SIZE = 32;
const SWATCH_CENTER = SWATCH_SIZE / 2;
const SWATCH_RADIUS = 14;

export default function Scene({ scene }: SceneProps) {
  // Hue scene metadata used for recall POST.
  const { num, name, type, group } = scene;
  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/groups/${group}/action`;

  async function recallScene(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const bodyData = { scene: num };
    try {
      const response = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (data[0]?.error) {
        console.error("Error:", data[0].error.description);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fallbackColor = "#333333";

  const sceneColors = useMemo(() => {
    if (!scene.lightstates) {
      return [];
    }

    const colors = Object.values(scene.lightstates)
      .map((state) => calculateSceneLampColor(state))
      .filter((color): color is string => Boolean(color));

    if (colors.length === 0) {
      return [];
    }

    const uniqueColors = Array.from(new Set(colors));
    const visibleColors = uniqueColors.filter((color) => color !== fallbackColor);

    if (visibleColors.length > 0) {
      return visibleColors;
    }

    return uniqueColors;
  }, [scene.lightstates]);

  // Use the fallback grey if the API doesn't supply any colors.
  const displayColors = useMemo(() => {
    return sceneColors.length > 0 ? sceneColors : [fallbackColor];
  }, [sceneColors]);
  const hasMultipleColors = displayColors.length > 1;

  const segments = useMemo(() => {
    if (!hasMultipleColors) {
      return null;
    }

    const angleStep = 360 / displayColors.length;
    let currentStart = -90;

    return displayColors.map((color) => {
      const endAngle = currentStart + angleStep;
      const path = describeArc(
        SWATCH_CENTER,
        SWATCH_CENTER,
        SWATCH_RADIUS,
        currentStart,
        endAngle
      );
      const segment = {
        color,
        path,
        startAngle: currentStart,
        endAngle,
      };
      currentStart = endAngle;
      return segment;
    });
  }, [displayColors, hasMultipleColors]);

  const separatorAngles = useMemo(() => {
    if (!segments) {
      return [];
    }

    return segments.map((segment) => segment.startAngle);
  }, [segments]);

  return (
    <button className="scene" onClick={recallScene}>
      {/* Render an SVG pie chart so separators stay crisp regardless of display scaling. */}
      <span className="scene__swatch" aria-hidden="true">
        <svg
          viewBox={`0 0 ${SWATCH_SIZE} ${SWATCH_SIZE}`}
          width={SWATCH_SIZE}
          height={SWATCH_SIZE}
          focusable="false"
        >
          {hasMultipleColors && segments ? (
            <>
              {segments.map((segment, index) => (
                <path key={`segment-${index}`} d={segment.path} fill={segment.color} />
              ))}
              {/* Separator spokes use the button background color so the gaps feel native. */}
              {separatorAngles.map((angle, index) => {
                const { x, y } = polarToCartesian(
                  SWATCH_CENTER,
                  SWATCH_CENTER,
                  SWATCH_RADIUS,
                  angle
                );
                return (
                  <line
                    key={`separator-${index}`}
                    x1={SWATCH_CENTER}
                    y1={SWATCH_CENTER}
                    x2={x}
                    y2={y}
                    stroke="var(--scene-swatch-gap-color)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                );
              })}
              <circle
                cx={SWATCH_CENTER}
                cy={SWATCH_CENTER}
                r={SWATCH_RADIUS}
                fill="transparent"
                stroke="var(--scene-swatch-gap-color)"
                strokeWidth={2}
              />
            </>
          ) : (
            <circle
              cx={SWATCH_CENTER}
              cy={SWATCH_CENTER}
              r={SWATCH_RADIUS}
              fill={displayColors[0]}
              // Even single-color scenes get the outline so sizing matches the multi-color case.
              stroke="var(--scene-swatch-gap-color)"
              strokeWidth={2}
            />
          )}
        </svg>
      </span>
      {name}
    </button>
  );
}
