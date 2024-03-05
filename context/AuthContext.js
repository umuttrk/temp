import React, { createContext, useState } from "react";
import { API_URL } from "@env";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (mail, password) => {
    const postData = {
      usernameOrEmail: mail,
      password: password,
    };
    if (!mail || !password) {
      return { message: "Mail ve Şifrenizi giriniz." };
    } else {
      try {
        console.log("apiye istek atiliyor");
        const response = await axios.post(
          API_URL + "/api/Auth/Login",
          postData
        
        );
        console.log("apiye istek atildi");
        if (response.status === 200) {
          await AsyncStorage.setItem("mail", mail);

          return { message: "Success" };
        }
      } catch (err) {
        if (err.response) {
          return { message: err.response.data.Message };
        }
        return { message: "Server hatası. Lütfen daha sonra tekrar deneyin." };
      }
    }
  };
  const signup = async (username, mail, password, passwordAgain) => {
    const postData = {
      userName: username,
      email: mail,
      password: password,
      passwordAgain: passwordAgain,
    };
    if (username && mail && password) {
      try {
        const response = await axios.post(
          API_URL + "/api/users/CreateUser",
          postData,
          { timeout: 2500 }
        );
        if (response.status === 200) {
          await AsyncStorage.setItem("mail", mail);
          return { message: "Success" };
        }
      } catch (error) {
        if (err.response) {
          return { message: err.response.data.message };
        }
      }
    }
  };
  const logout = () => {
    setUserToken(null);
    setIsLoading(false);
  };
  return (
    <AuthContext.Provider
      value={{ login, logout, signup, isLoading, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
