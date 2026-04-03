import { describe, expect, it } from "vitest";

import { getErrorState } from "../app/lib/error-state";

describe("getErrorState", () => {
  it("maps 404 to the informational state", () => {
    const state = getErrorState(404);

    expect(state).toEqual(
      expect.objectContaining({
        code: 404,
        title: "Page not found",
        variant: "info",
      }),
    );
  });

  it("maps 401 and 403 to the warning state", () => {
    expect(getErrorState(401)).toEqual(
      expect.objectContaining({
        code: 401,
        variant: "warning",
      }),
    );

    expect(getErrorState(403)).toEqual(
      expect.objectContaining({
        code: 403,
        variant: "warning",
      }),
    );
  });

  it("maps 500 and unknown codes to the danger state", () => {
    expect(getErrorState(500)).toEqual(
      expect.objectContaining({
        code: 500,
        variant: "danger",
      }),
    );

    expect(getErrorState(418)).toEqual(
      expect.objectContaining({
        code: 418,
        title: "Unexpected error",
        variant: "danger",
      }),
    );
  });
});
