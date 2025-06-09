import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  tipo: string;
  origen: string;
  descripcion: string;
  payload?: any;
  fecha?: Date;
}

const LogSchema = new Schema<ILog>({
  tipo: { type: String, required: true },
  origen: { type: String, required: true },
  descripcion: { type: String, required: true },
  payload: { type: Schema.Types.Mixed },
  fecha: { type: Date, default: Date.now }
});

const LogModel = mongoose.model<ILog>("Log", LogSchema);
export default LogModel;
