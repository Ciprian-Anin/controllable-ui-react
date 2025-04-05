"use client";
import { useState } from 'react';

import { TooltipDemo } from './TooltipDemo';

export const TableWithTooltipsDemo = () => {
  const [scrollableContainerElement, setScrollableContainerElement] =
    useState<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        overflow: "auto",
        width: "100%",
        height: "80vh",
        maxWidth: "60vw",
      }}
      ref={(ref) => setScrollableContainerElement(ref)}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {Array.from({ length: 30 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: 30 }, (_, col) => (
                <td
                  key={col}
                  style={{
                    border: "1px solid #ccc",
                    position: "relative",
                  }}
                >
                  <TooltipDemo
                    placementStrategy="default"
                    preferredPlacement="top"
                    enterDelay={200}
                    scrollableContainer={
                      scrollableContainerElement ?? undefined
                    }
                    message={
                      <span>
                        <p>Tooltip with HTML</p>
                        <em>{"And here's"}</em> <b>{"some"}</b>{" "}
                        <u>{"amazing content"}</u>.{" "}
                        {"It's very engaging. Right?"}
                      </span>
                    }
                  >
                    <div style={{ width: 100, height: 100, padding: "10px" }}>
                      Cell {row * 10 + col + 1}
                    </div>
                  </TooltipDemo>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
