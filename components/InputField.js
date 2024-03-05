import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  fieldButtonStyle,
  onChangeFunction,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
        marginHorizontal: 0,
      }}
    >
      {icon}
      {inputType == "password" ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          secureTextEntry={true}
          onChangeText={onChangeFunction}

        />
      ) : (
        <TextInput
          onChangeText={onChangeFunction}
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text
          style={{
            color: fieldButtonStyle ? fieldButtonStyle["color"] : "black",
            fontWeight: "700",
          }}
        >
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
