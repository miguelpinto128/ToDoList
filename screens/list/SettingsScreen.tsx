import { deleteTaskById, getTaskById, TaskRow, updateTask } from "@/db/tasks";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
  Switch,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import * as S from "./styles";

const SettingsScreen: FC = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const formikRef = useRef<any>(null);
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<TaskRow>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const titleInputRef = React.useRef<any>(null);
  const buttonColor = Platform.select({
    ios: "#007AFF",
    android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();

      Alert.alert(
        "Are you sure?",
        "Do you want to go back? Unsaved changes may be lost.",
        [
          { text: "Stay", style: "cancel", onPress: () => {} },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation]);

  const onDelete = useCallback(
    async (id: number) => {
      try {
        const response = await deleteTaskById(Number(id));

        if (response.success) {
          router.back();
        }
      } catch {
        Alert.alert(
          "Warning",
          "Failed to delete task.",
          [{ text: "OK", style: "cancel" }],
          { cancelable: true }
        );
        return null;
      }
    },
    [router]
  );

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
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            Alert.alert(
              "Warning",
              "Are you sure you want to delete this task?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => onDelete(Number(id)) },
              ],
              { cancelable: true }
            );
          }}
        >
          <Feather name="trash" size={24} color={buttonColor} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <S.BackButtonWrapper onPress={handleBackPress}>
          <Feather name="arrow-left" size={24} color={buttonColor} />
        </S.BackButtonWrapper>
      ),
    });
  }, [buttonColor, handleBackPress, id, navigation, onDelete, router]);

  const onSubmit = async (values: {
    title: string;
    description: string;
    date: string;
    time: string;
    completed: boolean;
  }) => {
    try {
      const response = await updateTask(
        Number(id),
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

  useEffect(() => {
    titleInputRef.current?.focus();
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [isFocused]);

  const fetchTask = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getTaskById(Number(id));

      if (response.success) {
        setTask(response.data);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch task.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: true }
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask, isFocused]);

  if (isLoading) {
    return (
      <S.StyledSafeAreaView>
        <ActivityIndicator />
      </S.StyledSafeAreaView>
    );
  }

  return (
    <S.SafeArea>
      <Formik
        innerRef={formikRef}
        initialValues={{
          title: task?.title ?? "",
          description: task?.description ?? "",
          date: task?.date ?? "",
          time: task?.time ?? "",
          completed: task?.completed ?? false,
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
                <DateTimePicker
                  mode="date"
                  value={values.date ? new Date(values.date) : new Date()}
                  display={Platform.OS === "ios" ? "compact" : "default"}
                  onChange={(_, selectedDate) => {
                    if (selectedDate) {
                      setFieldValue(
                        "date",
                        selectedDate.toISOString().split("T")[0]
                      );
                    }
                  }}
                />
                {touched.date && errors.date && (
                  <S.ErrorText>{errors.date}</S.ErrorText>
                )}
              </S.DateTimeColumn>
              <S.DateTimeColumn>
                <DateTimePicker
                  mode="time"
                  value={values.date ? new Date(values.date) : new Date()}
                  display={Platform.OS === "ios" ? "compact" : "default"}
                  onChange={(_, selectedTime) => {
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
                  }}
                />
                {touched.time && errors.time && (
                  <S.ErrorText>{errors.time}</S.ErrorText>
                )}
              </S.DateTimeColumn>
            </S.DateTimeRow>
            <S.Label>Completed</S.Label>
            <S.CheckboxContainer>
              <Switch
                value={Boolean(values.completed)}
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

export default SettingsScreen;
