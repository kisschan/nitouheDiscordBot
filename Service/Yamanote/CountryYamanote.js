import countryFlagEmoji from "country-flag-emoji";

export class CountryYamanote {
  constructor() {
    this.arrangeForJP();
  }

  answer(word) {
    const country = Object.values(countryFlagEmoji.data).find((v) => v.name === word);
    if (!country) return;
    return country.emoji;
  }

  arrangeForJP() {
    const list = countryFlagEmoji.list;

  }

}

