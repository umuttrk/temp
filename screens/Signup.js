import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
//import DatePicker from "react-native-date-picker";
import DatePicker from "react-native-modern-datepicker";

import InputField from "../components/InputField";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MyModalComponent from "../components/MyModal.js";
import CustomButton from "../components/CustomButton";
import { AuthContext } from "../context/AuthContext";
import { ErrorMessage } from "formik";

const Signup = ({ navigation }) => {
  const { signup } = useContext(AuthContext);
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openError, setOpenError] = useState(false);
  const [dobLabel, setDobLabel] = useState("Date of Birth");
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const onClose = () => {
    setOpen(false);
    setOpenError(false)
  };
  async function handleSignUp(username, mail, password, confPassword, date) {
    if (!username | !mail |!password) {
      setErrorMessage("Bütün boşlukları doldurun")
      setOpenError(true)
    }
    else if (password !== confPassword) {
      setErrorMessage("Şifreler Eşleşmiyor")
      setOpenError(true)
    } else {
      var response=await signup(username,mail,password,confPassword);
      if (response.message === "Success") {
        console.log("basarili")
        navigation.navigate("Homepage");
      } else {
         alert(response.message)
      }
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ marginHorizontal: 15 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 25 }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: "500",
              color: "#5d58b2",
              marginBottom: 30,
            }}
          >
            Register
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
          ></View>
          <InputField
            onChangeFunction={(e) => setUsername(e)}
            label={"Username"}
            icon={
              <Ionicons
                name="person-outline"
                size={20}
                color="#5d58b2"
                style={{ marginRight: 15 }}
              />
            }
          />
          <InputField
            onChangeFunction={(e) => setMail(e)}
            label={"Email Address"}
            icon={
              <MaterialIcons
                name="alternate-email"
                size={20}
                color="#5d58b2"
                style={{ marginRight: 15 }}
              />
            }
            keyboardType="email-address"
          />
          <InputField
            onChangeFunction={(e) => setPassword(e)}
            label={"Password"}
            icon={
              <Ionicons
                name="ios-lock-closed-outline"
                size={20}
                color="#5d58b2"
                style={{ marginRight: 15 }}
              />
            }
            inputType="password"
          />

          <InputField
            onChangeFunction={(e) => {
              setConfPassword(e);
            }}
            label={"Confirm Password"}
            icon={
              <Ionicons
                name="ios-lock-closed-outline"
                size={20}
                color="#5d58b2"
                style={{ marginRight: 15 }}
              />
            }
            inputType="password"
          />

          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#ccc",
              borderBottomWidth: 1,
              paddingBottom: 8,
              marginBottom: 30,
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#5d58b2"
              style={{ marginRight: 15 }}
            />
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={{ color: "#666", marginLeft: 5, marginTop: 5 }}>
                {dobLabel}
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            visible={open || openError}
            animationType="slide"
            transparent={true}
          >
            {open && (
              <MyModalComponent
                content={
                  <DatePicker
                    mode="calendar"
                    onDateChange={(e) => {
                      var validDateString = e.replace(/\//g, "-");
                      console.log(validDateString);
                      console.log(typeof e);
                      setDate(new Date(validDateString));
                      console.log(typeof date);
                      setDobLabel(
                        moment(new Date(validDateString)).format("DD-MM-YYYY")
                      );
                      console.log(dobLabel);
                    }}
                  />
                }
                title={"Date of Birthday"}
                onClose={onClose}
              />
            )}
            {openError && (
              <MyModalComponent
                content={<Text style={{marginVertical:10}}> {errorMessage}</Text>}
                title={"Error"}
                onClose={onClose}
              />
            )}
          </Modal>

          <CustomButton
            label={"Register"}
            onPress={() =>
              handleSignUp(username, mail, password, confPassword, date)
            }
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <Text>Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: "#5d58b2", fontWeight: "700" }}>
                {"  "}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
