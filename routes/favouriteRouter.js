const express = require('express')
const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
const Favourites = require('../models/favourites')
var authenticate = require('../authenticate');
const cors = require('./cors');

const favouriteRouter = express.Router()
favouriteRouter.use(bodyParser.json())

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.find({})
            .populate('author')
            .populate('dishes')
            .then((dishes) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dishes)
            }, (err) => next(err))
            .catch((err) => next(err))

    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // Extract array of dish ObjectIds from request body
        const dishIds = req.body.dishes
        console.log("req", dishIds)


        Favourites.findOne({ author: req.user._id })
            .then((favourite) => {
                if (!favourite) {
                    return Favourites.create({
                        author: req.user._id,
                        dishes: dishIds

                    })
                } else {
                    dishIds.forEach(dishId => {
                        if (!favourite.dishes.includes(dishId)) {
                            favourite.dishes.push(dishId);
                        }

                    })
                    return favourite.save()

                }
            })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => {
                console.error('Create/Update Favourites Error:', err);
                next(err);
            });


    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Favourites.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


//  Routes for favourites/:dishId
favouriteRouter.route('/:dishId')
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        // Extract array of dish ObjectIds from request body
        const dishId = req.params.dishId
        Favourites.findOne({ author: req.user._id })
            .then((favourite) => {
                if (!favourite) {
                    return Favourites.create({
                        author: req.user._id,
                        dishes: [dishId]

                    })
                } else {
                    // Favorites exists, check for duplicate
                    if (!favourite.dishes.includes(dishId)) {
                        favourite.dishes.push(dishId);
                        return favourite.save();
                    } else {
                        // Dish already in favorites, return unchanged
                        return favourite;
                    }

                }

            })
            .then(favourite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            })
            .catch(err => {
                console.error('Create/Update Favourites Error:', err);
                next(err);
            });

    })



    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const dishId = req.params.dishId;

        Favourites.findOne({ author: req.user._id })
            .then(favourite => {
                if (!favourite) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ message: "Favorite document not found." });
                }

                // Check if dish exists in favorites
                const index = favourite.dishes.indexOf(dishId);
                if (index >= 0) {
                    favourite.dishes.splice(index, 1); // remove the dish
                    return favourite.save();
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ message: "Dish not found in favorites." });
                }
            })
            .then(updatedFavorite => {
                if (updatedFavorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(updatedFavorite);
                }
            })
            .catch(err => {
                console.error('Remove Dish from Favorites Error:', err);
                next(err);
            });
    });

module.exports = favouriteRouter
