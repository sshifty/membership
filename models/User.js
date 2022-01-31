var mongoose=require('mongoose');
var Schema=mongoose.Schema;

const UserSchema= new Schema({
    username:{type:String,required:true,maxlength:20},
    password:{type:String,required:true},
    admin:{type:Boolean},
    member:{type:Boolean},
    avatar:{type:String}
});

module.exports=mongoose.model('User',UserSchema);