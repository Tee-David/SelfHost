import { describe, expect, it } from "vitest";
import { integer, yes } from "../src/lib/hestia/types";

describe("Hestia response helpers", () => {
  it("normalizes integer fields", () => {
    expect(integer("42")).toBe(42);
    expect(integer(undefined)).toBe(0);
    expect(integer("not-a-number")).toBe(0);
  });

  it("only treats Hestia yes as enabled", () => {
    expect(yes("yes")).toBe(true);
    expect(yes("no")).toBe(false);
    expect(yes(undefined)).toBe(false);
  });
});
