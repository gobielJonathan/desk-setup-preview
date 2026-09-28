import { describe, expect, it } from "vitest";
import { computeQuote } from "../lib/pricing";

const selection = {
  deskId: "sunrise-standing",
  chairId: "cloud-mesh",
  accessories: {
    "halo-monitor": 1,
    "arc-lamp": 1,
    "desk-sprout": 1,
    "soft-rug": 1,
  },
};

describe("computeQuote", () => {
  it("uses the configured 35% multiplier for a weekly rental", () => {
    const quote = computeQuote(selection, "week");

    expect(quote.monthlySubtotal).toBe(168);
    expect(quote.subtotal).toBe(58.8);
    expect(quote.discount).toBe(0);
    expect(quote.deliveryFee).toBe(18);
    expect(quote.total).toBe(76.8);
    expect(quote.lineItems[0].total).toBe(23.8);
  });

  it("preserves long-stay discounts and line-item totals", () => {
    const quote = computeQuote(selection, "quarter");

    expect(quote.subtotal).toBe(504);
    expect(quote.discount).toBe(50.4);
    expect(quote.total).toBe(453.6);
    expect(quote.deliveryFee).toBe(0);
    expect(quote.lineItems[0].total).toBe(183.6);
  });
});
