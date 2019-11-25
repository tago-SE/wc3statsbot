
var initialized = false; 
var colors = [];

module.exports = class ColorManager {

    static init(client) {
        if (initialized) 
            return;
        initialized = true; 
        let colorTags = [
            "red", "blue", "teal", "purple",
            "yellow", "orange", "green", "pink", 
            "grey", "lightblue", "darkgreen", "brown",
            "maroon", "navy", "turquoise", "violet", 
            "wheat", "peach", "mint", "lavender",
            "coal", "snow", "emerald", "peanut"
        ]
        var i = 0;
        try {
            for ( ; i < colorTags.length; i++) {
                let colorEmoji = client.emojis.find(emoji => emoji.name === colorTags[i]);
                colors.push(client.emojis.get(colorEmoji.id).toString());
            }
        } catch (err) {
            console.log("Could not find all color emojis (" + colorTags[i] + ")\n" + err);
        }
    }   

    static getClinetColorEmoji(client, index) {
        return colors[index];
    }

}