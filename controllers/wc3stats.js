const fetch = require('node-fetch');
const request = require('request') 
const config = require('../config.json'); 

function createMapRequest(map) {
    var mapArgs = map.split(' ');
    var mapRequest = "";
    for (var i = 0; i < mapArgs.length - 1; i++) {
        mapRequest += mapArgs[i] + "%20";
    }
    mapRequest += mapArgs[mapArgs.length -1];
    return mapRequest;
}

module.exports = class UsersController {

    static fetchReplayById(id) {
        return new Promise(function (resolve, reject) {
            fetch(`https://api.wc3stats.com/replays/` + id + `&toDisplay=true`)
            .then(res => res.json())
            .then(json => {
                var body = json.body;
                if (!body) {
                    reject(new Error("no body found"));
                } else {
                    resolve(body);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    static fetchUserProfileByMap(map, username) {
        return new Promise(function (resolve, reject) {
            fetch('https://api.wc3stats.com/profiles/' + username + '&map=' + createMapRequest(map))
            .then(res => res.json())
            .then(json => {
                var body = json.body;
                if (!body) {
                    reject(new Error("no body found"));
                } else {
                    resolve(body);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    static fetchUserStatsByIdAndMap(id, map, username) {
        return new Promise(function (resolve, reject) {
            fetch('https://api.wc3stats.com/profiles/' + username + '/' + id + '&map=' + createMapRequest(map))
            .then(res => res.json())
            .then(json => {
                var body = json.body;
                if (!body) {
                    reject(new Error("no body found"));
                } else {
                    resolve(body);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    static fetchTopRankedUsersByMap(map, numUsers) {
        var mapRequest = createMapRequest(map);
        const url = "https://api.wc3stats.com/leaderboard&map=" + mapRequest + "&ladder=Public&season=Season%201&round=Global&sort=rank&order=asc&page=1&limit=" + numUsers;
        return new Promise(function (resolve, reject) {
            fetch(url)
            .then(res => res.json())
            .then(json => {
                var body = json.body;
                if (!body) {
                    reject(new Error("no body found"));
                } else {
                    resolve(body);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
}