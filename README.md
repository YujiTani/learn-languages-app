# LingoPop! 🇰🇷🇩🇰🇬🇧

日本語の文を見て、韓国語・デンマーク語・英語で答える、Duolingo風の語学学習アプリ。
**各言語1000問(合計3000問)** 収録。

## 機能

- 4モード: 韓国語 / デンマーク語 / 英語 / 3言語ミックス
- 「問題を生成」で毎回ランダムに**日本語の文**を5問出題 → 選んだ言語で回答
- 回答モードをトグルで切替:
  - 📝 ノート記述: 自分でノートに書いてから「回答を確認」で答え合わせ
  - 🧩 単語タイル: Duolingo風。シャッフルされた単語を正しい順にタップ(ダミー単語入り)
- 韓国語はローマ字読み付き(連音化を反映)
- 全問に文法解説つき(助詞の使い分け、en/et の性、a/an など)
- GitHubの草風「学習カレンダー」で毎日の学習量を可視化
- ゲーミフィケーション: XP・レベル・連続学習ストリーク🔥・レベルアップ演出・紙吹雪
- 進捗はブラウザ(localStorage)に自動保存

## ファイル構成

```
index.html      アプリ本体
questions.json  問題データ(各言語1000問)
questions.js    同じデータのJS版。file:// で開いたときのフォールバック
tools/
  vocab.py             語彙データ(名詞・動詞・形容詞など約180語)
  generate_questions.py 問題ジェネレーター
  curated.json         手書きの定番フレーズ(各言語20問)
```

## 問題の追加・編集

### 語彙を足す(推奨)

`tools/vocab.py` に単語を1行足して再生成すると、全テンプレートに自動で展開されます。

```python
dict(ja="鏡", ko="거울", da="spejl", g="et", dad="spejlet", en="mirror", art="a", tag="thing"),
```

```bash
python3 tools/generate_questions.py   # questions.json / questions.js を再生成
```

文法は語彙データから自動で処理されます:

- **韓国語** … 을/를・이/가・은/는・이에요/예요 をパッチムの有無で自動選択
- **デンマーク語** … `g`(en/et)と `dad`(限定形)から冠詞・形容詞の中性形を決定
- **英語** … `art` で a/an を指定

### 文型を足す

`tools/generate_questions.py` の `@group(...)` を1つ追加すると、語彙数ぶんの問題が一気に増えます。

### 1問だけ手で足す

`tools/curated.json` に追記して再生成してください(手書き問題は必ず収録されます)。

## GitHub Pages へのデプロイ手順

このフォルダでターミナルを開いて実行:

```bash
# 1. Gitリポジトリを初期化してコミット
git init
git add index.html questions.json questions.js README.md tools/
git commit -m "Add LingoPop language learning app"
git branch -M main

# 2. GitHubにリポジトリを作成してプッシュ(gh CLIがある場合)
gh repo create learn-languages-app --public --source=. --push

# 3. GitHub Pagesを有効化
gh api repos/{owner}/learn-languages-app/pages \
  -X POST -f "source[branch]=main" -f "source[path]=/"
```

数分後に `https://<ユーザー名>.github.io/learn-languages-app/` で公開されます。

### gh CLI がない場合(Web UIで)

1. https://github.com/new で `learn-languages-app` リポジトリを作成(Public)
2. ```bash
   git init
   git add index.html questions.json questions.js README.md tools/
   git commit -m "Add LingoPop language learning app"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/learn-languages-app.git
   git push -u origin main
   ```
3. リポジトリの **Settings → Pages** を開き、Source を **Deploy from a branch**、Branch を **main / (root)** にして Save
4. 数分後に表示されるURLでアクセス

## ローカルで動かす

`index.html` をダブルクリックするだけで動きます(`questions.js` フォールバックが効くため)。
ローカルサーバーで動かしたい場合:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```
