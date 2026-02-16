import { describe, it, expect } from "vitest";
import { buildTree, flattenTree } from "../features/menu/lib/utils";
import { MenuItemFlat, MenuItemTree } from "../features/menu/model/types";

describe("Menu Utils", () => {
  describe("buildTree", () => {
    it("should build tree from flat list", () => {
      const flatList: MenuItemFlat[] = [
        { id: "1", name: "Root 1", parentId: null, sort: 0 },
        { id: "2", name: "Child 1", parentId: "1", sort: 0 },
        { id: "3", name: "Root 2", parentId: null, sort: 1 },
        { id: "4", name: "Child 2", parentId: "1", sort: 1 },
      ];

      const tree = buildTree(flatList);

      expect(tree).toHaveLength(2);
      expect(tree[0].name).toBe("Root 1");
      expect(tree[0].children).toHaveLength(2);
      expect(tree[1].name).toBe("Root 2");
      expect(tree[1].children).toHaveLength(0);
    });

    it("should handle empty list", () => {
      const tree = buildTree([]);
      expect(tree).toHaveLength(0);
    });
  });

  describe("flattenTree", () => {
    it("should flatten tree to structure data", () => {
      const tree: MenuItemTree[] = [
        {
          id: "1",
          name: "Root 1",
          sort: 0,
          children: [
            { id: "2", name: "Child 1", sort: 0 },
            { id: "3", name: "Child 2", sort: 1 },
          ],
        },
        { id: "4", name: "Root 2", sort: 1 },
      ];

      const flattened = flattenTree(tree);

      expect(flattened).toHaveLength(4);
      expect(flattened[0]).toEqual({ id: "1", parentId: null, sort: 0 });
      expect(flattened[1]).toEqual({ id: "2", parentId: "1", sort: 0 });
      expect(flattened[2]).toEqual({ id: "3", parentId: "1", sort: 1 });
      expect(flattened[3]).toEqual({ id: "4", parentId: null, sort: 1 });
    });

    it("should handle empty tree", () => {
      const flattened = flattenTree([]);
      expect(flattened).toHaveLength(0);
    });
  });
});
