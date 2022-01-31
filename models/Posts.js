const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const PostSchema=new Schema({
    user:{type:Schema.Types.ObjectId, ref:'User',required:true},
    post:{type:String,required:true,maxlength:100},
    title:{type:String,required:true,maxlength:20},
    timestamp:{type:Number,required:true}
})

module.exports=mongoose.model('Post',PostSchema);