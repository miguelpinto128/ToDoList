import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "./LoginScreen";
import { loginUser } from "@/db/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Mock dependencies
jest.mock("@/db/users", () => ({
  loginUser: jest.fn(),
}));
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("LoginScreen", () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText("Login")).toBeTruthy();
    expect(getByPlaceholderText("Enter email")).toBeTruthy();
    expect(getByPlaceholderText("Enter password")).toBeTruthy();
  });

  it("shows validation errors", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Enter email"), "invalid-email");
    fireEvent.changeText(getByPlaceholderText("Enter password"), "123");
    fireEvent.press(getByText(/log-in/i));
    await waitFor(() => {
      expect(getByText("Invalid email")).toBeTruthy();
      expect(getByText("Min 6 characters")).toBeTruthy();
    });
  });

  it("calls loginUser and navigates on success", async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      success: true,
      data: { token: "abc123" },
    });
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText(/log-in/i));
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@userToken",
        JSON.stringify({ token: "abc123" })
      );
      expect(mockReplace).toHaveBeenCalledWith("/list");
    });
  });

  it("shows alert on login failure", async () => {
    jest.spyOn(global, "alert").mockImplementation(() => {});
    (loginUser as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials")
    );
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText(/log-in/i));
    await waitFor(() => {
      // Alert.alert is used, so we check if it was called
      expect(global.alert).toHaveBeenCalled();
    });
    (global.alert as jest.Mock).mockRestore();
  });

  it("navigates to register screen", () => {
    const { getByTestId } = render(<LoginScreen />);
    fireEvent.press(getByTestId("FloatingButtonLeft"));
    expect(mockPush).toHaveBeenCalledWith("/register");
  });
});
