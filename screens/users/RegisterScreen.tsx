import { registerUser } from "@/db/users";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { Alert, Appearance, Platform } from "react-native";
import * as Yup from "yup";
import * as S from "./styles"; // Your styled components

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const formikRef = useRef<any>(null);
  const router = useRouter();

  const buttonColor = Platform.select({
    ios: "#007AFF",
    android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
  });

  const onSubmit = async (values: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await registerUser(
        values.username,
        values.firstname,
        values.lastname,
        values.email,
        values.password
      );
      if (response.success) {
        navigation.goBack();
      }
      Alert.alert("Registered!", "User registered successfully.");
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to register user.");
    }
  };

  useEffect(() => {
    formikRef.current?.resetForm();
  }, []);

  return (
    <S.SafeArea>
      <Formik
        innerRef={formikRef}
        initialValues={{
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          firstname: Yup.string().required("First name is required"),
          lastname: Yup.string().required("Last name is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
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
            <S.Label>Username</S.Label>
            <S.Input
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              placeholder="Enter username"
            />
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
              <Feather name="check" size={24} color="white" />
            </S.FloatingButton>
          </S.FormContainer>
        )}
      </Formik>
    </S.SafeArea>
  );
};

export default RegisterScreen;
