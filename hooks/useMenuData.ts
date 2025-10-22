import { getMenuFromDb, initDatabase, saveMenuinDb } from "@/database/database";
import { useEffect, useState } from "react";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const IMAGE_BASE_URL =
  "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/";

type RawMenuItem = {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
};

export type MenuItemType = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
};

export const useMenuData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [menu, setMenu] = useState<MenuItemType[]>([]);

  const formatPrice = (price: string) => {
    const priceNum = parseFloat(price);
    return `$${priceNum.toFixed(2)}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await initDatabase();
        const database = await getMenuFromDb();
        if (database.length > 0) {
          setMenu(database);
        } else {
          const response = await fetch(API_URL);
          const json = await response.json();

          const transformedData = json.menu.map(
            (item: RawMenuItem, index: number) => ({
              id: index + 1,
              name: item.name,
              price: formatPrice(item.price),
              description: item.description,
              category: item.category,
              image: `${IMAGE_BASE_URL}${item.image}?raw=true`,
            })
          );
          setMenu(transformedData);
          await saveMenuinDb(transformedData);
        }
      } catch (e) {
        console.error("Failed to fetch menu: ", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  return { menu, setMenu, isLoading, isError };
};
