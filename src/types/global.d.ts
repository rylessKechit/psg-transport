// types/global.d.ts
import { Mongoose } from 'mongoose';

declare global {
  namespace globalThis {
    var mongoose: {
      conn: Mongoose | null;
      promise: Promise<Mongoose> | null;
    };
  }
}

export {};