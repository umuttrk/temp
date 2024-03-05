import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const MyModal = ({ content, onClose,title }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      }}
    >
      <View
        style={{
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          width: "90%",
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 600 }}>{title}</Text>
        {content}

        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: "#666", marginLeft: 5, marginTop: 5 }}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyModal;
