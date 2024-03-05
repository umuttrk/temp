import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios"; // Axios kütüphanesini projenize eklemeyi unutmayın

import { API_URL } from "@env";
import "react-native-url-polyfill/auto";
import { connect } from "formik";

const Chatting = ({ route }) => {
  const [showModal, setShowModal] = useState(false);

  const [offer, setOffer] = useState();
  const navigation = useNavigation(); // Access the navigation object using the useNavigation hook
  const [product, setProduct] = useState(null);
  const { productId, receiverUser } = route.params; // Varsayalım ki, productId bir önceki sayfadan geçiliyor
  const [productData, setProductData] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [hubConnection, setHubConnection] = useState();
  const [localUser, setLocalUser] = useState("");

  useEffect(() => {
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
          {/* {product ? (
            product.userName !== localUser ? ( */}
          <TouchableOpacity onPress={() => handleOffer()}>
            <Text
              style={{
                color: "#070707",
                marginRight: 20,
                fontWeight: "600",
              }}
            >
              Yeni Teklif
            </Text>
          </TouchableOpacity>
          {/* ) : (
              <></>
            )
          ) : (
            <></>
          )} */}
        </View>
      ),
    });

    fetchMessages();

    signalConnection();
  }, [productId]);
  // useEffect(() => {
  //   fetchProduct();
  // }, []);

  const handleOffer = () => {
    setShowModal(true);
  };
  const handleModalConfirm = async () => {
    let storedMail = await AsyncStorage.getItem("mail");
    storedMail = "nuh";
    const chatElement = {
      productId: productId,
      senderName: "nuh",
      receiverName: "umut",
      messageText: message,
      offer: {
        amount: offer,
        isAccepted: false,
        isRejected: false,
      }, 
      sendingTime: new Date(),
    };

    const response = await axios.post(API_URL + "/api/chats/CreateOffer", {
      productId: productId,
      receiverName: receiverUser,
      offererName: storedMail,
      offerAmount: offer,
    });
    if (response.status === 200) {
      try {
        if (hubConnection) {
          await hubConnection.invoke("SendMessage", chatElement);
          console.log("Offer sent successfully by signal! ");
        } else {
          console.log("no hub connection");
        }
      } catch (err) {
        console.log("Error while sending ChatElement:", err);
      }
      setMessages([chatElement, ...messages]);
      setOffer();
      setShowModal(false);

    }
  };
  const fetchProduct = async () => {
    let storedMail = await AsyncStorage.getItem("mail");
    setLocalUser("nuh");
    try {
      const response = await axios.get(`${API_URL}/api/products/${productId}`);
      console.log(response);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  const signalConnection = async () => {
    const connection = new HubConnectionBuilder()
      .withUrl(API_URL + "/chats-hub")
      //.configureLogging(LogLevel.Information)
      .build();
    try {
      await connection.start();
      connection.on("receiveChatElement", (messageElement) => {
        console.log("signaldan yeni bir mesaj geldi");
        if (messageElement.receiverName === "nuh") {
          const newMessage = {
            productId: messageElement.productId,
            messageText: messageElement.messageText,
            receiverName: messageElement.receiverName,
            senderName: messageElement.senderName,
          };
          console.log(messageElement);
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        }
      });
      console.log("signal bağlantısı başarılı");
      setHubConnection(connection);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    console.log(receiverUser + "ile mesajlari getirme metodu çağrıldı");
    let storedMail = await AsyncStorage.getItem("mail");
    storedMail = "nuh";
    const response = await axios.get(
      `${API_URL}/api/chats/GetActiveUserChatReleatedProduct?activeUsername=${receiverUser}&messagingUsername=${storedMail}&productId=${productId}`
    );
    if (response.status === 200) {
      console.log("👍 Mesajlar Başarıyla getirildi");
      setProductData(response.data);
      const reversedMessages = response.data.releatedProductChats.reverse();
      setMessages(reversedMessages);
    }
  };
  const sendChatElement = async (chatElement) => {
    try {
      if (hubConnection) {
        await hubConnection.invoke("SendMessage", chatElement);
        console.log("ChatElement sent successfully!");
      } else {
        console.log("no hub connection");
      }
    } catch (err) {
      console.log("Error while sending ChatElement:", err);
    }
  };
  const sendMessage = async () => {
    const newMessage = {
      productId: productId,
      messageText: message,
      receiverName: "umut",
      senderName: "nuh",
    };
    const chatElement = {
      ProductId: productId,
      SenderName: "nuh",
      ReceiverName: "umut",
      MessageText: message,
      Offer: null,
      SendingTime: new Date(),
    };
    const result = await axios.post(
      `${API_URL}/api/chats/createMessage`,
      newMessage
    );
    if (result.status === 200) {
      await sendChatElement(chatElement);
      setMessages([newMessage, ...messages]);
      setMessage("");
    }
  };

  const renderChatItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderName === "nuh" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      {item.offer ? (
        <View
          style={{
            backgroundColor: "#4b5f59",
            padding: 25,
            borderRadius: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Yeni Teklif</Text>
          <Text style={{ color: "white" }}>{item.offer.amount} TL</Text>
        </View>
      ) : (
        <Text>{item.messageText}</Text>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: productData.productImageOnePath
              ? `${API_URL}${productData.productImageOnePath.substring(22)}`
              : `${API_URL}/files\\user-default.png`,
          }}
          style={styles.productImage}
        />
        <Text style={styles.productTitle}>{productData.productTitle}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Teklifinizi Girin:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={offer}
              onChangeText={(text) => setOffer(text)}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalConfirm}
            >
              <Text style={styles.modalButtonText}>Onayla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    // overflow: 'hidden',
    // elevation:10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    margin: 5,
    maxWidth: "70%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e1ffc7",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e1ffc7",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Chatting;
