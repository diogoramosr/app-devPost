import React, { useState, useContext } from "react";
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import {
  Container,
  Title,
  Input,
  Button,
  ButtonText,
  SignUpButton,
  SignUpText,
} from "./styles";

import { AuthContext } from "../../contexts/auth";

export default function PageLogin() {
  const [login, setLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, signIn, loadingAuth } = useContext(AuthContext);

  function toggleLogin() {
    setLogin(!login);
    setUsername("");
    setEmail("");
    setPassword("");
  }

  async function handleSignIn() {
    if (!email || !password) return alert("Preencha todos os campos");

    await signIn(email, password);
  }

  async function handleSignUp() {
    if (!username || !email || !password)
      return alert("Preencha todos os campos");

    await signUp(email, password, username);
  }

  if (login) {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <Title>
            Dev<Text style={{ color: "#E52246" }}>Post</Text>
          </Title>

          <Input
            placeholder="Endereço de e-mail"
            placeholderTextColor="#99999B"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Password"
            placeholderTextColor="#99999B"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />

          <Button onPress={handleSignIn}>
            {loadingAuth ? (
              <ActivityIndicator size={20} color="#FFF" />
            ) : (
              <ButtonText>Entrar</ButtonText>
            )}
          </Button>

          <SignUpButton onPress={toggleLogin}>
            <SignUpText>Criar conta</SignUpText>
          </SignUpButton>
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Title>
          Dev<Text style={{ color: "#E52246" }}>Post</Text>
        </Title>

        <Input
          placeholder="Username"
          placeholderTextColor="#99999B"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          placeholder="Endereço de e-mail"
          placeholderTextColor="#99999B"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          placeholderTextColor="#99999B"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />

        <Button onPress={handleSignUp}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#FFF" />
          ) : (
            <ButtonText>Cadastrar</ButtonText>
          )}
        </Button>

        <SignUpButton onPress={toggleLogin}>
          <SignUpText>Já tenho uma conta</SignUpText>
        </SignUpButton>
      </Container>
    </TouchableWithoutFeedback>
  );
}
