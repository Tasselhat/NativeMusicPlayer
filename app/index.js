import React, { useState, useEffect } from "react";
import NDK from "@nostr-dev-kit/ndk";
import { View, ScrollView, SafeAreaView, Text } from "react-native";
import { Stack, useRouter } from "expo-router";

import { ScreenHeaderMenuButton } from "../components";

import styles from "../styles/home.style";

const Home = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const ndk = new NDK({
    explicitRelayUrls: ["wss://relay.nostr.band", "wss://relay.damus.io", "wss://purplepag.es"],
  });
  ndk.connect().then(() => {
    console.log("connected");
  });

  const user = ndk.getUser({
    npub: "npub1ymxqla07nssw2p4cwynkkefgke3j599fmajp52cwh0cpdckkt58szfaeuq",
  });

  useEffect(() => {
    user.fetchProfile().then((profile) => {
      if (user.profile) setUserProfile(user.profile);
    });
  }, []);

  useEffect(() => {
    ndk
      .fetchEvents({
        kinds: [1],
        authors: [user.hexpubkey().toString()],
        limit: 10,
      })
      .then((events) => {
        events.forEach((event) => {
          if (event) setUserPosts((prevPosts) => [...prevPosts, event]);
        });
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#dddddd" }}>
      <Stack.Screen
        options={{
          heaaderStyle: { backgroundColor: "#dddddd" },
          headerShadowVisible: false,
          headerLeft: () => <ScreenHeaderMenuButton dimension="60%" />,
          headerTitle: () => (
            <Text style={{ color: "#111111", fontSize: 20, textAlign: "center", minWidth: 100 }}>
              Home
            </Text>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={styles.userName}>{userProfile?.username}</Text>
          <Text style={styles.displayName}>{userProfile?.displayName}</Text>
          <Text>Bio: {userProfile?.about}</Text>
          <Text>Website: {userProfile?.website}</Text>
          {userPosts?.map((post, index) => {
            const date = new Date(post?.created_at * 1000);
            return (
              <View key={index} style={styles.postContainer}>
                <View>
                  <Text style={styles.postText}>{post?.content}</Text>
                </View>
                <Text>{date.toISOString().split("T")[0]}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
