import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      
      style={{
        backgroundColor: '#5d58b2',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        marginHorizontal:50
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
