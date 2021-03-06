const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: 'You cannot leave an empty reply, silly!',
            trim: true
        },
        writtenBy: {
            type: String,
            required: 'You cannot leave an anonymous reply, silly!',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: 'You cannot leave an empty comment, silly!',
            trim: true
        },
        commentBody: {
            type: String,
            required: 'You cannot leave an anonymous comment, silly!',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // use ReplySchema to validate data for a reply
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

// get total number of replies on retrieval
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// create the Comment modle useing the CommentSchema
const Comment = model('Comment', CommentSchema);

// exporting... ... ...
module.exports = Comment;