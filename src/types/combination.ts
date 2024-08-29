import { Document, Types } from "mongoose";

export interface ICombination extends Document {
    name: string;
    abbreviation: string;
    category_id: Types.ObjectId;
    description: string;
}
