import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { auth, createUser, signInUser, signOutUser } from "./firebaseConfig";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert(
        "Error",
        error,
        [{ text: "OK", onPress: () => setError(null) }],
        { cancelable: false }
      );
    }
  }, [error]);

  return (
    <View style={styles(props).contentContainer}>
      <Text>Login Page</Text>
      {isLogin ? <Text>Logged In</Text> : <Text>Not Logged In</Text>}
      <TextInput
        style={styles(props).input}
        placeholder="Email"
        inputMode="email"
        onChange={(e) => {
          setEmail(e.nativeEvent.text);
        }}
      />
      <TextInput
        style={styles(props).input}
        placeholder="Password"
        secureTextEntry
        onChange={(e) => {
          setPassword(e.nativeEvent.text);
        }}
      />
      <TouchableOpacity
        style={styles(props).login}
        onPress={() => {
          isLogin
            ? signOutUser(auth)
            : signInUser(auth, email, password).catch((err) => {
                setError(err.message);
              });
        }}
      >
        {isLogin ? <Text>Logout</Text> : <Text>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          console.log("Sign Up");
          createUser(auth, email, password).catch((err) => {
            setError(err.message);
          });
        }}
      >
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (props) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      width: props.SCREEN_WIDTH,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      height: 40,
      width: 200,
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
    },
    login: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10,
      width: 200,
    },
  });

export default LoginPage;
