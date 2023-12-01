import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { AudioContext } from "../context/AudioProvider";

export class AudioList extends React.Component {
  static contextType = AudioContext;

  render() {
    return (
      <ScrollView>
        <Text>Audio Files:</Text>
        {this.context.audioFiles.map((item) => (
          <Text
            style={{ padding: 10, borderBottomColor: "black", borderBottomWidth: 2 }}
            key={item.id}
          >
            {item.filename}
          </Text>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AudioList;
