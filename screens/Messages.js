


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { API_URL } from "@env";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Messages = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Sohbetlerim sayfası açıldı");
    // API'den veriyi çek
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    console.log("sohbetleri getir methodu çağrıldı");
    try {
      let storedMail = await AsyncStorage.getItem("mail");
      storedMail = "nuh"; // silsilsilsilsislislisislsilsilsilsilsilsislislislsil
      const response = await axios.get(API_URL + "/api/chats/GetActiveUserAllChats?activeUsername=" + storedMail);
      if (response.status === 200) {
        console.log("👍 Sohbetler Başarıyla getirildi");
        setMessages(response.data.productChatGroups);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chatting", { productId: item.productId, receiverUser: item.chatingUserNames[0] })}
      style={styles.messageContainer}>
       <Image 
        style={styles.productImage}
        source={{
          uri: item.productImageFirst
            ? `${API_URL}${item.productImageFirst.substring(22)}`
            : `${API_URL}/files\\user-default.png`,
        }}
      />
      <View style={styles.messageDetails}>
        <Text style={styles.productTitle}>{item.productTitle}</Text>
        <Text style={styles.userInfo}>
          {` ${item.chatingUserNames.join(', ')}`}
        </Text>
        {/* <Text style={styles.lastMessage}>
          Last Message: {item.lastDateTime}
        </Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={renderMessageItem}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    backgroundColor:"white",
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  messageDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize:14,
    color: 'gray',
  },
  lastMessage: {
    marginTop: 8,
  },
});

export default Messages;
