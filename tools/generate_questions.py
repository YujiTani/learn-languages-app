# -*- coding: utf-8 -*-
"""
LingoPop! 問題ジェネレーター
---------------------------
テンプレート × 語彙 の組み合わせで、日本語出題 → 各言語で回答する問題を生成する。

文法処理:
  韓国語     … 을/를・이/가・은/는・이에요/예요 をパッチム有無で自動選択
  デンマーク語 … en/et の性、限定形、形容詞の中性形(-t)を語彙側で明示
  英語       … a/an を語彙側で明示

使い方:
  python3 tools/generate_questions.py
  → questions.json / questions.js を出力
"""
import json
import random
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vocab import (FOODS, PLACES, OBJECTS, JOBS, PEOPLE, ACTIONS, ADJS,
                   TIMES, COUNTRIES, WEATHER)

PER_LANG = 1000
OUT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# =====================================================================
# 韓国語の文法ヘルパー
# =====================================================================
HANGUL_START, HANGUL_END = 0xAC00, 0xD7A3


def _last_hangul(word):
    for ch in reversed(word):
        if HANGUL_START <= ord(ch) <= HANGUL_END:
            return ch
    return None


def has_batchim(word):
    """末尾の音節にパッチム(終声)があるか"""
    ch = _last_hangul(word)
    return bool(ch) and (ord(ch) - HANGUL_START) % 28 != 0


def obj_p(w):    return w + ("을" if has_batchim(w) else "를")   # 目的格
def subj_p(w):   return w + ("이" if has_batchim(w) else "가")   # 主格
def topic_p(w):  return w + ("은" if has_batchim(w) else "는")   # 主題
def copula(w):   return w + ("이에요" if has_batchim(w) else "예요")  # ~です


# --- ローマ字表記(文化観光部2000年式 + 連音化) ---
_INI = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"]
_VOW = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u",
        "wo","we","wi","yu","eu","ui","i"]
_FIN = ["","k","k","k","n","n","n","t","l","k","m","l","l","l","p","l","m",
        "p","p","t","t","ng","t","t","k","t","p","t"]
# 終声 → 次の音節の初声に移る際の音価(連音化)
_FIN_LINK = {1:"g", 2:"kk", 4:"n", 7:"d", 8:"r", 16:"m", 17:"b", 19:"s",
             20:"ss", 21:"ng", 22:"j", 23:"ch", 24:"k", 25:"t", 26:"p", 27:""}


def romanize(text):
    """ハングルをローマ字化(連音化を反映した簡易版)

    音節を [初声, 中声, 終声] に分解し、終声があって次の音節が母音で始まる場合
    (初声がㅇ=index 11)は終声を次の音節の頭に移す(連音化)。
    """
    syls = []
    for ch in text:
        code = ord(ch)
        if HANGUL_START <= code <= HANGUL_END:
            s = code - HANGUL_START
            # [初声idx, 中声idx, 終声idx, 上書き初声(あれば)]
            syls.append([s // 588, (s % 588) // 28, s % 28, None])
        else:
            syls.append(ch)

    for i in range(len(syls) - 1):
        cur, nxt = syls[i], syls[i + 1]
        if not (isinstance(cur, list) and isinstance(nxt, list)):
            continue
        if cur[2] in _FIN_LINK and cur[2] != 0 and nxt[0] == 11:
            nxt[3] = _FIN_LINK[cur[2]]   # 連音化: 終声を次の音節の初声へ
            cur[2] = 0
        elif cur[2] == 8 and nxt[0] == 5:      # ㄹ + ㄹ → ll
            cur[2] = 0
            nxt[3] = "ll"
        elif cur[2] == 8 and nxt[0] == 2:      # ㄹ + ㄴ → ll
            cur[2] = 0
            nxt[3] = "ll"
        elif cur[2] == 4 and nxt[0] == 5:      # ㄴ + ㄹ → ll
            cur[2] = 0
            nxt[3] = "ll"

    parts = []
    for s in syls:
        if isinstance(s, list):
            ini = s[3] if s[3] is not None else _INI[s[0]]
            parts.append(ini + _VOW[s[1]] + _FIN[s[2]])
        elif s in (" ", "　"):
            parts.append(" ")
        elif s in "?!.,~":
            parts.append(s)
    return " ".join("".join(parts).split()).replace(" ?", "?").replace(" .", ".")


# =====================================================================
# デンマーク語 / 英語ヘルパー
# =====================================================================
def da_indef(n):
    return n["g"] + " " + n["da"]


def da_this(n):
    return ("denne " if n["g"] == "en" else "dette ") + n["da"]


def da_my(n):
    return ("min " if n["g"] == "en" else "mit ") + n["da"]


def da_adj(adj, n):
    return adj["da"] if n["g"] == "en" else adj["da_n"]


def en_indef(n):
    return (n["art"] + " " + n["en"]) if n["art"] else n["en"]


def cap(s):
    return s[0].upper() + s[1:] if s else s


# =====================================================================
# テンプレート
# =====================================================================
GROUPS = []   # [(グループ名, [item, ...]), ...]


def group(name):
    def deco(fn):
        items = list(fn())
        GROUPS.append((name, items))
        return fn
    return deco


def item(ja, ko, da, en, hint, nko, nda, nen):
    return dict(ja=ja, ko=ko, da=da, en=en, h=hint,
                n=dict(ko=nko, da=nda, en=nen))


# ---------- 1. 「~が好きです」 ----------
@group("like")
def g_like():
    for f in FOODS:
        yield item(
            f"私は{f['ja']}が好きです。",
            f"저는 {obj_p(f['ko'])} 좋아해요.",
            f"Jeg kan godt lide {f['dagen']}.",
            f"I like {f['gen']}.",
            "好み",
            f"「~을/를 좋아해요」=「~が好きです」。{f['ko']}はパッチム{'あり→을' if has_batchim(f['ko']) else 'なし→를'}。",
            f"kan godt lide=好き。総称なので冠詞なしの {f['dagen']} を使います。",
            f"like のあとは総称形({f['gen']})。数えられる名詞は複数形にします。")
        yield item(
            f"私は{f['ja']}が好きではありません。",
            f"저는 {obj_p(f['ko'])} 안 좋아해요.",
            f"Jeg kan ikke lide {f['dagen']}.",
            f"I don't like {f['gen']}.",
            "好み",
            "動詞の前に 안 を置くと否定になります。",
            "否定は ikke を動詞の直後に。kan ikke lide=好きではない。",
            "don't + 動詞の原形で否定文になります。")
        yield item(
            f"{f['ja']}は好きですか?",
            f"{obj_p(f['ko'])} 좋아해요?",
            f"Kan du lide {f['dagen']}?",
            f"Do you like {f['gen']}?",
            "質問",
            "疑問文は語尾を上げるだけ。語順は変わりません。",
            "疑問文は動詞を文頭に(Kan du ...?)。",
            "一般動詞の疑問文は Do you ~? で始めます。")


# ---------- 2. 注文する ----------
@group("order")
def g_order():
    for f in FOODS:
        yield item(
            f"{f['ja']}を一つください。",
            f"{f['ko']} 하나 주세요.",
            f"{cap(da_indef(f))}, tak.",
            f"{cap(en_indef(f))}, please.",
            "買い物",
            "「~ 주세요」=「~をください」。하나=1つ。",
            f"{f['da']}は{f['g']}名詞なので「{f['g']} {f['da']}」。tak をつけると丁寧。",
            "カフェや店での注文の最短形。please を忘れずに。")
        yield item(
            f"{f['ja']}をお願いできますか?",
            f"{f['ko']} 좀 주시겠어요?",
            f"Må jeg bede om {da_indef(f)}?",
            f"Could I have {en_indef(f)}, please?",
            "買い物",
            "「주시겠어요?」は「주세요」より丁寧な依頼表現。",
            "Må jeg bede om ~? =「~をいただけますか」。丁寧な定番表現。",
            "Could I have ~? は Can I より丁寧な依頼。")


# ---------- 3. 場所を尋ねる ----------
@group("where")
def g_where():
    for p in PLACES:
        yield item(
            f"{p['ja']}はどこですか?",
            f"{subj_p(p['ko'])} 어디예요?",
            f"Hvor er {p['dad']}?",
            f"Where is the {p['en']}?",
            "旅行",
            f"「~이/가 어디예요?」=「~はどこですか」。{p['ko']}はパッチム{'あり→이' if has_batchim(p['ko']) else 'なし→가'}。",
            f"デンマーク語の定冠詞は語尾につきます({p['da']}→{p['dad']})。",
            "場所を尋ねる基本形。Excuse me, を前につけると丁寧。")


# ---------- 4. 場所へ行く ----------
@group("go")
def g_go():
    for p in PLACES:
        yield item(
            f"私は{p['ja']}に行きます。",
            f"저는 {p['ko']}에 가요.",
            f"Jeg skal til {p['dad']}.",
            f"I'm going to the {p['en']}.",
            "日常",
            "場所につく助詞は「에」。「~에 가요」=「~に行きます」。",
            "skal til ~ で「~へ行く予定だ」。行き先は限定形。",
            "近い予定は be going to で表します。")
        yield item(
            f"昨日{p['ja']}に行きました。",
            f"어제 {p['ko']}에 갔어요.",
            f"Jeg tog til {p['dad']} i går.",
            f"I went to the {p['en']} yesterday.",
            "日常",
            "過去形は 가요 → 갔어요。어제=昨日。",
            "tage(行く)の過去形は tog。i går=昨日。",
            "go の過去形は went(不規則動詞)。")


# ---------- 5. 値段を聞く ----------
@group("price")
def g_price():
    for o in OBJECTS:
        yield item(
            f"この{o['ja']}はいくらですか?",
            f"이 {topic_p(o['ko'])} 얼마예요?",
            f"Hvad koster {da_this(o)}?",
            f"How much is this {o['en']}?",
            "買い物",
            f"이=この、얼마=いくら。{o['ko']}はパッチム{'あり→은' if has_batchim(o['ko']) else 'なし→는'}。",
            f"「この」は{o['g']}名詞なら{'denne' if o['g']=='en' else 'dette'}。",
            "How much is ~? が値段を聞く定番。")


# ---------- 6. 職業 ----------
@group("job")
def g_job():
    for j in JOBS:
        yield item(
            f"私は{j['ja']}です。",
            f"저는 {copula(j['ko'])}.",
            f"Jeg er {j['da']}.",
            f"I'm {en_indef(j)}.",
            "自己紹介",
            f"~です は パッチムあり→이에요 / なし→예요。{j['ko']}は{'あり' if has_batchim(j['ko']) else 'なし'}。",
            "デンマーク語は職業名に冠詞をつけません(Jeg er læge.)。",
            f"英語は逆に冠詞が必要です({j['art']} {j['en']})。")
        yield item(
            f"あなたは{j['ja']}ですか?",
            f"{copula(j['ko'])}?",
            f"Er du {j['da']}?",
            f"Are you {en_indef(j)}?",
            "質問",
            "韓国語は主語をよく省略します。語尾を上げれば疑問文。",
            "be動詞 er を文頭に出して疑問文にします。",
            "Are you ~? で職業を尋ねられます。")


# ---------- 7. 予定を聞く ----------
@group("plan")
def g_plan():
    for t in TIMES:
        ko_time = t["ko"] + ("에" if t["ko_e"] else "")
        yield item(
            f"{t['ja']}は何をしますか?",
            f"{ko_time} 뭐 해요?",
            f"Hvad laver du {t['da']}?",
            f"What are you doing {t['en']}?",
            "質問",
            f"時間には助詞「에」がつきます{'' if t['ko_e'] else 'が、오늘・내일・어제 にはつきません'}。",
            "lave=する・作る。Hvad laver du? は「何してるの?」の定番。",
            "近い未来の予定は現在進行形で表せます。")


# ---------- 8-10. 動作 ----------
@group("routine")
def g_routine():
    for a in ACTIONS:
        yield item(
            f"私は毎日{a['ja_p']}。",
            f"저는 매일 {a['ko_p']}.",
            f"Jeg {a['da_p']} hver dag.",
            f"I {a['en_b']} every day.",
            "日常",
            "매일=毎日。해요体は日常会話で最もよく使う丁寧形。",
            "hver dag=毎日。デンマーク語の現在形は原形+r が基本。",
            "習慣は現在形で表します。")


@group("past")
def g_past():
    for a in ACTIONS:
        yield item(
            f"昨日{a['ja_pa']}。",
            f"어제 {a['ko_pa']}.",
            f"Jeg {a['da_pa']} i går.",
            f"I {a['en_pa']} yesterday.",
            "過去",
            "過去形は語幹+았/었어요。어제=昨日。",
            "規則動詞の過去形は -ede / -te。i går=昨日。",
            "過去の出来事は過去形で。")


@group("now")
def g_now():
    for a in ACTIONS:
        yield item(
            f"今{a['ja_p']}。",
            f"지금 {a['ko_p']}.",
            f"Jeg {a['da_p']} lige nu.",
            f"I'm {a['en_ing']} right now.",
            "日常",
            "지금=今。韓国語は現在形が進行の意味も兼ねます。",
            "デンマーク語も現在形で進行を表します(進行形は不要)。",
            "今まさにしていることは現在進行形(be + -ing)。")


@group("future")
def g_future():
    for a in ACTIONS:
        yield item(
            f"明日{a['ja_p']}。",
            f"내일 {a['ko_p']}.",
            f"Jeg {a['da_p']} i morgen.",
            f"I'm going to {a['en_b']} tomorrow.",
            "予定",
            "確定した予定は現在形のままでOK。내일=明日。",
            "デンマーク語も予定は現在形で表せます。i morgen=明日。",
            "be going to ~ で予定を表します。")


# ---------- 11. これは~です(形容詞) ----------
@group("adj_obj")
def g_adj_obj():
    for o in OBJECTS:
        for a in ADJS:
            if o["tag"] not in a["ok"].split():
                continue          # 「このドアは有名です」のような不自然な組合せを除外
            yield item(
                f"この{o['ja']}はとても{a['jp']}。",
                f"이 {topic_p(o['ko'])} 아주 {a['ko_p']}.",
                f"{cap(da_this(o))} er meget {da_adj(a, o)}.",
                f"This {o['en']} is very {a['en']}.",
                "描写",
                "아주=とても。形容詞も動詞と同じく해요体で活用します。",
                f"述語の形容詞は性に一致。{o['g']}名詞なので「{da_adj(a, o)}」。",
                "very で形容詞を強調できます。")


@group("adj_place")
def g_adj_place():
    for p in PLACES:
        for a in ADJS:
            if p["tag"] not in a["ok"].split():
                continue          # 「その大学は暖かいです」のような不自然な組合せを除外
            yield item(
                f"その{p['ja']}はとても{a['jp']}。",
                f"그 {topic_p(p['ko'])} 아주 {a['ko_p']}.",
                f"{cap(p['dad'])} er meget {da_adj(a, p)}.",
                f"The {p['en']} is very {a['en']}.",
                "描写",
                "그=その。指示語は 이(この)/그(その)/저(あの)。",
                f"{p['g']}名詞なので形容詞は「{da_adj(a, p)}」の形になります。",
                "既知のものには the をつけます。")


# ---------- 12. 言語を学ぶ ----------
@group("lang")
def g_lang():
    for c in COUNTRIES:
        yield item(
            f"私は{c['lang_ja']}を勉強しています。",
            f"저는 {obj_p(c['lang_ko'])} 공부해요.",
            f"Jeg lærer {c['lang_da']}.",
            f"I'm learning {c['lang_en']}.",
            "学習",
            "「~을/를 공부해요」=「~を勉強しています」。",
            "言語名は小文字で書きます(dansk, engelsk...)。",
            "言語名は大文字で始めます(Danish, Korean...)。")
        yield item(
            f"{c['lang_ja']}は難しいですか?",
            f"{topic_p(c['lang_ko'])} 어려워요?",
            f"Er {c['lang_da']} svært?",
            f"Is {c['lang_en']} difficult?",
            "質問",
            "어렵다(難しい)の해요体は 어려워요(ㅂ不規則)。",
            "言語名は中性扱いなので形容詞は -t 形(svært)。",
            "Is ~ difficult? で難易度を尋ねられます。")


# ---------- 13. 国に行きたい ----------
@group("country")
def g_country():
    for c in COUNTRIES:
        yield item(
            f"私は{c['ja']}に行きたいです。",
            f"저는 {c['ko']}에 가고 싶어요.",
            f"Jeg vil gerne til {c['da']}.",
            f"I want to go to {c['en']}.",
            "旅行",
            "「~고 싶어요」=「~したいです」。願望の基本表現。",
            "vil gerne ~ =「~したい」。gerne があると柔らかい響きに。",
            "want to + 動詞の原形。")
        yield item(
            f"{c['ja']}に行ったことがありますか?",
            f"{c['ko']}에 가 봤어요?",
            f"Har du været i {c['da']}?",
            f"Have you been to {c['en']}?",
            "質問",
            "「~아/어 봤어요」=「~したことがあります」(経験)。",
            "現在完了は har + 過去分詞。været は være の過去分詞。",
            "経験は現在完了(have been to ~)で表します。")


# ---------- 14. 持っている / 必要 ----------
@group("have")
def g_have():
    for o in OBJECTS:
        yield item(
            f"{o['ja']}を持っていますか?",
            f"{o['ko']} 있어요?",
            f"Har du {da_indef(o)}?",
            f"Do you have {en_indef(o)}?",
            "質問",
            "있어요=あります・持っています。없어요=ありません。",
            f"have の現在形は har。{o['da']}は{o['g']}名詞。",
            "Do you have ~? で所持を尋ねます。")


@group("need")
def g_need():
    for o in OBJECTS:
        yield item(
            f"{o['ja']}が必要です。",
            f"{subj_p(o['ko'])} 필요해요.",
            f"Jeg har brug for {da_indef(o)}.",
            f"I need {en_indef(o)}.",
            "日常",
            "「~이/가 필요해요」=「~が必要です」。助詞は이/가。",
            "har brug for ~ =「~が必要だ」。3語セットで覚えます。",
            "need のあとは目的語がそのまま続きます。")


@group("my_obj")
def g_my_obj():
    for o in OBJECTS:
        yield item(
            f"私の{o['ja']}はどこですか?",
            f"제 {topic_p(o['ko'])} 어디에 있어요?",
            f"Hvor er {da_my(o)}?",
            f"Where is my {o['en']}?",
            "質問",
            "제=私の(저의の縮約)。「어디에 있어요?」=「どこにありますか」。",
            f"所有代名詞も性に一致。{o['g']}名詞なので「{'min' if o['g']=='en' else 'mit'}」。",
            "my は性別・数に関係なく1種類だけ。")


# ---------- 15. 人 ----------
HUMANS = [p for p in PEOPLE if p["en"] not in ("dog", "cat", "baby")]


@group("person_job")
def g_person_job():
    for p in HUMANS:
        for j in JOBS:
            yield item(
                f"私の{p['ja']}は{j['ja']}です。",
                f"제 {topic_p(p['ko'])} {copula(j['ko'])}.",
                f"Min {p['da']} er {j['da']}.",
                f"My {p['en']} is {en_indef(j)}.",
                "家族",
                "제 ~ 은/는 …이에요/예요。所有+主題+断定の基本形。",
                "人を表す名詞はほぼ en 名詞なので min を使います。",
                "3人称単数なので be動詞は is。")


@group("person_place")
def g_person_place():
    for p in HUMANS:
        for pl in PLACES:
            yield item(
                f"私の{p['ja']}は{pl['ja']}にいます。",
                f"제 {topic_p(p['ko'])} {pl['ko']}에 있어요.",
                f"Min {p['da']} er {pl['dapre']}.",
                f"My {p['en']} is at the {pl['en']}.",
                "日常",
                "있어요 は「いる」「ある」の両方に使えます。場所には에。",
                f"場所の前置詞は語ごとに決まっています(ここでは {pl['dapre'].split()[0]})。",
                "建物の中にいるときは at the ~ が自然。")


@group("met")
def g_met():
    for p in HUMANS:
        yield item(
            f"昨日私の{p['ja']}に会いました。",
            f"어제 제 {obj_p(p['ko'])} 만났어요.",
            f"Jeg mødte min {p['da']} i går.",
            f"I met my {p['en']} yesterday.",
            "過去",
            "만나다は「~를/을 만나다」。日本語の「に会う」と助詞が違います。",
            "møde の過去形は mødte。",
            "meet の過去形は met(不規則動詞)。")


# ---------- 16. 天気 ----------
@group("weather")
def g_weather():
    for w in WEATHER:
        yield item(
            f"今日は{w['ja']}です。",
            f"오늘은 {w['ko']}.",
            f"Det er {w['da']} i dag.",
            f"It's {w['en']} today.",
            "天気",
            "오늘은=今日は。天気は形容詞の해요体をそのまま使えます。",
            "天気は必ず Det er ~ で始めます(形式主語)。",
            "天気の主語は it。It's ~ today. が定番。")


# ---------- 17. 距離を聞く ----------
@group("far")
def g_far():
    for p in PLACES:
        yield item(
            f"{p['ja']}はここから遠いですか?",
            f"{subj_p(p['ko'])} 여기서 멀어요?",
            f"Er {p['dad']} langt herfra?",
            f"Is the {p['en']} far from here?",
            "旅行",
            "여기서=ここから(여기에서の縮約)、멀다=遠い。",
            "herfra=ここから(her+fra)。langt は中性形。",
            "far from here で「ここから遠い」。")


# =====================================================================
# 生成 & サンプリング
# =====================================================================
def build(lang, curated, seed):
    """グループをラウンドロビンで巡回し、偏りなく PER_LANG 件サンプリング"""
    rnd = random.Random(seed)
    pools = []
    for name, items in GROUPS:
        shuffled = items[:]
        rnd.shuffle(shuffled)
        pools.append(shuffled)
    rnd.shuffle(pools)

    out, seen = [], set()
    for c in curated:                       # 手書き問題を先頭に
        out.append(c)
        seen.add(c["t"])

    idx = [0] * len(pools)
    exhausted = 0
    while len(out) < PER_LANG and exhausted < len(pools):
        exhausted = 0
        for gi, pool in enumerate(pools):
            if len(out) >= PER_LANG:
                break
            if idx[gi] >= len(pool):
                exhausted += 1
                continue
            it = pool[idx[gi]]
            idx[gi] += 1
            t = it[lang]
            if t in seen:
                continue
            seen.add(t)
            out.append(dict(
                t=t,
                r=romanize(t) if lang == "ko" else "",
                a=it["ja"],
                n=it["n"][lang],
                h=it["h"],
            ))
    return out


# --- 手書きの定番フレーズ(既存の20問 × 3言語) ---
CURATED = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "curated.json"), encoding="utf-8"))

META = {
    "ko": ("韓国語", "🇰🇷"),
    "da": ("デンマーク語", "🇩🇰"),
    "en": ("英語", "🇬🇧"),
}

def main():
    data = {}
    for i, lang in enumerate(["ko", "da", "en"]):
        name, flag = META[lang]
        items = build(lang, CURATED[lang], seed=1000 + i)
        data[lang] = dict(name=name, flag=flag, items=items)
        print(f"{lang}: {len(items)} 問  (ユニーク {len(set(x['t'] for x in items))})")

    js_path = os.path.join(OUT_DIR, "questions.json")
    with open(js_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    # file:// でも読めるよう JS 版も出力
    with open(os.path.join(OUT_DIR, "questions.js"), "w", encoding="utf-8") as f:
        f.write("window.LINGOPOP_QUESTIONS = ")
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    size = os.path.getsize(js_path) / 1024
    print(f"→ questions.json / questions.js を出力 ({size:.0f} KB)")


if __name__ == "__main__":
    main()
