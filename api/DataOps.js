const db = require('../data/dbConfig');

const findUsers = () => {
    console.log("routing findUsers")
    return db('users');
}

const createUser = (user) => {
    return db('users').insert(user)
}

module.exports = {
    findUsers,
    createUser,
}