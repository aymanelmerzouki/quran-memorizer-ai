/**
 * Audio Recording Manager
 * Handles continuous audio recording and streaming to AI backend
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

class AudioRecordingManager {
  constructor() {
    this.recording = null;
    this.isRecording = false;
    this.chunkDuration = 2000; // 2 seconds per chunk
    this.recordingSettings = {
      android: {
        extension: '.m4a',
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
    };
    this.onChunkReady = null;
    this.chunkTimer = null;
  }

  /**
   * Initialize audio permissions and settings
   */
  async initialize() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      console.log('[AudioRecording] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[AudioRecording] Initialization error:', error);
      return false;
    }
  }

  /**
   * Start continuous recording with chunked streaming
   * @param {Function} onChunkCallback - Callback for each audio chunk
   */
  async startRecording(onChunkCallback) {
    if (this.isRecording) {
      console.warn('[AudioRecording] Already recording');
      return false;
    }

    try {
      this.onChunkReady = onChunkCallback;

      // Create new recording
      const { recording } = await Audio.Recording.createAsync(
        this.recordingSettings
      );
      
      this.recording = recording;
      this.isRecording = true;

      // Start chunked processing
      this._startChunkedRecording();

      console.log('[AudioRecording] Recording started');
      return true;
    } catch (error) {
      console.error('[AudioRecording] Failed to start:', error);
      this.isRecording = false;
      return false;
    }
  }

  /**
   * Internal method to handle chunked recording
   */
  _startChunkedRecording() {
    this.chunkTimer = setInterval(async () => {
      if (!this.isRecording) {
        clearInterval(this.chunkTimer);
        return;
      }

      try {
        // Stop current recording
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();

        // Send chunk to callback
        if (this.onChunkReady && uri) {
          this.onChunkReady(uri);
        }

        // Clean up old chunk
        if (uri) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }

        // Start new recording for next chunk
        const { recording } = await Audio.Recording.createAsync(
          this.recordingSettings
        );
        this.recording = recording;

      } catch (error) {
        console.error('[AudioRecording] Chunk processing error:', error);
      }
    }, this.chunkDuration);
  }

  /**
   * Stop recording
   */
  async stopRecording() {
    if (!this.isRecording) {
      return;
    }

    try {
      if (this.chunkTimer) {
        clearInterval(this.chunkTimer);
        this.chunkTimer = null;
      }

      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        
        // Send final chunk
        if (this.onChunkReady && uri) {
          this.onChunkReady(uri);
        }

        // Clean up
        if (uri) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }

        this.recording = null;
      }

      this.isRecording = false;
      this.onChunkReady = null;

      console.log('[AudioRecording] Recording stopped');
      return true;
    } catch (error) {
      console.error('[AudioRecording] Error stopping recording:', error);
      this.isRecording = false;
      return false;
    }
  }

  /**
   * Pause recording (not sending chunks but still recording)
   */
  async pauseRecording() {
    if (!this.isRecording) return;
    
    if (this.chunkTimer) {
      clearInterval(this.chunkTimer);
      this.chunkTimer = null;
    }
    
    console.log('[AudioRecording] Recording paused');
  }

  /**
   * Resume recording after pause
   */
  async resumeRecording() {
    if (!this.isRecording) return;
    
    this._startChunkedRecording();
    console.log('[AudioRecording] Recording resumed');
  }

  /**
   * Get recording status
   */
  getStatus() {
    return {
      isRecording: this.isRecording,
      chunkDuration: this.chunkDuration,
    };
  }

  /**
   * Update chunk duration
   * @param {number} duration - Duration in milliseconds
   */
  setChunkDuration(duration) {
    this.chunkDuration = duration;
    
    // Restart chunking with new duration if recording
    if (this.isRecording) {
      this.pauseRecording();
      this.resumeRecording();
    }
  }
}

export default new AudioRecordingManager();
