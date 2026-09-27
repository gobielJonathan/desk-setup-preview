"use client";

import dynamic from "next/dynamic";

const Workspace3D = dynamic(() => import("./Workspace3D"), {
  ssr: false,
  loading: () => (
    <div className="workspace-scene workspace-scene--3d workspace-scene--loading">
      <div className="scene-loading-orb" />
      <span>Setting the table...</span>
    </div>
  ),
});

export function WorkspaceScene({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return <Workspace3D compact={compact} className={className} />;
}
