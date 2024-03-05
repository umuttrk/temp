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

// Ana sayfa bileşeni
const MyOffers = ({ navigation }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    console.log("İlanlarım sayfası açıldı")
    fetchOffers();
  }, []);
  const fetchOffers = async () => {

    console.log("İlanlarımı getirecek method çağrıldı")
    let storedMail = await AsyncStorage.getItem("mail");  
    storedMail = "nuh";
    const response = await axios.get(
      API_URL +
        "/api/products/getProfileMyProducts?activeUsername=" +
        storedMail
    );
    if (response.status === 200) {
      console.log("👍İlanlarım başarıyla getirildi");
      setData(response.data);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "stretch" }}>
      <FlatList
        data={data.productsInfoes}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate("ProductDetail", {
                id: item.productId,
                navigation: navigation,
              })
            }
          >
            <Image
              source={{
                uri:
                  item.productImageOnePath != ""
                    ? `${API_URL}${item.productImageOnePath.substring(22)}`
                    : `${API_URL}/files\\user-default.png`,
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemTextContainer}>
              <Text>{item.title}</Text>
              <Text>{item.createdDate}</Text>
              <Text>{item.location}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  console.log(
                    `${API_URL}${item.productImageOnePath.substring(22)}`
                  )
                }
              >
                <Text style={styles.buttonText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => console.log("sil")}
              >
                <Text style={styles.buttonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Detay sayfa bileşeni
function DetailsScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{item.title}</Text>
      {/* Detayları göster */}
    </View>
  );
}

// Sayfa yönlendirmesi

// Stil tanımlamaları
const styles = StyleSheet.create({
  buttonText: {
    color: "#eee",
    fontWeight: "500",
  },
  itemContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
});
export default MyOffers;
