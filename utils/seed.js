const db = require('../config/connection');
const { Thought, User } = require('../models');
const { usernames, domains, thoughts } = require('./data');

const drop = async (name) => {
    if ((await db.db.listCollections({ name }).toArray()).length) {
        await db.dropCollection(name);
    }
};

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

db.on("error", (err) => err);

db.once("open", async () => {
    await drop("thoughts");
    await drop("users");

    shuffleArray(usernames);
    shuffleArray(thoughts);

    for (let username of usernames) {
        let listOfThoughts = [];

        for (let i = 0; i < 2; ++i) {
            listOfThoughts.push({
                thoughtText: thoughts.pop(),
                username
            });
        }

        await User.create({
            username,
            email: `${username}@${getRandomArrItem(domains)}`,
            thoughts: await Thought.insertMany(listOfThoughts),
            friends: await User.findOne({ username: getRandomArrItem(usernames) }) || [],
        });
    }

    process.exit(0);
});