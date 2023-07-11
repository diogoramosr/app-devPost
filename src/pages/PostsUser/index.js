import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { View, ActivityIndicator } from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";

import CompListPost from "../../components/PostList";

import { Container, ListPosts } from "./styles";

export default function PagePosts() {
  const route = useRoute();
  const navigation = useNavigation();
  const [title, setTitle] = useState(route.params?.title);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === "" ? "" : title,
    });
  }, [navigation, title]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      firebase
        .firestore()
        .collection("posts")
        .where("userId", "==", route.params?.userId)
        .orderBy("createdAt", "desc")
        .get()
        .then((snapshot) => {
          const postList = [];
          snapshot.docs.map((doc) => {
            postList.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          if (isActive) {
            setPosts(postList);
            setLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <Container>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color="#E52246" size={50} />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CompListPost data={item} userId={user?.uid} />
          )}
        />
      )}
    </Container>
  );
}
