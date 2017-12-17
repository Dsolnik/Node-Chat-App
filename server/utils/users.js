const _ = require('lodash');

class Users {

    constructor () {
        this.users = [];
    }

    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser (id) {
        var to_return = _.remove(this.users, {id});
        return to_return[0];
    }

    getUser (id) {
        return _.find(this.users, {id});
    }

    getUserList (room) {
        var users = _.filter(this.users, {room});
        return users.map((user) => user.name);
    }
}

module.exports = {Users};
