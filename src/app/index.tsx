import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, ScrollView, Text } from "react-native";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzePlant = async (imageUri: string) => {
    try {
      setLoading(true);

      const apiKey =
        process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const base64 =
        await FileSystem.readAsStringAsync(
          imageUri,
          {
            encoding:
              FileSystem.EncodingType.Base64,
          }
        );

      const result =
        await model.generateContent([
          {
            inlineData: {
              data: base64,
              mimeType: "image/jpeg",
            },
          },
          "Identify this plant and explain how to care for it in Mongolian language.",
        ]);

      setAiResult(
        result.response.text()
      );
    } catch (error) {
      console.log(error);
      setAiResult(
        "AI analysis failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission required");
      return;
    }

    const cameraResult =
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

    if (!cameraResult.canceled) {
      const imageUri =
        cameraResult.assets[0].uri;

      setImage(imageUri);

      await analyzePlant(imageUri);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        🌿 Plant AI
      </Text>

      <Button
        title="Take Photo"
        onPress={pickImage}
      />

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

      {loading && (
        <Text
          style={{
            marginTop: 20,
          }}
        >
          Analyzing...
        </Text>
      )}

      {aiResult !== "" && (
        <Text
          style={{
            marginTop: 20,
            fontSize: 16,
          }}
        >
          {aiResult}
        </Text>
      )}
    </ScrollView>
  );
}