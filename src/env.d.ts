declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ORIGIN: string;
      PORT: string;
    }
  }
}

export {};
