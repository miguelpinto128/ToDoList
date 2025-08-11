import ListScreen from "@/app/list";
import * as tasksDb from "@/db/tasks";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@/db/tasks");
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => true,
}));
jest.mock("@expo/vector-icons/Feather", () => "Feather");

jest.mock("expo-sqlite", () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
    executeSql: jest.fn(),
  })),
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      transactionAsync: jest.fn(),
      executeSqlAsync: jest.fn(),
    })
  ),
}));

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("<ListScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading indicator when loading", async () => {
    (tasksDb.getAllTasks as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    const { getByTestId } = render(<ListScreen />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
    expect(() => getByTestId("TaskList")).toThrow();
  });

  test("renders empty state when no tasks", async () => {
    (tasksDb.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
    const { getByText } = render(<ListScreen />);
    await waitFor(() => {
      expect(getByText("No tasks yet")).toBeTruthy();
    });
  });

  test("renders tasks when present", async () => {
    (tasksDb.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          title: "Task 1",
          description: "Desc 1",
          date: "2024-06-01",
          time: "10:00",
          completed: false,
        },
        {
          id: 2,
          title: "Task 2",
          description: "Desc 2",
          date: "2024-06-02",
          time: "11:00",
          completed: true,
        },
      ],
    });
    const { getByText } = render(<ListScreen />);
    await waitFor(() => {
      expect(getByText("Task 1")).toBeTruthy();
      expect(getByText("Task 2")).toBeTruthy();
    });
  });

  test("calls router.push when FloatingButton is pressed", async () => {
    (tasksDb.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    const { getByTestId } = render(<ListScreen />);
    const floatingButton = await waitFor(() => getByTestId("addButton"));
    fireEvent.press(floatingButton);
    expect(mockPush).toHaveBeenCalledWith("/add");
  });

  test("calls updateTaskCompleted when task is toggled", async () => {
    (tasksDb.getAllTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          title: "Task 1",
          description: "Desc 1",
          date: "2024-06-01",
          time: "10:00",
          completed: false,
        },
      ],
    });
    (tasksDb.updateTaskCompleted as jest.Mock).mockResolvedValue({});
    const { getByText } = render(<ListScreen />);
    await waitFor(() => {
      fireEvent.press(getByText("Task 1"));
      expect(tasksDb.updateTaskCompleted).toHaveBeenCalledWith(1, true);
    });
  });
});
