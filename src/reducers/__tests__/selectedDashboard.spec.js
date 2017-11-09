import reducer, {
  actionTypes,
  sGetSelectedDashboardFromState,
  sGetSelectedDashboardItems
} from "../selectedDashboard";

describe("selected dashboard reducer", () => {
  it("should set the selected dashboard", () => {
    const selectedDash = "my favorite dashboard";
    const actualState = reducer(undefined, {
      type: actionTypes.SET_SELECTEDDASHBOARD,
      value: selectedDash
    });

    expect(actualState).toEqual(selectedDash);
  });

  it("should return null as the default selected dashboard", () => {
    const actualState = reducer(undefined, { type: "NO_MATCH" });

    expect(actualState).toEqual(null);
  });

  describe("selectors", () => {
    it("should get the selected dashboard", () => {
      const dash = { name: "my favorite dashboard" };
      const state = {
        selectedDashboard: dash
      };

      const actual = sGetSelectedDashboardFromState(state);
      expect(actual).toEqual(dash);
    });

    it("should return an array of selected dashboard items", () => {
      const dash = {
        name: "my favorite dashboard",
        dashboardItems: ["abc", "def"]
      };
      const state = {
        selectedDashboard: dash
      };

      const actual = sGetSelectedDashboardItems(state);
      expect(actual).toEqual(dash.dashboardItems);
    });

    it("should return an empty array if no dashboardItems", () => {
      const dash = {
        name: "my favorite dashboard"
      };
      const state = {
        selectedDashboard: dash
      };

      const actual = sGetSelectedDashboardItems(state);
      expect(actual).toEqual([]);
    });
  });
});
