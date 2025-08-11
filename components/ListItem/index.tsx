import React from "react";
import { View } from "react-native";
import * as S from "./styles";

type ListItemProps = {
  title: string;
  description?: string;
  date?: string;
  onPress?: () => void;
  isSelected?: boolean;
};

export const ListItem = ({
  title,
  description,
  date,
  onPress,
  isSelected,
  ...props
}: ListItemProps) => {
  return (
    <S.ListItemWrapper activeOpacity={1} onPress={onPress} {...props}>
      <S.StyledCheckbox value={isSelected} />
      <View>
        <S.ListItemTitle numberOfLines={1}>{title}</S.ListItemTitle>
        {description && (
          <S.ListItemDescription numberOfLines={1}>
            {description}
          </S.ListItemDescription>
        )}
        {date && <S.ListItemDate numberOfLines={1}>{date}</S.ListItemDate>}
      </View>
    </S.ListItemWrapper>
  );
};
