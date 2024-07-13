const mongoose=require('mongoose')

const Restaurantschema=new mongoose.Schema({
    name:{type: 'string', required:true},
    email:{type: 'string', required:true, unique: true},
    address:{type: 'string', required:true},
    number:{type: 'string', required:true},
    password:{type: 'string', required:true},
     jwtToken: String
})
const Restaurant= mongoose.model('Restaurant',Restaurantschema)

module.exports=Restaurant;