"use client";

import {
  accessories,
  chairs,
  desks,
  type AccessoryId,
  type ChairId,
  type DeskId,
  type Vibe,
} from "./catalog";
import {
  durationOptions,
  type RentalDuration,
} from "./pricing";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

export type WorkspaceState = {
  deskId: DeskId;
  chairId: ChairId;
  accessories: Partial<Record<AccessoryId, number>>;
  vibe: Vibe;
  duration: RentalDuration;
};

export type WorkspaceAction =
  | { type: "hydrate"; state: WorkspaceState }
  | { type: "selectDesk"; id: DeskId }
  | { type: "selectChair"; id: ChairId }
  | { type: "addAccessory"; id: AccessoryId }
  | { type: "removeAccessory"; id: AccessoryId }
  | { type: "setVibe"; vibe: Vibe }
  | { type: "setDuration"; duration: RentalDuration }
  | { type: "randomize" }
  | { type: "reset" };

const STORAGE_KEY = "nomad-workspace-selection";

export const defaultWorkspace: WorkspaceState = {
  deskId: desks[0].id,
  chairId: chairs[0].id,
  accessories: {
    "halo-monitor": 1,
    "arc-lamp": 1,
    "desk-sprout": 1,
    "soft-rug": 1,
  },
  vibe: "sunset",
  duration: "month",
};

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "selectDesk":
      return { ...state, deskId: action.id };
    case "selectChair":
      return { ...state, chairId: action.id };
    case "addAccessory": {
      const accessory = accessories.find((item) => item.id === action.id);
      if (!accessory) return state;
      const current = state.accessories[action.id] ?? 0;
      if (current >= accessory.maxQty) return state;
      return {
        ...state,
        accessories: { ...state.accessories, [action.id]: current + 1 },
      };
    }
    case "removeAccessory": {
      const current = state.accessories[action.id] ?? 0;
      if (current <= 0) return state;
      const nextAccessories = { ...state.accessories };
      if (current === 1) {
        delete nextAccessories[action.id];
      } else {
        nextAccessories[action.id] = current - 1;
      }
      return { ...state, accessories: nextAccessories };
    }
    case "setVibe":
      return { ...state, vibe: action.vibe };
    case "setDuration":
      return { ...state, duration: action.duration };
    case "randomize": {
      const randomAccessories = accessories.reduce<Partial<Record<AccessoryId, number>>>(
        (result, accessory) => {
          if (Math.random() > 0.52) {
            result[accessory.id] = 1;
          }
          return result;
        },
        {},
      );
      return {
        ...state,
        deskId: pick(desks).id,
        chairId: pick(chairs).id,
        accessories: randomAccessories,
        vibe: pick(["morning", "sunset", "night"] as const),
      };
    }
    case "reset":
      return defaultWorkspace;
    default:
      return state;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDeskId(value: unknown): value is DeskId {
  return typeof value === "string" && desks.some((desk) => desk.id === value);
}

function isChairId(value: unknown): value is ChairId {
  return typeof value === "string" && chairs.some((chair) => chair.id === value);
}

function isAccessoryId(value: string): value is AccessoryId {
  return accessories.some((accessory) => accessory.id === value);
}

function isVibe(value: unknown): value is Vibe {
  return value === "morning" || value === "sunset" || value === "night";
}

function isRentalDuration(value: unknown): value is RentalDuration {
  return typeof value === "string" && durationOptions.some((option) => option.id === value);
}

export function normalizeWorkspace(value: unknown): WorkspaceState {
  const parsed = isRecord(value) ? value : {};
  const parsedAccessories = isRecord(parsed.accessories)
    ? parsed.accessories
    : defaultWorkspace.accessories;
  const validAccessories = Object.entries(parsedAccessories).reduce<
    Partial<Record<AccessoryId, number>>
  >((result, [id, quantity]) => {
    if (!isAccessoryId(id)) return result;
    const accessory = accessories.find((item) => item.id === id);
    if (accessory && typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0) {
      result[id] = Math.min(quantity, accessory.maxQty);
    }
    return result;
  }, {});

  return {
    deskId: isDeskId(parsed.deskId) ? parsed.deskId : defaultWorkspace.deskId,
    chairId: isChairId(parsed.chairId) ? parsed.chairId : defaultWorkspace.chairId,
    accessories: validAccessories,
    vibe: isVibe(parsed.vibe) ? parsed.vibe : defaultWorkspace.vibe,
    duration: isRentalDuration(parsed.duration) ? parsed.duration : defaultWorkspace.duration,
  };
}

type WorkspaceContextValue = {
  state: WorkspaceState;
  selectDesk: (id: DeskId) => void;
  selectChair: (id: ChairId) => void;
  addAccessory: (id: AccessoryId) => void;
  removeAccessory: (id: AccessoryId) => void;
  setVibe: (vibe: Vibe) => void;
  setDuration: (duration: RentalDuration) => void;
  randomize: () => void;
  reset: () => void;
  accessoryCount: number;
  selectedAccessoryCount: number;
  hydrated: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, defaultWorkspace);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: "hydrate", state: normalizeWorkspace(JSON.parse(saved)) });
      }
    } catch {
      // An unavailable or malformed local preference should not block the builder.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // An unavailable storage backend should not block the builder.
      }
    }
  }, [hydrated, state]);

  const selectDesk = useCallback(
    (id: DeskId) => dispatch({ type: "selectDesk", id }),
    [],
  );
  const selectChair = useCallback(
    (id: ChairId) => dispatch({ type: "selectChair", id }),
    [],
  );
  const addAccessory = useCallback(
    (id: AccessoryId) => dispatch({ type: "addAccessory", id }),
    [],
  );
  const removeAccessory = useCallback(
    (id: AccessoryId) => dispatch({ type: "removeAccessory", id }),
    [],
  );
  const setVibe = useCallback(
    (vibe: Vibe) => dispatch({ type: "setVibe", vibe }),
    [],
  );
  const setDuration = useCallback(
    (duration: RentalDuration) => dispatch({ type: "setDuration", duration }),
    [],
  );
  const randomize = useCallback(() => dispatch({ type: "randomize" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<WorkspaceContextValue>(() => {
    const selectedAccessoryCount = Object.values(state.accessories).reduce(
      (sum, quantity) => sum + (quantity ?? 0),
      0,
    );
    return {
      state,
      selectDesk,
      selectChair,
      addAccessory,
      removeAccessory,
      setVibe,
      setDuration,
      randomize,
      reset,
      accessoryCount: Object.keys(state.accessories).length,
      selectedAccessoryCount,
      hydrated,
    };
  }, [
    state,
    selectDesk,
    selectChair,
    addAccessory,
    removeAccessory,
    setVibe,
    setDuration,
    randomize,
    reset,
    hydrated,
  ]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}

