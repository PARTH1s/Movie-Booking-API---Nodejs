/**
 * Mongoose Schema for Show
 * Represents a movie show scheduled in a theatre
 */

const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
    {
        theatreId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Theatre'
        },
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Movie'
        },
        timing: {
            type: Date,
            required: true
        },
        noOfSeats: {
            type: Number,
            required: true,
            min: [1, "Show must have at least one seat"] // validation
        },
        seatConfiguration: {
            type: String,
            default: null
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },
        format: {
            type: String,
            enum: ["2D", "3D", "IMAX", "4DX"],
            default: "2D"
        }
    },
    {
        timestamps: true, // auto-createdAt & updatedAt
        versionKey: false // removes __v field
    }
);

// Add indexes for faster queries (common access patterns)
showSchema.index({ theatreId: 1, movieId: 1, timing: 1 }, { unique: true });

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
