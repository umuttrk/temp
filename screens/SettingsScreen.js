import axios from "axios";
import { API_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

const SettingsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [image, setImage] = useState(null);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [user, SetUser] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const handleLogout = async () => {
    await AsyncStorage.removeItem("mail"); // Clear authentication token or user-related data
    navigation.navigate("Login");
  };

  const handleNavigate = async () => {
    // Handle navigation logic
    console.log("Navigate Button Pressed");
    // You can replace the following line with your actual navigation logic
    navigation.navigate("MyOffers");
  };
  useEffect(() => {
    console.log("Ayarlar ekranı açıldı");

    fetchUserInfo();            

    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            marginRight: 10,
            justifyContent: "flex-start",
            backgroundColor: "#ffffff",
          }}
        >
          <TouchableOpacity onPress={handleNavigate}>
            <Text style={{ color: "#000000", marginRight: 20 }}>İlanlarım</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
            <Text style={{ color: "#000000" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });

    //fetchUserInfo();
    // Diğer işlemler
    // ...

    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })(); 
  }, [image]);

  const fetchUserInfo = async () => {
    console.log("kullanici bilgilerini getirme methodu çağırıldı")
    try {
      let storedMail = await AsyncStorage.getItem("mail");
      storedMail="nuh"
      SetUser(storedMail);//******************************************************************************** */
      const response = await axios.get(
        API_URL + "/api/users/GetProfileEditInfo?activeUsername=" + (storedMail)
      );
      if (response.status===200) {
        console.log("👍Kullanıcı bilgileri başarıyla getirildi")
        setUserInfo(response.data);
        setImage(userInfo.profileImage);
        setEmail(response.data.email);   
        setPhone(response.data.phoneNumber);
        setAbout(response.data.about);
        setName(response.data.nameAndSurname);
      }
    
      //console.log(`${API_URL}/files\\user-default.png`);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }  
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
        console.log(result.assets[0]["uri"])
      setImage(result.assets[0]["uri"]);
      console.log(image)     
    }
  };

  const handleSubmit = async () => {
    // Burada submit işlemlerini gerçekleştirebilirsiniz
    // Örneğin, bu bilgileri bir API'ye gönderebilir veya yerel depolamaya kaydedebilirsiniz
    const result = await axios.put(API_URL + "/api/users", {
      username: user,
      nameAndSurname: name,
      about: about,
      phoneNumber: phone,
    });
    if (result.status === 200) {
      alert("Kullanıcı ayarları güncellendi.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image && (
          <View
            style={{
              elevation: 50,
              borderWidth: 0.5,
              borderRadius: 100,
            }}
          >
            <Image
              source={{
                uri:
                  image !== "https://localhost:7018/"
                    ? `${API_URL}/${image.substring(22)}`
                    : `${API_URL}/files\\user-default.png`,
              }}
              style={{
                borderRadius: 100,
                width: 200,
                height: 200,
              }}
            />
          </View>
        )}
        <Button title="Pick an image" onPress={pickImage} />
      </View>
      <View style={styles.section}>
        <Text>Adınız ve soyadınız:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <Text>Hakkında:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setAbout(text)}
          value={about}
          multiline
          //   numberOfLines={2}
        />
      </View>
      <View style={styles.section}>
        <Text>Telefon:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
        <Text>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    padding: 16,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  input: {
    elevation: 5,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
});

export default SettingsScreen;
