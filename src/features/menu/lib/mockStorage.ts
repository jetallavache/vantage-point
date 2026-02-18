import { MenuItemFlat } from "../model/types";

const STORAGE_KEY = "vantage_point_menu_items";

export const mockMenuStorage = {
  getItems: (typeId: string): MenuItemFlat[] => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${typeId}`);
    return stored ? JSON.parse(stored) : [];
  },

  setItems: (typeId: string, items: MenuItemFlat[]): void => {
    localStorage.setItem(`${STORAGE_KEY}_${typeId}`, JSON.stringify(items));
  },

  addItem: (typeId: string, item: MenuItemFlat): MenuItemFlat => {
    const items = mockMenuStorage.getItems(typeId);
    items.push(item);
    mockMenuStorage.setItems(typeId, items);
    return item;
  },

  updateItem: (typeId: string, updatedItem: MenuItemFlat): MenuItemFlat => {
    const items = mockMenuStorage.getItems(typeId);
    const index = items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      mockMenuStorage.setItems(typeId, items);
    }
    return updatedItem;
  },

  removeItem: (typeId: string, itemId: string): void => {
    const items = mockMenuStorage.getItems(typeId);
    const filtered = items.filter((item) => item.id !== itemId);
    mockMenuStorage.setItems(typeId, filtered);
  },

  clearItems: (typeId: string): void => {
    localStorage.removeItem(`${STORAGE_KEY}_${typeId}`);
  },
};
