var colorInitialized = false; 
var colors = [];

module.exports = class Wc3ColorManager {

    /**
     * Imports color emojis if present in any of the discord channels the bot is in.
     * 
     * @param {*} index 
     */

    static getClientColorEmoji(client, index) {
        if (!colorInitialized) {
            colorInitialized = true; 
            let colorTags = [
                "red", "blue", "teal", "purple",
                "yellow", "orange", "green", "pink", 
                "grey", "lightblue", "darkgreen", "brown",
                "maroon", "navy", "turquoise", "violet", 
                "wheat", "peach", "mint", "lavender",
                "coal", "snow", "emerald", "peanut"
            ];
            var i;
            for (i = 0; i < colorTags.length; i++) {
                try {
                    let colorEmoji = client.emojis.find(emoji => emoji.name === colorTags[i]);
                    colors.push(client.emojis.get(colorEmoji.id).toString());
                } catch (err) {
                    console.log("Could not find color emoji for: " + colorTags[i] + "\n" + err);
                }
            }
        }
        return colors[index];
    }

}