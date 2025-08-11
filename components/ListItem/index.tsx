import moment from "moment";
import React from "react";
import { View } from "react-native";
import * as S from "./styles";

type ListItemProps = {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  onPress?: () => void;
  isSelected?: boolean;
};

export const ListItem = ({
  title,
  description,
  date,
  time,
  onPress,
  isSelected,
  ...props
}: ListItemProps) => {
  return (
    <S.ListItemWrapper activeOpacity={1} onPress={onPress} {...props}>
      <S.StyledCheckbox value={isSelected} pointerEvents="none" />
      <View>
        <S.ListItemTitle numberOfLines={1}>{title}</S.ListItemTitle>
        {description && (
          <S.ListItemDescription numberOfLines={1}>
            {description}
          </S.ListItemDescription>
        )}
        <View style={{ flexDirection: "row" }}>
          {date && (
            <S.ListItemDate numberOfLines={1}>
              {moment(
                moment(date, moment.ISO_8601, true).isValid() ? date : undefined
              ).format("YYYY-MM-DD")}
            </S.ListItemDate>
          )}
          <S.ListItemDate> | </S.ListItemDate>
          {time && (
            <S.ListItemDate numberOfLines={1}>
              {moment(time, "HH:mm").format("hh:mm A")}
            </S.ListItemDate>
          )}
        </View>
      </View>
    </S.ListItemWrapper>
  );
};
