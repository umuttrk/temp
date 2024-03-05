import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAppBar = ({navigation}) => {
  return (
    <View style={styles.appBar}>
      <Text style={styles.title}>Anasayfa</Text>
      <TouchableOpacity onPress={() =>  navigation.navigate('Settings',{ /* diğer parametreler */ key: new Date().toISOString() })}>
        <Text style={styles.button}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',         
    backgroundColor: '#881deb',
    padding: 5, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 90,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eee',
  },
  button: {
    fontSize: 18,
    color: '#eee',
  },
});

export default CustomAppBar;
