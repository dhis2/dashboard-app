import reducer, { actionTypes } from "../dashboards";
import * as utils from "../../util";

describe("dashboards reducer", () => {
  it("should set the list of dashboards", () => {
    expect(1).toEqual(1);
  });

  it("should return the default state", () => {
    const actualState = reducer(undefined, { type: "NO_MATCH" });

    expect(actualState).toEqual([]);
  });

  it("should return the list of dashboards", () => {
    const expectedState = [1];

    utils.validateReducer = jest.fn();
    utils.validateReducer.mockReturnValue(expectedState);

    const actualState = reducer(undefined, {
      type: actionTypes.SET_DASHBOARDS,
      dashboards: expectedState
    });

    expect(actualState).toEqual(expectedState);
  });
});
