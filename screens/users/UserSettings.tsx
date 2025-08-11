import { getAllUserDataById, updateUserInfo, UpdateUserRow } from "@/db/users";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Appearance,
  Platform,
  View,
} from "react-native";
import * as Yup from "yup";
import * as S from "./styles";

const buttonColor = Platform.select({
  ios: "#007AFF",
  android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
});

const EditUserScreen: FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const formikRef = useRef<any>(null);
  const [user, setUser] = useState<UpdateUserRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const fetchUser = useCallback(async () => {
    const token = await AsyncStorage.getItem("@userToken");
    if (token) {
      try {
        setIsLoading(true);
        const response = await getAllUserDataById(Number(token));
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        router.replace("/");
        Alert.alert("Error", "Failed to fetch user");
      } finally {
        setIsLoading(false);
      }
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (formikRef.current && formikRef.current.dirty) {
        e.preventDefault();
        Alert.alert(
          "Unsaved changes",
          "You have unsaved changes. Are you sure you want to discard them and leave?",
          [
            { text: "Stay", style: "cancel", onPress: () => {} },
            {
              text: "Leave",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }
    });
    return unsubscribe;
  }, [navigation]);

  const onSubmit = async (values: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    const token = await AsyncStorage.getItem("@userToken");
    if (token && user) {
      try {
        const response = await updateUserInfo(
          user?.id,
          values.username,
          values.firstname,
          values.lastname,
          values.email,
          values.password
        );
        if (response.success) {
          Alert.alert("Success", "User updated successfully");
          router.back();
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update user");
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <S.BackButtonWrapper onPress={() => router.push("/profile")}>
          <Feather name="arrow-left" size={24} color={buttonColor} />
        </S.BackButtonWrapper>
      ),
    });
  }, [navigation, router]);

  if (isLoading || !user) {
    return (
      <S.SafeArea>
        <ActivityIndicator />
      </S.SafeArea>
    );
  }

  return (
    <S.SafeArea>
      <Formik
        innerRef={formikRef}
        initialValues={{
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
        }}
        validationSchema={Yup.object({
          username: Yup.string().notRequired(),
          firstname: Yup.string().notRequired(),
          lastname: Yup.string().notRequired(),
          email: Yup.string().email("Invalid email").notRequired(),
          password: Yup.string().notRequired(),
        })}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          dirty,
        }) => (
          <S.FormContainer>
            <S.Label>Username</S.Label>
            <S.Input
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              placeholder="Enter username"
            />
            <S.Separator />
            {touched.username && errors.username && (
              <S.ErrorText>{errors.username}</S.ErrorText>
            )}

            <S.Label>First Name</S.Label>
            <S.Input
              onChangeText={handleChange("firstname")}
              onBlur={handleBlur("firstname")}
              value={values.firstname}
              placeholder="Enter first name"
            />
            <S.Separator />
            {touched.firstname && errors.firstname && (
              <S.ErrorText>{errors.firstname}</S.ErrorText>
            )}

            <S.Label>Last Name</S.Label>
            <S.Input
              onChangeText={handleChange("lastname")}
              onBlur={handleBlur("lastname")}
              value={values.lastname}
              placeholder="Enter last name"
            />
            <S.Separator />
            {touched.lastname && errors.lastname && (
              <S.ErrorText>{errors.lastname}</S.ErrorText>
            )}

            <S.Label>Email</S.Label>
            <S.Input
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <S.Separator />
            {touched.email && errors.email && (
              <S.ErrorText>{errors.email}</S.ErrorText>
            )}

            <S.Label>Password</S.Label>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <S.Input
                style={{ flex: 1 }}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <View style={{ width: 40 }}>
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={buttonColor}
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              </View>
            </View>
            <S.Separator />
            {touched.password && errors.password && (
              <S.ErrorText>{errors.password}</S.ErrorText>
            )}

            <S.FloatingButton
              disabled={!dirty}
              bgColor={buttonColor}
              onPress={handleSubmit as any}
            >
              <Feather name="check" size={24} color="white" />
            </S.FloatingButton>
          </S.FormContainer>
        )}
      </Formik>
    </S.SafeArea>
  );
};

export default EditUserScreen;
