// Objets globaux fournis par les bibliothèques XiVO (cti.js, xc_webrtc.js)
// Global objects provided by the XiVO libraries (cti.js, xc_webrtc.js)
export {};

type Handler = (payload: never) => void;

declare global {
  const Cti: {
    debugMsg: boolean;
    MessageType: {
      LOGGEDON: string;
      LINECONFIG: string;
      PHONEEVENT: string;
      ERROR: string;
      LINKSTATUSUPDATE: string;
    };
    clearHandlers(): void;
    setHandler(type: string, handler: Handler): void;
    WebSocket: { init(url: string, login: string, phoneNumber: string): void };
    dial(destination: string): void;
    hangup(uniqueId?: string): void;
    hold(uniqueId?: string): void;
    directTransfer(destination: string): void;
  };

  const xc_webrtc: {
    MessageType: { GENERAL: string; REGISTRATION: string; INCOMING: string; OUTGOING: string };
    clearHandlers(): void;
    setHandler(type: string, handler: Handler): void;
    initByLineConfig(
      lineConfig: unknown, name: string, ssl: boolean, port: string | number,
      token: string, remoteAudioId: string, host: string,
    ): void;
    dial(destination: string): void;
    answer(): void;
  };
}
