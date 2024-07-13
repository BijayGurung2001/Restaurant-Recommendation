const express=require('express');
const {  usersignup, userLogin, userProfile } = require('../controller/usercontroller');
const { restaurantsignup, restaurantlogin } = require('../controller/RestaurantController');
const router= express.Router();



router.post('/user/signup', usersignup);
router.post('/user/login', userLogin);
router.post('/user/Profile', userProfile);
router.post('/restaurant/signup', restaurantsignup);
router.post('/restaurant/login', restaurantlogin);

module.exports=router;