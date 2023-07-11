import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #36393f;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 55px;
  color: #fff;
  font-weight: bold;
  font-style: italic;
`;

export const Input = styled.TextInput`
  width: 80%;
  background-color: #fff;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  font-size: 17px;
`;

export const Button = styled.TouchableOpacity`
  width: 80%;
  background-color: #418cfd;
  border-radius: 8px;
  margin-top: 10px;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export const SignUpButton = styled.TouchableOpacity`
  width: 100%;
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;

export const SignUpText = styled.Text`
  color: #fff;
  font-size: 17px;
`;
