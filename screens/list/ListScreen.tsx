import { ListItem } from "@/components";
import { getAllTasks, TaskRow, updateTaskCompleted } from "@/db/tasks";
import Feather from "@expo/vector-icons/Feather";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";
import SwipeableItem, {
  SwipeableItemImperativeRef,
} from "react-native-swipeable-item";
import * as S from "./styles";

const ListScreen: FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [tasks, setTasks] = useState<TaskRow[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const itemRef = useRef<SwipeableItemImperativeRef>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const buttonColor = Platform.select({
    ios: "#007AFF",
    android: Appearance.getColorScheme() === "dark" ? "#BB86FC" : "#6200EE",
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getAllTasks();

      if (response.success) {
        setTasks(response.data);

        if (response.data?.length) {
          const completedIds = response?.data
            .filter((t) => t.completed)
            .map((t) => t.id.toString());
          setSelectedItems(completedIds);
        }
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      fetchTasks();
      setRefreshing(false);
    }, 1500);
  }, []);

  const onTaskClick = async (id: number, completed: number) => {
    try {
      await updateTaskCompleted(id, Boolean(completed));
      const updatedTasks = tasks?.map((task) =>
        task.id === id ? { ...task, completed: Boolean(completed) } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to update task:", error);
      return null;
    }
  };

  if (isLoading) {
    return (
      <S.StyledSafeAreaView>
        <ActivityIndicator />
      </S.StyledSafeAreaView>
    );
  }

  if (!tasks?.length) {
    return (
      <S.StyledSafeAreaView>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Feather name="inbox" size={48} color="#ccc" />
          <Text>No tasks yet</Text>
          <S.FloatingButton
            style={{ marginTop: 24 }}
            bgColor={buttonColor}
            onPress={() => router.push(`/add`)}
          >
            <Feather name="plus" size={24} color="white" />
          </S.FloatingButton>
        </View>
      </S.StyledSafeAreaView>
    );
  }

  return (
    <S.StyledSafeAreaView>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableItem
            ref={itemRef}
            key={item.id}
            item={item}
            snapPointsLeft={[56]}
            renderUnderlayLeft={() => (
              <S.SwipeableItemContainer
                onPress={() => {
                  router.push(`/settings?id=${item.id}`);
                  itemRef.current?.close();
                }}
              >
                <Feather
                  name="settings"
                  size={24}
                  color="white"
                  style={{ marginRight: 16 }}
                />
              </S.SwipeableItemContainer>
            )}
          >
            <ListItem
              title={item.title}
              description={item.description}
              date={item.date}
              time={item.time}
              isSelected={selectedItems.includes(item.id.toString())}
              onPress={() => {
                if (
                  selectedItems.includes(item.id.toString()) ||
                  Boolean(item.completed)
                ) {
                  onTaskClick(item.id, 0);
                  setSelectedItems(
                    selectedItems.filter((id) => id !== item.id.toString())
                  );
                } else {
                  onTaskClick(item.id, 1);
                  setSelectedItems([...selectedItems, item.id.toString()]);
                }
              }}
            />
          </SwipeableItem>
        )}
      />
      <S.FloatingButton
        style={{ marginBottom: 32, marginRight: 16 }}
        bgColor={buttonColor}
        onPress={() => router.push(`/add`)}
      >
        <Feather name="plus" size={24} color="white" />
      </S.FloatingButton>
    </S.StyledSafeAreaView>
  );
};

export default ListScreen;
