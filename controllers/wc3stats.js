const fetch = require('node-fetch');
const request = require('request-promise');

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

    static fetchReplayById(id) {
        return new Promise(function (resolve, reject) {
            fetch('https://api.wc3stats.com/replays/' + id)
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

    static fetchResultById(id) {
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
            fetch('https://api.wc3stats.com/profiles/' + username + '&map=' + map + '&season=' + season)
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
            fetch('https://api.wc3stats.com/profiles/' + username + '/' + id + '&map=' + map + '&season=' + season)
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

    static fetchTopRankedUsersByMap(map, numUsers, season, mode) {
        const url = "https://api.wc3stats.com/leaderboard&map=" + map + 
            "&ladder=Public&season=Season%201&round=Global&sort=rank&order=asc&page=1&limit=" + numUsers  + 
            '&season=' + season + ((mode == null)? '' : '&mode=' + mode);
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

    static fetchUserGamesByMapSeasonMode(username, map, season, mode) {
        var url = 'https://api.wc3stats.com/replays'  +
            '&map=' + map + 
            '&season=' + season + ((mode == null)? '' : '&mode=' + mode) + 
            '&for=' + username;
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