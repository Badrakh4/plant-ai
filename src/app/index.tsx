import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, Text, View } from "react-native";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          marginBottom: 20,
        }}
      >
        🌿 Plant AI
      </Text>

      <Button title="Take Photo" onPress={pickImage} />

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 250,
            height: 250,
            marginTop: 20,
            borderRadius: 12,
          }}
        />
      )}
    </View>
  );
}
