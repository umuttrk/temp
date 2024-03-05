import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { AuthContext } from "../context/AuthContext";

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin() {
    try {
      var response = await login(mail, password);
      if (response.message === "Success") {
        console.log("basarili")
        navigation.replace("Homepage");
      } else {
         alert(response.message)
      }
    } catch (error) {
        alert(error)
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            style={{
              justifyContent: "center",
              width: 300, // Adjust the width as needed
              height: 300, // Adjust the height as needed
              resizeMode: "contain",
              marginBottom: -50,
            }}
            source={require("../assets/images/onaronar-logo-blue.png")}
          />
        </View>

        <Text
          style={{
            //fontFamily: "Roboto-Medium",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Login
        </Text>
        <InputField
          label={"Email "}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#5d58b2"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
          onChangeFunction={(e) => setMail(e)}
        />

        <InputField
          label={"Password"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#5d58b2"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
          fieldButtonLabel={"Forgot?"}
          fieldButtonFunction={() => {}}
          fieldButtonStyle={{ color: "#5d58b2" }}
          onChangeFunction={(e) => setPassword(e)}
        />

        <CustomButton
          label={"Login"}
          onPress={() => {
            handleLogin();
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: "#5d58b2", fontWeight: "700" }}>
              {" "}
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
