import React, { useState, useEffect } from "react";
import firebase from "../../services/firebaseConnection";

import { Container, AreaInput, Input, List } from "./styles";
import Feather from "react-native-vector-icons/Feather";

import CompSearchList from "../../components/SearchList";

export default function PageSearch() {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (input === "" || input === undefined) {
      setUsers([]);
      return;
    }

    const usersSub = firebase
      .firestore()
      .collection("users")
      .where("username", ">=", input)
      .where("username", "<=", input + "\uf8ff")
      .onSnapshot((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setUsers(users);
      });

    return () => usersSub();
  }, [input]);

  return (
    <Container>
      <AreaInput>
        <Feather name="search" size={20} color="#E52246" />
        <Input
          placeholder="Procurando alguém?"
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor="#000"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
      </AreaInput>
      <List
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CompSearchList data={item} />}
      />
    </Container>
  );
}
