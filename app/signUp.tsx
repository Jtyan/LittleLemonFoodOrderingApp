import Loading from "@/component/Loading";
import { createProfile, signIn, signUp } from "@/lib/auth/auth";
import { validateEmail } from "@/utils/isInputValid";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Banner from "../component/Banner";
import PrimaryButton from "../component/PrimaryButton";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEmailValid = useMemo(() => {
    return validateEmail(email);
  }, [email]);

  const isPasswordMatching = useMemo(() => {
    if (password.length < 1) {
      return false
    }
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const showPasswordError = useMemo(() => {
    return confirmPassword.length > 0 && password !== confirmPassword;
  }, [password, confirmPassword]);

  const isButtonDisabled = !isEmailValid || !isPasswordMatching;

  const submitUserSignUpDetails = async () => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);

      const { data, error } = await signUp(email, password);

      if (error) {
        if (error.message.includes("already registered")) {
          setErrorMessage("This email is already registered.");
        } else {
          setErrorMessage("Failed to create account. Please try again.");
        }
        return;
      }

      if (data.user) {
        // Create profile record (if trigger didn't already create it)
        await createProfile(data.user.id, {});

        // Sign in the user
        await signIn(email, password);
        router.replace("/home");
      }
    } catch (error) {
      console.error("Unexpected error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
        }}
      />
      <KeyboardAwareScrollView
        style={styles.background}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Banner />

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Welcome!</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.signUp}>Already have an account? </Text>
            <Pressable
              style={styles.signUpPressable}
              onPress={() => router.navigate("/signIn")}
            >
              <Text
                style={[
                  styles.signUp,
                  { fontStyle: "italic", textDecorationLine: "underline" },
                ]}
              >
                Sign in here
              </Text>
            </Pressable>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textLabel}>Email:</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(email) => {
                setEmail(email);
                setErrorMessage("");
              }}
              keyboardType="email-address"
              placeholder="Enter your email"
              returnKeyType="next"
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textLabel}>Password:</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={(password) => {
                setPassword(password);
                setErrorMessage("");
              }}
              placeholder="Enter your password"
              secureTextEntry={true}
              returnKeyType="next"
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textLabel}>Confirm Password:</Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: !showPasswordError ? "#495E57" : "#f11326ff" },
              ]}
              value={confirmPassword}
              onChangeText={(password) => {
                setConfirmPassword(password);
                setErrorMessage("");
              }}
              placeholder="Re-enter your password"
              secureTextEntry={true}
              returnKeyType="done"
            />
            {showPasswordError && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.button}>
            {isLoading ? (
              <View style={{ width: 100 }}>
                <Loading />
              </View>
            ) :(<PrimaryButton
              label="Create Account"
              onClick={submitUserSignUpDetails}
              isDisabled={isButtonDisabled}
            />)}
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
    fontWeight: "semibold",
    color: "#495E57",
    fontFamily: "Karla-Medium",
    alignSelf: "center",
    marginBottom: 5,
  },
  signUp: {
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: "Karla-Medium",
    color: "#495E57",
    alignSelf: "center",
  },
  signUpPressable: {
    alignItems: "center",
  },
  textInputContainer: {
    marginTop: 20,
  },
  textLabel: {
    fontFamily: "Karla-Medium",
    color: "#495E57",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    color: "#495E57",
    borderColor: "#495E57",
    fontFamily: "Karla-Medium",
  },
  errorContainer: {
    backgroundColor: "#ffd9d9ff",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#f11326ff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Karla-Regular",
    color: "#f11326ff",
  },
  button: {
    alignItems: "flex-end",
    marginTop: 10,
  },
});

export default SignUp;
