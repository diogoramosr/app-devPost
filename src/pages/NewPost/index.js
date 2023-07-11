import React, { useState, useLayoutEffect, useContext } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Container, Input, Button, ButtonText } from "./styles";

import { AuthContext } from "../../contexts/auth";

import firebase from "../../services/firebaseConnection";

export default function PagePost() {
  const navigation = useNavigation();
  const [post, setPost] = useState("");

  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    const options = navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => handlePost()}>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      ),
    });
  }, [navigation, post]);

  
  async function handlePost() {
    if (post === "") {
      alert("Preencha o campo!");
      return;
    }
    let avatarUrl = null;
    try {
      let response = await firebase
        .storage()
        .ref("users")
        .child(user?.uid)
        .getDownloadURL();
      avatarUrl = response;
    } catch (error) {
      avatarUrl = null;
      console.log(error);
    }

    await firebase
      .firestore()
      .collection("posts")
      .add({
        createdAt: new Date(),
        content: post,
        autor: user?.username,
        userId: user?.uid,
        likes: 0,
        avatarUrl: avatarUrl,
      })
      .then(() => {
        setPost("");
        Keyboard.dismiss();
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Input
          placeholder="O que está acontecendo?"
          placeholderTextColor={"#FFF"}
          value={post}
          onChangeText={(text) => setPost(text)}
          autoCorrect={false}
          multiline={true}
          maxLength={500}
        />
      </Container>
    </TouchableWithoutFeedback>
  );
}
