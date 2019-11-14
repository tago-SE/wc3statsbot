const fetch = require('node-fetch');
const request = require('request') 
const config = require('../config.json'); 

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

    static fetchTopRankedUsersByMap(map, numUsers) {
        
        // Converts the map name to a suitable request argument
        //
        var mapArgs = map.split(' ');
        var mapRequest = "";
        for (var i = 0; i < mapArgs.length - 1; i++) {
            mapRequest += mapArgs[i] + "%20";
        }
        mapRequest += mapArgs[mapArgs.length -1];
        // 
        const url = "https://api.wc3stats.com/leaderboard&map=" + mapRequest + "&ladder=Public&season=Season%201&round=Global&sorzt=rating&order=desc&page=1&limit=" + numUsers;
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