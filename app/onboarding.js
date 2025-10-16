import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Banner from "../component/banner";
import Button from "../component/button";

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
      await AsyncStorage.multiSet([
        ["firstName", firstName],
        ["email", email],
      ]);
    } catch (err) {
      console.error("Failed to save user details in async storage", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Button
              name="Next"
              onClick={() => {
                saveUserDetails();
                router.push("/profile");
              }}
              isDisabled={isButtonDisabled}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
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
    fontFamily: "Karla-Regular",
    fontWeight: "semibold",
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
  },
  button: {
    alignItems: "flex-end",
  },
});

export default Onboarding;
