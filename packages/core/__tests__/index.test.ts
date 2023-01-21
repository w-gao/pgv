import { it, expect } from "vitest"
import { sum } from "@pgv/core"

it("should work", () => {
    expect(sum(1, 4)).toEqual(5)
})
