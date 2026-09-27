import { accessories, type Accessory, type Desk } from "../../lib/catalog";

export type PlacedAccessory = {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  scale: number;
  zone: Accessory["zone"];
  index: number;
};

export function placeItems(
  desk: Desk,
  selection: Record<string, number>,
): PlacedAccessory[] {
  const selected = Object.entries(selection).flatMap(([id, quantity]) => {
    return Array.from({ length: quantity }, (_, index) => ({ id, index }));
  });

  const itemById = new Map<string, Accessory>(
    accessories.map((accessory) => [accessory.id, accessory]),
  );

  const deskItems = selected.filter(({ id }) => itemById.get(id)?.zone === "desk");
  const monitors = deskItems.filter(({ id }) =>
    ["halo-monitor", "wide-screen"].includes(id),
  );
  const otherDeskItems = deskItems.filter(
    ({ id }) => !["halo-monitor", "wide-screen"].includes(id),
  );
  const placed: PlacedAccessory[] = [];

  monitors.forEach(({ id, index }, position) => {
    const item = itemById.get(id);
    if (!item) return;
    const x = monitors.length === 1 ? 400 : position === 0 ? 320 : 480;
    placed.push({
      id,
      name: item.name,
      icon: item.icon,
      x,
      y: desk.id === "cloud-white" ? 221 : 224,
      scale: id === "wide-screen" ? 1.06 : 0.92,
      zone: item.zone,
      index,
    });
  });

  const deskSlots = [
    { x: 185, y: 271, scale: 0.82 },
    { x: 585, y: 270, scale: 0.8 },
    { x: 270, y: 274, scale: 0.7 },
    { x: 530, y: 273, scale: 0.7 },
  ];
  otherDeskItems.forEach(({ id, index }, position) => {
    const item = itemById.get(id);
    if (!item) return;
    const slot = deskSlots[position % deskSlots.length];
    placed.push({
      id,
      name: item.name,
      icon: item.icon,
      x: slot.x,
      y: slot.y,
      scale: slot.scale,
      zone: item.zone,
      index,
    });
  });

  selected
    .filter(({ id }) => itemById.get(id)?.zone === "wall")
    .forEach(({ id, index }) => {
      const item = itemById.get(id);
      if (!item) return;
      placed.push({
        id,
        name: item.name,
        icon: item.icon,
        x: 610,
        y: 115,
        scale: 1,
        zone: item.zone,
        index,
      });
    });

  selected
    .filter(({ id }) => itemById.get(id)?.zone === "floor")
    .forEach(({ id, index }, position) => {
      const item = itemById.get(id);
      if (!item) return;
      const slot = id === "soft-rug"
        ? { x: 397, y: 425, scale: 1.15 }
        : { x: 690 - position * 112, y: 390, scale: 0.98 };
      placed.push({
        id,
        name: item.name,
        icon: item.icon,
        x: slot.x,
        y: slot.y,
        scale: slot.scale,
        zone: item.zone,
        index,
      });
    });

  return placed;
}

