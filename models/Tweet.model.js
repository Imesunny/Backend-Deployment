const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: {
    type: String,
    enum: ["education", "development", "fun", "sports"],
  },
  user_id: { type: String, required: true} //one to many relationships
});

const TweetModel = mongoose.model("tweet", tweetSchema);

module.exports = { TweetModel };
