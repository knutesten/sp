module.exports = function formatNumber(number) {
      // Use two decimals and use ',' instead of '.' (norwegian standard).
      number = number.toFixed(2).replace('.', ',');

      // Add a space if the number is above 999.99. (ex. 1 000.33).
      var len = number.length;
      number =len>6?number.substring(0, len-6)+' '+number.substring(len-6):number;

      return number;
}
