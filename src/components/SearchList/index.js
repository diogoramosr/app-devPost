import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Container, Name } from "./styles";

export default function CompSearchList({ data }) {
  const navigation = useNavigation();

  return (
    <Container
      onPress={() =>
        navigation.navigate("Posts", { title: data.username, userId: data.id })
      }
    >
      <Name>{data.username}</Name>
    </Container>
  );
}
