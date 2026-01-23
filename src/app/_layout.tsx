import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
    return <React.Fragment>
        <StatusBar style="auto" />
        <Stack>
            <Stack.Protected guard={false}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={true}>
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    </React.Fragment>
}