const AutoInit = require('es7frame/auto-init');
const XRegExp = require('xregexp');

class Keywords extends AutoInit {
  async getKeywords(from) {
    const allKeywords = [];

    for (const key in from) {
      if (Object.hasOwnProperty.call(from, key)) {
        const name = from[key];
        const keywords = name.toString().toLowerCase().match(Keywords.rxNameKeywors);
        if (keywords) allKeywords.push(...keywords);
      }
    }

    return allKeywords;
  }
}

Keywords.rxNameKeywors = new XRegExp('[\\pL\\d]+', 'g');

module.exports = Keywords;
