import { Dimensions, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

const PlaylistAddModal = ({ modalVisible }) => {
  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Playlist Name" />
          <AntDesign name="check" size={24} color="white" style={styles.submitIcon} />
        </View>
      </View>
    </Modal>
  );
};

export default PlaylistAddModal;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: width - 30,
    backgroundColor: "#fff",
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
  },
  input: {
    width: width - 50,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_FONT,
    fontSize: 18,
    paddingVertical: 8,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
});
