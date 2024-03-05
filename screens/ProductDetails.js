import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "@env";  
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
 
const ProductDetailScreen = ({ route}) => {
  const navigation = useNavigation();
  const { id} = route.params;
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState([]); // State to hold comments
  const [newComment, setNewComment] = useState(""); // State to hold the new comment text
  const [localUser, setLocalUser] = useState("")

  useEffect(() => {
    console.log("Ürün detayları sayfası çalıştı")
    

    fetchProduct();
  }, [id]);
  const fetchProduct = async () => {
      console.log(`id:${id} ürün detaylarını getirecek method çağrıldı `)
    let storedMail = await AsyncStorage.getItem("mail");
    setLocalUser("nuh")
    try {
      const response = await axios.get(
        `${API_URL}/api/products/${id}`, {
        } 
      ); 
      if (response.status===200) {
        console.log(`👍 id:${id} ürün detayları başarıyla getirildi `)
        setProduct(response.data);
        setComments(response.data.comments);
      }
      
     
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const addNewComment = async () => {
    try {
      // Implement the logic to add a new comment using an API call
      // You may use axios.post or any other method to send the new comment to your server
      console.log("Adding new comment:", newComment);

      // Placeholder: Simulate adding the comment to the state
      setComments((prevComments) => [
        ...prevComments,
        {
          createdDate: "2024-01-08T19:30:40.0993112",
          userName: "CurrentUser",
          text: newComment,
        },
      ]);

      // Clear the input field after adding the comment
      setNewComment("");
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  };

  const handleArrowClick = (direction) => {
    //console.log(product.productImages[currentIndex].path);
    if (direction === "prev") {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else {
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + 1, product.productImages.length - 1)
      );
    }
  };
  return (
    <ScrollView
      style={{
        // marginTop: 50,
        flex: 1,
        //borderWidth: 2,
        width: "90%",
        alignSelf: "center",
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            marginTop: 5,
            alignSelf: "center",
          }}
        >
          <Text style={styles.productTitle}>{product.title}</Text>
        </View>
        <View style={styles.imageContainer}>  
          <TouchableOpacity
            onPress={() => handleArrowClick("prev")}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowButtonText}>&lt;</Text>
          </TouchableOpacity>
          <Image
            source={{
              uri: product.productImages[currentIndex]
                ? `${API_URL}${product.productImages[
                    currentIndex
                  ].path.substring(22)}`
                : `${API_URL}/files/Ekran görüntüsü 2023-09-27 181113.png`,
            }}
            style={styles.productImage}
          />
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={() => handleArrowClick("next")}
              style={styles.arrowButton}
            >
              <Text style={styles.arrowButtonText}>&gt;</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <View
            style={{
              shadowOpacity: 0.2,
              borderWidth: 0,
              elevation: 5,
              padding: 15,
            }}
          >
            <View
              style={{
                justifyContent: "space-around",
                flex: 1,
              }}
            >
              <Text>Kullanıcı: {product.userName}</Text>
              {localUser!==product.userName&&(<TouchableOpacity 
                onPress={() => navigation.navigate("Chatting",{productId:product.id,receiverUser:product.userName})}
                style={styles.offerButton}
              >
                <Text style={styles.arrowButtonText}>Teklif Ver</Text>
              </TouchableOpacity>)}
            </View>
          </View>
          <View style={styles.productDetailsContainer}>
            <Text style={styles.productBrand}>Marka: {product.brand}</Text>
            <Text style={styles.productModel}>Model: {product.model}</Text>
            <Text style={styles.productModel}>Konum: {product.location}</Text>
          </View>
        </View>
        <View style={{ borderWidth: 0 }}>
          <Text style={{ fontWeight: 700, fontSize: 17 }}>Açıklama:</Text>
          <Text style={styles.productDescription}>
            {product.description}
          </Text>
        </View>
      </View>
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments</Text>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentUserName}>{comment.userName}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCommentsText}>No comments yet.</Text>
        )}
      </View>
      {/* New Comment Section */}
      <View style={styles.commentsContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write your comment..."
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <TouchableOpacity onPress={addNewComment} style={styles.commentButton}>
          <Text style={styles.commentButtonText}>Post Comment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentButton: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowButton: {
    backgroundColor: "#565353",
    padding: 8,
    borderRadius: 8,
  },
  offerButton: {
    backgroundColor: "#d35050",
    padding: 8,
    borderRadius: 8,
    
  },
  arrowButtonText: {
    color: "#eee",
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    padding: 5,
    margin: 10,
    flexDirection: "row",
    // backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  container: {
    flex: 1,
    //backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    //flex:1,
    width: "80%",
    height: 300,
    resizeMode: "contain",
  },
  productDetailsContainer: {
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  productModel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  commentsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor:"#ffffff",
    elevation:6,
    padding:13,
    marginBottom: 12,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
  },
  noCommentsText: {
    fontSize: 14,
    color: "#888",
  },
});

export default ProductDetailScreen;
