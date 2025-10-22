import Banner from "@/component/Banner";
import MenuItem from "@/component/MenuItem";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { MenuItemType, useMenuData } from "@/hooks/useMenuData";
import { getInitials } from "@/utils/getInitials";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";

export default function Home() {
  const { isLoading: profileIsLoading, isError: profileIsError, profile, refetch } = useGetUserProfile();
  const { menu, isLoading: menuIsLoading, isError: menuIsError} = useMenuData()

  const { firstName, lastName, profilePhoto } = profile || {};

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (profileIsLoading || menuIsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (profileIsError || menuIsError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Oops, something went wrong!</Text>
        <Text>Could not load your data.</Text>
      </View>
    );
  }

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
          headerRight: () =>
            profilePhoto ? (
              <Pressable onPress={() => router.navigate("/profile")}>
                <Image
                  source={{ uri: profilePhoto }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => router.navigate("/profile")}>
                <View style={styles.headerAvatarPlaceholder}>
                  <Text style={styles.headerAvatarPlaceholderText}>
                    {getInitials(firstName, lastName)}
                  </Text>
                </View>
              </Pressable>
            ),
        }}
      />
      <View style={styles.container}>
        <Banner />
        <View style={styles.searchbarBackground}>
          <Searchbar style={styles.searchbar} value="" placeholder="Search" />
        </View>
        <View style={styles.bottomContainer}>
          <View>
            <Text style={styles.subHeading}>ORDER FOR DELIVERY!</Text>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              data={menu}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
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
  },
  subHeading: {
    fontFamily: "Karla-ExtraBold",
    fontSize: 20,
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
});
