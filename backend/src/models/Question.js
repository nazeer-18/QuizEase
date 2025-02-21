const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true, unique: true },
    type: { type: String, enum: ["mcq", "integer"], required: true },
    options: {
        type: mongoose.Schema.Types.Mixed, // Can be an object (MCQ) or a number (Integer)
        validate: {
            required: function () {
                return this.type === "mcq"; // Required only if type is "mcq"
            },
            validator: function (value) {
                if (this.type === "mcq") {
                    return (
                        typeof value === "object" &&
                        value.A && value.B && value.C && value.D &&
                        typeof value.A === "string" &&
                        typeof value.B === "string" &&
                        typeof value.C === "string" &&
                        typeof value.D === "string"
                    );
                } else if (this.type === "integer") {
                    return typeof value === "number";
                }
                return false;
            },
            message: "Invalid options format based on type"
        }
    },
    answer: {
        type: mongoose.Schema.Types.Mixed, // Can store either a string (MCQ) or number (Integer)
        required: true
    },
});

module.exports = mongoose.model("Question", QuestionSchema);
