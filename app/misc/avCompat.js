import { createAudioPlayer } from "expo-audio";

// Drop-in replacement for the expo-av Audio.Sound API surface this app uses,
// backed by expo-audio (expo-av was removed from the Expo SDK in SDK 54+).
// expo-audio works in seconds; expo-av worked in milliseconds.
export class Sound {
  constructor() {
    this._player = null;
    this._callback = null;
    this._unloaded = true;
  }

  _status(evt, overrides = {}) {
    const p = this._player;
    if (!p || this._unloaded) return { isLoaded: false, ...overrides };
    return {
      isLoaded: evt ? evt.isLoaded : p.isLoaded,
      isPlaying: evt ? evt.playing : p.playing,
      positionMillis: (evt ? evt.currentTime : p.currentTime) * 1000,
      durationMillis: (evt ? evt.duration : p.duration) * 1000,
      didJustFinish: evt ? evt.didJustFinish : false,
      ...overrides,
    };
  }

  _waitLoaded() {
    const p = this._player;
    if (!p || p.isLoaded) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => {
        clearTimeout(timer);
        sub.remove();
        resolve();
      };
      const timer = setTimeout(done, 5000);
      const sub = p.addListener("playbackStatusUpdate", (s) => {
        if (s.isLoaded) done();
      });
    });
  }

  async loadAsync(source, { shouldPlay = false, progressUpdateIntervalMillis = 500 } = {}) {
    if (!this._player) {
      this._player = createAudioPlayer(source, { updateInterval: progressUpdateIntervalMillis });
      this._player.addListener("playbackStatusUpdate", (s) => {
        if (!this._unloaded && this._callback) this._callback(this._status(s));
      });
    } else {
      this._player.replace(source);
    }
    this._unloaded = false;
    await this._waitLoaded();
    if (shouldPlay) this._player.play();
    return this._status(null, { isLoaded: true, isPlaying: !!shouldPlay });
  }

  async unloadAsync() {
    if (this._player) this._player.pause();
    this._unloaded = true;
    return { isLoaded: false };
  }

  async stopAsync() {
    if (this._player) this._player.pause();
    return this._status();
  }

  async playAsync() {
    if (this._player) this._player.play();
    return this._status(null, { isPlaying: true });
  }

  async setStatusAsync({ shouldPlay = false } = {}) {
    if (this._player) {
      if (shouldPlay) this._player.play();
      else this._player.pause();
    }
    return this._status(null, { isPlaying: !!shouldPlay });
  }

  async playFromPositionAsync(positionMillis) {
    if (this._player) {
      await this._player.seekTo(positionMillis / 1000);
      this._player.play();
    }
    return this._status(null, { isPlaying: true, positionMillis });
  }

  async setPositionAsync(positionMillis) {
    if (this._player) await this._player.seekTo(positionMillis / 1000);
    return this._status(null, { positionMillis });
  }

  async getStatusAsync() {
    return this._status();
  }

  setOnPlaybackStatusUpdate(callback) {
    this._callback = callback;
  }
}

export const Audio = { Sound };
