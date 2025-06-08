import mongoose, { Document, Schema } from "mongoose";

interface Log extends Document {
  tipo: string;
  origen: string;
  descripcion: string;
  payload: Record<string, any>;
  creadoEn: Date;
}

const logSchema = new Schema<Log>({
  tipo: { type: String, required: true },
  origen: { type: String, required: true },
  descripcion: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: false },
  creadoEn: { type: Date, default: Date.now },
});

const LogModel = mongoose.model<Log>("Log", logSchema);
export default LogModel;
