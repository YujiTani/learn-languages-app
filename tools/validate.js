#!/usr/bin/env node
/* =====================================================================
 * LingoPop! 全数検証スクリプト
 * ---------------------------------------------------------------------
 * generator.js が生成しうる全問題を列挙し、文法・形式を機械チェックする。
 * デプロイ前に必ず実行:  node tools/validate.js
 * 1件でもエラーがあれば exit code 1 で失敗する。
 * ===================================================================== */
"use strict";
const path = require("path");
const gen = require(path.join(__dirname, "..", "generator.js"));

const errors = [];
const warns = [];
function err(lang, t, msg) { errors.push(`[${lang}] ${msg}\n        ${t}`); }
function warn(lang, t, msg) { warns.push(`[${lang}] ${msg}\n        ${t}`); }

const bank = gen.buildBank();
const { hasBatchim, endsRieul, vocab } = gen;

/* ---------- 全言語共通チェック ---------- */
for (const [lang, data] of Object.entries(bank)) {
  const seen = new Set();
  for (const it of data.items) {
    const { t, a, n, h, r, alt } = it;
    // 必須フィールド
    if (!t || !a || !n || !h) err(lang, t || a, "空フィールドがある");
    // テンプレート事故の痕跡
    for (const bad of ["undefined", "null", "NaN", "[object", "${"]) {
      if (t.includes(bad)) err(lang, t, `出力に "${bad}" が混入`);
      if (a.includes(bad)) err(lang, a, `出題文に "${bad}" が混入`);
    }
    // 二重スペース・端のスペース
    if (/\s{2,}/.test(t)) err(lang, t, "二重スペース");
    if (t !== t.trim()) err(lang, t, "端に余分な空白");
    // 文末
    if (!/[.?!。]$/.test(t)) err(lang, t, "文末記号がない");
    // 疑問文の整合(日本語が?で終わるのに回答がピリオド等)
    if (/[?？]$/.test(a) && !/\?$/.test(t)) err(lang, t, `疑問文の不一致: 出題「${a}」`);
    if (!/[?？]$/.test(a) && /\?$/.test(t)) err(lang, t, `平叙文なのに?で終わる: 出題「${a}」`);
    // 重複
    if (seen.has(t)) err(lang, t, "重複した問題文");
    seen.add(t);
    // 単語タイルモードで成立するか(1語だけの文は curated 以外NG)
    // (1語文はタイル問題として成立するのでwarnのみ)
    if (t.split(" ").length === 1 && lang !== "ko") warn(lang, t, "1語のみの文");
    // 言い換え(任意フィールド。ないのは正常、あるなら中身を検査する)
    if (alt) {
      for (const bad of ["undefined", "null", "NaN", "[object", "${"]) {
        if (alt.includes(bad)) err(lang, t, `言い換えに "${bad}" が混入: ${alt}`);
      }
      if (alt !== alt.trim()) err(lang, t, `言い換えの端に余分な空白: ${alt}`);
      if (/\s{2,}/.test(alt)) err(lang, t, `言い換えに二重スペース: ${alt}`);
      if (alt === t) err(lang, t, "言い換えが模範解答そのもの");
      if (alt.length < 10) err(lang, t, `言い換えが短すぎる(書きかけ?): ${alt}`);
    }
    if (lang === "ko" && !r) err(lang, t, "ローマ字がない");
    if (lang === "ko" && /[a-zA-Z]/.test(t)) err(lang, t, "韓国語文にラテン文字が混入");
  }
}

/* ---------- 韓国語: 助詞チェック ---------- */
{
  const items = bank.ko.items;
  for (const it of items) {
    const t = it.t;
    // 을/를
    for (const m of t.matchAll(/([가-힣])(을|를)(\s|$)/g)) {
      const need = hasBatchim(m[1]) ? "을" : "를";
      if (m[2] !== need) err("ko", t, `目的格助詞: ${m[1]}${m[2]} → ${m[1]}${need} が正しい`);
    }
    // 이/가 (이 は連体詞「この」と衝突するため直後が空白のもののみ)
    // 「가까이(近くに)」のように 이 で終わる副詞は助詞ではないので除外する。
    // m[1] は1文字しか取れないので、マッチ位置の手前まで含めて判定する
    const ADV_I = /(가까이|많이|같이|깊이|높이)$/;
    for (const m of t.matchAll(/([가-힣])(이|가)\s/g)) {
      const need = hasBatchim(m[1]) ? "이" : "가";
      if (m[2] === "이" && ADV_I.test(t.slice(0, m.index + 2))) continue;
      if (m[2] !== need) err("ko", t, `主格助詞: ${m[1]}${m[2]} → ${m[1]}${need} が正しい`);
    }
    // 은/는
    // 動詞・形容詞の連体形(재미있는・사는 など)は助詞ではないので除外する。
    // 있다 の連体形は必ず 있는 で、「있 + 은」になることはない。
    const ADNOM = /(있|사|하|가|오|보|자|먹|읽|쓰)는$/;
    for (const m of t.matchAll(/([가-힣])(은|는)\s/g)) {
      const need = hasBatchim(m[1]) ? "은" : "는";
      if (m[2] === "는" && ADNOM.test(m[1] + m[2])) continue;
      if (m[2] !== need) err("ko", t, `主題助詞: ${m[1]}${m[2]} → ${m[1]}${need} が正しい`);
    }
    // 이에요/예요
    for (const m of t.matchAll(/([가-힣])(이에요|예요)/g)) {
      const stem = m[1];
      if (m[2] === "이에요" && !hasBatchim(stem)) err("ko", t, `${stem}이에요 → ${stem}예요 が正しい`);
      if (m[2] === "예요" && hasBatchim(stem) && stem !== "어") // 어디예요 等は 어디+예요 で正しい
        err("ko", t, `${stem}예요 → ${stem}이에요 が正しい可能性`);
    }
    // (으)로
    for (const m of t.matchAll(/([가-힣])(로|으로)\s/g)) {
      const need = (!hasBatchim(m[1]) || endsRieul(m[1])) ? "로" : "으로";
      if (m[2] !== need) err("ko", t, `助詞(으)로: ${m[1]}${m[2]} → ${m[1]}${need} が正しい`);
    }
  }
}

/* ---------- デンマーク語: 冠詞・性・一致チェック ---------- */
{
  const nouns = {};   // da形 → 語彙情報
  for (const list of [vocab.FOODS, vocab.PLACES, vocab.OBJECTS]) {
    for (const n of list) nouns[n.da] = n;
  }
  const items = bank.da.items;
  for (const it of items) {
    const t = it.t;
    if (!/^[A-ZÆØÅ]/.test(t)) err("da", t, "文頭が大文字でない");
    // en/et + 名詞
    for (const m of t.matchAll(/\b(en|et) ([a-zæøåA-ZÆØÅ-]+)/gi)) {
      const g = m[1].toLowerCase(), w = m[2];
      const info = nouns[w] || nouns[w.toLowerCase()];
      if (info && info.g !== g) err("da", t, `冠詞の性: ${g} ${w} → ${info.g} ${w} が正しい`);
    }
    // denne/dette + 名詞
    for (const m of t.matchAll(/\b(denne|dette) ([a-zæøåA-ZÆØÅ-]+)/gi)) {
      const need = m[1].toLowerCase() === "denne" ? "en" : "et";
      const info = nouns[m[2]] || nouns[m[2].toLowerCase()];
      if (info && info.g !== need)
        err("da", t, `指示詞の性: ${m[1]} ${m[2]} → ${info.g === "en" ? "denne" : "dette"} ${m[2]} が正しい`);
    }
    // min/mit + 名詞
    for (const m of t.matchAll(/\b(min|mit) ([a-zæøåA-ZÆØÅ-]+)/gi)) {
      const need = m[1].toLowerCase() === "min" ? "en" : "et";
      const info = nouns[m[2]] || nouns[m[2].toLowerCase()];
      if (info && info.g !== need)
        err("da", t, `所有詞の性: ${m[1]} ${m[2]} → ${info.g === "en" ? "min" : "mit"} ${m[2]} が正しい`);
    }
    // 形容詞の性一致(er meget X / er X 形式で主語名詞が特定できる場合)
    const adjMap = {};
    for (const a of vocab.ADJS) { adjMap[a.da] = a; adjMap[a.da_n] = a; }
    const m2 = t.match(/^(Denne|Dette) ([a-zæøå-]+) er meget ([a-zæøå]+)\.$/i);
    if (m2) {
      const info = nouns[m2[2]];
      const adj = adjMap[m2[3]];
      if (info && adj) {
        const need = info.g === "en" ? adj.da : adj.da_n;
        if (m2[3] !== need) err("da", t, `形容詞の性一致: ${m2[3]} → ${need} が正しい`);
      }
    }
  }
}

/* ---------- 英語: 冠詞チェック ---------- */
{
  const AN_EXCEPT = new Set(["university", "european", "one", "unique", "uniform"]);
  const A_EXCEPT = new Set(["hour", "honest", "honor"]);
  for (const it of bank.en.items) {
    const t = it.t;
    if (!/^[A-Z]/.test(t)) err("en", t, "文頭が大文字でない");
    for (const m of t.matchAll(/\b(a|an) ([A-Za-z-]+)/g)) {
      const w = m[2].toLowerCase();
      const startsVowel = "aeiou".includes(w[0]);
      if (m[1] === "a" && startsVowel && !AN_EXCEPT.has(w)) err("en", t, `a ${m[2]} → an ${m[2]} が正しい`);
      if (m[1] === "an" && !startsVowel && !A_EXCEPT.has(w)) err("en", t, `an ${m[2]} → a ${m[2]} が正しい`);
    }
    if (/\bI is\b|\byou is\b|\bis are\b/.test(t)) err("en", t, "be動詞の一致エラー");
  }
}

/* ---------- 語彙データ自体の整合チェック ---------- */
{
  for (const list of [vocab.FOODS, vocab.PLACES, vocab.OBJECTS]) {
    for (const n of list) {
      if (!["en", "et"].includes(n.g)) err("da", n.da, `語彙: 性が不正 (${n.g})`);
      if (n.g === "en" && !/(en|n)$/.test(n.dad) && n.dad !== n.da)
        warn("da", n.da, `語彙: en名詞の限定形 ${n.dad} を確認`);
      if (!["a", "an", ""].includes(n.art)) err("en", n.en, `語彙: 冠詞が不正 (${n.art})`);
    }
    for (const n of list) {
      if (n.tag && !("read device vehicle thing furniture cloth culture commerce nature service food".split(" ").includes(n.tag)))
        err("all", n.ja, `語彙: 未知のタグ ${n.tag}`);
    }
  }
}

/* ---------- 言い換えデータの整合チェック ---------- */
{
  for (const a of vocab.ACTIONS) {
    for (const k of ["alt_ko", "alt_da", "alt_en"]) {
      if (a[k] === undefined) continue;
      if (typeof a[k] !== "string" || a[k].length < 10)
        err("all", a.ja_p, `語彙: ${k} が文字列でないか短すぎる`);
    }
  }
}

/* ---------- 意味の禁止パターン(レビューで見つけ次第ここに追加) ---------- */
const BANNED = {
  ja: [
    /その(橋|バス停|トイレ)はとても(面白い|人気)/,   // 意味的に不自然
    /トイレ.*とても美しい/,
    /(ご飯|バター|牛乳|水)はとても(甘い|人気)/,      // LLMレビュー指摘(2026-08)
    /(祖父|祖母|上司)は学生です/,
    /(写真|地図)はとても(重い|軽い)/,
    /曇りので/,                                      // 名詞+ので は非文(→曇りなので)
    /(ビール|ワイン|コーヒー|お茶|牛乳|水)を食べた/,
  ],
  da: [
    /\bzooen\b/,             // zoologisk have を使う(zooen は口語すぎ)
    /Det er fugtigt/,        // 蒸し暑い は lummert(LLMレビュー指摘)
    /Jeg tegnede i går/,     // 目的語が必要
  ],
  en: [
    /very delicious/,        // delicious は強意形容詞なので very と併用不可
    /\bI drew yesterday\b/,  // 目的語が必要
    /Where is my key\?/,     // 鍵は keys(複数)が自然
    /do you .* my /,         // 疑問文でmyは人称不一致(→your)
    /Have you ever tried (bread|meat|cheese|rice)\b/,  // 日常食すぎて不自然
  ],
  ko: [
    /바람이 불어요/,          // 「風が強い」は 바람이 세요(LLMレビュー指摘)
    /습해요/,                // 蒸し暑い は 무더워요
  ],
};
for (const [lang, data] of Object.entries(bank)) {
  for (const it of data.items) {
    for (const re of BANNED.ja) if (re.test(it.a)) err(lang, it.t, `禁止パターン(出題文): ${re}`);
    for (const re of BANNED[lang] || []) if (re.test(it.t)) err(lang, it.t, `禁止パターン: ${re}`);
    for (const re of BANNED[lang] || []) if (it.alt && re.test(it.alt))
      err(lang, it.t, `禁止パターン(言い換え): ${re}`);
  }
}

/* ---------- 難易度チェック ---------- */
{
  const MIN_PER_BUCKET = 100;
  const MAX_D = 5;
  for (const [lang, data] of Object.entries(bank)) {
    const counts = new Array(MAX_D).fill(0);
    for (const it of data.items) {
      if (!(Number.isInteger(it.d) && it.d >= 1 && it.d <= MAX_D)) {
        err(lang, it.t, `難易度が不正 (d=${it.d})`); continue;
      }
      counts[it.d - 1]++;
    }
    counts.forEach((c, i) => {
      if (c < MIN_PER_BUCKET) err(lang, `D${i + 1}`, `難易度D${i + 1}の問題が${c}問しかない(最低${MIN_PER_BUCKET}問)`);
    });
  }
  // 飲み物に「食べた」が付いていないか(回帰ガード)
  for (const it of bank.en.items) {
    if (/tried (water|milk|coffee|tea|juice|beer|wine)\b/.test(it.t)) err("en", it.t, "飲み物にtried(食べた文脈)");
  }
  for (const it of Object.values(bank).flatMap(b => b.items)) {
    if (/(ビール|ワイン|水|牛乳|コーヒー|お茶|ジュース)を食べた/.test(it.a)) err("ja", it.a, "飲み物に「食べた」");
  }
}

/* ---------- ローマ字の回帰テスト(LLMレビューで見つかった発音変化) ---------- */
{
  const CASES = [
    ["감사합니다", "gamsahamnida"],       // 鼻音化 ㅂ+ㄴ→m
    ["입니다", "imnida"],
    ["읽었어요", "ilgeosseoyo"],          // 二重パッチム ㄺ+母音
    ["박물관", "bangmulgwan"],            // 鼻音化 ㄱ+ㅁ→ng
    ["설날", "seollal"],                  // ㄹ+ㄴ→ll
    ["음악을", "eumageul"],               // 連音化
    ["한국어", "hangugeo"],
    ["좋아해요", "joahaeyo"],             // ㅎ+母音→無音
    ["산책해요", "sanchaekaeyo"],         // 激音化 ㄱ+ㅎ→k
    ["따뜻해서", "ttatteutaeseo"],        // 激音化 ㅅ+ㅎ→t
  ];
  for (const [input, expected] of CASES) {
    const got = gen.romanize(input);
    if (got !== expected) err("ko", input, `ローマ字回帰テスト失敗: ${got} (期待: ${expected})`);
  }
}

/* ---------- レポート ---------- */
console.log("=== LingoPop! 全数検証 ===");
for (const [lang, data] of Object.entries(bank)) {
  const withAlt = data.items.filter(i => i.alt).length;
  console.log(`${lang}: ${data.items.length.toLocaleString()} 問(うち言い換えつき ${withAlt.toLocaleString()} 問)`);
}
console.log();
if (warns.length) {
  console.log(`⚠ 警告 ${warns.length} 件`);
  for (const w of warns.slice(0, 10)) console.log("  " + w.replace(/\n/g, "\n  "));
  if (warns.length > 10) console.log(`  …ほか ${warns.length - 10} 件`);
  console.log();
}
if (errors.length) {
  console.log(`✗ エラー ${errors.length} 件`);
  for (const e of errors.slice(0, 30)) console.log("  " + e.replace(/\n/g, "\n  "));
  if (errors.length > 30) console.log(`  …ほか ${errors.length - 30} 件`);
  process.exit(1);
} else {
  console.log("✓ 全チェック合格");
}
