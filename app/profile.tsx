import { getInitials } from "@/utils/getInitials";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaskedTextInput } from "react-native-mask-text";
import CheckBox from "../component/Checkbox";
import PrimaryButton from "../component/PrimaryButton";
import SecondaryButton from "../component/SecondaryButton";

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderStatuses, setOrderStatuses] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("userProfile");
        if (userProfile) {
          const profileData = JSON.parse(userProfile);
          setFirstName(profileData.firstName || "");
          setLastName(profileData.lastName || "");
          setEmail(profileData.email || "");
          setPhoneNumber(profileData.phoneNumber || "");
          setProfilePhoto(profileData.profilePhoto || "");

          if (profileData.emailNotifications) {
            setOrderStatuses(
              profileData.emailNotifications.orderStatuses || false
            );
            setPasswordChanges(
              profileData.emailNotifications.passwordChanges || false
            );
            setSpecialOffers(
              profileData.emailNotifications.specialOffers || false
            );
            setNewsletter(profileData.emailNotifications.newsletter || false);
          }
        }
      } catch (err) {
        console.error("Unable to get user details from async storage", err);
      }
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const toggleNotifications = (key: string) => {
    switch (key) {
      case "order statuses":
        setOrderStatuses(!orderStatuses);
        break;
      case "password changes":
        setPasswordChanges(!passwordChanges);
        break;
      case "special offers":
        setSpecialOffers(!specialOffers);
        break;
      case "newsletter":
        setNewsletter(!newsletter);
        break;
      default:
        break;
    }
  };

  const saveUserDetails = async () => {
    try {
      const userProfile = {
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePhoto,
        emailNotifications: {
          orderStatuses,
          passwordChanges,
          specialOffers,
          newsletter,
        },
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Failed to save user details", err);
    }
  };

  const onLogoutClick = async () => {
    try {
      await AsyncStorage.removeItem("userProfile");
      router.replace("./onboarding");
    } catch (err) {
      console.error("Failed to clear async storage", err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <View style={styles.headerAvatarPlaceholder}>
                <Text style={styles.headerAvatarPlaceholderText}>
                  {getInitials(firstName, lastName)}
                </Text>
              </View>
            ),
        }}
      />

      <KeyboardAwareScrollView
        style={styles.background}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../assets/images/lemon-background.png")}
          resizeMode="center"
          style={styles.container}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>Personal information </Text>
            <Text style={styles.textLabel}>Avatar</Text>
            <View style={styles.profilePicContainer}>
              {profilePhoto ? (
                <Image
                  style={styles.avatarImage}
                  source={{ uri: profilePhoto }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {getInitials(firstName, lastName)}
                  </Text>
                </View>
              )}
              <SecondaryButton name="Change" onClick={pickImage} />
              <SecondaryButton
                name="Remove"
                onClick={() => setProfilePhoto("")}
                backgroundColor="#EDEFEE"
                fontColor="#495E57"
                borderColor="#495E57"
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.textLabel}>First name:</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName}
              />
              <Text style={styles.textLabel}>Last name:</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
              />
              <Text style={styles.textLabel}>Email:</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
              />
              <Text style={styles.textLabel}>Phone number:</Text>
              <MaskedTextInput
                style={styles.textInput}
                mask="+(999) 999-9999"
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={setPhoneNumber}
              />
            </View>
            <Text style={styles.title}>Email notifications</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                label="Order statuses"
                isChecked={orderStatuses}
                setChecked={() => toggleNotifications("order statuses")}
              />
              <CheckBox
                label="Password changes"
                isChecked={passwordChanges}
                setChecked={() => toggleNotifications("password changes")}
              />
              <CheckBox
                label="Special offers"
                isChecked={specialOffers}
                setChecked={() => toggleNotifications("special offers")}
              />
              <CheckBox
                label="Newsletter"
                isChecked={newsletter}
                setChecked={() => toggleNotifications("newsletter")}
              />
            </View>
            <PrimaryButton label="Log out" onClick={onLogoutClick} />
            <View style={styles.changeContainer}>
              <SecondaryButton
                name="Discard changes"
                onClick={() => {}}
                backgroundColor="#EDEFEE"
                fontColor="#495E57"
                borderColor="#495E57"
              />
              <SecondaryButton name="Save changes" onClick={saveUserDetails} />
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#edefeef8",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontFamily: "Karla-Regular",
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 10,
  },
  profilePicContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginEnd: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#26abb4ff",
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 20,
  },
  avatarPlaceholderText: {
    fontSize: 32,
    fontFamily: "Karla-Regular",
    color: "#EDEFEE",
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
  formContainer: {
    marginTop: 20,
  },
  textLabel: {
    marginBottom: 5,
    fontFamily: "Karla-Regular",
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 20,
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  changeContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
export default Profile;
