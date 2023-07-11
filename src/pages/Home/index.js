import React, { useState, useContext, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { ActivityIndicator, View } from "react-native";
import { Container, ButtonPost, ListPosts } from "./styles";

import CompHeader from "../../components/Header";
import CompPostList from "../../components/PostList";
import Father from "react-native-vector-icons/Feather";

import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";
import { set } from "date-fns";

export default function PageHome() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);
  const [lastItem, setLastItem] = useState("");
  const [emptyList, setEmptyList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchPosts() {
        firebase
          .firestore()
          .collection("posts")
          .orderBy("createdAt", "desc")
          .limit(5)
          .get()
          .then((snapshot) => {
            if (isActive) {
              setPosts([]);
              const postList = [];

              snapshot.docs.map((doc) => {
                if (doc.data().userId === user.uid) {
                  postList.push({
                    ...doc.data(),
                    id: doc.id,
                  });
                }
              });
              setEmptyList(!!snapshot.empty);
              setPosts(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1]);
              setLoading(false);
            }
          });
      }
      fetchPosts();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // buscar posts quando puxar a lista para cima (refresh)
  async function handleRefreshPosts() {
    setRefreshing(true);
    firebase
      .firestore()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get()
      .then((snapshot) => {
        setPosts([]);
        const postList = [];

        snapshot.docs.map((doc) => {
          postList.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setEmptyList(false);
        setPosts(postList);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      });
    setRefreshing(false);
  }

  // buscar ao chegar no final da lista
  async function handleGetMorePosts() {
    if (emptyList) {
      setLoading(false);
      return null;
    }

    if (loading) return;

    firebase
      .firestore()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(5)
      .startAfter(lastItem)
      .get()
      .then((snapshot) => {
        const postList = [];
        snapshot.docs.map((doc) => {
          postList.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setEmptyList(!!snapshot.empty);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setPosts((oldPosts) => [...oldPosts, ...postList]);
        setLoading(false);
      });
  }

  return (
    <Container>
      <CompHeader />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={50} color="#E52246" />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CompPostList data={item} userId={user?.uid} />
          )}
          refreshing={refreshing}
          onRefresh={handleRefreshPosts}
          onEndReached={() => handleGetMorePosts()}
          onEndReachedThreshold={0.2}
        />
      )}

      <ButtonPost
        onPress={() => navigation.navigate("NewPost")}
        activeOpacity={0.5}
      >
        <Father name="edit-2" size={25} color="#fff" />
      </ButtonPost>
    </Container>
  );
}
