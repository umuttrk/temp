// import React, { useState } from "react";
// import { View, Button, Image } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import * as ImagePicker from "expo-image-picker";

import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,  ActivityIndicator, // Import ActivityIndicator

} from "react-native";

const MyComponent = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // Introduce loading state

  useEffect(() => {
    fetchData();
  }, [categories]); // Boş bağımlılık dizisi, sadece ilk render'da çağrılmasını sağlar
  const selectImages = async () => {
    try {
      let result = {};
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: true,
      });
      if (!result.canceled) {
        console.log("AASAD");
        // setImages((prevImages) => [...prevImages, result.assets[0].uri]);
        const selectedImages = result.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.log("YES SIRRR");
      throw error;
    }
  };
  const uploadFile = async (productId) => {
    const formData = new FormData();
    images.forEach((fileUri, index) => {
      const fileExt = fileUri.split(".").pop();
      formData.append(`Files_${Math.random() * 1000 + index}.${fileExt}`, {
        uri: fileUri,
        name: `Screenshot_${new Date().toISOString()}.${fileExt}`,
        type: `image/${fileExt}`,
      });
    });

    try {
      const response = await axios.post(
        API_URL + "/api/Products/Upload?Id=" + productId,
        formData,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setImages([]);

        console.log("ÜRÜNLER BAŞARIYLA EKLENDI");
        alert("İlan onaylama bekliyor.");
        setTimeout(() => {}, 1000); // Sleep for 1000 milliseconds (1 second)GEREK YOK
        navigation.replace("Homepage");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL + "/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };
  const handleButtonPress = async () => {
    // Seçilen alt kategoriyi kullanarak API çağrısını gerçekleştir
    // title, brand, model, description gibi diğer bilgileri de kullanabilirsin
    const postData = {
      title: title,
      brand: brand,
      model: model,
      description: description,
      location: "İstanbul",
      categoryName: selectedCategory,
      subCategoryName: selectedSubCategory,
      username: "nuh",
    };
    console.log("Selected SubCategory:", selectedSubCategory);
    console.log("Selected Category:", selectedCategory);
    const response = await axios.post(API_URL + "/api/products", postData, {
      timeout: 2500,
    });

    if (response.status === 200) {
      console.log("Yeni Ürün Eklendi");
      await uploadFile(response.data.productId);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <View>
      <Text>{item.categoryName}</Text>
      <FlatList
        data={item.subCategories}
        keyExtractor={(subCategory) => subCategory}
        renderItem={({ item: subCategory }) => (
          <Text
            onPress={() => {
              setSelectedSubCategory(subCategory);
              setSelectedCategory(item.categoryName);
            }}
            style={{
              padding: 10,
              backgroundColor:
                subCategory === selectedSubCategory ? "lightblue" : "white",
            }}
          >
            {subCategory}
          </Text>
        )}
      />
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        // backgroundColor: "gray",
        justifyContent: "center",
      }}
    >
      {loading ? ( // Check if categories are still loading
        <ActivityIndicator size="large" color="#0000ff" /> // Display loading indicator
      ) : (
        <>
          <View
            style={{
              alignItems: "stretch",
              backgroundColor: "#c9c9c9",
              height: 200,
              width: "100%",
            }}
          >
            <FlatList
              style={{ marginVertical: 19 }}
              data={categories}
              keyExtractor={(category) => category.categoryName}
              renderItem={renderCategoryItem}
            />
          </View>
          <View style={styles.line}></View>
          <View
            style={{
              backgroundColor: "#ffffff",
            }}
          >
            <Text>Başlık</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            <Text>Marka</Text>
            <TextInput
              style={styles.input}
              placeholder="Brand"
              value={brand}
              onChangeText={(text) => setBrand(text)}
            />
            <Text>Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Model"
              value={model}
              onChangeText={(text) => setModel(text)}
            />
            <Text>Açıklama</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TouchableOpacity
              onPress={selectImages}
              style={{
                backgroundColor: "#5d58b2",
                padding: 5,
                width: 100,
                borderRadius: 10,
                marginBottom: 30,
                marginHorizontal: 50,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Fotoğraf Ekle
              </Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false} // Optionally hide the horizontal scrollbar
              style={styles.scrollView}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
            {/* {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width: 50, height: 50, marginVertical: 20 }}
          />
        ))} */}
            <TouchableOpacity
              onPress={handleButtonPress}
              style={{
                backgroundColor: "#5d58b2",
                padding: 20,
                borderRadius: 10,
                marginBottom: 30,
                marginHorizontal: 50,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust as needed
  },
  scrollView: {
    flexDirection: "row", // Horizontal scrolling
    padding: 16,
    backgroundColor: "#ffffff",
  },
  image: {
    width: 50,
    height: 50,
    marginHorizontal: 10, // Adjust the spacing between images
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
  },
  descriptionInput: {
    height: 100, // Adjust the height as needed for your design
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
  },
  submitButton: {
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
  },
});
export default MyComponent;
