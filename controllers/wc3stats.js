const fetch = require('node-fetch');
const request = require('request-promise');
const config = require('../config.json'); 

function createMapRequest(map) {
    var mapArgs = map.split(' ')
    var mapRequest = "";
    for (var i = 0; i < mapArgs.length - 1; i++) {
        mapRequest += mapArgs[i] + "%20";
    }
    mapRequest += mapArgs[mapArgs.length -1];
    return mapRequest;
}

module.exports = class UsersController {

    static postReplayAttachment(attachment) {
        return new Promise(function (resolve, reject) {
            let formData = {
                 file: request (attachment.url) 
            };
            request.post('https://api.wc3stats.com/upload', {formData, json: true})
            .then(function (json) {
                resolve(json);
            })
            .catch(function (err) {
                reject(err);
            }); 
        });
    }

    static fetchReplayById(id, season) {
        return new Promise(function (resolve, reject) {
            fetch(`https://api.wc3stats.com/replays/` + id + '&season=' + season)
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

    static fetchResultById(id, season) {
        return new Promise(function (resolve, reject) {
            fetch(`https://api.wc3stats.com/results/` + id)
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

    static fetchUserProfileByMap(map, username, season) {
        return new Promise(function (resolve, reject) {
            fetch('https://api.wc3stats.com/profiles/' + username + '&map=' + createMapRequest(map) + '&season=' + season)
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

    static fetchUserStatsByIdAndMap(id, map, username, season) {
        return new Promise(function (resolve, reject) {
            fetch('https://api.wc3stats.com/profiles/' + username + '/' + id + '&map=' + createMapRequest(map) + '&season=' + season)
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

    static fetchTopRankedUsersByMap(map, numUsers, season) {
        var mapRequest = createMapRequest(map);
        const url = "https://api.wc3stats.com/leaderboard&map=" + mapRequest + 
            "&ladder=Public&season=Season%201&round=Global&sort=rank&order=asc&page=1&limit=" + numUsers  + 
            '&season=' + season
            
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