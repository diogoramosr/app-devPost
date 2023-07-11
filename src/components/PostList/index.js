import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  Header,
  Avatar,
  Name,
  ContentView,
  Content,
  Actions,
  LikeButton,
  Like,
  TimePost,
} from "./styles";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

import firebase from "../../services/firebaseConnection";

export default function PagePostList({ data, userId }) {
  const [like, setLike] = useState(data?.likes);
  const navigation = useNavigation();

  function formateTimePost() {
    const datePost = new Date(data.createdAt.seconds * 1000);
    return formatDistance(new Date(), datePost, {
      locale: ptBR,
    });
  }

  async function handleLikePost(id, likes) {
    const docId = `${userId}_${id}`;

    // CHECAR SE O POST JÁ FOI CURTIDO
    const likeRef = await firebase
      .firestore()
      .collection("likes")
      .doc(docId)
      .get();

    if (likeRef.exists) {
      // DELETAR O LIKE
      await firebase
        .firestore()
        .collection("posts")
        .doc(id)
        .update({
          likes: likes - 1,
        });
      await firebase
        .firestore()
        .collection("likes")
        .doc(docId)
        .delete()
        .then(() => {
          setLike(likes - 1);
        });
      return;
    }

    // ADICIONAR O LIKE
    await firebase.firestore().collection("likes").doc(docId).set({
      postId: id,
      userId: userId,
    });
    await firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .update({
        likes: likes + 1,
      })
      .then(() => {
        setLike(likes + 1);
      });
  }

  return (
    <Container>
      <Header
        onPress={() =>
          navigation.navigate("Posts", {
            title: data.autor,
            userId: data.userId,
          })
        }
      >
        {data.avatarUrl ? (
          <Avatar source={{ uri: data.avatarUrl }} />
        ) : (
          <Avatar source={require("../../assets/avatar.png")} />
        )}
        <Name numberOfLines={1}>{data?.autor}</Name>
      </Header>
      <ContentView>
        <Content>{data?.content}</Content>
      </ContentView>
      <Actions>
        <LikeButton onPress={() => handleLikePost(data.id, like)}>
          <Like>{like}</Like>
          <MaterialCommunityIcons
            name={like === 0 ? "heart-plus-outline" : "cards-heart"}
            size={20}
            color="#E52246"
          />
        </LikeButton>
        <TimePost>há {formateTimePost()}</TimePost>
      </Actions>
    </Container>
  );
}
