const { Schema, model } = require('mongoose');
const reactionSchema = require("./Reaction");
const moment = require("moment");

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: [1, "Too short"],
            maxlength: [280, "Too long"]
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function(date) {
                return moment(date).format("MMM Do, YYYY [at] hh:mm a")
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.virtual("reactionCount").get(function() {
    return this.reactions.length;
})

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
