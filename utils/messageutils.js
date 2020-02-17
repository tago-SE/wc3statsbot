module.exports = class MessageUtils {

    static error(str) {
        return "```diff\n" +
                "- " + str + "\n" +
                "```"; 
   }

   static system(str) {
       return "```CSS\n" + str + "\n```";
   }

   static formatRatio(n, m, dec) {
        if (m == 0) {
            if (n != 0)
                return "" + (1).toFixed(dec);
            return "" + (0).toFixed(dec);
        }
        return (n/m).toFixed(dec);
   }


} 