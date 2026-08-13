/* =====================================================================
 * LingoPop! 問題ジェネレーター(単一ソース)
 * ---------------------------------------------------------------------
 * 語彙 × 文型テンプレートから問題をその場で生成する。
 * このファイルはアプリ本体(index.html)と検証スクリプト(tools/validate.js)の
 * 両方から読み込まれる。問題を増やすには語彙かテンプレートを足すだけ。
 *
 * 文法処理:
 *   韓国語     … 을/를・이/가・은/는・(으)로・이에요/예요 をパッチムで自動選択
 *   デンマーク語 … en/et の性・限定形・形容詞の中性形を語彙側で明示
 *   英語       … a/an を語彙側で明示
 * ===================================================================== */
(function (global) {
"use strict";

/* =====================  語彙  ===================== */
/* 名詞共通: ja(日本語) ko(韓国語) da(デンマーク語・非限定) g(en/et)
 *           dad(限定形) en(英語) art(a/an/"") tag(意味カテゴリ) */

// 食べ物・飲み物  gen: 英語の総称形 / dagen: デンマーク語の総称形
const FOODS = [
  {ja:"コーヒー", ko:"커피", da:"kaffe", g:"en", dad:"kaffen", en:"coffee", art:"a", gen:"coffee", dagen:"kaffe"},
  {ja:"お茶", ko:"차", da:"te", g:"en", dad:"teen", en:"tea", art:"a", gen:"tea", dagen:"te"},
  {ja:"水", ko:"물", da:"vand", g:"et", dad:"vandet", en:"water", art:"", gen:"water", dagen:"vand"},
  {ja:"ビール", ko:"맥주", da:"øl", g:"en", dad:"øllen", en:"beer", art:"a", gen:"beer", dagen:"øl"},
  {ja:"ワイン", ko:"와인", da:"vin", g:"en", dad:"vinen", en:"wine", art:"a", gen:"wine", dagen:"vin"},
  {ja:"ジュース", ko:"주스", da:"juice", g:"en", dad:"juicen", en:"juice", art:"a", gen:"juice", dagen:"juice"},
  {ja:"牛乳", ko:"우유", da:"mælk", g:"en", dad:"mælken", en:"milk", art:"", gen:"milk", dagen:"mælk"},
  {ja:"パン", ko:"빵", da:"brød", g:"et", dad:"brødet", en:"bread", art:"", gen:"bread", dagen:"brød"},
  {ja:"ケーキ", ko:"케이크", da:"kage", g:"en", dad:"kagen", en:"cake", art:"a", gen:"cake", dagen:"kage"},
  {ja:"クッキー", ko:"쿠키", da:"småkage", g:"en", dad:"småkagen", en:"cookie", art:"a", gen:"cookies", dagen:"småkager"},
  {ja:"りんご", ko:"사과", da:"æble", g:"et", dad:"æblet", en:"apple", art:"an", gen:"apples", dagen:"æbler"},
  {ja:"バナナ", ko:"바나나", da:"banan", g:"en", dad:"bananen", en:"banana", art:"a", gen:"bananas", dagen:"bananer"},
  {ja:"オレンジ", ko:"오렌지", da:"appelsin", g:"en", dad:"appelsinen", en:"orange", art:"an", gen:"oranges", dagen:"appelsiner"},
  {ja:"ぶどう", ko:"포도", da:"vindrue", g:"en", dad:"vindruen", en:"grape", art:"a", gen:"grapes", dagen:"vindruer"},
  {ja:"いちご", ko:"딸기", da:"jordbær", g:"et", dad:"jordbærret", en:"strawberry", art:"a", gen:"strawberries", dagen:"jordbær"},
  {ja:"梨", ko:"배", da:"pære", g:"en", dad:"pæren", en:"pear", art:"a", gen:"pears", dagen:"pærer"},
  {ja:"卵", ko:"계란", da:"æg", g:"et", dad:"ægget", en:"egg", art:"an", gen:"eggs", dagen:"æg"},
  {ja:"チーズ", ko:"치즈", da:"ost", g:"en", dad:"osten", en:"cheese", art:"", gen:"cheese", dagen:"ost"},
  {ja:"バター", ko:"버터", da:"smør", g:"et", dad:"smørret", en:"butter", art:"", gen:"butter", dagen:"smør"},
  {ja:"ヨーグルト", ko:"요거트", da:"yoghurt", g:"en", dad:"yoghurten", en:"yogurt", art:"", gen:"yogurt", dagen:"yoghurt"},
  {ja:"スープ", ko:"수프", da:"suppe", g:"en", dad:"suppen", en:"soup", art:"a", gen:"soup", dagen:"suppe"},
  {ja:"サラダ", ko:"샐러드", da:"salat", g:"en", dad:"salaten", en:"salad", art:"a", gen:"salad", dagen:"salat"},
  {ja:"ピザ", ko:"피자", da:"pizza", g:"en", dad:"pizzaen", en:"pizza", art:"a", gen:"pizza", dagen:"pizza"},
  {ja:"サンドイッチ", ko:"샌드위치", da:"sandwich", g:"en", dad:"sandwichen", en:"sandwich", art:"a", gen:"sandwiches", dagen:"sandwicher"},
  {ja:"魚", ko:"생선", da:"fisk", g:"en", dad:"fisken", en:"fish", art:"a", gen:"fish", dagen:"fisk"},
  {ja:"肉", ko:"고기", da:"kød", g:"et", dad:"kødet", en:"meat", art:"", gen:"meat", dagen:"kød"},
  {ja:"ご飯", ko:"밥", da:"ris", g:"en", dad:"risen", en:"rice", art:"", gen:"rice", dagen:"ris"},
  {ja:"パスタ", ko:"파스타", da:"pasta", g:"en", dad:"pastaen", en:"pasta", art:"", gen:"pasta", dagen:"pasta"},
  {ja:"チョコレート", ko:"초콜릿", da:"chokolade", g:"en", dad:"chokoladen", en:"chocolate", art:"", gen:"chocolate", dagen:"chokolade"},
  {ja:"アイスクリーム", ko:"아이스크림", da:"is", g:"en", dad:"isen", en:"ice cream", art:"an", gen:"ice cream", dagen:"is"},
  {ja:"スイカ", ko:"수박", da:"vandmelon", g:"en", dad:"vandmelonen", en:"watermelon", art:"a", gen:"watermelon", dagen:"vandmelon"},
  {ja:"キムチ", ko:"김치", da:"kimchi", g:"en", dad:"kimchien", en:"kimchi", art:"", gen:"kimchi", dagen:"kimchi"},
  {ja:"カレー", ko:"카레", da:"karry", g:"en", dad:"karryen", en:"curry", art:"a", gen:"curry", dagen:"karry"},
  {ja:"トマト", ko:"토마토", da:"tomat", g:"en", dad:"tomaten", en:"tomato", art:"a", gen:"tomatoes", dagen:"tomater"},
  {ja:"じゃがいも", ko:"감자", da:"kartoffel", g:"en", dad:"kartoflen", en:"potato", art:"a", gen:"potatoes", dagen:"kartofler"},
  {ja:"玉ねぎ", ko:"양파", da:"løg", g:"et", dad:"løget", en:"onion", art:"an", gen:"onions", dagen:"løg"},
  {ja:"にんじん", ko:"당근", da:"gulerod", g:"en", dad:"guleroden", en:"carrot", art:"a", gen:"carrots", dagen:"gulerødder"},
  {ja:"野菜", ko:"채소", da:"grøntsag", g:"en", dad:"grøntsagen", en:"vegetable", art:"a", gen:"vegetables", dagen:"grøntsager"},
];

// 場所  dapre: 「~で/~に」の前置詞句(限定形込み) / go: 「行きます」文に使えるか
const PLACES = [
  {ja:"駅", ko:"역", da:"station", g:"en", dad:"stationen", en:"station", art:"a", dapre:"på stationen", tag:"service", go:true},
  {ja:"空港", ko:"공항", da:"lufthavn", g:"en", dad:"lufthavnen", en:"airport", art:"an", dapre:"i lufthavnen", tag:"service", go:true},
  {ja:"病院", ko:"병원", da:"hospital", g:"et", dad:"hospitalet", en:"hospital", art:"a", dapre:"på hospitalet", tag:"service", go:true},
  {ja:"学校", ko:"학교", da:"skole", g:"en", dad:"skolen", en:"school", art:"a", dapre:"på skolen", tag:"service", go:true},
  {ja:"大学", ko:"대학교", da:"universitet", g:"et", dad:"universitetet", en:"university", art:"a", dapre:"på universitetet", tag:"culture", go:true},
  {ja:"図書館", ko:"도서관", da:"bibliotek", g:"et", dad:"biblioteket", en:"library", art:"a", dapre:"på biblioteket", tag:"culture", go:true},
  {ja:"銀行", ko:"은행", da:"bank", g:"en", dad:"banken", en:"bank", art:"a", dapre:"i banken", tag:"service", go:true},
  {ja:"郵便局", ko:"우체국", da:"posthus", g:"et", dad:"posthuset", en:"post office", art:"a", dapre:"på posthuset", tag:"service", go:true},
  {ja:"スーパー", ko:"슈퍼마켓", da:"supermarked", g:"et", dad:"supermarkedet", en:"supermarket", art:"a", dapre:"i supermarkedet", tag:"commerce", go:true},
  {ja:"レストラン", ko:"레스토랑", da:"restaurant", g:"en", dad:"restauranten", en:"restaurant", art:"a", dapre:"på restauranten", tag:"commerce", go:true},
  {ja:"カフェ", ko:"카페", da:"café", g:"en", dad:"caféen", en:"café", art:"a", dapre:"på caféen", tag:"commerce", go:true},
  {ja:"ホテル", ko:"호텔", da:"hotel", g:"et", dad:"hotellet", en:"hotel", art:"a", dapre:"på hotellet", tag:"commerce", go:true},
  {ja:"公園", ko:"공원", da:"park", g:"en", dad:"parken", en:"park", art:"a", dapre:"i parken", tag:"nature", go:true},
  {ja:"美術館", ko:"미술관", da:"kunstmuseum", g:"et", dad:"kunstmuseet", en:"art museum", art:"an", dapre:"på kunstmuseet", tag:"culture", go:true},
  {ja:"博物館", ko:"박물관", da:"museum", g:"et", dad:"museet", en:"museum", art:"a", dapre:"på museet", tag:"culture", go:true},
  {ja:"映画館", ko:"영화관", da:"biograf", g:"en", dad:"biografen", en:"movie theater", art:"a", dapre:"i biografen", tag:"culture", go:true},
  {ja:"教会", ko:"교회", da:"kirke", g:"en", dad:"kirken", en:"church", art:"a", dapre:"i kirken", tag:"culture", go:true},
  {ja:"市場", ko:"시장", da:"marked", g:"et", dad:"markedet", en:"market", art:"a", dapre:"på markedet", tag:"commerce", go:true},
  {ja:"お店", ko:"가게", da:"butik", g:"en", dad:"butikken", en:"shop", art:"a", dapre:"i butikken", tag:"commerce", go:true},
  {ja:"パン屋", ko:"빵집", da:"bageri", g:"et", dad:"bageriet", en:"bakery", art:"a", dapre:"i bageriet", tag:"commerce", go:true},
  {ja:"花屋", ko:"꽃집", da:"blomsterbutik", g:"en", dad:"blomsterbutikken", en:"flower shop", art:"a", dapre:"i blomsterbutikken", tag:"commerce", go:true},
  {ja:"海辺", ko:"해변", da:"strand", g:"en", dad:"stranden", en:"beach", art:"a", dapre:"på stranden", tag:"nature", go:true},
  {ja:"山", ko:"산", da:"bjerg", g:"et", dad:"bjerget", en:"mountain", art:"a", dapre:"på bjerget", tag:"nature", go:false},
  {ja:"湖", ko:"호수", da:"sø", g:"en", dad:"søen", en:"lake", art:"a", dapre:"ved søen", tag:"nature", go:true},
  {ja:"森", ko:"숲", da:"skov", g:"en", dad:"skoven", en:"forest", art:"a", dapre:"i skoven", tag:"nature", go:true},
  {ja:"島", ko:"섬", da:"ø", g:"en", dad:"øen", en:"island", art:"an", dapre:"på øen", tag:"nature", go:false},
  {ja:"川", ko:"강", da:"flod", g:"en", dad:"floden", en:"river", art:"a", dapre:"ved floden", tag:"nature", go:false},
  {ja:"城", ko:"성", da:"slot", g:"et", dad:"slottet", en:"castle", art:"a", dapre:"på slottet", tag:"culture", go:true},
  {ja:"遊園地", ko:"놀이공원", da:"forlystelsespark", g:"en", dad:"forlystelsesparken", en:"amusement park", art:"an", dapre:"i forlystelsesparken", tag:"culture", go:true},
  {ja:"港", ko:"항구", da:"havn", g:"en", dad:"havnen", en:"harbor", art:"a", dapre:"i havnen", tag:"nature", go:true},
  {ja:"橋", ko:"다리", da:"bro", g:"en", dad:"broen", en:"bridge", art:"a", dapre:"på broen", tag:"service", go:false},
  {ja:"広場", ko:"광장", da:"torv", g:"et", dad:"torvet", en:"square", art:"a", dapre:"på torvet", tag:"nature", go:true},
  {ja:"トイレ", ko:"화장실", da:"toilet", g:"et", dad:"toilettet", en:"restroom", art:"a", dapre:"på toilettet", tag:"service", go:false},
  {ja:"動物園", ko:"동물원", da:"zoologisk have", g:"en", dad:"den zoologiske have", en:"zoo", art:"a", dapre:"i den zoologiske have", tag:"culture", go:true},
  {ja:"バス停", ko:"정류장", da:"busstoppested", g:"et", dad:"busstoppestedet", en:"bus stop", art:"a", dapre:"ved busstoppestedet", tag:"service", go:false},
  {ja:"薬局", ko:"약국", da:"apotek", g:"et", dad:"apoteket", en:"pharmacy", art:"a", dapre:"på apoteket", tag:"commerce", go:true},
  {ja:"本屋", ko:"서점", da:"boghandel", g:"en", dad:"boghandlen", en:"bookstore", art:"a", dapre:"i boghandlen", tag:"commerce", go:true},
  {ja:"ジム", ko:"헬스장", da:"fitnesscenter", g:"et", dad:"fitnesscentret", en:"gym", art:"a", dapre:"i fitnesscentret", tag:"service", go:true},
];

// 物  tag: read(読み物)/device(機器)/vehicle(乗り物)/thing(小物)/furniture(家具・家電)/cloth(衣類)
const OBJECTS = [
  {ja:"本", ko:"책", da:"bog", g:"en", dad:"bogen", en:"book", art:"a", tag:"read"},
  {ja:"雑誌", ko:"잡지", da:"magasin", g:"et", dad:"magasinet", en:"magazine", art:"a", tag:"read"},
  {ja:"新聞", ko:"신문", da:"avis", g:"en", dad:"avisen", en:"newspaper", art:"a", tag:"read"},
  {ja:"ノート", ko:"공책", da:"notesbog", g:"en", dad:"notesbogen", en:"notebook", art:"a", tag:"read"},
  {ja:"辞書", ko:"사전", da:"ordbog", g:"en", dad:"ordbogen", en:"dictionary", art:"a", tag:"read"},
  {ja:"地図", ko:"지도", da:"kort", g:"et", dad:"kortet", en:"map", art:"a", tag:"read"},
  {ja:"手紙", ko:"편지", da:"brev", g:"et", dad:"brevet", en:"letter", art:"a", tag:"read"},
  {ja:"かばん", ko:"가방", da:"taske", g:"en", dad:"tasken", en:"bag", art:"a", tag:"thing"},
  {ja:"腕時計", ko:"시계", da:"ur", g:"et", dad:"uret", en:"watch", art:"a", tag:"device"},
  {ja:"電話", ko:"전화", da:"telefon", g:"en", dad:"telefonen", en:"phone", art:"a", tag:"device"},
  {ja:"コンピューター", ko:"컴퓨터", da:"computer", g:"en", dad:"computeren", en:"computer", art:"a", tag:"device"},
  {ja:"カメラ", ko:"카메라", da:"kamera", g:"et", dad:"kameraet", en:"camera", art:"a", tag:"device"},
  {ja:"テレビ", ko:"텔레비전", da:"fjernsyn", g:"et", dad:"fjernsynet", en:"TV", art:"a", tag:"device"},
  {ja:"ラジオ", ko:"라디오", da:"radio", g:"en", dad:"radioen", en:"radio", art:"a", tag:"device"},
  {ja:"冷蔵庫", ko:"냉장고", da:"køleskab", g:"et", dad:"køleskabet", en:"refrigerator", art:"a", tag:"furniture"},
  {ja:"洗濯機", ko:"세탁기", da:"vaskemaskine", g:"en", dad:"vaskemaskinen", en:"washing machine", art:"a", tag:"furniture"},
  {ja:"車", ko:"자동차", da:"bil", g:"en", dad:"bilen", en:"car", art:"a", tag:"vehicle"},
  {ja:"自転車", ko:"자전거", da:"cykel", g:"en", dad:"cyklen", en:"bicycle", art:"a", tag:"vehicle"},
  {ja:"鍵", ko:"열쇠", da:"nøgle", g:"en", dad:"nøglen", en:"key", art:"a", tag:"thing"},
  {ja:"傘", ko:"우산", da:"paraply", g:"en", dad:"paraplyen", en:"umbrella", art:"an", tag:"thing"},
  {ja:"帽子", ko:"모자", da:"hat", g:"en", dad:"hatten", en:"hat", art:"a", tag:"cloth"},
  {ja:"コート", ko:"코트", da:"frakke", g:"en", dad:"frakken", en:"coat", art:"a", tag:"cloth"},
  {ja:"セーター", ko:"스웨터", da:"sweater", g:"en", dad:"sweateren", en:"sweater", art:"a", tag:"cloth"},
  {ja:"Tシャツ", ko:"티셔츠", da:"T-shirt", g:"en", dad:"T-shirten", en:"T-shirt", art:"a", tag:"cloth"},
  {ja:"スカート", ko:"치마", da:"nederdel", g:"en", dad:"nederdelen", en:"skirt", art:"a", tag:"cloth"},
  {ja:"靴", ko:"구두", da:"sko", g:"en", dad:"skoen", en:"shoe", art:"a", tag:"cloth"},
  {ja:"ペン", ko:"펜", da:"pen", g:"en", dad:"pennen", en:"pen", art:"a", tag:"thing"},
  {ja:"鉛筆", ko:"연필", da:"blyant", g:"en", dad:"blyanten", en:"pencil", art:"a", tag:"thing"},
  {ja:"写真", ko:"사진", da:"billede", g:"et", dad:"billedet", en:"photo", art:"a", tag:"thing"},
  {ja:"切符", ko:"표", da:"billet", g:"en", dad:"billetten", en:"ticket", art:"a", tag:"thing"},
  {ja:"花", ko:"꽃", da:"blomst", g:"en", dad:"blomsten", en:"flower", art:"a", tag:"thing"},
  {ja:"椅子", ko:"의자", da:"stol", g:"en", dad:"stolen", en:"chair", art:"a", tag:"furniture"},
  {ja:"机", ko:"책상", da:"skrivebord", g:"et", dad:"skrivebordet", en:"desk", art:"a", tag:"furniture"},
  {ja:"テーブル", ko:"테이블", da:"bord", g:"et", dad:"bordet", en:"table", art:"a", tag:"furniture"},
  {ja:"ソファ", ko:"소파", da:"sofa", g:"en", dad:"sofaen", en:"sofa", art:"a", tag:"furniture"},
  {ja:"ベッド", ko:"침대", da:"seng", g:"en", dad:"sengen", en:"bed", art:"a", tag:"furniture"},
  {ja:"鏡", ko:"거울", da:"spejl", g:"et", dad:"spejlet", en:"mirror", art:"a", tag:"furniture"},
  {ja:"枕", ko:"베개", da:"pude", g:"en", dad:"puden", en:"pillow", art:"a", tag:"thing"},
  {ja:"毛布", ko:"담요", da:"tæppe", g:"et", dad:"tæppet", en:"blanket", art:"a", tag:"thing"},
  {ja:"財布", ko:"지갑", da:"pung", g:"en", dad:"pungen", en:"wallet", art:"a", tag:"thing"},
  {ja:"コップ", ko:"컵", da:"kop", g:"en", dad:"koppen", en:"cup", art:"a", tag:"thing"},
  {ja:"窓", ko:"창문", da:"vindue", g:"et", dad:"vinduet", en:"window", art:"a", tag:"furniture"},
  {ja:"ドア", ko:"문", da:"dør", g:"en", dad:"døren", en:"door", art:"a", tag:"furniture"},
];

// 職業(デンマーク語は職業名に冠詞をつけない)
const JOBS = [
  {ja:"学生", ko:"학생", da:"studerende", en:"student", art:"a"},
  {ja:"先生", ko:"선생님", da:"lærer", en:"teacher", art:"a"},
  {ja:"医者", ko:"의사", da:"læge", en:"doctor", art:"a"},
  {ja:"看護師", ko:"간호사", da:"sygeplejerske", en:"nurse", art:"a"},
  {ja:"エンジニア", ko:"엔지니어", da:"ingeniør", en:"engineer", art:"an"},
  {ja:"デザイナー", ko:"디자이너", da:"designer", en:"designer", art:"a"},
  {ja:"警察官", ko:"경찰관", da:"politibetjent", en:"police officer", art:"a"},
  {ja:"消防士", ko:"소방관", da:"brandmand", en:"firefighter", art:"a"},
  {ja:"パイロット", ko:"조종사", da:"pilot", en:"pilot", art:"a"},
  {ja:"料理人", ko:"요리사", da:"kok", en:"chef", art:"a"},
  {ja:"パン職人", ko:"제빵사", da:"bager", en:"baker", art:"a"},
  {ja:"記者", ko:"기자", da:"journalist", en:"journalist", art:"a"},
  {ja:"弁護士", ko:"변호사", da:"advokat", en:"lawyer", art:"a"},
  {ja:"音楽家", ko:"음악가", da:"musiker", en:"musician", art:"a"},
  {ja:"画家", ko:"화가", da:"maler", en:"painter", art:"a"},
  {ja:"作家", ko:"작가", da:"forfatter", en:"writer", art:"a"},
  {ja:"写真家", ko:"사진작가", da:"fotograf", en:"photographer", art:"a"},
  {ja:"農家", ko:"농부", da:"landmand", en:"farmer", art:"a"},
  {ja:"運転手", ko:"운전사", da:"chauffør", en:"driver", art:"a"},
  {ja:"歌手", ko:"가수", da:"sanger", en:"singer", art:"a"},
  {ja:"俳優", ko:"배우", da:"skuespiller", en:"actor", art:"an"},
  {ja:"建築家", ko:"건축가", da:"arkitekt", en:"architect", art:"an"},
  {ja:"研究者", ko:"연구원", da:"forsker", en:"researcher", art:"a"},
  {ja:"教授", ko:"교수", da:"professor", en:"professor", art:"a"},
  {ja:"美容師", ko:"미용사", da:"frisør", en:"hairdresser", art:"a"},
  {ja:"店員", ko:"점원", da:"ekspedient", en:"shop assistant", art:"a"},
];

// 人(human: 職業・所在テンプレートに使えるか)
const PEOPLE = [
  {ja:"友達", ko:"친구", da:"ven", en:"friend", human:true},
  {ja:"母", ko:"어머니", da:"mor", en:"mother", human:true},
  {ja:"父", ko:"아버지", da:"far", en:"father", human:true},
  {ja:"息子", ko:"아들", da:"søn", en:"son", human:true},
  {ja:"娘", ko:"딸", da:"datter", en:"daughter", human:true},
  {ja:"祖母", ko:"할머니", da:"bedstemor", en:"grandmother", human:true},
  {ja:"祖父", ko:"할아버지", da:"bedstefar", en:"grandfather", human:true},
  {ja:"おじ", ko:"삼촌", da:"onkel", en:"uncle", human:true},
  {ja:"おば", ko:"이모", da:"tante", en:"aunt", human:true},
  {ja:"妻", ko:"아내", da:"kone", en:"wife", human:true},
  {ja:"夫", ko:"남편", da:"mand", en:"husband", human:true},
  {ja:"同僚", ko:"동료", da:"kollega", en:"colleague", human:true},
  {ja:"上司", ko:"상사", da:"chef", en:"boss", human:true},
  {ja:"隣人", ko:"이웃", da:"nabo", en:"neighbor", human:true},
  {ja:"ルームメイト", ko:"룸메이트", da:"bofælle", en:"roommate", human:true},
  {ja:"犬", ko:"개", da:"hund", en:"dog", human:false},
  {ja:"猫", ko:"고양이", da:"kat", en:"cat", human:false},
];

// 動作  ja_p/ja_pa: 日本語 現在/過去、ko_p/ko_pa: 韓国語、da_p/da_pa: デンマーク語、
//       en_b/en_pa/en_ing: 英語 原形/過去/進行形
const ACTIONS = [
  {ja_p:"勉強します", ja_pa:"勉強しました", ko_p:"공부해요", ko_pa:"공부했어요", da_p:"studerer", da_pa:"studerede", en_b:"study", en_pa:"studied", en_ing:"studying"},
  {ja_p:"働きます", ja_pa:"働きました", ko_p:"일해요", ko_pa:"일했어요", da_p:"arbejder", da_pa:"arbejdede", en_b:"work", en_pa:"worked", en_ing:"working"},
  {ja_p:"運動します", ja_pa:"運動しました", ko_p:"운동해요", ko_pa:"운동했어요", da_p:"træner", da_pa:"trænede", en_b:"exercise", en_pa:"exercised", en_ing:"exercising"},
  {ja_p:"料理します", ja_pa:"料理しました", ko_p:"요리해요", ko_pa:"요리했어요", da_p:"laver mad", da_pa:"lavede mad", en_b:"cook", en_pa:"cooked", en_ing:"cooking"},
  {ja_p:"掃除します", ja_pa:"掃除しました", ko_p:"청소해요", ko_pa:"청소했어요", da_p:"gør rent", da_pa:"gjorde rent", en_b:"clean", en_pa:"cleaned", en_ing:"cleaning"},
  {ja_p:"散歩します", ja_pa:"散歩しました", ko_p:"산책해요", ko_pa:"산책했어요", da_p:"går en tur", da_pa:"gik en tur", en_b:"take a walk", en_pa:"took a walk", en_ing:"taking a walk"},
  {ja_p:"買い物します", ja_pa:"買い物しました", ko_p:"쇼핑해요", ko_pa:"쇼핑했어요", da_p:"shopper", da_pa:"shoppede", en_b:"go shopping", en_pa:"went shopping", en_ing:"going shopping"},
  {ja_p:"本を読みます", ja_pa:"本を読みました", ko_p:"책을 읽어요", ko_pa:"책을 읽었어요", da_p:"læser en bog", da_pa:"læste en bog", en_b:"read a book", en_pa:"read a book", en_ing:"reading a book"},
  {ja_p:"音楽を聞きます", ja_pa:"音楽を聞きました", ko_p:"음악을 들어요", ko_pa:"음악을 들었어요", da_p:"hører musik", da_pa:"hørte musik", en_b:"listen to music", en_pa:"listened to music", en_ing:"listening to music"},
  {ja_p:"映画を見ます", ja_pa:"映画を見ました", ko_p:"영화를 봐요", ko_pa:"영화를 봤어요", da_p:"ser en film", da_pa:"så en film", en_b:"watch a movie", en_pa:"watched a movie", en_ing:"watching a movie"},
  {ja_p:"コーヒーを飲みます", ja_pa:"コーヒーを飲みました", ko_p:"커피를 마셔요", ko_pa:"커피를 마셨어요", da_p:"drikker kaffe", da_pa:"drak kaffe", en_b:"drink coffee", en_pa:"drank coffee", en_ing:"drinking coffee"},
  {ja_p:"友達に会います", ja_pa:"友達に会いました", ko_p:"친구를 만나요", ko_pa:"친구를 만났어요", da_p:"mødes med en ven", da_pa:"mødtes med en ven", en_b:"meet a friend", en_pa:"met a friend", en_ing:"meeting a friend"},
  {ja_p:"自転車に乗ります", ja_pa:"自転車に乗りました", ko_p:"자전거를 타요", ko_pa:"자전거를 탔어요", da_p:"cykler", da_pa:"cyklede", en_b:"ride a bike", en_pa:"rode a bike", en_ing:"riding a bike"},
  {ja_p:"車を運転します", ja_pa:"車を運転しました", ko_p:"운전해요", ko_pa:"운전했어요", da_p:"kører bil", da_pa:"kørte bil", en_b:"drive", en_pa:"drove", en_ing:"driving"},
  {ja_p:"歌を歌います", ja_pa:"歌を歌いました", ko_p:"노래를 불러요", ko_pa:"노래를 불렀어요", da_p:"synger", da_pa:"sang", en_b:"sing", en_pa:"sang", en_ing:"singing"},
  {ja_p:"絵を描きます", ja_pa:"絵を描きました", ko_p:"그림을 그려요", ko_pa:"그림을 그렸어요", da_p:"tegner", da_pa:"tegnede et billede", en_b:"draw", en_pa:"drew a picture", en_ing:"drawing"},
  {ja_p:"写真を撮ります", ja_pa:"写真を撮りました", ko_p:"사진을 찍어요", ko_pa:"사진을 찍었어요", da_p:"tager billeder", da_pa:"tog billeder", en_b:"take photos", en_pa:"took photos", en_ing:"taking photos"},
  {ja_p:"手紙を書きます", ja_pa:"手紙を書きました", ko_p:"편지를 써요", ko_pa:"편지를 썼어요", da_p:"skriver et brev", da_pa:"skrev et brev", en_b:"write a letter", en_pa:"wrote a letter", en_ing:"writing a letter"},
  {ja_p:"日記を書きます", ja_pa:"日記を書きました", ko_p:"일기를 써요", ko_pa:"일기를 썼어요", da_p:"skriver dagbog", da_pa:"skrev dagbog", en_b:"write in my diary", en_pa:"wrote in my diary", en_ing:"writing in my diary"},
  {ja_p:"早く起きます", ja_pa:"早く起きました", ko_p:"일찍 일어나요", ko_pa:"일찍 일어났어요", da_p:"står tidligt op", da_pa:"stod tidligt op", en_b:"get up early", en_pa:"got up early", en_ing:"getting up early"},
  {ja_p:"遅く寝ます", ja_pa:"遅く寝ました", ko_p:"늦게 자요", ko_pa:"늦게 잤어요", da_p:"går sent i seng", da_pa:"gik sent i seng", en_b:"go to bed late", en_pa:"went to bed late", en_ing:"going to bed late"},
  {ja_p:"走ります", ja_pa:"走りました", ko_p:"달려요", ko_pa:"달렸어요", da_p:"løber", da_pa:"løb", en_b:"run", en_pa:"ran", en_ing:"running"},
  {ja_p:"泳ぎます", ja_pa:"泳ぎました", ko_p:"수영해요", ko_pa:"수영했어요", da_p:"svømmer", da_pa:"svømmede", en_b:"swim", en_pa:"swam", en_ing:"swimming"},
  {ja_p:"踊ります", ja_pa:"踊りました", ko_p:"춤춰요", ko_pa:"춤췄어요", da_p:"danser", da_pa:"dansede", en_b:"dance", en_pa:"danced", en_ing:"dancing"},
  {ja_p:"ヨガをします", ja_pa:"ヨガをしました", ko_p:"요가해요", ko_pa:"요가했어요", da_p:"dyrker yoga", da_pa:"dyrkede yoga", en_b:"do yoga", en_pa:"did yoga", en_ing:"doing yoga"},
  {ja_p:"サッカーをします", ja_pa:"サッカーをしました", ko_p:"축구해요", ko_pa:"축구했어요", da_p:"spiller fodbold", da_pa:"spillede fodbold", en_b:"play soccer", en_pa:"played soccer", en_ing:"playing soccer"},
  {ja_p:"ゲームをします", ja_pa:"ゲームをしました", ko_p:"게임해요", ko_pa:"게임했어요", da_p:"spiller computerspil", da_pa:"spillede computerspil", en_b:"play video games", en_pa:"played video games", en_ing:"playing video games"},
  {ja_p:"ピアノを弾きます", ja_pa:"ピアノを弾きました", ko_p:"피아노를 쳐요", ko_pa:"피아노를 쳤어요", da_p:"spiller klaver", da_pa:"spillede klaver", en_b:"play the piano", en_pa:"played the piano", en_ing:"playing the piano"},
  {ja_p:"パンを焼きます", ja_pa:"パンを焼きました", ko_p:"빵을 구워요", ko_pa:"빵을 구웠어요", da_p:"bager brød", da_pa:"bagte brød", en_b:"bake bread", en_pa:"baked bread", en_ing:"baking bread"},
  {ja_p:"旅行します", ja_pa:"旅行しました", ko_p:"여행해요", ko_pa:"여행했어요", da_p:"rejser", da_pa:"rejste", en_b:"travel", en_pa:"traveled", en_ing:"traveling"},
  {ja_p:"ゆっくり休みます", ja_pa:"ゆっくり休みました", ko_p:"푹 쉬어요", ko_pa:"푹 쉬었어요", da_p:"slapper af", da_pa:"slappede af", en_b:"relax", en_pa:"relaxed", en_ing:"relaxing"},
  {ja_p:"ニュースを見ます", ja_pa:"ニュースを見ました", ko_p:"뉴스를 봐요", ko_pa:"뉴스를 봤어요", da_p:"ser nyhederne", da_pa:"så nyhederne", en_b:"watch the news", en_pa:"watched the news", en_ing:"watching the news"},
];

// 形容詞  jp: 日本語述語形 / ko_p: 韓国語述語 / da,da_n: 共性形・中性形 /
//         ok: 使える名詞タグ(スペース区切り)
const ALLTAG = "read device vehicle thing furniture cloth culture commerce nature service food";
const ADJS = [
  {ja:"大きい", jp:"大きいです", ko_p:"커요", da:"stor", da_n:"stort", en:"big", ok:ALLTAG},
  {ja:"小さい", jp:"小さいです", ko_p:"작아요", da:"lille", da_n:"lille", en:"small", ok:ALLTAG},
  {ja:"新しい", jp:"新しいです", ko_p:"새로워요", da:"ny", da_n:"nyt", en:"new", ok:"read device vehicle thing furniture cloth culture commerce service"},
  {ja:"古い", jp:"古いです", ko_p:"오래됐어요", da:"gammel", da_n:"gammelt", en:"old", ok:"read device vehicle thing furniture cloth culture commerce service"},
  {ja:"高い", jp:"高いです", ko_p:"비싸요", da:"dyr", da_n:"dyrt", en:"expensive", ok:"read device vehicle thing furniture cloth commerce food"},
  {ja:"安い", jp:"安いです", ko_p:"싸요", da:"billig", da_n:"billigt", en:"cheap", ok:"read device vehicle thing furniture cloth commerce food"},
  {ja:"美しい", jp:"美しいです", ko_p:"아름다워요", da:"smuk", da_n:"smukt", en:"beautiful", ok:"thing cloth culture nature"},
  {ja:"面白い", jp:"面白いです", ko_p:"재미있어요", da:"sjov", da_n:"sjovt", en:"fun", ok:"read culture"},
  {ja:"難しい", jp:"難しいです", ko_p:"어려워요", da:"svær", da_n:"svært", en:"difficult", ok:"read"},
  {ja:"簡単", jp:"簡単です", ko_p:"쉬워요", da:"nem", da_n:"nemt", en:"easy", ok:"read"},
  {ja:"速い", jp:"速いです", ko_p:"빨라요", da:"hurtig", da_n:"hurtigt", en:"fast", ok:"vehicle device"},
  {ja:"清潔", jp:"清潔です", ko_p:"깨끗해요", da:"ren", da_n:"rent", en:"clean", ok:"vehicle thing furniture cloth culture commerce service"},
  {ja:"静か", jp:"静かです", ko_p:"조용해요", da:"stille", da_n:"stille", en:"quiet", ok:"culture nature service commerce"},
  {ja:"有名", jp:"有名です", ko_p:"유명해요", da:"berømt", da_n:"berømt", en:"famous", ok:"read culture nature commerce"},
  {ja:"重い", jp:"重いです", ko_p:"무거워요", da:"tung", da_n:"tungt", en:"heavy", ok:"read device thing furniture"},
  {ja:"軽い", jp:"軽いです", ko_p:"가벼워요", da:"let", da_n:"let", en:"light", ok:"read device thing cloth"},
  {ja:"便利", jp:"便利です", ko_p:"편리해요", da:"praktisk", da_n:"praktisk", en:"handy", ok:"vehicle thing"},
  {ja:"人気", jp:"人気があります", ko_p:"인기가 많아요", da:"populær", da_n:"populært", en:"popular", ok:"read culture commerce nature food"},
  {ja:"おいしい", jp:"おいしいです", ko_p:"맛있어요", da:"lækker", da_n:"lækkert", en:"tasty", ok:"food"},
  {ja:"甘い", jp:"甘いです", ko_p:"달아요", da:"sød", da_n:"sødt", en:"sweet", ok:"food"},
  {ja:"新鮮", jp:"新鮮です", ko_p:"신선해요", da:"frisk", da_n:"friskt", en:"fresh", ok:"food"},
];

// 時間  ko_e: 助詞「에」をつけるか
const TIMES = [
  {ja:"今日", ko:"오늘", ko_e:false, da:"i dag", en:"today"},
  {ja:"明日", ko:"내일", ko_e:false, da:"i morgen", en:"tomorrow"},
  {ja:"今週", ko:"이번 주", ko_e:true, da:"i denne uge", en:"this week"},
  {ja:"来週", ko:"다음 주", ko_e:true, da:"i næste uge", en:"next week"},
  {ja:"週末", ko:"주말", ko_e:true, da:"i weekenden", en:"this weekend"},
  {ja:"今晩", ko:"오늘 저녁", ko_e:true, da:"i aften", en:"tonight"},
  {ja:"今度の月曜日", ko:"월요일", ko_e:true, da:"på mandag", en:"on Monday"},
  {ja:"今度の火曜日", ko:"화요일", ko_e:true, da:"på tirsdag", en:"on Tuesday"},
  {ja:"今度の水曜日", ko:"수요일", ko_e:true, da:"på onsdag", en:"on Wednesday"},
  {ja:"今度の木曜日", ko:"목요일", ko_e:true, da:"på torsdag", en:"on Thursday"},
  {ja:"今度の金曜日", ko:"금요일", ko_e:true, da:"på fredag", en:"on Friday"},
  {ja:"今度の土曜日", ko:"토요일", ko_e:true, da:"på lørdag", en:"on Saturday"},
  {ja:"今度の日曜日", ko:"일요일", ko_e:true, da:"på søndag", en:"on Sunday"},
  {ja:"来月", ko:"다음 달", ko_e:true, da:"i næste måned", en:"next month"},
  {ja:"夏休み", ko:"여름 방학", ko_e:true, da:"i sommerferien", en:"during the summer break"},
];

// 国・言語
const COUNTRIES = [
  {ja:"韓国", ko:"한국", da:"Korea", en:"Korea", lang_ja:"韓国語", lang_ko:"한국어", lang_da:"koreansk", lang_en:"Korean"},
  {ja:"デンマーク", ko:"덴마크", da:"Danmark", en:"Denmark", lang_ja:"デンマーク語", lang_ko:"덴마크어", lang_da:"dansk", lang_en:"Danish"},
  {ja:"日本", ko:"일본", da:"Japan", en:"Japan", lang_ja:"日本語", lang_ko:"일본어", lang_da:"japansk", lang_en:"Japanese"},
  {ja:"イギリス", ko:"영국", da:"England", en:"England", lang_ja:"英語", lang_ko:"영어", lang_da:"engelsk", lang_en:"English"},
  {ja:"フランス", ko:"프랑스", da:"Frankrig", en:"France", lang_ja:"フランス語", lang_ko:"프랑스어", lang_da:"fransk", lang_en:"French"},
  {ja:"ドイツ", ko:"독일", da:"Tyskland", en:"Germany", lang_ja:"ドイツ語", lang_ko:"독일어", lang_da:"tysk", lang_en:"German"},
  {ja:"スペイン", ko:"스페인", da:"Spanien", en:"Spain", lang_ja:"スペイン語", lang_ko:"스페인어", lang_da:"spansk", lang_en:"Spanish"},
  {ja:"イタリア", ko:"이탈리아", da:"Italien", en:"Italy", lang_ja:"イタリア語", lang_ko:"이탈리아어", lang_da:"italiensk", lang_en:"Italian"},
  {ja:"中国", ko:"중국", da:"Kina", en:"China", lang_ja:"中国語", lang_ko:"중국어", lang_da:"kinesisk", lang_en:"Chinese"},
  {ja:"スウェーデン", ko:"스웨덴", da:"Sverige", en:"Sweden", lang_ja:"スウェーデン語", lang_ko:"스웨덴어", lang_da:"svensk", lang_en:"Swedish"},
  {ja:"ノルウェー", ko:"노르웨이", da:"Norge", en:"Norway", lang_ja:"ノルウェー語", lang_ko:"노르웨이어", lang_da:"norsk", lang_en:"Norwegian"},
  {ja:"オランダ", ko:"네덜란드", da:"Holland", en:"the Netherlands", lang_ja:"オランダ語", lang_ko:"네덜란드어", lang_da:"hollandsk", lang_en:"Dutch"},
];

// 天気  da_t: デンマーク語の文全体を差し替える場合に指定
const WEATHER = [
  {ja:"暑い", ko:"더워요", da:"varmt", en:"hot"},
  {ja:"寒い", ko:"추워요", da:"koldt", en:"cold"},
  {ja:"暖かい", ko:"따뜻해요", da:"lunt", en:"warm"},
  {ja:"涼しい", ko:"시원해요", da:"køligt", en:"cool"},
  {ja:"曇り", ko:"흐려요", da:"overskyet", en:"cloudy"},
  {ja:"風が強い", ko:"바람이 세요", da:"blæsende", da_t:"Det blæser meget i dag.", en:"windy"},
  {ja:"蒸し暑い", ko:"무더워요", da:"lummert", en:"humid"},
];

// 趣味(私の趣味は~です)
const HOBBIES = [
  {ja:"読書", ko:"독서", da:"at læse", en:"reading"},
  {ja:"料理", ko:"요리", da:"madlavning", en:"cooking"},
  {ja:"旅行", ko:"여행", da:"at rejse", en:"traveling"},
  {ja:"写真", ko:"사진", da:"fotografering", en:"photography"},
  {ja:"音楽鑑賞", ko:"음악 감상", da:"at høre musik", en:"listening to music"},
  {ja:"釣り", ko:"낚시", da:"fiskeri", en:"fishing"},
  {ja:"ダンス", ko:"춤", da:"dans", en:"dancing"},
  {ja:"ガーデニング", ko:"정원 가꾸기", da:"havearbejde", en:"gardening"},
];

// 交通手段  daph: デンマーク語「tager ~」の句 / enph: 英語「by ~」の句
const TRANSPORT = [
  {ja:"バス", ko:"버스", daph:"bussen", enph:"by bus"},
  {ja:"電車", ko:"전철", daph:"toget", enph:"by train"},
  {ja:"地下鉄", ko:"지하철", daph:"metroen", enph:"by subway"},
  {ja:"タクシー", ko:"택시", daph:"en taxa", enph:"by taxi"},
  {ja:"飛行機", ko:"비행기", daph:"flyet", enph:"by plane"},
  {ja:"フェリー", ko:"페리", daph:"færgen", enph:"by ferry"},
];

/* =====================  韓国語 文法ヘルパー  ===================== */
const HS = 0xAC00, HE = 0xD7A3;

function lastHangul(w) {
  for (let i = w.length - 1; i >= 0; i--) {
    const c = w.charCodeAt(i);
    if (c >= HS && c <= HE) return c;
  }
  return null;
}
function hasBatchim(w) {
  const c = lastHangul(w);
  return c !== null && (c - HS) % 28 !== 0;
}
function endsRieul(w) {                    // 末尾のパッチムがㄹか
  const c = lastHangul(w);
  return c !== null && (c - HS) % 28 === 8;
}
const objP   = w => w + (hasBatchim(w) ? "을" : "를");
const subjP  = w => w + (hasBatchim(w) ? "이" : "가");
const topicP = w => w + (hasBatchim(w) ? "은" : "는");
const copula = w => w + (hasBatchim(w) ? "이에요" : "예요");
const iro    = w => w + (!hasBatchim(w) || endsRieul(w) ? "로" : "으로");  // ~(으)로

/* ローマ字化(文化観光部2000年式+連音化+ㄹ同化) */
const R_INI = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const R_VOW = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const R_FIN = ["","k","k","k","n","n","n","t","l","k","m","l","l","l","p","l","m","p","p","t","t","ng","t","t","k","t","p","t"];
const R_LINK = {1:"g",2:"kk",4:"n",7:"d",8:"r",16:"m",17:"b",19:"s",20:"ss",21:"ng",22:"j",23:"ch",24:"k",25:"t",26:"p",27:""};

function romanize(text) {
  const syls = [];
  for (const ch of text) {
    const c = ch.codePointAt(0);
    if (c >= HS && c <= HE) {
      const s = c - HS;
      syls.push([Math.floor(s / 588), Math.floor((s % 588) / 28), s % 28, null]);
    } else syls.push(ch);
  }
  const K_FIN = [1, 2, 3, 24];                 // ㄱ系のパッチム(音価 k)
  const P_FIN = [17, 26];                      // ㅂ系のパッチム(音価 p)
  const T_FIN = [7, 19, 20, 22, 23, 25, 27];   // ㄷ系のパッチム(音価 t)
  for (let i = 0; i < syls.length - 1; i++) {
    const cur = syls[i], nxt = syls[i + 1];
    if (!Array.isArray(cur) || !Array.isArray(nxt)) continue;
    if (cur[2] !== 0 && nxt[0] === 11 && cur[2] in R_LINK) {       // 連音化
      nxt[3] = R_LINK[cur[2]]; cur[2] = 0;
    } else if (cur[2] === 9 && nxt[0] === 11) {                    // ㄺ+母音 → l-g (읽었어요=ilgeosseoyo)
      cur[2] = 8; nxt[3] = "g";
    } else if (cur[2] === 10 && nxt[0] === 11) {                   // ㄻ+母音 → l-m
      cur[2] = 8; nxt[3] = "m";
    } else if (K_FIN.includes(cur[2]) && (nxt[0] === 2 || nxt[0] === 6)) {  // 鼻音化 k+ㄴ/ㅁ → ng (박물관=bangmulgwan)
      cur[2] = 21;
    } else if (P_FIN.includes(cur[2]) && (nxt[0] === 2 || nxt[0] === 6)) {  // 鼻音化 p+ㄴ/ㅁ → m (합니다=hamnida)
      cur[2] = 16;
    } else if (T_FIN.includes(cur[2]) && (nxt[0] === 2 || nxt[0] === 6)) {  // 鼻音化 t+ㄴ/ㅁ → n
      cur[2] = 4;
    } else if (cur[2] === 8 && (nxt[0] === 5 || nxt[0] === 2)) {   // ㄹ+ㄹ/ㄴ → ll
      cur[2] = 0; nxt[3] = "ll";
    } else if (cur[2] === 4 && nxt[0] === 5) {                     // ㄴ+ㄹ → ll
      cur[2] = 0; nxt[3] = "ll";
    }
  }
  const parts = [];
  for (const s of syls) {
    if (Array.isArray(s)) {
      const ini = s[3] !== null ? s[3] : R_INI[s[0]];
      parts.push(ini + R_VOW[s[1]] + R_FIN[s[2]]);
    } else if (s === " " || s === "　") parts.push(" ");
    else if ("?!.,~".includes(s)) parts.push(s);
  }
  return parts.join("").replace(/\s+/g, " ").replace(/ \?/g, "?").replace(/ \./g, ".").trim();
}

/* =====================  デンマーク語 / 英語ヘルパー  ===================== */
const daIndef = n => n.g + " " + n.da;
const daThis  = n => (n.g === "en" ? "denne " : "dette ") + n.da;
const daMy    = n => (n.g === "en" ? "min " : "mit ") + n.da;
const daAdj   = (a, n) => n.g === "en" ? a.da : a.da_n;
const enIndef = n => n.art ? n.art + " " + n.en : n.en;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* =====================  テンプレート  ===================== */
/* item(): {ja, ko, da, en, h(ヒント), n:{ko,da,en}(解説)} */
function item(ja, ko, da, en, h, nko, nda, nen) {
  return { ja, ko, da, en, h, n: { ko: nko, da: nda, en: nen } };
}
const bat = w => hasBatchim(w) ? "あり" : "なし";

const TEMPLATES = [

["好み: ~が好きです", function* () {
  for (const f of FOODS) {
    yield item(`私は${f.ja}が好きです。`,
      `저는 ${objP(f.ko)} 좋아해요.`, `Jeg kan godt lide ${f.dagen}.`, `I like ${f.gen}.`, "好み",
      `「~을/를 좋아해요」=「~が好きです」。${f.ko}はパッチム${bat(f.ko)}→${hasBatchim(f.ko) ? "을" : "를"}。`,
      `kan godt lide=好き。総称なので冠詞なしの ${f.dagen} を使います。`,
      f.art ? `like のあとは総称形。数えられる名詞は複数形(${f.gen})にします。`
            : `${f.gen} は数えられない名詞なので、そのままの形で使います。`);
    yield item(`私は${f.ja}が好きではありません。`,
      `저는 ${objP(f.ko)} 안 좋아해요.`, `Jeg kan ikke lide ${f.dagen}.`, `I don't like ${f.gen}.`, "好み",
      "動詞の前に 안 を置くと否定になります。",
      "否定は ikke。kan ikke lide=好きではない。",
      "don't + 動詞の原形で否定文になります。");
    yield item(`${f.ja}は好きですか?`,
      `${objP(f.ko)} 좋아해요?`, `Kan du lide ${f.dagen}?`, `Do you like ${f.gen}?`, "質問",
      "疑問文は語尾を上げるだけ。語順は変わりません。",
      "疑問文は動詞を文頭に(Kan du ...?)。",
      "一般動詞の疑問文は Do you ~? で始めます。");
  }
}],

["注文する", function* () {
  for (const f of FOODS) {
    if (!f.art && f.gen === f.en) continue;   // 不可算(water, milk 等)は「一つください」と相性が悪いので除外
    yield item(`${f.ja}を一つください。`,
      `${f.ko} 하나 주세요.`, `${cap(daIndef(f))}, tak.`, `${cap(enIndef(f))}, please.`, "買い物",
      "「~ 주세요」=「~をください」。하나=1つ。",
      `${f.da}は${f.g}名詞なので「${f.g} ${f.da}」。tak をつけると丁寧。`,
      "カフェや店での注文の最短形。please を忘れずに。");
    yield item(`${f.ja}をお願いできますか?`,
      `${f.ko} 좀 주시겠어요?`, `Må jeg bede om ${daIndef(f)}?`, `Could I have ${enIndef(f)}, please?`, "買い物",
      "「주시겠어요?」は「주세요」より丁寧な依頼表現。",
      "Må jeg bede om ~? =「~をいただけますか」。丁寧な定番表現。",
      "Could I have ~? は Can I より丁寧な依頼。");
  }
}],

["場所を尋ねる", function* () {
  for (const p of PLACES) {
    yield item(`${p.ja}はどこですか?`,
      `${subjP(p.ko)} 어디예요?`, `Hvor er ${p.dad}?`, `Where is the ${p.en}?`, "旅行",
      `「~이/가 어디예요?」=「~はどこですか」。${p.ko}はパッチム${bat(p.ko)}→${hasBatchim(p.ko) ? "이" : "가"}。`,
      `デンマーク語の定冠詞は語尾につきます(${p.da}→${p.dad})。`,
      "場所を尋ねる基本形。Excuse me, を前につけると丁寧。");
  }
}],

["近くにありますか", function* () {
  for (const p of PLACES) {
    if (["nature"].includes(p.tag)) continue;
    yield item(`近くに${p.ja}はありますか?`,
      `근처에 ${subjP(p.ko)} 있어요?`, `Er der ${daIndef(p)} i nærheden?`, `Is there ${enIndef(p)} near here?`, "旅行",
      "근처=近く、있어요?=ありますか。",
      "Er der ~? =「~はありますか」。i nærheden=近くに。",
      "Is there ~? で存在を尋ねます。");
  }
}],

["場所へ行く", function* () {
  for (const p of PLACES) {
    if (!p.go) continue;
    yield item(`私は${p.ja}に行きます。`,
      `저는 ${p.ko}에 가요.`, `Jeg skal til ${p.dad}.`, `I'm going to the ${p.en}.`, "日常",
      "場所につく助詞は「에」。「~에 가요」=「~に行きます」。",
      "skal til ~ で「~へ行く予定だ」。行き先は限定形。",
      "近い予定は be going to で表します。");
    yield item(`昨日${p.ja}に行きました。`,
      `어제 ${p.ko}에 갔어요.`, `Jeg tog til ${p.dad} i går.`, `I went to the ${p.en} yesterday.`, "過去",
      "過去形は 가요 → 갔어요。어제=昨日。",
      "tage(行く)の過去形は tog。i går=昨日。",
      "go の過去形は went(不規則動詞)。");
  }
}],

["値段を聞く", function* () {
  for (const o of OBJECTS) {
    if (["窓", "ドア"].includes(o.ja)) continue;   // 単体で値段を聞くのは不自然
    yield item(`この${o.ja}はいくらですか?`,
      `이 ${topicP(o.ko)} 얼마예요?`, `Hvad koster ${daThis(o)}?`, `How much is this ${o.en}?`, "買い物",
      `이=この、얼마=いくら。${o.ko}はパッチム${bat(o.ko)}→${hasBatchim(o.ko) ? "은" : "는"}。`,
      `「この」は${o.g}名詞なら${o.g === "en" ? "denne" : "dette"}。`,
      "How much is ~? が値段を聞く定番。");
  }
}],

["買いたい", function* () {
  for (const o of OBJECTS) {
    if (o.tag === "furniture" && ["窓", "ドア"].includes(o.ja)) continue;
    yield item(`${o.ja}を買いたいです。`,
      `${objP(o.ko)} 사고 싶어요.`, `Jeg vil gerne købe ${daIndef(o)}.`, `I want to buy ${enIndef(o)}.`, "買い物",
      "「~고 싶어요」=「~したいです」。사다=買う。",
      "vil gerne købe ~ =「~を買いたい」。gerne で柔らかい響きに。",
      "want to + 動詞の原形。");
  }
}],

["職業", function* () {
  for (const j of JOBS) {
    yield item(`私は${j.ja}です。`,
      `저는 ${copula(j.ko)}.`, `Jeg er ${j.da}.`, `I'm ${enIndef(j)}.`, "自己紹介",
      `~です は パッチムあり→이에요 / なし→예요。${j.ko}は${bat(j.ko)}。`,
      "デンマーク語は職業名に冠詞をつけません(Jeg er læge.)。",
      `英語は逆に冠詞が必要です(${j.art} ${j.en})。`);
    yield item(`あなたは${j.ja}ですか?`,
      `${copula(j.ko)}?`, `Er du ${j.da}?`, `Are you ${enIndef(j)}?`, "質問",
      "韓国語は主語をよく省略します。語尾を上げれば疑問文。",
      "be動詞 er を文頭に出して疑問文にします。",
      "Are you ~? で職業を尋ねられます。");
  }
}],

["予定を聞く", function* () {
  for (const t of TIMES) {
    const koTime = t.ko + (t.ko_e ? "에" : "");
    yield item(`${t.ja}は何をしますか?`,
      `${koTime} 뭐 해요?`, `Hvad laver du ${t.da}?`, `What are you doing ${t.en}?`, "質問",
      `時間には助詞「에」がつきます${t.ko_e ? "" : "が、오늘・내일 にはつきません"}。`,
      "lave=する・作る。Hvad laver du? は「何してるの?」の定番。",
      "近い未来の予定は現在進行形で表せます。");
  }
}],

["毎日の習慣", function* () {
  for (const a of ACTIONS) {
    yield item(`私は毎日${a.ja_p}。`,
      `저는 매일 ${a.ko_p}.`, `Jeg ${a.da_p} hver dag.`, `I ${a.en_b} every day.`, "日常",
      "매일=毎日。해요体は日常会話で最もよく使う丁寧形。",
      "hver dag=毎日。デンマーク語の現在形は原形+r が基本。",
      "習慣は現在形で表します。");
  }
}],

["昨日したこと", function* () {
  for (const a of ACTIONS) {
    yield item(`昨日${a.ja_pa}。`,
      `어제 ${a.ko_pa}.`, `Jeg ${a.da_pa} i går.`, `I ${a.en_pa} yesterday.`, "過去",
      "過去形は語幹+았/었어요。어제=昨日。",
      "規則動詞の過去形は -ede/-te。så・tog・gik などの不規則動詞もあります。i går=昨日。",
      "過去の出来事は過去形で。");
  }
}],

["今していること", function* () {
  for (const a of ACTIONS) {
    yield item(`今${a.ja_p}。`,
      `지금 ${a.ko_p}.`, `Jeg ${a.da_p} lige nu.`, `I'm ${a.en_ing} right now.`, "日常",
      "지금=今。韓国語は現在形が進行の意味も兼ねます。",
      "デンマーク語も現在形で進行を表します(進行形は不要)。",
      "今まさにしていることは現在進行形(be + -ing)。");
  }
}],

["明日の予定", function* () {
  // デンマーク語の予定は skal + 不定詞が最も自然
  const daInf = (da_p) => {
    const parts = da_p.split(" ");
    let v = parts[0];
    if (v === "gør") v = "gøre";
    else if (!v.endsWith("s") && v.endsWith("r")) v = v.slice(0, -1);
    parts[0] = v;
    return parts.join(" ");
  };
  for (const a of ACTIONS) {
    yield item(`明日${a.ja_p}。`,
      `내일 ${a.ko_p}.`, `Jeg skal ${daInf(a.da_p)} i morgen.`, `I'm going to ${a.en_b} tomorrow.`, "予定",
      "確定した予定は現在形のままでOK。내일=明日。",
      "予定は skal+動詞の原形で表すのが自然です。i morgen=明日。",
      "be going to ~ で予定を表します。");
  }
}],

["物の描写", function* () {
  for (const o of OBJECTS) {
    for (const a of ADJS) {
      if (!a.ok.split(" ").includes(o.tag)) continue;
      if (["写真", "地図"].includes(o.ja) && ["重い", "軽い"].includes(a.ja)) continue;  // 紙物の重さは不自然
      yield item(`この${o.ja}はとても${a.jp}。`,
        `이 ${topicP(o.ko)} 아주 ${a.ko_p}.`, `${cap(daThis(o))} er meget ${daAdj(a, o)}.`, `This ${o.en} is very ${a.en}.`, "描写",
        "아주=とても。形容詞も動詞と同じく해요体で活用します。",
        a.da === a.da_n ? `この形容詞は en/et どちらの名詞でも同じ形(${a.da})です。`
          : `述語の形容詞は性に一致。${o.g}名詞なので「${daAdj(a, o)}」。`,
        "very で形容詞を強調できます。");
    }
  }
}],

["場所の描写", function* () {
  for (const p of PLACES) {
    for (const a of ADJS) {
      if (!a.ok.split(" ").includes(p.tag)) continue;
      yield item(`その${p.ja}はとても${a.jp}。`,
        `그 ${topicP(p.ko)} 아주 ${a.ko_p}.`, `${cap(p.dad)} er meget ${daAdj(a, p)}.`, `The ${p.en} is very ${a.en}.`, "描写",
        "그=その。指示語は 이(この)/그(その)/저(あの)。",
        a.da === a.da_n ? `この形容詞は en/et どちらの名詞でも同じ形(${a.da})です。`
          : `${p.g}名詞なので形容詞は「${daAdj(a, p)}」の形になります。`,
        "既知のものには the をつけます。");
    }
  }
}],

["食べ物の描写", function* () {
  // 意味的に自然な組み合わせだけを許可する
  const SWEET_OK = new Set(["ケーキ", "クッキー", "チョコレート", "アイスクリーム", "りんご", "バナナ", "オレンジ", "ぶどう", "いちご", "梨", "スイカ", "ジュース", "ワイン", "ヨーグルト"]);
  const FRESH_OK = new Set(["りんご", "バナナ", "オレンジ", "ぶどう", "いちご", "梨", "スイカ", "トマト", "にんじん", "玉ねぎ", "じゃがいも", "野菜", "魚", "肉", "卵", "牛乳", "パン"]);
  const POPULAR_NG = new Set(["バター", "ヨーグルト", "卵", "玉ねぎ", "にんじん", "野菜", "じゃがいも", "牛乳", "ご飯", "パスタ", "水", "チーズ"]);
  for (const f of FOODS) {
    if (f.ja === "水") continue;                                   // 水の描写は不自然になりやすい
    for (const a of ADJS) {
      if (!a.ok.split(" ").includes("food")) continue;
      if (["大きい", "小さい"].includes(a.ja) && !f.art) continue;  // 不可算に大小は不自然
      if (a.ja === "甘い" && !SWEET_OK.has(f.ja)) continue;
      if (a.ja === "新鮮" && !FRESH_OK.has(f.ja)) continue;
      if (a.ja === "人気" && POPULAR_NG.has(f.ja)) continue;
      yield item(`この${f.ja}はとても${a.jp}。`,
        `이 ${topicP(f.ko)} 아주 ${a.ko_p}.`, `${cap(daThis(f))} er meget ${daAdj(a, f)}.`, `This ${f.en} is very ${a.en}.`, "食事",
        "이=この、아주=とても。",
        a.da === a.da_n ? `この形容詞は en/et どちらの名詞でも同じ形(${a.da})です。`
          : `${f.g}名詞なので形容詞は「${daAdj(a, f)}」。`,
        "食べ物の感想は This ~ is ... で伝えられます。");
    }
  }
}],

["言語を学ぶ", function* () {
  for (const c of COUNTRIES) {
    yield item(`私は${c.lang_ja}を勉強しています。`,
      `저는 ${objP(c.lang_ko)} 공부해요.`, `Jeg lærer ${c.lang_da}.`, `I'm learning ${c.lang_en}.`, "学習",
      "「~을/를 공부해요」=「~を勉強しています」。",
      "言語名は小文字で書きます(dansk, engelsk...)。",
      "言語名は大文字で始めます(Danish, Korean...)。");
    yield item(`${c.lang_ja}は難しいですか?`,
      `${topicP(c.lang_ko)} 어려워요?`, `Er ${c.lang_da} svært?`, `Is ${c.lang_en} difficult?`, "質問",
      "어렵다(難しい)の해요体は 어려워요(ㅂ不規則)。",
      "言語名は中性扱いなので形容詞は -t 形(svært)。",
      "Is ~ difficult? で難易度を尋ねられます。");
  }
}],

["国へ行きたい", function* () {
  for (const c of COUNTRIES) {
    yield item(`私は${c.ja}に行きたいです。`,
      `저는 ${c.ko}에 가고 싶어요.`, `Jeg vil gerne til ${c.da}.`, `I want to go to ${c.en}.`, "旅行",
      "「~고 싶어요」=「~したいです」。願望の基本表現。",
      "vil gerne (til) ~ =「~へ行きたい」。",
      "want to + 動詞の原形。");
    yield item(`${c.ja}に行ったことがありますか?`,
      `${c.ko}에 가 봤어요?`, `Har du været i ${c.da}?`, `Have you been to ${c.en}?`, "質問",
      "「~아/어 봤어요」=「~したことがあります」(経験)。",
      "現在完了は har + 過去分詞。været は være の過去分詞。",
      "経験は現在完了(have been to ~)で表します。");
  }
}],

["持っていますか", function* () {
  for (const o of OBJECTS) {
    if (["furniture"].includes(o.tag) && ["窓", "ドア"].includes(o.ja)) continue;
    yield item(`${o.ja}を持っていますか?`,
      `${o.ko} 있어요?`, `Har du ${daIndef(o)}?`, `Do you have ${enIndef(o)}?`, "質問",
      "있어요=あります・持っています。없어요=ありません。",
      `have の現在形は har。${o.da}は${o.g}名詞。`,
      "Do you have ~? で所持を尋ねます。");
  }
}],

["必要です", function* () {
  for (const o of OBJECTS) {
    if (["窓", "ドア"].includes(o.ja)) continue;
    yield item(`${o.ja}が必要です。`,
      `${subjP(o.ko)} 필요해요.`, `Jeg har brug for ${daIndef(o)}.`, `I need ${enIndef(o)}.`, "日常",
      "「~이/가 필요해요」=「~が必要です」。助詞は이/가。",
      "har brug for ~ =「~が必要だ」。3語セットで覚えます。",
      "need のあとは目的語がそのまま続きます。");
  }
}],

["私の物はどこ", function* () {
  for (const o of OBJECTS) {
    if (["窓", "ドア", "冷蔵庫", "洗濯機", "ベッド", "ソファ", "机", "テーブル", "鍵"].includes(o.ja)) continue;  // 鍵は複数形(keys)が自然なため除外
    yield item(`私の${o.ja}はどこですか?`,
      `제 ${topicP(o.ko)} 어디에 있어요?`, `Hvor er ${daMy(o)}?`, `Where is my ${o.en}?`, "質問",
      "제=私の(저의の縮約)。「어디에 있어요?」=「どこにありますか」。",
      `所有代名詞も性に一致。${o.g}名詞なので「${o.g === "en" ? "min" : "mit"}」。`,
      "my は性別・数に関係なく1種類だけ。");
  }
}],

["家族・知人の職業", function* () {
  for (const p of PEOPLE) {
    if (!p.human) continue;
    for (const j of JOBS) {
      if (j.ja === "学生" && ["祖母", "祖父", "上司"].includes(p.ja)) continue;  // 意味的に不自然
      yield item(`私の${p.ja}は${j.ja}です。`,
        `제 ${topicP(p.ko)} ${copula(j.ko)}.`, `Min ${p.da} er ${j.da}.`, `My ${p.en} is ${enIndef(j)}.`, "家族",
        "제 ~ 은/는 …이에요/예요。所有+主題+断定の基本形。",
        "人を表す名詞はほぼ en 名詞なので min を使います。",
        "3人称単数なので be動詞は is。");
    }
  }
}],

["家族・知人の居場所", function* () {
  for (const p of PEOPLE) {
    if (!p.human) continue;
    for (const pl of PLACES) {
      if (pl.tag === "nature" || !pl.go) continue;
      yield item(`私の${p.ja}は${pl.ja}にいます。`,
        `제 ${topicP(p.ko)} ${pl.ko}에 있어요.`, `Min ${p.da} er ${pl.dapre}.`, `My ${p.en} is at the ${pl.en}.`, "日常",
        "있어요 は「いる」「ある」の両方に使えます。場所には에。",
        `場所の前置詞は語ごとに決まっています(ここでは ${pl.dapre.split(" ")[0]})。`,
        "場所に「いる」は be at the ~ が定番。中にいることを強調するなら in。");
    }
  }
}],

["会いました", function* () {
  for (const p of PEOPLE) {
    if (!p.human) continue;
    yield item(`昨日私の${p.ja}に会いました。`,
      `어제 제 ${objP(p.ko)} 만났어요.`, `Jeg mødte min ${p.da} i går.`, `I met my ${p.en} yesterday.`, "過去",
      "만나다は「~를/을 만나다」。日本語の「に会う」と助詞が違います。",
      "møde の過去形は mødte。",
      "meet の過去形は met(不規則動詞)。");
  }
}],

["天気", function* () {
  for (const w of WEATHER) {
    yield item(`今日は${w.ja}です。`,
      `오늘은 ${w.ko}.`, w.da_t || `Det er ${w.da} i dag.`, `It's ${w.en} today.`, "天気",
      w.ja === "風が強い" ? "세다=(風・力が)強い。바람=風。" : "오늘은=今日は。天気は形容詞の해요体をそのまま使えます。",
      w.da_t ? "blæse=風が吹く。動詞で表すのが自然です。" : "天気の文はふつう形式主語 Det で始めます。",
      "天気の主語は it。It's ~ today. が定番。");
  }
}],

["遠いですか", function* () {
  for (const p of PLACES) {
    yield item(`${p.ja}はここから遠いですか?`,
      `${subjP(p.ko)} 여기서 멀어요?`, `Er ${p.dad} langt herfra?`, `Is the ${p.en} far from here?`, "旅行",
      "여기서=ここから(여기에서の縮約)、멀다=遠い。",
      "herfra=ここから。距離の langt は主語の性に関係なく常にこの形です。",
      "far from here で「ここから遠い」。");
  }
}],

["趣味", function* () {
  for (const h of HOBBIES) {
    yield item(`私の趣味は${h.ja}です。`,
      `제 취미는 ${copula(h.ko)}.`, `Min hobby er ${h.da}.`, `My hobby is ${h.en}.`, "自己紹介",
      "취미=趣味。名詞+이에요/예요で「~です」。",
      "「~すること」は at + 動詞の原形でも表せます(at læse=読むこと)。",
      "「~すること」は動名詞(-ing)。会話では I like ~ing もよく使います。");
  }
}],

["交通手段", function* () {
  for (const t of TRANSPORT) {
    yield item(`私は${t.ja}で行きます。`,
      `저는 ${iro(t.ko)} 가요.`, `Jeg tager ${t.daph}.`, `I'm going ${t.enph}.`, "旅行",
      `手段は「~(으)로」。${t.ko}は${hasBatchim(t.ko) && !endsRieul(t.ko) ? "パッチムあり→으로" : "로"}。`,
      "tage + 乗り物(限定形)=「~で行く」。tager bussen が定番。",
      "交通手段は by + 無冠詞(by bus, by train)。");
    yield item(`${t.ja}で行きましょう。`,
      `${iro(t.ko)} 갑시다.`, `Lad os tage ${t.daph}.`, `Let's go ${t.enph}.`, "提案",
      "「~(으)ㅂ시다」=「~しましょう」。",
      "Lad os ~ =「~しましょう」(英語の Let's にあたる)。",
      "Let's + 動詞の原形で提案します。");
  }
}],

];

/* =====================  手書きの定番フレーズ  ===================== */
const CURATED = {
ko: [
  {t:"안녕하세요!", a:"こんにちは!", n:"時間帯を問わず使える基本のあいさつ。", h:"あいさつ"},
  {t:"감사합니다.", a:"ありがとうございます。", n:"丁寧なお礼。カジュアルには 고마워(コマウォ)。", h:"お礼"},
  {t:"저는 학생입니다.", a:"私は学生です。", n:"~입니다 は 이에요/예요 より硬い丁寧形。", h:"自己紹介"},
  {t:"이름이 뭐예요?", a:"お名前は何ですか?", n:"이름=名前、뭐=何。", h:"質問"},
  {t:"만나서 반가워요.", a:"お会いできてうれしいです。", n:"初対面のあいさつの定番。", h:"あいさつ"},
  {t:"내일 또 봐요!", a:"また明日会いましょう!", n:"내일=明日、또=また、봐요=会いましょう。", h:"別れ"},
  {t:"조금만 기다려 주세요.", a:"少しだけ待ってください。", n:"조금=少し、기다리다=待つ。", h:"お願い"},
  {t:"천천히 말해 주세요.", a:"ゆっくり話してください。", n:"천천히=ゆっくり、말하다=話す。", h:"お願い"},
  {t:"정말 맛있어요!", a:"本当においしいです!", n:"정말=本当に。맛있다=「味がある」=おいしい。", h:"食事"},
  {t:"물 좀 주세요.", a:"お水をください。", n:"좀 を入れるとやわらかい頼み方に。", h:"食事"},
  {t:"네, 괜찮아요.", a:"はい、大丈夫です。", n:"괜찮아요はOKにも「結構です」にも使える万能表現。", h:"日常"},
  {t:"저는 일본 사람입니다.", a:"私は日本人です。", n:"일본=日本、사람=人。", h:"自己紹介"},
  {t:"한국 음식을 좋아해요.", a:"韓国料理が好きです。", n:"음식=食べ物、料理。", h:"好み"},
  {t:"화장실이 어디예요?", a:"トイレはどこですか?", n:"화장실=トイレ(化粧室)。", h:"旅行"},
  {t:"커피 한 잔 주세요.", a:"コーヒーを一杯ください。", n:"한 잔=一杯。カフェで使えます。", h:"買い物"},
  {t:"주말에 뭐 해요?", a:"週末は何をしますか?", n:"주말=週末。", h:"質問"},
  {t:"오늘 날씨가 좋아요.", a:"今日は天気がいいです。", n:"날씨=天気、좋아요=良いです。", h:"天気"},
  {t:"이거 얼마예요?", a:"これはいくらですか?", n:"이거=これ、얼마=いくら。", h:"買い物"},
  {t:"어디에 가요?", a:"どこに行きますか?", n:"어디=どこ、가다=行く。", h:"質問"},
  {t:"저는 한국어를 공부해요.", a:"私は韓国語を勉強しています。", n:"공부하다=勉強する。", h:"学習"},
],
da: [
  {t:"Hej! Hvordan går det?", a:"やあ!元気?", n:"Hvordan går det? は直訳「調子はどう行ってる?」。", h:"あいさつ"},
  {t:"Tak for hjælpen.", a:"手伝ってくれてありがとう。", n:"tak=ありがとう、hjælp=助け。", h:"お礼"},
  {t:"Jeg hedder Yuzu.", a:"私はユズといいます。", n:"jeg hedder ~=私は~という名前です。", h:"自己紹介"},
  {t:"Hvad hedder du?", a:"あなたの名前は何ですか?", n:"hvad=何、du=あなた。", h:"質問"},
  {t:"Hyggeligt at møde dig.", a:"会えてうれしいです。", n:"hyggelig はデンマーク文化の鍵となる言葉「心地よい」。", h:"あいさつ"},
  {t:"Vi ses i morgen!", a:"また明日!", n:"vi ses=また会いましょう、i morgen=明日。", h:"別れ"},
  {t:"Et øjeblik, tak.", a:"少々お待ちください。", n:"øjeblik=瞬間。「一瞬お願いします」が定番の待って表現。", h:"お願い"},
  {t:"Vil du tale lidt langsommere?", a:"もう少しゆっくり話してもらえますか?", n:"langsommere=langsom(ゆっくり)の比較級。Vil du ~? で丁寧な依頼。", h:"お願い"},
  {t:"Det smager godt!", a:"おいしいです!", n:"smage=味がする。", h:"食事"},
  {t:"Må jeg bede om vand?", a:"お水をいただけますか?", n:"må jeg bede om ~=~をお願いできますか。", h:"食事"},
  {t:"Det er i orden.", a:"大丈夫です。", n:"i orden=順調・問題ない。", h:"日常"},
  {t:"Jeg kommer fra Japan.", a:"私は日本から来ました。", n:"komme fra ~=~出身です。", h:"自己紹介"},
  {t:"Jeg kan godt lide dansk mad.", a:"デンマーク料理が好きです。", n:"kan godt lide=好き、mad=食べ物。", h:"好み"},
  {t:"Hvor er toilettet?", a:"トイレはどこですか?", n:"toilet の限定形は toilettet(tが重なる)。", h:"旅行"},
  {t:"En kaffe, tak.", a:"コーヒーを一杯ください。", n:"注文は「品物+tak」でOK。シンプル!", h:"買い物"},
  {t:"Hvad laver du i weekenden?", a:"週末は何をしますか?", n:"lave=する・作る。", h:"質問"},
  {t:"Vejret er godt i dag.", a:"今日は天気がいいです。", n:"vejr=天気、i dag=今日。", h:"天気"},
  {t:"Hvad koster det?", a:"それはいくらですか?", n:"koste=値段がする。買い物の定番。", h:"買い物"},
  {t:"Hvor skal du hen?", a:"どこへ行くの?", n:"hvor=どこ、hen=方向を表す語。", h:"質問"},
  {t:"Jeg lærer dansk.", a:"私はデンマーク語を学んでいます。", n:"lære=学ぶ。", h:"学習"},
],
en: [
  {t:"How's it going?", a:"調子はどう?", n:"How are you? よりカジュアルな定番あいさつ。", h:"あいさつ"},
  {t:"Thanks a lot for your help.", a:"手伝ってくれて本当にありがとう。", n:"Thanks a lot は Thank you より少しカジュアル。", h:"お礼"},
  {t:"It's nice to meet you.", a:"はじめまして。", n:"初対面のあいさつの定番。", h:"あいさつ"},
  {t:"What do you do for a living?", a:"お仕事は何をされていますか?", n:"直訳「生活のために何をしてる?」=職業を尋ねる表現。", h:"質問"},
  {t:"See you tomorrow!", a:"また明日!", n:"See you later(またあとで)もよく使う。", h:"別れ"},
  {t:"Just a moment, please.", a:"少々お待ちください。", n:"Just a second / Hang on も同じ意味。", h:"お願い"},
  {t:"Could you speak more slowly?", a:"もっとゆっくり話していただけますか?", n:"Could you ~? は丁寧な依頼。", h:"お願い"},
  {t:"This tastes amazing!", a:"これ、すごくおいしい!", n:"taste=味がする。amazing で強調。", h:"食事"},
  {t:"Could I get some water, please?", a:"お水をいただけますか?", n:"Could I get ~ は丁寧な注文表現。", h:"食事"},
  {t:"No worries.", a:"大丈夫だよ / 気にしないで。", n:"That's OK のカジュアル版。", h:"日常"},
  {t:"I was born and raised in Japan.", a:"私は日本で生まれ育ちました。", n:"born and raised はセットでよく使う。", h:"自己紹介"},
  {t:"I'm really into Korean food.", a:"韓国料理にすごくハマってます。", n:"be into ~=~にハマっている。", h:"好み"},
  {t:"Excuse me, where's the restroom?", a:"すみません、トイレはどこですか?", n:"アメリカでは restroom、イギリスでは toilet。", h:"旅行"},
  {t:"I'll have a coffee, please.", a:"コーヒーをください。", n:"注文は I'll have ~ が自然。", h:"買い物"},
  {t:"Any plans for the weekend?", a:"週末の予定はある?", n:"Do you have を省略したカジュアルな聞き方。", h:"質問"},
  {t:"It's a beautiful day today.", a:"今日はいい天気ですね。", n:"天気の話は英会話の入り口の定番。", h:"天気"},
  {t:"How much is this?", a:"これはいくらですか?", n:"買い物の基本フレーズ。", h:"買い物"},
  {t:"Where are you headed?", a:"どこに向かってるの?", n:"be headed=向かっている。カジュアルな表現。", h:"質問"},
  {t:"I'm learning three languages at once.", a:"私は3つの言語を同時に学んでいます。", n:"at once=同時に。", h:"学習"},
  {t:"Take care!", a:"気をつけてね!/ じゃあね!", n:"別れ際の定番。Take care of yourself の略。", h:"別れ"},
],
};

/* =====================  組み立て  ===================== */
const cache = {};

function buildAll(lang) {
  if (cache[lang]) return cache[lang];
  const seen = new Set();
  const out = [];
  for (const c of CURATED[lang]) {
    if (seen.has(c.t)) continue;
    seen.add(c.t);
    out.push({ t: c.t, r: lang === "ko" ? romanize(c.t) : "", a: c.a, n: c.n, h: c.h });
  }
  for (const [, gen] of TEMPLATES) {
    for (const it of gen()) {
      const t = it[lang];
      if (seen.has(t)) continue;
      seen.add(t);
      out.push({ t, r: lang === "ko" ? romanize(t) : "", a: it.ja, n: it.n[lang], h: it.h });
    }
  }
  cache[lang] = out;
  return out;
}

function buildBank() {
  return {
    ko: { name: "韓国語", flag: "🇰🇷", items: buildAll("ko") },
    da: { name: "デンマーク語", flag: "🇩🇰", items: buildAll("da") },
    en: { name: "英語", flag: "🇬🇧", items: buildAll("en") },
  };
}

const api = {
  buildBank, buildAll, romanize, hasBatchim, endsRieul,
  vocab: { FOODS, PLACES, OBJECTS, JOBS, PEOPLE, ACTIONS, ADJS, TIMES, COUNTRIES, WEATHER, HOBBIES, TRANSPORT },
  TEMPLATES, CURATED,
};

if (typeof module !== "undefined" && module.exports) module.exports = api;
global.LINGOPOP_GEN = api;

})(typeof window !== "undefined" ? window : globalThis);
