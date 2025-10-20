"use client";

export function WorkflowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Base dark background - matches image */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />

      {/* Dot pattern layer - lighter dots with wider spacing */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Optional: Very subtle vignette for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.3) 100%)",
        }}
      />
    </div>
  );
}
