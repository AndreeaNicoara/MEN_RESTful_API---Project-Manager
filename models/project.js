const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let projectSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  inProgress: {
    type: Boolean,
  },
});

module.exports = mongoose.model("project", projectSchema);
