const { Router } = require("express");
const { TweetModel } = require("../models/Tweet.model");
const { authentication } = require("../middlewares/auth");

const tweetRouter = Router();

//get tweets
tweetRouter.get("/", async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};

  const tweets = await TweetModel.find();
  res.send({ Tweets: tweets });
});

//add tweets
tweetRouter.post("/add",authentication, async (req, res) => {
    const { title, body, category } = req.body;
    const userID = req.userID;
    const add_tweets = await TweetModel.create({
      title,
      body,
      category,
      user_id: userID,
    });
    res.json({ tweets: add_tweets, message: "Tweets are added successfully." });
  });

//edit the tweets
  tweetRouter.patch("/edit/:tweetID",authentication, async (req, res) => {
    const tweetID = req.params.tweetID;
    const userID = req.userID;
    const payload = req.body;
    try {
        const tweets_to_update = await TweetModel.findOneAndUpdate(
          { _id: tweetID, user_id: userID },
          payload
        );
        if (tweets_to_update) {
          res.json({ message: "Tweet updated successfully" });
        } else {
          res.json({ message: "Tweet cannot be updated" });
        }
      } catch (error) {
        res.json({ message:"Problem in Editing, try own crediantials" });
      }
    
  });


  //delete the tweets
  tweetRouter.delete("/delete/:tweetID",authentication, async (req, res) => {
    const tweetID = req.params.tweetID;
    const userID = req.userID;
    // const payload = req.body;
    try {
        const tweets_to_delete = await TweetModel.findOneAndDelete(
          { _id: tweetID, user_id: userID }
        );
        if (tweets_to_delete) {
          res.json({ message: "Tweet deleted successfully" });
        } else {
          res.json({ message: "Tweet cannot be deleted" });
        }
      } catch (error) {
        res.json({ message:"Problem in Deleting, try own crediantials"});
      }
    
  });


  


module.exports = {
  tweetRouter,
};
