import { addTask } from "@/db/tasks";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import AddScreen from "../screens/list/AddScreen";
const router = require("expo-router").useRouter();

jest.mock("@/db/tasks", () => ({
  addTask: jest.fn(),
}));
jest.mock("@expo/vector-icons/Feather", () => "Feather");
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");
jest.mock("@react-navigation/native", () => ({
  useIsFocused: jest.fn(() => true),
}));
jest.mock("expo-router", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

describe("AddScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields", () => {
    const { getByPlaceholderText, getByText } = render(<AddScreen />);
    expect(getByPlaceholderText("Enter title")).toBeTruthy();
    expect(getByPlaceholderText("Enter description")).toBeTruthy();
    expect(getByText("Date and Time of conclusion")).toBeTruthy();
    expect(getByText("Completed")).toBeTruthy();
  });

  it("calls addTask and navigates back on successful submit", async () => {
    (addTask as jest.Mock).mockResolvedValue({ success: true });
    const { getByPlaceholderText, getByTestId } = render(<AddScreen />);
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Enter title"), "Test Title");
      fireEvent.changeText(
        getByPlaceholderText("Enter description"),
        "Test Desc"
      );
      fireEvent.changeText(getByPlaceholderText("Enter title"), "Test Title");
    });
    const submitButton = getByTestId("submit-button");
    await act(async () => {
      fireEvent.press(submitButton);
    });
    await waitFor(() => {
      expect(addTask).toHaveBeenCalled();
    });
  });

  it("toggles completed switch", () => {
    const { getByTestId } = render(<AddScreen />);
    const switchInput = getByTestId("completed-switch");
    expect(switchInput.props.value).toBe(false);
    fireEvent(switchInput, "valueChange", true);
    expect(switchInput.props.value).toBe(true);
  });
});
