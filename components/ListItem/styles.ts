// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";
// eslint-disable-next-line import/no-named-as-default
import Checkbox from "expo-checkbox";

export const ListItemWrapper = styled.TouchableOpacity`
  flex: 1;
  justify-content: start;
  align-items: center;
  gap: 8px;
  padding: 16px;
  flex-direction: row;
  background-color: white;
`;

export const ListItemTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const ListItemDescription = styled.Text`
  font-size: 14px;
  color: gray;
`;

export const ListItemDate = styled.Text`
  font-size: 12px;
  color: darkgray;
`;

export const StyledCheckbox = styled(Checkbox)`
  margin-right: 12px;
`;
