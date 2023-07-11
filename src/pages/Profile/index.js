import React, { useContext, useState, useEffect } from "react";

import { Modal, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../contexts/auth";
import {
  Container,
  Name,
  Email,
  Button,
  ButtonText,
  UploadButton,
  UploadText,
  Avatar,
  ModalContainer,
  ButtonBack,
  Input,
} from "./styles";

import Feather from "react-native-vector-icons/Feather";

import CompHeader from "../../components/Header";

import firebase from "../../services/firebaseConnection";

export default function PageProfile() {
  const { signOut, user, setUser, storageUser } = useContext(AuthContext);
  const [name, setName] = useState(user && user?.username);
  const [url, setUrl] = useState(user && user?.avatarUrl);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function loadAvatar() {
      try {
        let storageRef = await firebase
          .storage()
          .ref("users")
          .child(user?.uid)
          .getDownloadURL();
        setUrl(storageRef);
      } catch (error) {
        console.log(error);
      }
    }
    loadAvatar();
  }, []);

  async function handleSignOut() {
    await signOut();
  }

  async function updateProfile() {
    if (name === "") {
      alert("Preencha todos os campos");
      return;
    }

    await firebase.firestore().collection("users").doc(user?.uid).update({
      username: name,
    });

    const postDocs = await firebase
      .firestore()
      .collection("posts")
      .where("userId", "==", user?.uid)
      .get();

    postDocs.forEach(async (doc) => {
      await firebase.firestore().collection("posts").doc(doc.id).update({
        autor: name,
      });
    });

    let data = {
      uid: user?.uid,
      username: name,
      email: user?.email,
    };

    setUser(data);
    storageUser(data);
    setOpenModal(false);
  }

  async function uploadFile() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      noData: true,
    });

    if (result.canceled) {
      return;
    }

    if (result.error) {
      console.log(result.error);
      return;
    }

    if (result.assets.length > 0) {
      uploadFileFirebase(result.assets[0]).then(() => {
        uploadAvatar();
      });
      setUrl(result.assets[0].uri);
    }
  }

  const uploadFileFirebase = async (fileUri) => {
    const storageRef = firebase.storage().ref("users").child(user?.uid);
    try {
      await storageRef.put(fileUri.uri);
      console.log("Arquivo enviado com sucesso para o Firebase Storage!");
    } catch (error) {
      console.log("Erro ao enviar o arquivo para o Firebase Storage:", error);
    }
  };

  const uploadAvatar = async () => {
    const storageRef = firebase.storage().ref("users").child(user?.uid);
    try {
      const url = await storageRef
        .getDownloadURL()
        .then(async (image) => {
          const postDocs = await firebase
            .firestore()
            .collection("posts")
            .where("userId", "==", user?.uid)
            .get();

          postDocs.forEach(async (doc) => {
            await firebase.firestore().collection("posts").doc(doc.id).update({
              avatarUrl: image,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("Erro ao enviar o arquivo para o Firebase Storage:", error);
    }
  };

  return (
    <Container>
      <CompHeader />

      {url ? (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
          <Avatar source={{ uri: url }} />
        </UploadButton>
      ) : (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
        </UploadButton>
      )}

      <Name>{user?.username}</Name>
      <Email>{user?.email}</Email>

      <Button bg="#428cfd" onPress={() => setOpenModal(true)}>
        <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
      </Button>

      <Button bg="#DDD" onPress={handleSignOut}>
        <ButtonText color="#353840">Sair</ButtonText>
      </Button>

      <Modal animationType="slide" transparent={true} visible={openModal}>
        <ModalContainer behavior={Platform.OS === "android" ? "" : "padding"}>
          <ButtonBack onPress={() => setOpenModal(false)}>
            <Feather name="arrow-left" size={22} color="#121212" />
            <ButtonText color="#121212">Voltar</ButtonText>
          </ButtonBack>
          <Input
            placeholder={user.username}
            placeholderTextColor="#121212"
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <Button bg="#428cfd" onPress={updateProfile}>
            <ButtonText color="#FFF">Atualizar</ButtonText>
          </Button>
        </ModalContainer>
      </Modal>
    </Container>
  );
}
