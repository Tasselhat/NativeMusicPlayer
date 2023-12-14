import { Audio } from "expo-av";

//play
export const play = async (playbackObj, uri) => {
  try {
    await playbackObj.unloadAsync();
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("Error inside play helper method (audioController.js)", error.message);
  }
};

//select new

export const selectNew = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    await play(playbackObj, uri);
  } catch (error) {
    console.log("Error inside selectNew helper method (audioController.js)", error.message);
  }
};

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
