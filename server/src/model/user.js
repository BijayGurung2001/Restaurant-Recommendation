const mongoose=require('mongoose')

const Userschema=new mongoose.Schema({
    name:{type: 'string', required:true},
    email:{type: 'string', required:true, unique: true},
    address:{type: 'string', required:true},
    number:{type: 'string', required:true},
   
    password:{type: 'string', required:true},
     jwtToken: String
})
const user= mongoose.model('User',Userschema)

module.exports=user;