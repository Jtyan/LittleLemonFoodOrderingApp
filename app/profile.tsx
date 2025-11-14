import Loading from "@/component/Loading";
import PrimaryButton from "@/component/PrimaryButton";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { signOut, updateProfile } from "@/lib/auth/auth";
import { getInitials } from "@/utils/getInitials";
import { validateEmail, validateName } from "@/utils/isInputValid";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
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
import SecondaryButton from "../component/SecondaryButton";

const Profile = () => {
  const { profile, isLoading: getUserLoading, isError, refetch } = useGetUserProfile();
  const [isLoading, setIsLoading] = useState(false);

  if (getUserLoading && !profile) {
    return <Loading />;
  }

  if(isError) {
    router.replace('/signIn')
    return <Loading/>;
  }

  const pickImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("profilePhoto", result.assets[0].uri);
    }
  };

  const saveUserDetails = async (values: any) => {
    try {
      if (!validateName(values.firstName) || !validateEmail(values.email)) {
        Alert.alert("Error", "First name and email must be valid.");
        return;
      }

      const { error } = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        profilePhoto: values.profilePhoto,
        emailNotifications: {
          orderStatuses: values.orderStatuses,
          passwordChanges: values.passwordChanges,
          specialOffers: values.specialOffers,
          newsletter: values.newsletter,
        },
      });

      if (error) {
        Alert.alert("Error", "Failed to save profile. Please try again.");
        console.error("Failed to save user details", error);
      } else {
        await refetch()
        Alert.alert("Success", "Profile saved successfully!");
      }
    } catch (err) {
      console.error("Failed to save user details", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  const onLogoutClick = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        Alert.alert("Error", "Failed to log out. Please try again.");
        console.error("Failed to log out", error);
      } else {
        router.replace("/home");
      }
    } catch (err) {
      console.error("Failed to log out", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        profilePhoto: profile?.profilePhoto || "",
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        email: profile?.email || "",
        phoneNumber: profile?.phoneNumber || "",
        orderStatuses: profile?.emailNotifications?.orderStatuses || false,
        passwordChanges: profile?.emailNotifications?.passwordChanges || false,
        specialOffers: profile?.emailNotifications?.specialOffers || false,
        newsletter: profile?.emailNotifications?.newsletter || false,
      }}
      onSubmit={saveUserDetails}
      enableReinitialize
    >
      {({
        resetForm,
        setFieldValue,
        handleSubmit,
        values: {
          profilePhoto,
          firstName,
          lastName,
          email,
          phoneNumber,
          orderStatuses,
          passwordChanges,
          specialOffers,
          newsletter,
        },
      }) => (
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
            extraScrollHeight={50}
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
                  <SecondaryButton name="Change" onClick={() => pickImage(setFieldValue)} />
                  <SecondaryButton
                    name="Remove"
                    onClick={() => setFieldValue("profilePhoto", "")}
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
                    onChangeText={(text) => setFieldValue("firstName", text)}
                  />
                  <Text style={styles.textLabel}>Last name:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={lastName}
                    onChangeText={(text) => setFieldValue("lastName", text)}
                  />
                  <Text style={styles.textLabel}>Email:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    keyboardType="email-address"
                    onChangeText={(text) => setFieldValue("email", text)}
                  />
                  <Text style={styles.textLabel}>Phone number:</Text>
                  <MaskedTextInput
                    style={styles.textInput}
                    mask="+(999) 999-9999"
                    value={phoneNumber}
                    keyboardType="numeric"
                    onChangeText={(text) => setFieldValue("phoneNumber", text)}
                  />
                </View>
                <Text style={styles.title}>Email notifications</Text>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    label="Order statuses"
                    isChecked={orderStatuses}
                    setChecked={() => setFieldValue("orderStatuses", !orderStatuses)}
                  />
                  <CheckBox
                    label="Password changes"
                    isChecked={passwordChanges}
                    setChecked={() => setFieldValue("passwordChanges", !passwordChanges)}
                  />
                  <CheckBox
                    label="Special offers"
                    isChecked={specialOffers}
                    setChecked={() => setFieldValue("specialOffers", !specialOffers)}
                  />
                  <CheckBox
                    label="Newsletter"
                    isChecked={newsletter}
                    setChecked={() => setFieldValue("newsletter", !newsletter)}
                  />
                </View>
                {isLoading ? (
                  <View
                    style={{
                      width: 100,
                      flexDirection: "row",
                      alignSelf: "center",
                      padding: 5,
                    }}
                  >
                    <Loading />
                  </View>
                ) : (
                  <PrimaryButton label="Log out" onClick={onLogoutClick} />
                )}
                <View style={styles.changeContainer}>
                  <SecondaryButton
                    name="Discard changes"
                    onClick={resetForm}
                    backgroundColor="#EDEFEE"
                    fontColor="#495E57"
                    borderColor="#495E57"
                  />
                  <SecondaryButton name="Save changes" onClick={handleSubmit} />
                </View>
              </View>
            </ImageBackground>
          </KeyboardAwareScrollView>
        </>
      )}
    </Formik>
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
