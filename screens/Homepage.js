import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import CustomAppBar from "../components/AppBar";

const Homepage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#881deb" barStyle="light-content"  currentHeight="50" />
      <CustomAppBar navigation={navigation} />
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Text style={styles.logoText}>OnarOnar</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* İlanlara Göz At Fonksiyonu */
            navigation.navigate('Browse')
          }}
        >
          <Text style={styles.buttonText}>İlanlara Göz At</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('AddProduct')
            /* İlan Oluştur Fonksiyonu */
          }}
        >
          <Text style={styles.buttonText}>İlan Oluştur</Text>
        </TouchableOpacity>

        <View style={styles.infoBar}>
          <Text style={styles.infoText}>Adresiniz: Manisa</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#E6E6FA",
    padding: 0,
  },
  navigationBar: {
    height: 50,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  navigationText: {
    color: "#fff",
    fontSize: 16,
  },
  logoText: {
    fontWeight: "600",
    fontSize: 54,
    color: "#881deb",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 30,
    borderColor: "#030303",
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "70%",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 18,
    color: "#5d58b2",
  },
  infoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#5d58b2",
  },
});

export default Homepage;
