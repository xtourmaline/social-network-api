const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
const { findOne, findOneAndUpdate } = require('../models/User');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();

            const userObj = {
                users,
            };

            res.json(userObj);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');
            
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId }, 
                {...req.body},
                { runValidators: true, new: true }
            );
            
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.json(user)
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // deletes user and removes thoughts
    async deleteUser(req, res) {
        try {
            const user = await Student.findOneAndRemove({ _id: req.params.userId });
            
            if (!user) {
                return res.status(404).json({ message: 'No such student exists' });
            }

            // BONUS: Remove thoughts of user
            const thought = await Thought.deleteMany(
                { username: user.username },
                { new: true }
            );

            if (!thought) {
                res.status(404).json({ message: "No thoughts associated with user "});
            }

            res.json({ message: "User successfully deleted "});
        
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // adds friends
    async addFriend(req, res) {
        try {
            const friend = await User.findOne({ _id: req.params.friendId })

            if (!friend) {
                return res.status(404).json({message: "No friend found with that ID"})
            }

            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: friend }},
                { new: true}
            );

            if (!user) {
                return res.status(404).json({message: "No user found with that ID"})
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // remove friends
    async removeFriend(req, res) {
        try {
            const friend = await User.findOne({ _id: req.params.friendId })

            if (!friend) {
                return res.status(404).json({message: "No friend found with that ID"})
            }

            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: friend }},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({message: "No user found with that ID"})
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};