import { loginUser } from "@/db/users";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { FC, useEffect, useRef } from "react";
import { Alert, Appearance, Platform } from "react-native";
import * as Yup from "yup";
import * as S from "./styles";

const buttonColor = Platform.select({
  ios: "#007AFF",
  android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
});

const LoginScreen: FC = () => {
  const router = useRouter();
  const formikRef = useRef<any>(null);
  const isFocused = useIsFocused();

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await loginUser(values.email, values.password);
      if (response.success) {
        await AsyncStorage.setItem("@userToken", JSON.stringify(response.data));

        router.replace("/list");
      }
    } catch (error) {
      Alert.alert("Invalid credentials");
      return null;
    }
  };

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [isFocused]);

  return (
    <S.SafeArea>
      <S.Title>Login</S.Title>
      <Formik
        innerRef={formikRef}
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Min 6 characters")
            .required("Password is required"),
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
            <S.Label>Email</S.Label>
            <S.Input
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <S.ErrorText>{errors.email}</S.ErrorText>
            )}

            <S.Label>Password</S.Label>
            <S.Input
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Enter password"
              secureTextEntry
            />
            {touched.password && errors.password && (
              <S.ErrorText>{errors.password}</S.ErrorText>
            )}

            <S.FloatingButton
              disabled={!dirty}
              bgColor={buttonColor}
              onPress={handleSubmit as any}
            >
              <Feather name="log-in" size={24} color="white" />
            </S.FloatingButton>
            <S.FloatingButtonLeft
              bgColor={buttonColor}
              onPress={() => router.push("/register")}
            >
              <Feather name="user-plus" size={24} color="white" />
            </S.FloatingButtonLeft>
          </S.FormContainer>
        )}
      </Formik>
    </S.SafeArea>
  );
};

export default LoginScreen;
