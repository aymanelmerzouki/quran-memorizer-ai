/**
 * AI Backend Service
 * Manages WebSocket communication with the Python Flask backend
 */

import { io } from 'socket.io-client';
import * as FileSystem from 'expo-file-system';

class AIBackendService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.backendUrl = 'http://localhost:7860';
    this.listeners = {};
    this.sessionId = null;
    this.currentPage = 1;
  }

  async connect(backendUrl = null) {
    if (backendUrl) this.backendUrl = backendUrl;

    try {
      this.socket = io(this.backendUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      return new Promise((resolve) => {
        this.socket.on('connect', () => {
          console.log('[AI] Connected to backend');
          this.isConnected = true;
          this.sessionId = this.socket.id;
          this._setupEventListeners();
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('[AI] Connection error:', error.message);
          this.isConnected = false;
          resolve(false);
        });
      });
    } catch (error) {
      console.error('[AI] Failed to initialize:', error);
      return false;
    }
  }

  _setupEventListeners() {
    this.socket.on('word_result', (data) => this._emit('wordResult', data));
    this.socket.on('sequence_error', (data) => this._emit('sequenceError', data));
    this.socket.on('session_update', (data) => this._emit('sessionUpdate', data));
    this.socket.on('error', (data) => this._emit('error', data));
    this.socket.on('disconnect', () => {
      console.log('[AI] Disconnected');
      this.isConnected = false;
      this._emit('disconnect');
    });
  }

  startSession(pageNumber, surahNumber = null) {
    if (!this.isConnected) return;
    this.currentPage = pageNumber;
    this.socket.emit('start_session', { page: pageNumber, surah: surahNumber, timestamp: Date.now() });
    console.log(`[AI] Session started - Page: ${pageNumber}`);
  }

  async sendAudioChunk(audioUri) {
    if (!this.isConnected) return;
    try {
      const audioData = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      this.socket.emit('audio_chunk', { audio: audioData, format: 'webm', page: this.currentPage, timestamp: Date.now() });
    } catch (error) {
      console.error('[AI] Error sending audio:', error);
      this._emit('error', { message: 'Failed to send audio', error });
    }
  }

  updatePage(pageNumber) {
    this.currentPage = pageNumber;
    if (this.isConnected) this.socket.emit('update_page', { page: pageNumber });
  }

  resetSession() {
    if (this.isConnected) this.socket.emit('reset_session');
  }

  stopSession() {
    if (this.isConnected) this.socket.emit('stop_session');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.sessionId = null;
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try { callback(data); } catch (error) {
          console.error(`[AI] Error in listener for ${event}:`, error);
        }
      });
    }
  }

  getConnectionStatus() { return this.isConnected; }
  getSessionId() { return this.sessionId; }
}

export default new AIBackendService();
