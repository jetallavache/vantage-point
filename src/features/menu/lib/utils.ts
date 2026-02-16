import { MenuItemTree, MenuItemFlat } from "../model/types";

export function buildTree(flatList: MenuItemFlat[]): MenuItemTree[] {
  const itemMap = new Map<string, MenuItemTree>();
  const rootItems: MenuItemTree[] = [];

  // Create map of all items
  flatList.forEach((item) => {
    itemMap.set(item.id, {
      ...item,
      children: [],
    });
  });

  // Build tree structure
  flatList.forEach((item) => {
    const treeItem = itemMap.get(item.id)!;

    if (item.parentId && itemMap.has(item.parentId)) {
      const parent = itemMap.get(item.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(treeItem);
    } else {
      rootItems.push(treeItem);
    }
  });

  // Sort items by sort field
  const sortItems = (items: MenuItemTree[]) => {
    items.sort((a, b) => a.sort - b.sort);
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortItems(item.children);
      }
    });
  };

  sortItems(rootItems);
  return rootItems;
}

export function flattenTree(
  tree: MenuItemTree[]
): Array<{ id: string; parentId: string | null; sort: number }> {
  const result: Array<{ id: string; parentId: string | null; sort: number }> =
    [];

  const traverse = (items: MenuItemTree[], parentId: string | null = null) => {
    items.forEach((item, index) => {
      result.push({
        id: item.id,
        parentId,
        sort: index,
      });

      if (item.children && item.children.length > 0) {
        traverse(item.children, item.id);
      }
    });
  };

  traverse(tree);
  return result;
}
