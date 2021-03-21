import countryFlagEmoji from "country-flag-emoji";

export class CountryYamanote {
  constructor() {
    this.arrangeForJP();
  }

  answer(word) {
    const country = Object.values(countryFlagEmoji.data).find((v) => v.jp === word);
    if (!country) return;
    return country.emoji;
  }

  registerToCountries(key, jp, capital, area) {
    countryFlagEmoji.data[key].jp = jp;
    countryFlagEmoji.data[key].capital = capital;
    countryFlagEmoji.data[key].area = area;
  }

  // https://github.com/risan/country-flag-emoji/blob/master/src/data.js
  arrangeForJP() {
    const countries = countryFlagEmoji.data;
    countries.AC.jp = "アセンション島";
    countries.AC.capital = "ジョージタウン";
    countries.AC.area = "atlantic";

    countries.AD.jp = "アンドラ";
    countries.AD.capital = "アンドラ・ラ・ベリャ";
    countries.AD.area = "europa";

    countries.AE.jp = "アラブ首長国連邦";
    countries.AE.capital = "アブダビ";
    countries.AE.area = "middleEast";

    countries.AF.jp = "アフガニスタン";
    countries.AF.capital = "カブール";
    countries.AF.area = "asia";

    countries.AG.jp = "アンティグア・バーブーダ";
    countries.AG.capital = "セント・ジョンズ";
    countries.AG.area = "caribbean";

    countries.AI.jp = "アンギラ";
    countries.AI.capital = "バレー";
    countries.AI.area = "caribbean";

    this.registerToCountries("AL", "アルバニア", "ティラーナ", "europa");
    this.registerToCountries("AM", "アルメニア", "エレバン", "asia");
    this.registerToCountries("AO", "アンゴラ", "ルアンダ", "africa");
    this.registerToCountries("AQ", "南極", "", "other");
    this.registerToCountries("AR", "アルゼンチン", "ブエノスアイレス", "southAmerica");
    this.registerToCountries("AR", "アメリカ領サモア", "パゴパゴ", "oceania");
    this.registerToCountries("AT", "オーストリア", "ウィーン", "europa");
    this.registerToCountries("AW", "アルバ", "オラニェスタット", "caribbean");
    this.registerToCountries("AX", "オーランド諸島", "マリエハムン", "europa"); 
    this.registerToCountries("AZ", "アゼルバイジャン", "バクー", "asia"); 
  }

}

