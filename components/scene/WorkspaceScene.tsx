"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";

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
  return (
    <WorkspaceSceneBoundary compact={compact}>
      <Workspace3D compact={compact} className={className} />
    </WorkspaceSceneBoundary>
  );
}

class WorkspaceSceneBoundary extends Component<
  { children: ReactNode; compact: boolean },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`workspace-scene workspace-scene--3d workspace-scene--error ${this.props.compact ? "workspace-scene--compact" : ""}`} role="status">
          <strong>Preview unavailable</strong>
          <span>You can still finish your setup using the selection summary.</span>
        </div>
      );
    }

    return this.props.children;
  }
}
