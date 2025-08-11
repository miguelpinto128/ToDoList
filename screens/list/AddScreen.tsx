import { addTask } from "@/db/tasks";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import moment from "moment";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Appearance,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import * as S from "./styles";

const AddScreen: FC = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const formikRef = useRef<any>(null);
  const navigation = useNavigation();
  const isIos = Platform.OS === "ios" ? true : false;
  const [shouldRenderDate, setShouldRenderDate] = useState(isIos);
  const [shouldRenderTime, setShouldRenderTime] = useState(isIos);

  const buttonColor = Platform.select({
    ios: "#007AFF",
    android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
  });

  const onSubmit = async (values: {
    title: string;
    description: string;
    date: string;
    time: string;
    completed: boolean;
  }) => {
    try {
      const response = await addTask(
        values.title,
        values.description,
        values.date,
        values.time,
        values.completed
      );

      if (response.success) {
        router.back();
      }
    } catch (error) {
      console.error("Failed to add task:", error);
      return null;
    }
  };

  const titleInputRef = React.useRef<any>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [isFocused]);

  const handleBackPress = useCallback(() => {
    if (formikRef.current && formikRef.current.dirty) {
      Alert.alert(
        "Unsaved changes",
        "You have unsaved changes. Are you sure you want to discard them and leave?",
        [
          { text: "Stay", style: "cancel", onPress: () => {} },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <S.BackButtonWrapper onPress={handleBackPress}>
          <Feather name="arrow-left" size={24} color={buttonColor} />
        </S.BackButtonWrapper>
      ),
    });
  }, [buttonColor, handleBackPress, navigation, router]);

  return (
    <S.SafeArea>
      <Formik
        innerRef={formikRef}
        initialValues={{
          title: "",
          description: "",
          date: new Date().toString(),
          time: new Date().toString(),
          completed: false,
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
          date: Yup.string().required("Date is required"),
          time: Yup.string().required("Time is required"),
          completed: Yup.boolean(),
        })}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          dirty,
        }) => (
          <S.FormContainer>
            <S.Label>Title</S.Label>
            <S.Input
              ref={titleInputRef}
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              placeholder="Enter title"
            />
            <S.InputWrapper />
            {touched.title && errors.title && (
              <S.ErrorText>{errors.title}</S.ErrorText>
            )}

            <S.Label>Description</S.Label>
            <S.Input
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              value={values.description}
              placeholder="Enter description"
            />
            <S.InputWrapper />
            {touched.description && errors.description && (
              <S.ErrorText>{errors.description}</S.ErrorText>
            )}
            <S.Label>Date and Time of conclusion</S.Label>
            <S.DateTimeRow>
              <S.DateTimeColumn>
                {!isIos && (
                  <TouchableOpacity onPress={() => setShouldRenderDate(true)}>
                    <View
                      style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                      }}
                    >
                      <Text>
                        {values.date
                          ? moment(new Date(values.date)).format("YYYY-MM-DD")
                          : moment().format("YYYY-MM-DD")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {shouldRenderDate && (
                  <DateTimePicker
                    mode="date"
                    value={values.date ? new Date(values.date) : new Date()}
                    display="compact"
                    onChange={(_, selectedDate) => {
                      if (selectedDate) {
                        setFieldValue(
                          "date",
                          selectedDate.toISOString().split("T")[0]
                        );
                        if (!isIos) {
                          setShouldRenderDate(false);
                        }
                      }
                    }}
                  />
                )}
                {touched.date && errors.date && (
                  <S.ErrorText>{errors.date}</S.ErrorText>
                )}
              </S.DateTimeColumn>
              <S.DateTimeColumn>
                {!isIos && (
                  <TouchableOpacity onPress={() => setShouldRenderTime(true)}>
                    <View
                      style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                      }}
                    >
                      <Text>
                        {values.date
                          ? moment(new Date(values.date)).format("HH:mm")
                          : moment().format("HH:mm")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {shouldRenderTime && (
                  <DateTimePicker
                    mode="time"
                    value={
                      values.time
                        ? new Date(`2025-01-01T${values.time}:00`)
                        : new Date()
                    }
                    display="compact"
                    onChange={(_, selectedTime) => {
                      if (selectedTime) {
                        if (selectedTime) {
                          const hours = selectedTime
                            .getHours()
                            .toString()
                            .padStart(2, "0");
                          const minutes = selectedTime
                            .getMinutes()
                            .toString()
                            .padStart(2, "0");
                          setFieldValue("time", `${hours}:${minutes}`);
                        }
                        if (!isIos) {
                          setShouldRenderTime(false);
                        }
                      }
                    }}
                  />
                )}
                {touched.time && errors.time && (
                  <S.ErrorText>{errors.time}</S.ErrorText>
                )}
              </S.DateTimeColumn>
            </S.DateTimeRow>
            <S.Label>Completed</S.Label>
            <S.CheckboxContainer>
              <Switch
                value={values.completed}
                onValueChange={(value) => {
                  setFieldValue("completed", value);
                }}
              />
            </S.CheckboxContainer>
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

export default AddScreen;
