import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  userName: {
    fontSize: 24,
    color: "#444444",
  },
  displayName: {
    fontSize: 20,
    color: "#111111",
    marginTop: 2,
  },
  postContainer: {
    margin: 10,
    minWidth: 120,
    minHeight: 40,
    backgroundColor: "#ffffff",
    borderRadius: 10 / 1.25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 9,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  postText: {
    fontSize: 16,
    color: "#111111",
  },
});

export default styles;
