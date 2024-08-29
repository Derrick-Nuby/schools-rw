import mongoose, { Schema } from 'mongoose';
import { ICombination } from "../types/combination";

const CombinationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        match: /^[a-zA-Z0-9 ]+$/,
    },
    abbreviation: {
        type: String,
        required: true,
        maxlength: 10,
        match: /^[A-Z]+$/,
    },
    description: {
        type: String,
        default: '',
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Combination',
        required: true,
    }
});

export default mongoose.model<ICombination>('Combination', CombinationSchema);
