import { deleteUserById, getUserById, UserRow } from "@/db/users";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Alert, Appearance, Platform } from "react-native";
import * as S from "./styles";

const buttonColor = Platform.select({
  ios: "#007AFF",
  android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
});

const ProfileScreen: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserRow | null>(null);
  const isFocused = useIsFocused();

  const fetchUser = useCallback(async () => {
    const token = await AsyncStorage.getItem("@userToken");
    if (token) {
      try {
        setIsLoading(true);

        const response = await getUserById(Number(token));

        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        router.replace("/");
        Alert.alert("Error", "Failed to fetch user");
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, isFocused]);

  const handleSettings = async () => {
    router.push("/editUser");
  };

  const handleDeleteUser = async () => {
    const token = await AsyncStorage.getItem("@userToken");
    if (token) {
      try {
        const response = await deleteUserById(Number(token));
        if (response.success) {
          Alert.alert("Success", "User deleted successfully");
          router.replace("/");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to delete user");
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <S.SafeArea>
        <S.Title>Profile</S.Title>
        <S.FormContainer>
          <S.Label>Loading...</S.Label>
        </S.FormContainer>
      </S.SafeArea>
    );
  }

  return (
    <S.SafeArea>
      <S.FormContainer>
        <S.Label>Username</S.Label>
        <S.Input value={user?.username || "No username"} editable={false} />
        <S.Label>First Name</S.Label>
        <S.Input value={user?.firstname || "No first name"} editable={false} />
        <S.Label>Last Name</S.Label>
        <S.Input value={user?.lastname || "No last name"} editable={false} />
        <S.Label>Email</S.Label>
        <S.Input value={user?.email || "No email"} editable={false} />
        <S.FloatingButton bgColor={buttonColor} onPress={handleSettings}>
          <Feather name="edit" size={24} color="white" />
        </S.FloatingButton>
        <S.FloatingButtonLeft
          bgColor="red"
          onPress={() => {
            Alert.alert(
              "Warning",
              "Are you sure you want to delete your user?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: handleDeleteUser },
              ],
              { cancelable: true }
            );
          }}
        >
          <Feather name="trash" size={24} color="white" />
        </S.FloatingButtonLeft>
      </S.FormContainer>
    </S.SafeArea>
  );
};

export default ProfileScreen;
