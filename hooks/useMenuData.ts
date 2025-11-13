import { getMenuFromDb, initDatabase, saveMenuinDb } from "@/database/database";
import { supabase } from "@/lib/supabase";
import { MenuItemType } from "@/types/menuItemType";
import { useEffect, useState } from "react";

export const useMenuData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [menu, setMenu] = useState<MenuItemType[]>([]);

  const fetchMenuFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from("menu_items").select("*");
      if (error) {
        console.error("Error fetching Menu", error);
        throw error;
      } else {
        setMenu(data);
        await saveMenuinDb(data);
      }
    } catch (error) {
      console.error("fetchMenuFromSupabase: Failed to fetch Menu", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await initDatabase();
        const database = await getMenuFromDb();
        if (database.length > 0) {
          setMenu(database);
        } else {
          await fetchMenuFromSupabase();
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
