import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PageLogin from "../pages/Login";

const Stack = createNativeStackNavigator();

export default function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={PageLogin}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
