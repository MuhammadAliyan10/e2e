"use client";

export function WorkflowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0f1419]" />

      {/* Dot pattern layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(15, 20, 25, 0.4) 100%)",
        }}
      />
    </div>
  );
}
