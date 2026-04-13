import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { DataTableScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";
const RED = "#FF4444";
const ORANGE = "#FF8C00";
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

const TableScan: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: (frame * 3) % 300, height: 2,
      background: `linear-gradient(90deg, transparent, ${TEAL}44, transparent)`,
      pointerEvents: "none",
    }} />
  );
};

export const DataTable: React.FC<{ data: DataTableScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const rowCount = data.table.rows.length;

  // Hero stat count-up
  const heroDelay = 4;
  const heroT = Math.min(Math.max(0, frame - heroDelay) / 35, 1);
  const heroEased = 1 - Math.pow(1 - heroT, 3);
  const heroP = spring({ frame: Math.max(0, frame - heroDelay), fps, config: { damping: 14 } });
  const heroOp = interpolate(heroP, [0, 1], [0, 1]);
  const heroScale = interpolate(heroP, [0, 1], [0.85, 1]);
  const heroGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const tableP = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 18 } });
  const tableOp = interpolate(tableP, [0, 1], [0, 1]);

  const shimmer = (Math.sin(frame * 0.09) + 1) / 2;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 16px", display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14,
      }}>
        {data.header}
      </div>

      {data.heroStat && (
        <div style={{
          opacity: heroOp, transform: `scale(${heroScale})`,
          background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
          padding: "16px 20px", marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{data.heroStat.label}</div>
          <div style={{
            fontSize: 52, fontWeight: 900, color: data.heroStat.color,
            textShadow: `0 0 ${24 * heroGlow}px ${data.heroStat.color}66`,
          }}>
            {Math.round(heroEased * data.heroStat.value).toLocaleString()}
          </div>
          {data.heroStat.subtitle && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{data.heroStat.subtitle}</div>
          )}
          <div style={{ marginTop: 10, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{
              height: "100%", width: `${heroEased * 72}%`, borderRadius: 2,
              background: `linear-gradient(90deg, ${ORANGE}, ${RED})`,
              boxShadow: `0 0 8px ${RED}44`,
            }} />
          </div>
        </div>
      )}

      <div style={{
        opacity: tableOp, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "14px 16px", flex: 1, overflow: "hidden", position: "relative",
      }}>
        <TableScan />
        <div style={{
          display: "flex", fontSize: 12, color: "rgba(255,255,255,0.3)",
          padding: "4px 0", borderBottom: `1px solid ${BORDER}`, marginBottom: 4,
        }}>
          {data.table.columns.map((col, i) => (
            <div key={col} style={{ flex: i === 0 ? 1 : undefined, width: i > 0 ? 90 : undefined,
              textAlign: i > 0 ? "center" : "left" }}>{col}</div>
          ))}
        </div>
        {data.table.rows.map((row, i) => {
          const rowDelay = 24 + i * 8;
          const rowP = spring({ frame: Math.max(0, frame - rowDelay), fps, config: { damping: 16 } });
          const rowOp = interpolate(rowP, [0, 1], [0, 1]);
          const rowX = interpolate(rowP, [0, 1], [-20, 0]);
          const scanRow = Math.floor(((frame - 50) % Math.max(rowCount * 14, 1)) / 14);
          const isActive = scanRow === i && frame > 50;
          const rowColor = row.color || TEAL;
          return (
            <div key={i} style={{
              opacity: rowOp, transform: `translateX(${rowX}px)`,
              display: "flex", alignItems: "center",
              padding: "8px 4px", borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: isActive ? `${rowColor}08` : "transparent", borderRadius: 4,
            }}>
              {isActive && (
                <div style={{
                  width: 3, height: 18, borderRadius: 2, background: rowColor,
                  marginRight: 8, flexShrink: 0, boxShadow: `0 0 8px ${rowColor}`,
                }} />
              )}
              {row.cells.map((cell, ci) => (
                <div key={ci} style={{
                  flex: ci === 0 ? 1 : undefined, width: ci > 0 ? 90 : undefined,
                  textAlign: ci > 0 ? "center" : "left",
                  fontSize: ci === 0 ? 17 : 15, fontWeight: ci === 0 ? 600 : 700,
                  color: ci === 0 ? "#fff" : (row.color || "rgba(255,255,255,0.6)"),
                }}>
                  {cell}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {data.title && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontSize: 32, fontWeight: 900 }}>
            {data.title.coloredWords
              ? data.title.text.split(" ").map((word, i) => {
                  const colored = data.title!.coloredWords?.find(cw => cw.word.toLowerCase() === word.toLowerCase());
                  const hueShift = colored ? shimmer * 20 : 0;
                  return (
                    <span key={i} style={{
                      color: colored ? colored.color : "#fff",
                      textShadow: colored ? `0 0 16px ${colored.color}55` : undefined,
                    }}>{word} </span>
                  );
                })
              : <span style={{ color: "#fff" }}>{data.title.text}</span>
            }
          </div>
        </div>
      )}
    </div>
  );
};
