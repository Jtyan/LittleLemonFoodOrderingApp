import Banner from "@/component/Banner";
import CategoryList from "@/component/CategoryList";
import Loading from "@/component/Loading";
import MenuItem from "@/component/MenuItem";
import { filterByQueryAndCategories } from "@/database/database";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useMenuData } from "@/hooks/useMenuData";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { getInitials } from "@/utils/getInitials";
import { router, Stack, useFocusEffect } from "expo-router";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { MenuItemType } from "../types/menuItemType";

const categories = ["Starters", "Mains", "Desserts", "Drinks", "Specials"];

export default function Home() {
  const [searchbarText, setSearchbarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelection, setFilterSelection] = useState(
    categories.map(() => false)
  );
  const { profile, refetch } = useGetUserProfile();
  const {
    menu,
    setMenu,
    isLoading: menuIsLoading,
    isError: menuIsError,
  } = useMenuData();
  const { firstName, lastName, profilePhoto } = profile || {};

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useUpdateEffect(() => {
    const searchAndFilterMenu = async () => {
      const activeCategories = categories.filter((s, i) => {
        if (filterSelection.every((item) => item === false)) {
          return true;
        }
        return filterSelection[i];
      });
      try {
        const menuList = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        console.log(
          `query: ${query}, activeCat: ${activeCategories}, menulist: ${menuList}`
        );
        setMenu(menuList);
      } catch (err) {
        console.error(
          "SearchAndFilterMenu: Failed to get filtered menu list",
          err
        );
      }
    };
    searchAndFilterMenu();
  }, [filterSelection, query]);

  const lookup = useCallback((query: string) => {
    setQuery(query);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text: string) => {
    setSearchbarText(text);
    debouncedLookup(text);
  };

  if (menuIsLoading) {
    return <Loading />;
  }

  if (menuIsError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Oops, something went wrong!</Text>
        <Text>Could not load your data.</Text>
      </View>
    );
  }

  const profileHeader = () => {
    if (profile && profilePhoto) {
      return (
        <Pressable onPress={() => router.navigate("/profile")}>
          <Image
            source={{ uri: profilePhoto }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </Pressable>
      );
    } else if (profile) {
      return (
        <Pressable onPress={() => router.navigate("/profile")}>
          <View style={styles.headerAvatarPlaceholder}>
            <Text style={styles.headerAvatarPlaceholderText}>
              {getInitials(firstName, lastName)}
            </Text>
          </View>
        </Pressable>
      );
    } else {
      return (
        <Pressable onPress={() => router.navigate("/signIn")}>
          <Image
            source={require("../assets/images/add-user.png")}
            style={{ width: 30, height: 30, tintColor: "#495E57" }}
            accessibilityLabel="Signup/Login"
          />
        </Pressable>
      );
    }
  };

  const renderItem = ({ item }: { item: MenuItemType }) => (
    <MenuItem
      name={item.name}
      price={item.price}
      description={item.description}
      image={item.image}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: profileHeader,
          headerBackVisible: false,
        }}
      />
      <View style={styles.container}>
        <Banner />
        <View style={styles.searchbarBackground}>
          <Searchbar
            style={styles.searchbar}
            value={searchbarText}
            placeholder="Search"
            placeholderTextColor="#495E57"
            inputStyle={{ alignSelf: "center" }}
            onChangeText={handleSearchChange}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View>
            <Text style={styles.subHeading}>ORDER FOR DELIVERY!</Text>
          </View>
          <View>
            <CategoryList
              category={categories}
              selection={filterSelection}
              setFilterSelection={setFilterSelection}
            />
          </View>
          {menu.length > 0 ? (
            <View style={styles.flatListContainer}>
              <FlatList
                data={menu}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <Text style={styles.emptyMenuText}>No menu item available</Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#26abb4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarPlaceholderText: {
    fontSize: 20,
    fontFamily: "Karla-Regular",
    color: "#EDEFEE",
  },
  searchbarBackground: {
    backgroundColor: "#495E57",
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  searchbar: {
    height: 40,
    fontFamily: "Karla-Regular",
    color: "#495E57",
  },
  subHeading: {
    fontFamily: "Karla-ExtraBold",
    fontSize: 20,
    marginVertical: 10,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flatListContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#495e572d",
  },
  emptyMenuText: {
    alignSelf: "center",
    padding: 20,
    fontFamily: "Karla-Regular",
    color: "#495E57",
  },
});
