var mongoose = require("mongoose")

var Schema = mongoose.Schema;

var MenuItemSchema = new Schema(
    {
        menuname :      {type: String, required:true},
        description :   {type: String, required:true},
        price :         {type : Number, required:true,default: 0.0},
        image :         {type : String, required:true},
        likes :         {type : Number,required:true,default: 0.0}
    },  {timestamps:true})
    

module.exports = mongoose.model("MenuItem",MenuItemSchema)
