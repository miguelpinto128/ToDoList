import { initializeTasksDb } from "@/db/tasks";
import { getUserById, initializeUsersDb, UserRow } from "@/db/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const LoginNavigator: FC = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Login" }}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: true, title: "Sign Up" }}
      />
      <Stack.Screen
        name="list"
        options={{ headerShown: true, title: "My ToDo List" }}
      />
    </Stack>
  );
};

const RootLayout: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFocused = useIsFocused();

  const [user, setUser] = useState<UserRow | null>(null);
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  useEffect(() => {
    initializeTasksDb();
    initializeUsersDb();

    const checkLoginStatus = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("@userToken");
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [isFocused]);

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

  if (isLoading) return <ActivityIndicator />;

  if (!loaded) return null;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@userToken");
    router.replace("/");
  };

  const handleProfile = async () => {
    router.push("/profile");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!isLoggedIn ? (
        <LoginNavigator />
      ) : (
        <Drawer
          initialRouteName="list"
          drawerContent={(props) => (
            <DrawerContentScrollView>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: 24,
                  }}
                >
                  <View>
                    {user && (
                      <View
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 20,
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                          {user?.firstname?.[0]?.toUpperCase()}
                          {user?.lastname?.[0]?.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 16 }}>{user?.email}</Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#e0e0e0",
                    marginVertical: 16,
                    marginHorizontal: 16,
                  }}
                />
                <DrawerItemList {...props} />
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#e0e0e0",
                    marginVertical: 16,
                    marginHorizontal: 16,
                  }}
                />
                <TouchableOpacity onPress={handleProfile}>
                  <Text style={{ fontSize: 16, padding: 16 }}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", padding: 16 }}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </DrawerContentScrollView>
          )}
        >
          <Drawer.Screen
            name="list"
            options={{
              drawerLabel: "My ToDo List",
              headerTitle: "My ToDo List",
            }}
          />
          <Drawer.Screen
            name="add"
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle: "Add Task",
            }}
          />
          <Drawer.Screen
            name="[settings]"
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle: "Edit Task",
            }}
          />
          <Drawer.Screen
            name="register"
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle: "Edit Task",
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle: "Profile",
            }}
          />
          <Drawer.Screen
            name="/"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="index"
            options={{
              headerShown: false,
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="editUser"
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle: "User Settings",
            }}
          />
        </Drawer>
      )}
    </GestureHandlerRootView>
  );
};

export default RootLayout;
