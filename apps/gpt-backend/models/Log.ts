import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  metodo: string;
  ruta: string;
  status: number;
  body?: Record<string, any>;
  query?: Record<string, any>;
  headers?: Record<string, any>;
  userAgent?: string;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>({
  metodo: { type: String, required: true },
  ruta: { type: String, required: true },
  status: { type: Number, required: true },
  body: { type: Schema.Types.Mixed },
  query: { type: Schema.Types.Mixed },
  headers: { type: Schema.Types.Mixed },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);

export default Log;
