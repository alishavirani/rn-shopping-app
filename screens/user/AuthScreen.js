import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Button,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{text: "Okay"}]);
    }
  }, [error]);

  const emailTextChangeHandler = text => {
    setEmail(text);
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (text.trim().length === 0) {
      isValid = false;
    }
    if (!emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (text.length < 5) {
      isValid = false;
    }
    setIsValidEmail(isValid);
  };

  const passwordTextChangeHandler = text => {
    setPassword(text);
    if (text.length < 5) {
      setIsValidPassword(false);
    } else {
      setIsValidPassword(true);
    }
  };

  const authHandler = async () => {
    let action;
    if (isSignUp) {
      action = authActions.signup(email, password);
    } else {
      action = authActions.login(email, password);
    }
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch(err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const emailLostFocusHandler = () => {
    setEmailTouched(true);
  };

  const passwordLostFocusHandler = () => {
    setPasswordTouched(true);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                autoCorrect={false}
                autoCompleteType="off"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                defaultValue=""
                onChangeText={emailTextChangeHandler}
                value={email}
                onBlur={emailLostFocusHandler}
              />
              {!isValidEmail && emailTouched && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Please enter valid email address.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                autoCorrect={false}
                autoCompleteType="off"
                keyboardType="default"
                textContentType="password"
                autoCapitalize="none"
                secureTextEntry={true}
                defaultValue=""
                onChangeText={passwordTextChangeHandler}
                value={password}
                onBlur={passwordLostFocusHandler}
              />
              {!isValidPassword && passwordTouched && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Please enter valid password.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              {isLoading ? <ActivityIndicator size="small" color={Colors.primary} /> : <Button
                title={isSignUp ? "Sign Up" : "Login"}
                color={Colors.primary}
                onPress={authHandler}
              />}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignUp(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  inputContainer: {
    padding: 10
  },
  buttonContainer: {
    marginTop: 10
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: "red",
    fontSize: 13
  }
});

export default AuthScreen;
