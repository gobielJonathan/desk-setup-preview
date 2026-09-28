import { describe, expect, it } from "vitest";
import {
  defaultWorkspace,
  normalizeWorkspace,
  workspaceReducer,
} from "../lib/workspace-store";

describe("workspace state", () => {
  it("enforces accessory limits through reducer actions", () => {
    const addedOnce = workspaceReducer(defaultWorkspace, {
      type: "addAccessory",
      id: "halo-monitor",
    });
    const addedTwice = workspaceReducer(addedOnce, {
      type: "addAccessory",
      id: "halo-monitor",
    });

    expect(addedOnce.accessories["halo-monitor"]).toBe(2);
    expect(addedTwice).toEqual(addedOnce);
  });

  it("normalizes invalid persisted selections", () => {
    const state = normalizeWorkspace({
      deskId: "not-a-desk",
      chairId: "not-a-chair",
      accessories: {
        "halo-monitor": 99,
        "arc-lamp": 1.5,
        "unknown-item": 4,
        "soft-rug": -1,
      },
      vibe: "not-a-vibe",
      duration: "not-a-duration",
    });

    expect(state.deskId).toBe(defaultWorkspace.deskId);
    expect(state.chairId).toBe(defaultWorkspace.chairId);
    expect(state.accessories).toEqual({ "halo-monitor": 2 });
    expect(state.vibe).toBe(defaultWorkspace.vibe);
    expect(state.duration).toBe(defaultWorkspace.duration);
  });
});
