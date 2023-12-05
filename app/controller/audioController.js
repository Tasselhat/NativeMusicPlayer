import { Audio } from "expo-av";

//play
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: true });
  } catch (error) {
    console.log("Error inside play helper method (audioController.js)", error.message);
  }
};

//select new

//pause
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.log("Error inside pause helper method (audioController.js)", error.message);
  }
};

//resume
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("Error inside resume helper method (audioController.js)", error.message);
  }
};
