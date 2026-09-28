import { accessoryById, chairById, deskById } from "./catalog";

export type RentalDuration = "week" | "month" | "quarter" | "season";

export type DurationOption = {
  id: RentalDuration;
  label: string;
  shortLabel: string;
  months: number;
  multiplier: number;
  discount: number;
  hint: string;
};

export const durationOptions: DurationOption[] = [
  {
    id: "week",
    label: "1 week",
    shortLabel: "Week",
    months: 0.25,
    multiplier: 0.35,
    discount: 0,
    hint: "Try it out",
  },
  {
    id: "month",
    label: "1 month",
    shortLabel: "Month",
    months: 1,
    multiplier: 1,
    discount: 0,
    hint: "Most flexible",
  },
  {
    id: "quarter",
    label: "3 months",
    shortLabel: "Quarter",
    months: 3,
    multiplier: 0.9,
    discount: 0.1,
    hint: "Save 10%",
  },
  {
    id: "season",
    label: "6 months",
    shortLabel: "Season",
    months: 6,
    multiplier: 0.8,
    discount: 0.2,
    hint: "Save 20%",
  },
];

export type QuoteSelection = {
  deskId: string;
  chairId: string;
  accessories: Record<string, number>;
};

export type QuoteLineItem = {
  id: string;
  name: string;
  detail: string;
  quantity: number;
  monthlyPrice: number;
  total: number;
};

export type Quote = {
  duration: DurationOption;
  lineItems: QuoteLineItem[];
  itemCount: number;
  monthlySubtotal: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

export function getDuration(id: RentalDuration): DurationOption {
  return durationOptions.find((option) => option.id === id) ?? durationOptions[1];
}

export function computeQuote(
  selection: QuoteSelection,
  durationId: RentalDuration,
): Quote {
  const duration = getDuration(durationId);
  const chargeableMonths = getChargeableMonths(duration);
  const desk = deskById(selection.deskId);
  const chair = chairById(selection.chairId);
  const rawItems = [
    {
      id: desk.id,
      name: desk.name,
      detail: "Desk",
      quantity: 1,
      monthlyPrice: desk.monthlyPrice,
    },
    {
      id: chair.id,
      name: chair.name,
      detail: "Chair",
      quantity: 1,
      monthlyPrice: chair.monthlyPrice,
    },
    ...Object.entries(selection.accessories).flatMap(([id, quantity]) => {
      const accessory = accessoryById(id);
      if (!accessory || quantity <= 0) return [];
      return [
        {
          id: accessory.id,
          name: accessory.name,
          detail: "Accessory",
          quantity,
          monthlyPrice: accessory.monthlyPrice,
        },
      ];
    }),
  ];

  const monthlySubtotal = rawItems.reduce(
    (sum, item) => sum + item.monthlyPrice * item.quantity,
    0,
  );
  const subtotal = Math.round(monthlySubtotal * chargeableMonths * 100) / 100;
  const discount = Math.round(subtotal * duration.discount * 100) / 100;
  const deliveryFee = durationId === "week" || durationId === "month" ? 18 : 0;
  const total = Math.round((subtotal - discount + deliveryFee) * 100) / 100;

  return {
    duration,
    lineItems: rawItems.map((item) => ({
      ...item,
      total:
        Math.round(item.monthlyPrice * item.quantity * chargeableMonths * (1 - duration.discount) * 100) /
        100,
    })),
    itemCount: rawItems.reduce((sum, item) => sum + item.quantity, 0),
    monthlySubtotal,
    subtotal,
    discount,
    deliveryFee,
    total,
  };
}

function getChargeableMonths(duration: DurationOption) {
  return duration.id === "week" ? duration.multiplier : duration.months;
}

