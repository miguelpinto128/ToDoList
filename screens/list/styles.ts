// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";

export const StyledSafeAreaView = styled.View`
  flex: 1;
  padding: 16px;
  background-color: white;
`;

export const SwipeableItemContainer = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
  background-color: grey;
`;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

export const FormContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

export const Label = styled.Text`
  font-weight: bold;
  margin-top: 16px;
`;

export const InputWrapper = styled.View`
  width: 100%;
  background-color: #f9f9f9;
  height: 2px;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 4px;
  border: none;
`;

export const ErrorText = styled.Text`
  color: red;
  font-size: 12px;
`;

export const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

export const DateTimeRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
`;

export const DateTimeColumn = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  gap: 8px;
`;

type FloatingButtonProps = {
  bgColor: string;
  disabled: boolean;
};

export const FloatingButton = styled.TouchableOpacity<FloatingButtonProps>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 56px;
  height: 56px;
  background-color: ${(props: FloatingButtonProps) => props.bgColor};
  opacity: ${(props: FloatingButtonProps) => (props.disabled ? 0.5 : 1)};
  justify-content: center;
  align-items: center;
  border-radius: 28px;
`;

export const BackButtonWrapper = styled.TouchableOpacity`
  margin-left: 16px;
`;
