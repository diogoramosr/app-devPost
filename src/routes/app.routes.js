import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PageHome from "../pages/Home";
import PageProfile from "../pages/Profile";
import PageSearch from "../pages/Search";
import PagePosts from "../pages/PostsUser";
import PageNewPost from "../pages/NewPost";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import Father from "react-native-vector-icons/Feather";

function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={PageHome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewPost"
        component={PageNewPost}
        options={{
          title: "Novo Post",
          headerTintColor: "#FFF",
          headerStyle: {
            backgroundColor: "#36393F",
          },
        }}
      />
      <Stack.Screen
        name="Posts"
        component={PagePosts}
        options={{
          headerTintColor: "#FFF",
          headerStyle: {
            backgroundColor: "#36393F",
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFF",
        tabBarStyle: {
          backgroundColor: "#202225",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={StackRoutes}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Father name="home" color={color} size={size} />;
          },
        }}
      />

      <Tab.Screen
        name="Search"
        component={PageSearch}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Father name="search" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={PageProfile}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Father name="user" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}


