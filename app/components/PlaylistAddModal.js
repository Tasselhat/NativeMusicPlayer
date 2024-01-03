import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

const PlaylistAddModal = ({ modalVisible, onClose, onSubmit }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleOnSubmit = () => {
    if (!playlistName.trim()) {
      alert("Please enter playlist name");
      onClose();
      return;
    } else {
      onSubmit(playlistName);
      onClose();
    }
  };

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={{ color: color.ACTIVE_BG, padding: 10 }}>Create New Playlist</Text>
          <TextInput
            value={playlistName}
            onChangeText={(text) => setPlaylistName(text)}
            style={styles.input}
            placeholder="Playlist Name"
          />
          <AntDesign
            onPress={handleOnSubmit}
            name="check"
            size={24}
            color="white"
            style={styles.submitIcon}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PlaylistAddModal;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
    width: width - 80,
    borderBottomWidth: 1,
    alignSelf: "center",
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 8,
  },
  submitIcon: {
    padding: 10,
    alignSelf: "center",
    width: 45,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
  },
});
