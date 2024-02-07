import { Audio } from "expo-av";
import { storeAudioForNextOpening } from "../misc/helper";

//play
export const play = async (playbackObj, uri) => {
  try {
    await playbackObj.unloadAsync();
    return await playbackObj.loadAsync(
      { uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
    );
  } catch (error) {
    console.log(
      "Error inside play helper method (audioController.js)",
      error.message
    );
  }
};

//select new

export const selectNew = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log(
      "Error inside selectNew helper method (audioController.js)",
      error.message
    );
  }
};

//pause
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.log(
      "Error inside pause helper method (audioController.js)",
      error.message
    );
  }
};

//resume

export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log(
      "Error inside resume helper method (audioController.js)",
      error.message
    );
  }
};

//play next

export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log(
      "Error inside playNext helper method (audioController.js)",
      error.message
    );
  }
};

//selecting audios

export const selectAudio = async (audio, context) => {
  const {
    playbackObj,
    soundObj,
    currentAudio,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
  } = context;

  try {
    //first play
    if (soundObj === null) {
      const index = audioFiles.indexOf(audio);
      const status = await play(playbackObj, audio.uri);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return storeAudioForNextOpening(audio, index);
    }

    //pause
    if (
      soundObj?.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }

    //resume
    if (
      soundObj?.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(context, { soundObj: status, isPlaying: true });
    }

    //new song
    if (soundObj?.isLoaded && currentAudio.id !== audio.id) {
      const status = await selectNew(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }

    if (!soundObj?.isLoaded || soundObj.isLoaded === undefined) {
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(context, {
        playbackObj: playbackObj,
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }
  } catch (error) {
    console.log(
      "Error inside selectAudio helper method (audioController.js)",
      error.message
    );
  }
};

//change audios

export const nextAudioPress = async (context) => {
  const {
    playbackObj,
    updateState,
    audioFiles,
    currentAudioIndex,
    onPlaybackStatusUpdate,
    randomize,
    totalAudioCount,
  } = context;

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const previousAudioIndex = currentAudioIndex;

    if (randomize) {
      const nextAudioIndex = Math.floor(Math.random() * totalAudioCount);
      const audio = audioFiles[nextAudioIndex];
      const status = await playNext(playbackObj, audio.uri);
      return updateState(context, {
        soundObj: status,
        currentAudio: audio,
        playbackObj: playbackObj,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
        previousAudioIndex: previousAudioIndex,
        playbackPosition: null,
        playbackDuration: null,
      });
    }

    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    let audio = audioFiles[currentAudioIndex + 1];
    let status;
    let index;

    if (!isLoaded && !isLastAudio) {
      index = currentAudioIndex + 1;
      status = await play(playbackObj, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      index = currentAudioIndex + 1;
      status = await playNext(playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = audioFiles[index];
      if (isLoaded) {
        status = await playNext(playbackObj, audio.uri);
      } else {
        status = await play(playbackObj, audio.uri);
      }
    }

    playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      previousAudioIndex: previousAudioIndex,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  } catch (error) {
    console.log(
      "Error inside changeAudio helper method (audioController.js)",
      error.message
    );
  }
};

export const previousAudioPress = async (context) => {
  const {
    playbackObj,
    updateState,
    audioFiles,
    currentAudioIndex,
    totalAudioCount,
    previousAudioIndex,
    onPlaybackStatusUpdate,
    randomize,
    isPlaylistRunning,
  } = context;

  if (isPlaylistRunning) return selectAudioFromPlaylist(context, select);

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const newPreviousAudioIndex = currentAudioIndex;

    const newIndex =
      randomize && previousAudioIndex
        ? previousAudioIndex
        : currentAudioIndex - 1;
    const isFirstAudio = newIndex <= 0;
    let audio = audioFiles[newIndex];
    let status;

    if (!isLoaded && !isFirstAudio) {
      status = await play(playbackObj, audio.uri);
    }

    if (isLoaded && !isFirstAudio) {
      status = await playNext(playbackObj, audio.uri);
    }

    if (isFirstAudio) {
      index = totalAudioCount - 1;
      audio = audioFiles[index];
      if (isLoaded) {
        status = await playNext(playbackObj, audio.uri);
      } else {
        status = await play(playbackObj, audio.uri);
      }
    }

    playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    updateState(context, {
      currentAudio: audio,
      playbackObj: playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      previousAudioIndex: newPreviousAudioIndex,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  } catch (error) {
    console.log(
      "Error inside previousAudioPress helper method (audioController.js)",
      error.message
    );
  }
};

//seek

export const seek = async (context, position) => {
  const { soundObj, playbackObj, updateState, isPlaying } = context;

  if (soundObj === null) {
    return;
  }

  try {
    const status = await playbackObj.setPositionAsync(
      Math.floor(position * soundObj.durationMillis)
    );
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
    });

    if (isPlaying) {
      await resume(playbackObj);
    }
  } catch (error) {
    console.log("Error inside onSlidingComplete", error.message);
  }
};
