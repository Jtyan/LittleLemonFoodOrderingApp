import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const IMAGE_BASE_URL =
  "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/";


  const db = await SQLite.openDatabaseAsync('little_lemon.db')
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

  const hasDecimalCheck = (price: string) => {
    if (Number(price) % 1 != 0) {
        return `$${price}`
    } else {
        return `$${price}.00`
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();

        const transformedData = json.menu.map((item: RawMenuItem) => ({
          id: item.name + item.category,
          name: item.name,
          price: hasDecimalCheck(item.price),
          description: item.description,
          category: item.category,
          image: `${IMAGE_BASE_URL}${item.image}?raw=true`
        }));
        setMenu(transformedData)
      } catch (e) {
        console.error("Failed to fetch menu: ", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return { menu, isLoading, isError };
};
