import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Banner from "../component/Banner";
import PrimaryButton from "../component/PrimaryButton";

const Onboarding = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const isFirstNameValid = useMemo(() => {
    return /^[a-zA-Z]+$/.test(firstName);
  }, [firstName]);

  const isEmailValid = useMemo(() => {
    return /^\S+@\S+\.\S+$/.test(email);
  }, [email]);

  const isButtonDisabled = !isFirstNameValid || !isEmailValid;

  const saveUserDetails = async () => {
    try {
      const userProfile = {
        firstName,
        email
      }
      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile))
    } catch (err) {
      console.error("Failed to save user details in async storage", err);
    }
  };

  return (
    <>
    <Stack.Screen options={{
      headerBackVisible: false
    }}/>
     <KeyboardAwareScrollView
        style={styles.background}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Banner />

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Let us get to know you</Text>

          <View style={styles.textInputContainer}>
            <Text style={styles.textLabel}>First Name:</Text>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              returnKeyType="next"
            />
          </View>

          <View style={styles.textInputContainer}>
            <Text style={styles.textLabel}>Email:</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
              returnKeyType="done"
            />
          </View>

          <View style={styles.button}>
            <PrimaryButton
              label="Next"
              onClick={async() => {
                await saveUserDetails();
                router.replace("/home");
              }}
              isDisabled={isButtonDisabled}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#EDEFEE",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  formContainer: {
    margin: 20,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Karla-Medium",
    alignSelf: "center",
  },
  textInputContainer: {
    marginVertical: 20,
  },
  textLabel: {
    fontFamily: "Karla-Regular",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Karla-Regular'
  },
  button: {
    alignItems: "flex-end",
  },
});

export default Onboarding;
