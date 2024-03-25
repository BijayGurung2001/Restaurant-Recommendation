const express=require('express');
const { productlist, usersignup, userLogin } = require('../controller/usercontroller');
const { restaurantsignup, restaurantlogin } = require('../controller/RestaurantController');
const router= express.Router();


router.get('/', productlist);
router.post('/user/signup', usersignup);
router.post('/user/login', userLogin);
router.post('/restaurant/signup', restaurantsignup);
router.post('/restaurant/login', restaurantlogin);

module.exports=router;