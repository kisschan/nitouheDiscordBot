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

    this.registerToCountries("AC", "アセンション島", "ジョージタウン", "atlantic");
    this.registerToCountries("AD", "アンドラ", "アンドラ・ラ・ベリャ", "europa");
    this.registerToCountries("AE", "アラブ首長国連邦", "アブダビ", "middleEast");
    this.registerToCountries("AF", "アフガニスタン", "カブール", "asia");
    this.registerToCountries("AG", "アンティグア・バーブーダ", "セント・ジョンズ", "caribbean");
    this.registerToCountries("AI", "アンギラ", "バレー", "caribbean");
    this.registerToCountries("AL", "アルバニア", "ティラーナ", "europa");
    this.registerToCountries("AM", "アルメニア", "エレバン", "asia");
    this.registerToCountries("AO", "アンゴラ", "ルアンダ", "africa");
    this.registerToCountries("AQ", "南極", null, "other");
    this.registerToCountries("AR", "アルゼンチン", "ブエノスアイレス", "southAmerica");
    this.registerToCountries("AR", "アメリカ領サモア", "パゴパゴ", "oceania");
    this.registerToCountries("AT", "オーストリア", "ウィーン", "europa");
    this.registerToCountries("AW", "アルバ", "オラニェスタット", "caribbean");
    this.registerToCountries("AX", "オーランド諸島", "マリエハムン", "europa"); 
    this.registerToCountries("AZ", "アゼルバイジャン", "バクー", "asia"); 
    this.registerToCountries("BA", "ボスニア・ヘルツェゴビナ", "サラエボ", "europa");
    this.registerToCountries("BB", "バルバドス", "ブリッジタウン", "caribbean");
    this.registerToCountries("BD", "バングラデシュ", "ダッカ", "asia");
    this.registerToCountries("BE", "ベルギー", "ブリュッセル", "europa");
    this.registerToCountries("BF", "ブルキナ・ファソ", "ワガドゥグー", "africa");
    this.registerToCountries("BG", "ブルガリア", "ソフィア", "europa");
    this.registerToCountries("BH", "バーレーン", "マナーマ", "middleEast");
    this.registerToCountries("BI", "ブルンジ", "ギテガ", "africa");
    this.registerToCountries("BJ", "ベナン", "ポルト・ノボ", "africa");
    this.registerToCountries("BL", "サン・バルテルミー島", "グスタビア", "caribbean");
    this.registerToCountries("BM", "バミューダ諸島", "ハミルトン", "caribbean");
    this.registerToCountries("BN", "ブルネイ", "バンダル・スリ・ブガワン", "aisa");
    this.registerToCountries("BO", "ボリビア", "スクレ", "southAmerica");
    this.registerToCountries("BQ", "ボネール、シント・ユースタティウスおよびサバ", null, "southAmerica");
    this.registerToCountries("BR", "ブラジル", "ブラジリア", "southAmerica");
    this.registerToCountries("BS", "バハマ", "ナッソー", "latinAmerica");
    this.registerToCountries("BT", "ブータン", "ティンプー", "asia");
    this.registerToCountries("BV", "ブーベ島", null, "atlantic");
    this.registerToCountries("BW", "ボツワナ", "ハボローネ", "africa");
    this.registerToCountries("BY", "ベラルーシ", "ミンスク", "europa");
    this.registerToCountries("BZ", "ベリーズ", "ベルモパン", "latinAmerica");
  }

}

