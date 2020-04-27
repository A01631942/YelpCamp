var mongoose=require("mongoose");

var campSchema = new mongoose.Schema({
    name: String,
    image: String, //it's a string because it's an url
    description: String,
    comments:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"}
    ],
    author: {
        id:{type:mongoose.Schema.Types.ObjectId,
            ref:"User"},
        username: String
    },
    price:String
})

module.exports = mongoose.model("Campground", campSchema);