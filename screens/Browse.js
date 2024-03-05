import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";

const Browse = ({ navigation }) => {
  const [productList, setProductList] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    console.log("Ürünleri göz at sayfası açıldı")
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
          <TouchableOpacity onPress={(()=>navigation.navigate("Messages"))}>
            <Text style={{ color: "#000000", marginRight: 20 }}>Mesajlarım</Text>
          </TouchableOpacity>
       
        </View>
      ),
    })
    fetchProductList();
  }, []);
  const handleSearch = (text) => {
    // Filter the productList based on the searchQuery
    if(text.length===0){
        setProductList(filteredProductList);
        setSearchQuery("")
    }else{
        setSearchQuery(text);
    const filteredProducts = filteredProductList.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProductList(filteredProducts);
    return filteredProducts;
    }
    
    
  };
  const fetchProductList = async () => {   
    try {
      console.log("Ürünleri getirme metodu çalıştı")

      const response = await axios.get(API_URL+"/api/products/GetAllActiveProduct?page=0&size=20"); // API_ENDPOINT'i gerçek bir endpoint ile değiştirin
      if (response.status===200) {
        console.log("👍Ürünler başarıyla getirildi")
        setProductList(response.data.products);
        setFilteredProductList(response.data.products)
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const navigateToProductDetail = (product) => {
    console.log(product.id);
    navigation.navigate("ProductDetail", { id: product.id });
  };
  const renderProductItem = ({ item, index }) => {
    if (index % 2 === 0) {
      // Even index, render two items side by side
      const nextItem = productList[index + 1];

      return (
        <View style={styles.rowContainer}>
          {renderSingleProductItem(item)}
          {nextItem && renderSingleProductItem(nextItem)}
        </View>
      );
    } else {
      // Odd index, already rendered as part of the previous even index
      return null;
    }
  };

  const renderSingleProductItem = (item) => (
    <TouchableOpacity onPress={() => navigateToProductDetail(item)}>
      <View style={styles.productContainer}>
        <Image
          source={{
            uri: item.firstProductImage
              ? `${API_URL}${item.firstProductImage.substring(
                  22
                )}`
              : `${API_URL}/files\\Ekran görüntüsü 2023-09-27 181113.png`,
          }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productBrand}>{item.brand}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex:1}}>
      {/* Search Bar */}
      <TextInput 
        style={styles.searchInput}
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={(text) => handleSearch(text)}
      />

      <FlatList
        data={productList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal:30,
    backgroundColor:"#ffffff",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    marginTop:25,
    paddingLeft: 10,
    borderRadius:5,
    elevation:5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  productContainer: {
    alignItems: "center",
    width: 150,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden", // Ensures borderRadius is applied correctly
    backgroundColor: "#fff",
    elevation: 20, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    padding: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 14,
  },
});

export default Browse;
