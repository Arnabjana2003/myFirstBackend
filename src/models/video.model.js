import mongoose,{Schema} from "mongoose";

const videoSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    videoLink: {
        type: String,
        required: [true, "Video link is required"],
    },
    thumbnailLink: {
        type: String,
        required: [true, "Thumbnail link is required"],
    },
    isPublished: {
        type: Boolean,
        required: true,
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},
{
    timestamps: true,
})

export const Video = mongoose.model("Video", videoSchema);