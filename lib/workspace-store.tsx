"use client";

import {
  accessories,
  chairs,
  desks,
  type Vibe,
} from "./catalog";
import {
  getDuration,
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
  type Dispatch,
  type ReactNode,
} from "react";

export type WorkspaceState = {
  deskId: string;
  chairId: string;
  accessories: Record<string, number>;
  vibe: Vibe;
  duration: RentalDuration;
};

type WorkspaceAction =
  | { type: "hydrate"; state: WorkspaceState }
  | { type: "selectDesk"; id: string }
  | { type: "selectChair"; id: string }
  | { type: "addAccessory"; id: string }
  | { type: "removeAccessory"; id: string }
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

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function reducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
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
      const randomAccessories = accessories.reduce<Record<string, number>>(
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
        vibe: pick(["morning", "sunset", "night"] as Vibe[]),
      };
    }
    case "reset":
      return defaultWorkspace;
    default:
      return state;
  }
}

type WorkspaceContextValue = {
  state: WorkspaceState;
  dispatch: Dispatch<WorkspaceAction>;
  selectDesk: (id: string) => void;
  selectChair: (id: string) => void;
  addAccessory: (id: string) => void;
  removeAccessory: (id: string) => void;
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
  const [state, dispatch] = useReducer(reducer, defaultWorkspace);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WorkspaceState>;
        if (parsed.deskId && parsed.chairId && parsed.accessories) {
          const validAccessories = Object.entries(parsed.accessories).reduce<
            Record<string, number>
          >((result, [id, quantity]) => {
            const accessory = accessories.find((item) => item.id === id);
            if (accessory && typeof quantity === "number" && quantity > 0) {
              result[id] = Math.min(quantity, accessory.maxQty);
            }
            return result;
          }, {});
          dispatch({
            type: "hydrate",
            state: {
              deskId: desks.some((item) => item.id === parsed.deskId)
                ? parsed.deskId
                : defaultWorkspace.deskId,
              chairId: chairs.some((item) => item.id === parsed.chairId)
                ? parsed.chairId
                : defaultWorkspace.chairId,
              accessories: validAccessories,
              vibe:
                parsed.vibe === "morning" ||
                parsed.vibe === "sunset" ||
                parsed.vibe === "night"
                  ? parsed.vibe
                  : defaultWorkspace.vibe,
              duration:
                parsed.duration && getDuration(parsed.duration)
                  ? parsed.duration
                  : defaultWorkspace.duration,
            },
          });
        }
      }
    } catch {
      // An unavailable or malformed local preference should not block the builder.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const selectDesk = useCallback((id: string) => dispatch({ type: "selectDesk", id }), []);
  const selectChair = useCallback(
    (id: string) => dispatch({ type: "selectChair", id }),
    [],
  );
  const addAccessory = useCallback(
    (id: string) => dispatch({ type: "addAccessory", id }),
    [],
  );
  const removeAccessory = useCallback(
    (id: string) => dispatch({ type: "removeAccessory", id }),
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
      (sum, quantity) => sum + quantity,
      0,
    );
    return {
      state,
      dispatch,
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

