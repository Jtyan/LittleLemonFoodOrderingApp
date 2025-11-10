import Loading from "@/component/Loading";
import { signIn } from "@/lib/auth";
import { validateEmail } from "@/utils/isInputValid";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Banner from "../component/Banner";
import PrimaryButton from "../component/PrimaryButton";

const Onboarding = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const isEmailValid = useMemo(() => {
    return validateEmail(email);
  }, [email]);

  const isButtonDisabled = password.length == 0 || !isEmailValid;

  const submitUserLoginDetails = async () => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);
      setIsLoginFailed(false);

      const { data, error } = await signIn(email, password);

      if (error) {
        setIsLoginFailed(true);
        return;
      }

      if (data.user) {
        router.replace("/home");
      }
    } catch (error) {
      console.error("Unexpected error: ", error);
      setIsLoginFailed(true);
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
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Banner />

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Welcome!</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.signUp}>New User? </Text>
            <Pressable
              style={styles.signUpPressable}
              onPress={() => router.navigate("/signUp")}
            >
              <Text
                style={[
                  styles.signUp,
                  { fontStyle: "italic", textDecorationLine: "underline" },
                ]}
              >
                Sign up here
              </Text>
            </Pressable>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textLabel}>Email:</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(email) => {
                setEmail(email)
                setIsLoginFailed(false)
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
                setPassword(password)
                setIsLoginFailed(false)
              }}
              placeholder="Enter your password"
              secureTextEntry={true}
              returnKeyType="done"
            />
          </View>
          {isLoginFailed && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Incorrect email or password.</Text>
            </View>
          )}

          <View style={styles.button}>
            {isLoading ? (
              <View style={{ width: 100 }}>
                <Loading />
              </View>
            ) : (
              <PrimaryButton
                label="Next"
                onClick={submitUserLoginDetails}
                isDisabled={isButtonDisabled}
              />
            )}
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

export default Onboarding;
