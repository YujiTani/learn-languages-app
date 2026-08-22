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
  {ja_p:"勉強します", ja_pa:"勉強しました", ko_p:"공부해요", ko_pa:"공부했어요", da_p:"studerer", da_pa:"studerede", en_b:"study", en_pa:"studied", en_ing:"studying", alt_ko:"공부해요 は 배워요 とも言えます(공부하다=机に向かって勉強する / 배우다=習って身につける)", alt_da:"studerer は læser とも言えます(læse は「(学科を)勉強する」の意味でもよく使います)"},
  {ja_p:"働きます", ja_pa:"働きました", ko_p:"일해요", ko_pa:"일했어요", da_p:"arbejder", da_pa:"arbejdede", en_b:"work", en_pa:"worked", en_ing:"working", alt_ko:"일해요 は 근무해요 とも言えます(근무하다 は職場での勤務を指す少し硬い語)"},
  {ja_p:"運動します", ja_pa:"運動しました", ko_p:"운동해요", ko_pa:"운동했어요", da_p:"træner", da_pa:"trænede", en_b:"exercise", en_pa:"exercised", en_ing:"exercising", alt_da:"træner は dyrker motion とも言えます(dyrke motion=運動をする)", alt_en:"exercise は work out とも言えます(work out はジムでの筋トレ・運動によく使います)"},
  {ja_p:"料理します", ja_pa:"料理しました", ko_p:"요리해요", ko_pa:"요리했어요", da_p:"laver mad", da_pa:"lavede mad", en_b:"cook", en_pa:"cooked", en_ing:"cooking", alt_ko:"요리해요 は 음식을 만들어요(食べ物を作る)とも言えます", alt_en:"cook は make food とも言えます(make dinner「夕食を作る」のように具体的に言うのも自然です)"},
  {ja_p:"掃除します", ja_pa:"掃除しました", ko_p:"청소해요", ko_pa:"청소했어요", da_p:"gør rent", da_pa:"gjorde rent", en_b:"clean", en_pa:"cleaned", en_ing:"cleaning", alt_da:"gør rent は rydder op とも言えます(rydde op は「片づける」寄りの意味)", alt_en:"clean は tidy up とも言えます(tidy up は「散らかりを片づける」寄りの意味)"},
  {ja_p:"散歩します", ja_pa:"散歩しました", ko_p:"산책해요", ko_pa:"산책했어요", da_p:"går en tur", da_pa:"gik en tur", en_b:"take a walk", en_pa:"took a walk", en_ing:"taking a walk", alt_da:"går en tur は tager en gåtur とも言えます", alt_en:"take a walk は go for a walk とも言えます(どちらも同じくらいよく使います)"},
  {ja_p:"買い物します", ja_pa:"買い物しました", ko_p:"쇼핑해요", ko_pa:"쇼핑했어요", da_p:"shopper", da_pa:"shoppede", en_b:"go shopping", en_pa:"went shopping", en_ing:"going shopping", alt_ko:"쇼핑해요 は 장을 봐요 とも言えます(장을 보다 は食料品の買い出しを指します)", alt_da:"shopper は køber ind とも言えます(købe ind は食料品の買い出し寄り)", alt_en:"go shopping は do some shopping とも言えます"},
  {ja_p:"本を読みます", ja_pa:"本を読みました", ko_p:"책을 읽어요", ko_pa:"책을 읽었어요", da_p:"læser en bog", da_pa:"læste en bog", en_b:"read a book", en_pa:"read a book", en_ing:"reading a book"},
  {ja_p:"音楽を聞きます", ja_pa:"音楽を聞きました", ko_p:"음악을 들어요", ko_pa:"음악을 들었어요", da_p:"hører musik", da_pa:"hørte musik", en_b:"listen to music", en_pa:"listened to music", en_ing:"listening to music", alt_da:"hører musik は lytter til musik とも言えます(lytte til は「耳を傾ける」感じ)"},
  {ja_p:"映画を見ます", ja_pa:"映画を見ました", ko_p:"영화를 봐요", ko_pa:"영화를 봤어요", da_p:"ser en film", da_pa:"så en film", en_b:"watch a movie", en_pa:"watched a movie", en_ing:"watching a movie", alt_en:"watch a movie は see a movie とも言えます(過去形は saw。see は映画館で観るイメージ)"},
  {ja_p:"コーヒーを飲みます", ja_pa:"コーヒーを飲みました", ko_p:"커피를 마셔요", ko_pa:"커피를 마셨어요", da_p:"drikker kaffe", da_pa:"drak kaffe", en_b:"drink coffee", en_pa:"drank coffee", en_ing:"drinking coffee", alt_en:"drink coffee は have coffee とも言えます(have は飲む・食べるのどちらにも使えます)"},
  {ja_p:"友達に会います", ja_pa:"友達に会いました", ko_p:"친구를 만나요", ko_pa:"친구를 만났어요", da_p:"mødes med en ven", da_pa:"mødtes med en ven", en_b:"meet a friend", en_pa:"met a friend", en_ing:"meeting a friend", alt_ko:"친구를 만나요 は 친구를 봐요 とも言えます(봐요 のほうが口語的)", alt_en:"meet a friend は see a friend とも言えます(すでに知っている友達に会うときは see が自然。過去形は saw)"},
  {ja_p:"自転車に乗ります", ja_pa:"自転車に乗りました", ko_p:"자전거를 타요", ko_pa:"자전거를 탔어요", da_p:"cykler", da_pa:"cyklede", en_b:"ride a bike", en_pa:"rode a bike", en_ing:"riding a bike", alt_en:"ride a bike は go cycling とも言えます"},
  {ja_p:"車を運転します", ja_pa:"車を運転しました", ko_p:"차를 운전해요", ko_pa:"차를 운전했어요", da_p:"kører bil", da_pa:"kørte bil", en_b:"drive", en_pa:"drove", en_ing:"driving", alt_ko:"차를 운전해요 は 차를 몰아요 とも言えます(몰다 のほうが口語的)", alt_en:"drive は drive a car と言っても同じ意味です(過去形は drove)"},
  {ja_p:"歌を歌います", ja_pa:"歌を歌いました", ko_p:"노래를 불러요", ko_pa:"노래를 불렀어요", da_p:"synger", da_pa:"sang", en_b:"sing", en_pa:"sang", en_ing:"singing", alt_ko:"노래를 불러요 は 노래해요 とも言えます", alt_en:"sing は sing a song とも言えます(過去形はどちらも sang)"},
  {ja_p:"絵を描きます", ja_pa:"絵を描きました", ko_p:"그림을 그려요", ko_pa:"그림을 그렸어요", da_p:"tegner", da_pa:"tegnede et billede", en_b:"draw", en_pa:"drew a picture", en_ing:"drawing", alt_en:"draw は draw a picture とも言えます(過去形は drew)"},
  {ja_p:"写真を撮ります", ja_pa:"写真を撮りました", ko_p:"사진을 찍어요", ko_pa:"사진을 찍었어요", da_p:"tager billeder", da_pa:"tog billeder", en_b:"take photos", en_pa:"took photos", en_ing:"taking photos", alt_da:"tager billeder は tager fotos とも言えます", alt_en:"take photos は take pictures とも言えます(過去形は took)"},
  {ja_p:"手紙を書きます", ja_pa:"手紙を書きました", ko_p:"편지를 써요", ko_pa:"편지를 썼어요", da_p:"skriver et brev", da_pa:"skrev et brev", en_b:"write a letter", en_pa:"wrote a letter", en_ing:"writing a letter"},
  {ja_p:"日記を書きます", ja_pa:"日記を書きました", ko_p:"일기를 써요", ko_pa:"일기를 썼어요", da_p:"skriver dagbog", da_pa:"skrev dagbog", en_b:"write in my diary", en_pa:"wrote in my diary", en_ing:"writing in my diary", alt_en:"write in my diary は keep a diary とも言えます(keep a diary は「日記をつける習慣がある」)"},
  {ja_p:"早く起きます", ja_pa:"早く起きました", ko_p:"일찍 일어나요", ko_pa:"일찍 일어났어요", da_p:"står tidligt op", da_pa:"stod tidligt op", en_b:"get up early", en_pa:"got up early", en_ing:"getting up early", alt_en:"get up early は wake up early とも言えます(wake up=目が覚める / get up=起き上がる)"},
  {ja_p:"遅く寝ます", ja_pa:"遅く寝ました", ko_p:"늦게 자요", ko_pa:"늦게 잤어요", da_p:"går sent i seng", da_pa:"gik sent i seng", en_b:"go to bed late", en_pa:"went to bed late", en_ing:"going to bed late", alt_en:"go to bed late は stay up late とも言えます(stay up late=夜ふかしする)"},
  {ja_p:"走ります", ja_pa:"走りました", ko_p:"달려요", ko_pa:"달렸어요", da_p:"løber", da_pa:"løb", en_b:"run", en_pa:"ran", en_ing:"running", alt_ko:"달려요 は 뛰어요 とも言えます(뛰다 のほうが日常的)", alt_en:"run は go for a run とも言えます(過去形は ran)"},
  {ja_p:"泳ぎます", ja_pa:"泳ぎました", ko_p:"수영해요", ko_pa:"수영했어요", da_p:"svømmer", da_pa:"svømmede", en_b:"swim", en_pa:"swam", en_ing:"swimming", alt_en:"swim は go swimming とも言えます(過去形は swam)"},
  {ja_p:"踊ります", ja_pa:"踊りました", ko_p:"춤춰요", ko_pa:"춤췄어요", da_p:"danser", da_pa:"dansede", en_b:"dance", en_pa:"danced", en_ing:"dancing"},
  {ja_p:"ヨガをします", ja_pa:"ヨガをしました", ko_p:"요가해요", ko_pa:"요가했어요", da_p:"dyrker yoga", da_pa:"dyrkede yoga", en_b:"do yoga", en_pa:"did yoga", en_ing:"doing yoga", alt_en:"do yoga は practice yoga とも言えます"},
  {ja_p:"サッカーをします", ja_pa:"サッカーをしました", ko_p:"축구해요", ko_pa:"축구했어요", da_p:"spiller fodbold", da_pa:"spillede fodbold", en_b:"play soccer", en_pa:"played soccer", en_ing:"playing soccer", alt_en:"play soccer は play football とも言えます(イギリスでは football が普通)"},
  {ja_p:"ゲームをします", ja_pa:"ゲームをしました", ko_p:"게임해요", ko_pa:"게임했어요", da_p:"spiller computerspil", da_pa:"spillede computerspil", en_b:"play video games", en_pa:"played video games", en_ing:"playing video games"},
  {ja_p:"ピアノを弾きます", ja_pa:"ピアノを弾きました", ko_p:"피아노를 쳐요", ko_pa:"피아노를 쳤어요", da_p:"spiller klaver", da_pa:"spillede klaver", en_b:"play the piano", en_pa:"played the piano", en_ing:"playing the piano", alt_ko:"피아노를 쳐요 は 피아노를 연주해요 とも言えます(연주하다=演奏する。少し硬い語)"},
  {ja_p:"パンを焼きます", ja_pa:"パンを焼きました", ko_p:"빵을 구워요", ko_pa:"빵을 구웠어요", da_p:"bager brød", da_pa:"bagte brød", en_b:"bake bread", en_pa:"baked bread", en_ing:"baking bread"},
  {ja_p:"旅行します", ja_pa:"旅行しました", ko_p:"여행해요", ko_pa:"여행했어요", da_p:"rejser", da_pa:"rejste", en_b:"travel", en_pa:"traveled", en_ing:"traveling", alt_en:"travel は go on a trip とも言えます"},
  {ja_p:"ゆっくり休みます", ja_pa:"ゆっくり休みました", ko_p:"푹 쉬어요", ko_pa:"푹 쉬었어요", da_p:"slapper af", da_pa:"slappede af", en_b:"relax", en_pa:"relaxed", en_ing:"relaxing", alt_da:"slapper af は hviler mig とも言えます(hvile sig=休息をとる)", alt_en:"relax は take it easy とも言えます"},
  {ja_p:"ニュースを見ます", ja_pa:"ニュースを見ました", ko_p:"뉴스를 봐요", ko_pa:"뉴스를 봤어요", da_p:"ser nyhederne", da_pa:"så nyhederne", en_b:"watch the news", en_pa:"watched the news", en_ing:"watching the news"},
];

// 形容詞  jp: 日本語述語形 / ko_p: 韓国語述語 / da,da_n: 共性形・中性形 /
//         ok: 使える名詞タグ(スペース区切り)
const ALLTAG = "read device vehicle thing furniture cloth culture commerce nature service food";
const ADJS = [
  {ja:"大きい", jp:"大きいです", jp_neg:"大きくないです", jp_too:"大きすぎます", jp_adn:"大きい", ko_p:"커요", da:"stor", da_n:"stort", en:"big", en_er:"bigger", en_est:"biggest", da_er:"større", da_est:"størst", ok:ALLTAG},
  {ja:"小さい", jp:"小さいです", jp_neg:"小さくないです", jp_too:"小さすぎます", jp_adn:"小さい", ko_p:"작아요", da:"lille", da_n:"lille", en:"small", en_er:"smaller", en_est:"smallest", da_er:"mindre", da_est:"mindst", ok:ALLTAG},
  {ja:"新しい", jp:"新しいです", jp_neg:"新しくないです", jp_too:"新しすぎます", jp_adn:"新しい", ko_p:"새로워요", da:"ny", da_n:"nyt", en:"new", en_er:"newer", en_est:"newest", da_er:"nyere", da_est:"nyest", ok:"read device vehicle thing furniture cloth culture commerce service"},
  {ja:"古い", jp:"古いです", jp_neg:"古くないです", jp_too:"古すぎます", jp_adn:"古い", ko_p:"오래됐어요", da:"gammel", da_n:"gammelt", en:"old", en_er:"older", en_est:"oldest", da_er:"ældre", da_est:"ældst", ok:"read device vehicle thing furniture cloth culture commerce service"},
  {ja:"高い", jp:"高いです", jp_neg:"高くないです", jp_too:"高すぎます", jp_adn:"高い", ko_p:"비싸요", da:"dyr", da_n:"dyrt", en:"expensive", en_er:"more expensive", en_est:"most expensive", da_er:"dyrere", da_est:"dyrest", ok:"read device vehicle thing furniture cloth commerce food"},
  {ja:"安い", jp:"安いです", jp_neg:"安くないです", jp_too:"安すぎます", jp_adn:"安い", ko_p:"싸요", da:"billig", da_n:"billigt", en:"cheap", en_er:"cheaper", en_est:"cheapest", da_er:"billigere", da_est:"billigst", ok:"read device vehicle thing furniture cloth commerce food"},
  {ja:"美しい", jp:"美しいです", jp_neg:"美しくないです", jp_too:"美しすぎます", jp_adn:"美しい", ko_p:"아름다워요", da:"smuk", da_n:"smukt", en:"beautiful", en_er:"more beautiful", en_est:"most beautiful", da_er:"smukkere", da_est:"smukkest", ok:"thing cloth culture nature"},
  {ja:"面白い", jp:"面白いです", jp_neg:"面白くないです", jp_too:"面白すぎます", ko_neg:"재미없어요", jp_adn:"面白い", ko_p:"재미있어요", da:"sjov", da_n:"sjovt", en:"fun", en_er:"more fun", en_est:"most fun", da_er:"sjovere", da_est:"sjovest", ok:"read culture"},
  {ja:"難しい", jp:"難しいです", jp_neg:"難しくないです", jp_too:"難しすぎます", jp_adn:"難しい", ko_p:"어려워요", da:"svær", da_n:"svært", en:"difficult", en_er:"more difficult", en_est:"most difficult", da_er:"sværere", da_est:"sværest", ok:"read"},
  {ja:"簡単", jp:"簡単です", jp_neg:"簡単じゃないです", jp_too:"簡単すぎます", jp_adn:"簡単な", ko_p:"쉬워요", da:"nem", da_n:"nemt", en:"easy", en_er:"easier", en_est:"easiest", da_er:"nemmere", da_est:"nemmest", ok:"read"},
  {ja:"速い", jp:"速いです", jp_neg:"速くないです", jp_too:"速すぎます", jp_adn:"速い", ko_p:"빨라요", da:"hurtig", da_n:"hurtigt", en:"fast", en_er:"faster", en_est:"fastest", da_er:"hurtigere", da_est:"hurtigst", ok:"vehicle device"},
  {ja:"清潔", jp:"清潔です", jp_neg:"清潔じゃないです", jp_too:"清潔すぎます", jp_adn:"清潔な", ko_p:"깨끗해요", da:"ren", da_n:"rent", en:"clean", en_er:"cleaner", en_est:"cleanest", da_er:"renere", da_est:"renest", ok:"vehicle thing furniture cloth culture commerce service"},
  {ja:"静か", jp:"静かです", jp_neg:"静かじゃないです", jp_too:"静かすぎます", jp_adn:"静かな", ko_p:"조용해요", da:"stille", da_n:"stille", en:"quiet", en_er:"quieter", en_est:"quietest", da_er:"mere stille", da_est:"mest stille", ok:"culture nature service commerce"},
  {ja:"有名", jp:"有名です", jp_neg:"有名じゃないです", jp_too:"有名すぎます", no_deg:[3], jp_adn:"有名な", ko_p:"유명해요", da:"berømt", da_n:"berømt", en:"famous", en_er:"more famous", en_est:"most famous", da_er:"mere berømt", da_est:"mest berømt", ok:"read culture nature commerce"},
  {ja:"重い", jp:"重いです", jp_neg:"重くないです", jp_too:"重すぎます", jp_adn:"重い", ko_p:"무거워요", da:"tung", da_n:"tungt", en:"heavy", en_er:"heavier", en_est:"heaviest", da_er:"tungere", da_est:"tungest", ok:"read device thing furniture"},
  {ja:"軽い", jp:"軽いです", jp_neg:"軽くないです", jp_too:"軽すぎます", jp_adn:"軽い", ko_p:"가벼워요", da:"let", da_n:"let", en:"light", en_er:"lighter", en_est:"lightest", da_er:"lettere", da_est:"lettest", ok:"read device thing cloth"},
  {ja:"便利", jp:"便利です", jp_neg:"便利じゃないです", jp_too:"便利すぎます", jp_adn:"便利な", ko_p:"편리해요", da:"praktisk", da_n:"praktisk", en:"handy", en_er:"handier", en_est:"handiest", da_er:"mere praktisk", da_est:"mest praktisk", ok:"vehicle thing"},
  {ja:"人気", jp:"人気があります", jp_neg:"人気がないです", jp_too:"人気がありすぎます", ko_neg:"인기가 없어요", no_deg:[3,4], jp_adn:"人気のある", ko_p:"인기가 많아요", da:"populær", da_n:"populært", en:"popular", en_er:"more popular", en_est:"most popular", da_er:"mere populær", da_est:"mest populær", ok:"read culture commerce nature food"},
  {ja:"おいしい", jp:"おいしいです", jp_neg:"おいしくないです", jp_too:"おいしすぎます", ko_neg:"맛없어요", jp_adn:"おいしい", ko_p:"맛있어요", da:"lækker", da_n:"lækkert", en:"tasty", en_er:"tastier", en_est:"tastiest", da_er:"lækrere", da_est:"lækrest", ok:"food"},
  {ja:"甘い", jp:"甘いです", jp_neg:"甘くないです", jp_too:"甘すぎます", jp_adn:"甘い", ko_p:"달아요", da:"sød", da_n:"sødt", en:"sweet", en_er:"sweeter", en_est:"sweetest", da_er:"sødere", da_est:"sødest", ok:"food"},
  {ja:"新鮮", jp:"新鮮です", jp_neg:"新鮮じゃないです", jp_too:"新鮮すぎます", jp_adn:"新鮮な", ko_p:"신선해요", da:"frisk", da_n:"friskt", en:"fresh", en_er:"fresher", en_est:"freshest", da_er:"friskere", da_est:"friskest", ok:"food"},
];

/* 人の状態を表す形容詞。look(~に見える)・become(~になる)・SVOC(~を~にする)で使う。
 * 名詞の描写(ok タグ)には出さないので ok:"human" にしてある。
 * 韓国語の「~아/어 보여요」は ko_p の末尾「요」を落として作れる(피곤해요 → 피곤해 보여요)。 */
const HUMAN_ADJS = [
  {ja:"疲れた",   jp:"疲れています",   jp_look:"疲れているように見えます", jp_make:"疲れさせました",   jp_that:"疲れている",
   ko_p:"피곤해요", ko_st:"피곤하", da:"træt",       da_n:"træt",       en:"tired"},
  {ja:"うれしい", jp:"うれしいです",   jp_look:"うれしそうです",           jp_make:"うれしくさせました", jp_that:"うれしい",
   ko_p:"기뻐요",   ko_st:"기쁘",   da:"glad",       da_n:"glad",       en:"happy"},
  {ja:"悲しい",   jp:"悲しいです",     jp_look:"悲しそうです",             jp_make:"悲しくさせました",   jp_that:"悲しい",
   ko_p:"슬퍼요",   ko_st:"슬프",   da:"ked af det", da_n:"ked af det", en:"sad"},
  {ja:"忙しい",   jp:"忙しいです",     jp_look:"忙しそうです",             jp_make:"忙しくさせました",   jp_that:"忙しい",
   ko_p:"바빠요",   ko_st:"바쁘",   da:"travl",      da_n:"travlt",     en:"busy"},
  {ja:"親切",     jp:"親切です",       jp_look:"親切そうです",             jp_make:"親切にさせました",   jp_that:"親切だ",
   ko_p:"친절해요", ko_st:"친절하", da:"venlig",     da_n:"venligt",    en:"kind"},
  {ja:"元気",     jp:"元気です",       jp_look:"元気そうです",             jp_make:"元気にさせました",   jp_that:"元気だ",
   ko_p:"건강해요", ko_st:"건강하", da:"rask",       da_n:"raskt",      en:"healthy"},
  {ja:"眠い",     jp:"眠いです",       jp_look:"眠そうです",               jp_make:"眠くさせました",     jp_that:"眠い",
   ko_p:"졸려요",   ko_st:"졸리",   da:"søvnig",     da_n:"søvnigt",    en:"sleepy"},
  {ja:"緊張した", jp:"緊張しています", jp_look:"緊張しているように見えます", jp_make:"緊張させました",   jp_that:"緊張している",
   ko_p:"긴장했어요", ko_st:"긴장하", ko_that:"긴장했", da:"nervøs", da_n:"nervøst", en:"nervous"},
];
// 「~아/어 보여요(~に見える)」「~아/어 보였어요」の語幹。해요体の요を落とす
const koStem = ko_p => ko_p.replace(/요$/, "");
// 韓国語の副詞は動詞の直前。目的語つきの述語(「커피를 마셔요」)なら目的語のあとに入れる
const koAdvIn = (pred, adv) => {
  const i = pred.lastIndexOf(" ");
  return i < 0 ? `${adv} ${pred}` : `${pred.slice(0, i)} ${adv} ${pred.slice(i + 1)}`;
};
// デンマーク語の副詞は定形動詞のすぐあと。「drikker kaffe」なら drikker と kaffe の間
const daAdvIn = (pred, adv) => {
  const i = pred.indexOf(" ");
  return i < 0 ? `${pred} ${adv}` : `${pred.slice(0, i)} ${adv} ${pred.slice(i + 1)}`;
};

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
  {ja:"暑い", ko:"더워요", ja_ba:"暑ければ", ko_myeon:"더우면", ja_ku:"暑く", ko_became:"더워졌어요", ko_will:"더울 거예요", ko_seo:"더워서", da:"varmt", en:"hot"},
  {ja:"寒い", ko:"추워요", ja_ba:"寒ければ", ko_myeon:"추우면", ja_ku:"寒く", ko_became:"추워졌어요", ko_will:"추울 거예요", ko_seo:"추워서", da:"koldt", en:"cold"},
  {ja:"暖かい", ko:"따뜻해요", ja_ba:"暖かければ", ko_myeon:"따뜻하면", ja_ku:"暖かく", ko_became:"따뜻해졌어요", ko_will:"따뜻할 거예요", ko_seo:"따뜻해서", da:"lunt", en:"warm"},
  {ja:"涼しい", ko:"시원해요", ja_ba:"涼しければ", ko_myeon:"시원하면", ja_ku:"涼しく", ko_became:"시원해졌어요", ko_will:"시원할 거예요", ko_seo:"시원해서", da:"køligt", en:"cool"},
  {ja:"曇り", ko:"흐려요", ja_ba:"曇りなら", ko_myeon:"흐리면", ja_ku:"曇りに", ko_became:"흐려졌어요", ko_will:"흐릴 거예요", ko_seo:"흐려서", da:"overskyet", en:"cloudy"},
  {ja:"風が強い", ko:"바람이 세요", ja_ba:"風が強ければ", ko_myeon:"바람이 세면", ja_ku:"風が強く", ko_became:"바람이 세졌어요", ko_will:"바람이 셀 거예요", ko_seo:"바람이 세서", da:"blæsende", da_c:"det blæser meget", en:"windy"},
  {ja:"蒸し暑い", ko:"무더워요", ja_ba:"蒸し暑ければ", ko_myeon:"무더우면", ja_ku:"蒸し暑く", ko_became:"무더워졌어요", ko_will:"무더울 거예요", ko_seo:"무더워서", da:"lummert", en:"hot and humid"},
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
    } else if (K_FIN.includes(cur[2]) && nxt[0] === 18) {          // 激音化 k+ㅎ → k (산책해요=sanchaekaeyo)
      cur[2] = 0; nxt[3] = "k";
    } else if (P_FIN.includes(cur[2]) && nxt[0] === 18) {          // 激音化 p+ㅎ → p
      cur[2] = 0; nxt[3] = "p";
    } else if (T_FIN.includes(cur[2]) && cur[2] !== 27 && nxt[0] === 18) {  // 激音化 t+ㅎ → t (따뜻해서=ttatteutaeseo)
      cur[2] = 0; nxt[3] = "t";
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
// デンマーク語の不定冠詞。性で en/et を選ぶ(不可算に相当する語は art なしで裸のまま)
const enIndefDa = n => (n.art ? (n.g === "en" ? "en " : "et ") : "") + n.da;
// 「あの~」。denne/dette と対になる指示詞
const daThat = n => (n.g === "en" ? "den " : "det ") + n.da;
// 韓国語の形容詞の連体形(名詞を修飾する形)。해요体から作る
// 큰/작은 のように -ㄴ/-은 になるものと、하다形容詞の -한 の2系統がある
const KO_ADNOM = {
  "커요": "큰", "작아요": "작은", "새로워요": "새로운", "오래됐어요": "오래된",
  "비싸요": "비싼", "싸요": "싼", "아름다워요": "아름다운", "재미있어요": "재미있는",
  "어려워요": "어려운", "쉬워요": "쉬운", "빨라요": "빠른", "깨끗해요": "깨끗한",
  "조용해요": "조용한", "유명해요": "유명한", "무거워요": "무거운", "가벼워요": "가벼운",
  "편리해요": "편리한", "인기가 많아요": "인기가 많은", "맛있어요": "맛있는",
  "달아요": "단", "신선해요": "신선한",
};
const koAdnom = a => KO_ADNOM[a.ko_p] || a.ko_p;
// デンマーク語の主節倒置。従属節が文頭に来ると「動詞→主語」の順になる
// 「studerer」→「studerer jeg」、「laver mad」→「laver jeg mad」
const daInvert = pred => {
  const i = pred.indexOf(" ");
  return i < 0 ? `${pred} jeg` : `${pred.slice(0, i)} jeg ${pred.slice(i + 1)}`;
};
// デンマーク語の現在形→不定詞。skal / var ved at のあとで使う
const daInf = (da_p) => {
  const parts = da_p.split(" ");
  let v = parts[0];
  if (v === "gør") v = "gøre";
  else if (!v.endsWith("s") && v.endsWith("r")) v = v.slice(0, -1);
  parts[0] = v;
  return parts.join(" ");
};
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* 程度副詞のローテーション。
 * 以前は描写文がすべて「とても/아주/meget/very」固定で、very だけで951問あった。
 * 名詞indexと形容詞indexの和で決定的に選ぶ(乱数だとリロードごとに文面が変わり、
 * 重複除去・単語帳・検証がすべて不安定になる)。
 * jaf: 日本語側で使う ADJS のフィールド。「~すぎる」と「あまり~ない」は
 *      形容詞の活用そのものが変わるので jp ではなく jp_too / jp_neg を使う。 */
const DEGREES = [
  { ja: "とても", jaf: "jp", ko: "아주", da: "meget", en: "very",
    nko: "아주=とても。形容詞も動詞と同じく해요体で活用します。", nda: "meget=とても。",
    nen: "very で形容詞を強調できます。" },
  { ja: "本当に", jaf: "jp", ko: "정말", da: "virkelig", en: "really",
    nko: "정말=本当に。진짜 はもっとくだけた言い方です。", nda: "virkelig=本当に。rigtig とも言えます。",
    nen: "really は very とほぼ同じ強調で、会話でよく使います。" },
  { ja: "かなり", jaf: "jp", ko: "꽤", da: "ret", en: "quite",
    nko: "꽤=かなり。제법 とも言えます。", nda: "ret=かなり。ganske とも言えます。",
    nen: "quite=かなり。イギリス英語では「まあまあ」寄りの意味にもなります。" },
  { ja: "少し", jaf: "jp", ko: "조금", da: "lidt", en: "a little",
    nko: "조금=少し。좀 と縮めるとより口語的です。", nda: "lidt=少し。",
    nen: "a little=少し。a bit とも言えます。" },
  { ja: "", jaf: "jp_too", ko: "너무", da: "alt for", en: "too",
    nko: "너무=~すぎる。会話では「とても」の意味でも使われます。",
    nda: "alt for=~すぎる。for だけでも同じ意味になります。",
    nen: "too=~すぎる。very と違って「度が過ぎる」という否定的な含みがあります。" },
  { ja: "あまり", jaf: "jp_neg", ko: "별로 안", da: "ikke særlig", en: "not very",
    nko: "별로 안 ~=あまり~ない。별로 は否定と一緒に使います。",
    nda: "ikke særlig=あまり~ない。ikke が否定、særlig が「特に」。",
    nen: "not very ~=あまり~ない。not と very で控えめな否定になります。" },
];
// 名詞index+形容詞index で程度副詞を選ぶ。相性が悪い組(no_deg)は「とても」に落とす
const degOf = (a, i) => {
  const d = DEGREES[i % DEGREES.length];
  return (a.no_deg || []).includes(i % DEGREES.length) ? DEGREES[0] : d;
};
// 韓国語の述語。「あまり~ない」だけ否定形になり、재미없어요/맛없어요 のような
// 専用の否定形を持つ形容詞は ko_neg を優先する
const koDeg = (a, deg) => deg.jaf !== "jp_neg" ? `${deg.ko} ${a.ko_p}`
  : a.ko_neg ? `별로 ${a.ko_neg}` : `별로 안 ${a.ko_p}`;

/* 時間表現のローテーション。以前は過去がすべて「昨日」、未来がすべて「明日」固定だった。
 * DEGREES と同じく、語彙のindexで決定的に選ぶ。 */
const PASTS = [
  { ja: "昨日",  ko: "어제",      da: "i går",       en: "yesterday" },
  { ja: "今朝",  ko: "오늘 아침", da: "i morges",    en: "this morning" },
  { ja: "昨晩",  ko: "어젯밤",    da: "i går aftes", en: "last night" },
  { ja: "先週",  ko: "지난주",    da: "i sidste uge", en: "last week" },
];
const FUTURES = [
  { ja: "明日",   ko: "내일",         da: "i morgen",    en: "tomorrow" },
  { ja: "今晩",   ko: "오늘 밤",      da: "i aften",     en: "tonight" },
  { ja: "来週",   ko: "다음 주",      da: "i næste uge", en: "next week" },
  { ja: "週末に", ko: "이번 주말에",  da: "i weekenden", en: "this weekend" },
];
const pastOf   = i => PASTS[i % PASTS.length];
const futureOf = i => FUTURES[i % FUTURES.length];

/* =====================  テンプレート  ===================== */
/* item(): {ja, ko, da, en, h(ヒント), n:{ko,da,en}(解説), alt:{ko,da,en}(言い換え)}
 * 第9引数 opts は { d: 難易度, alt: {ko,da,en} }。数値を渡すと従来どおり難易度扱い。
 *
 * alt(言い換え)の書き方:
 *   - 「A は B とも言えます」を基本形にし、ニュアンス差は ( ) で一言添える
 *   - 活用や助詞が変わるものはその場で書く(例「助詞が 를 → 가 に変わります」)
 *   - 自然さに確信が持てないものは書かない(誤った言い換えは模範解答より害が大きい) */
function item(ja, ko, da, en, h, nko, nda, nen, opts) {
  if (typeof opts === "number") opts = { d: opts };
  opts = opts || {};
  return { ja, ko, da, en, h, d: opts.d, n: { ko: nko, da: nda, en: nen }, alt: opts.alt || {} };
}
const bat = w => hasBatchim(w) ? "あり" : "なし";
// 動詞ごとの言い換え(ACTIONS の alt_*)
const actAlt = a => ({ ko: a.alt_ko, da: a.alt_da, en: a.alt_en });
// 文型ごとの言い換えを優先し、なければ動詞ごとの言い換えにフォールバックする
const altOr = (primary, fallback) => ({
  ko: primary.ko || fallback.ko, da: primary.da || fallback.da, en: primary.en || fallback.en,
});

const TEMPLATES = [

["好み: ~が好きです", 1, function* () {
  for (const f of FOODS) {
    yield item(`私は${f.ja}が好きです。`,
      `저는 ${objP(f.ko)} 좋아해요.`, `Jeg kan godt lide ${f.dagen}.`, `I like ${f.gen}.`, "好み",
      `「~을/를 좋아해요」=「~が好きです」。${f.ko}はパッチム${bat(f.ko)}→${hasBatchim(f.ko) ? "을" : "를"}。`,
      `kan godt lide=好き。総称なので冠詞なしの ${f.dagen} を使います。`,
      f.art ? `like のあとは総称形。数えられる名詞は複数形(${f.gen})にします。`
            : `${f.gen} は数えられない名詞なので、そのままの形で使います。`,
      { alt: {
          ko: `좋아해요 は 좋아요 とも言えます(そのとき助詞が変わります: ${subjP(f.ko)} 좋아요)`,
          da: "kan godt lide は holder af とも言えます(holde af は「愛着がある」寄りの響き)",
          en: "like は enjoy とも言えます(I enjoy ~ のほうが少し丁寧な響き)",
        } });
    yield item(`私は${f.ja}が好きではありません。`,
      `저는 ${objP(f.ko)} 안 좋아해요.`, `Jeg kan ikke lide ${f.dagen}.`, `I don't like ${f.gen}.`, "好み",
      "動詞の前に 안 を置くと否定になります。",
      "否定は ikke。kan ikke lide=好きではない。",
      "don't + 動詞の原形で否定文になります。",
      { alt: {
          ko: "안 좋아해요 は 좋아하지 않아요 とも言えます(動詞の後ろにつける長い否定形)",
          en: "don't like は am not a fan of とも言えます(やわらかい言い方)",
        } });
    yield item(`${f.ja}は好きですか?`,
      `${objP(f.ko)} 좋아해요?`, `Kan du lide ${f.dagen}?`, `Do you like ${f.gen}?`, "質問",
      "疑問文は語尾を上げるだけ。語順は変わりません。",
      "疑問文は動詞を文頭に(Kan du ...?)。",
      "一般動詞の疑問文は Do you ~? で始めます。");
  }
}],

["注文する", 1, function* () {
  for (const f of FOODS) {
    if (!f.art && f.gen === f.en) continue;   // 不可算(water, milk 等)は「一つください」と相性が悪いので除外
    yield item(`${f.ja}を一つください。`,
      `${f.ko} 하나 주세요.`, `${cap(daIndef(f))}, tak.`, `${cap(enIndef(f))}, please.`, "買い物",
      "「~ 주세요」=「~をください」。하나=1つ。",
      `${f.da}は${f.g}名詞なので「${f.g} ${f.da}」。tak をつけると丁寧。`,
      "カフェや店での注文の最短形。please を忘れずに。",
      { alt: {
          ko: "하나 주세요 は 하나 주시겠어요? とも言えます(より丁寧な頼み方)",
          da: "「~, tak」は Må jeg bede om ~? とも言えます(より丁寧)",
          en: "「~, please」は Could I get ~? / I'll have ~ とも言えます",
        } });
    yield item(`${f.ja}をお願いできますか?`,
      `${f.ko} 좀 주시겠어요?`, `Må jeg bede om ${daIndef(f)}?`, `Could I have ${enIndef(f)}, please?`, "買い物",
      "「주시겠어요?」は「주세요」より丁寧な依頼表現。",
      "Må jeg bede om ~? =「~をいただけますか」。丁寧な定番表現。",
      "Could I have ~? は Can I より丁寧な依頼。");
  }
}],

["場所を尋ねる", 1, function* () {
  for (const p of PLACES) {
    yield item(`${p.ja}はどこですか?`,
      `${subjP(p.ko)} 어디예요?`, `Hvor er ${p.dad}?`, `Where is the ${p.en}?`, "旅行",
      `「~이/가 어디예요?」=「~はどこですか」。${p.ko}はパッチム${bat(p.ko)}→${hasBatchim(p.ko) ? "이" : "가"}。`,
      `デンマーク語の定冠詞は語尾につきます(${p.da}→${p.dad})。`,
      "場所を尋ねる基本形。Excuse me, を前につけると丁寧。",
      { alt: {
          ko: "어디예요? は 어디에 있어요? とも言えます(「どこにありますか」)",
          da: "Hvor er ~? は Kan du sige mig, hvor ~ er? とも言えます(より丁寧)",
          en: "Where is ~? は Could you tell me where ~ is? とも言えます(より丁寧)",
        } });
  }
}],

["近くにありますか", 2, function* () {
  for (const p of PLACES) {
    if (["nature"].includes(p.tag)) continue;
    yield item(`近くに${p.ja}はありますか?`,
      `근처에 ${subjP(p.ko)} 있어요?`, `Er der ${daIndef(p)} i nærheden?`, `Is there ${enIndef(p)} near here?`, "旅行",
      "근처=近く、있어요?=ありますか。",
      "Er der ~? =「~はありますか」。i nærheden=近くに。",
      "Is there ~? で存在を尋ねます。");
  }
}],

["場所へ行く", 2, function* () {
  for (const [pi, p] of PLACES.entries()) {
    if (!p.go) continue;
    const t = pastOf(pi);
    yield item(`私は${p.ja}に行きます。`,
      `저는 ${p.ko}에 가요.`, `Jeg skal til ${p.dad}.`, `I'm going to the ${p.en}.`, "日常",
      "場所につく助詞は「에」。「~에 가요」=「~に行きます」。",
      "skal til ~ で「~へ行く予定だ」。行き先は限定形。",
      "近い予定は be going to で表します。");
    yield item(`${t.ja}${p.ja}に行きました。`,
      `${t.ko} ${p.ko}에 갔어요.`, `Jeg tog til ${p.dad} ${t.da}.`, `I went to the ${p.en} ${t.en}.`, "過去",
      `過去形は 가요 → 갔어요。${t.ko}=${t.ja}。`,
      `tage(行く)の過去形は tog。${t.da}=${t.ja}。`,
      `go の過去形は went(不規則動詞)。${t.en}=${t.ja}。`, 3);
  }
}],

["値段を聞く", 1, function* () {
  for (const o of OBJECTS) {
    if (["窓", "ドア"].includes(o.ja)) continue;   // 単体で値段を聞くのは不自然
    yield item(`この${o.ja}はいくらですか?`,
      `이 ${topicP(o.ko)} 얼마예요?`, `Hvad koster ${daThis(o)}?`, `How much is this ${o.en}?`, "買い物",
      `이=この、얼마=いくら。${o.ko}はパッチム${bat(o.ko)}→${hasBatchim(o.ko) ? "은" : "는"}。`,
      `「この」は${o.g}名詞なら${o.g === "en" ? "denne" : "dette"}。`,
      "How much is ~? が値段を聞く定番。");
  }
}],

["買いたい", 2, function* () {
  for (const o of OBJECTS) {
    if (o.tag === "furniture" && ["窓", "ドア"].includes(o.ja)) continue;
    yield item(`${o.ja}を買いたいです。`,
      `${objP(o.ko)} 사고 싶어요.`, `Jeg vil gerne købe ${daIndef(o)}.`, `I want to buy ${enIndef(o)}.`, "買い物",
      "「~고 싶어요」=「~したいです」。사다=買う。",
      "vil gerne købe ~ =「~を買いたい」。gerne で柔らかい響きに。",
      "want to + 動詞の原形。",
      { alt: {
          ko: "사고 싶어요 は 사려고 해요 とも言えます(사려고 하다=買おうと思っている)",
          da: "vil gerne købe は kunne godt tænke mig at købe とも言えます(より控えめな言い方)",
          en: "want to buy は would like to buy とも言えます(would like のほうが丁寧)",
        } });
  }
}],

["職業", 1, function* () {
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

["予定を聞く", 2, function* () {
  for (const t of TIMES) {
    const koTime = t.ko + (t.ko_e ? "에" : "");
    yield item(`${t.ja}は何をしますか?`,
      `${koTime} 뭐 해요?`, `Hvad laver du ${t.da}?`, `What are you doing ${t.en}?`, "質問",
      `時間には助詞「에」がつきます${t.ko_e ? "" : "が、오늘・내일 にはつきません"}。`,
      "lave=する・作る。Hvad laver du? は「何してるの?」の定番。",
      "近い未来の予定は現在進行形で表せます。");
  }
}],

["毎日の習慣", 2, function* () {
  for (const a of ACTIONS) {
    yield item(`私は毎日${a.ja_p}。`,
      `저는 매일 ${a.ko_p}.`, `Jeg ${a.da_p} hver dag.`, `I ${a.en_b} every day.`, "日常",
      "매일=毎日。해요体は日常会話で最もよく使う丁寧形。",
      "hver dag=毎日。デンマーク語の現在形は原形+r が基本。",
      "習慣は現在形で表します。", { alt: actAlt(a) });
  }
}],

["昨日したこと", 3, function* () {
  for (const [ai, a] of ACTIONS.entries()) {
    const t = pastOf(ai);
    yield item(`${t.ja}${a.ja_pa}。`,
      `${t.ko} ${a.ko_pa}.`, `Jeg ${a.da_pa} ${t.da}.`, `I ${a.en_pa} ${t.en}.`, "過去",
      `過去形は語幹+았/었어요。${t.ko}=${t.ja}。`,
      `規則動詞の過去形は -ede/-te。så・tog・gik などの不規則動詞もあります。${t.da}=${t.ja}。`,
      `過去の出来事は過去形で。${t.en}=${t.ja}。`, { alt: actAlt(a) });
  }
}],

["今していること", 2, function* () {
  for (const a of ACTIONS) {
    yield item(`今${a.ja_p}。`,
      `지금 ${a.ko_p}.`, `Jeg ${a.da_p} lige nu.`, `I'm ${a.en_ing} right now.`, "日常",
      "지금=今。韓国語は現在形が進行の意味も兼ねます。",
      "デンマーク語も現在形で進行を表します(進行形は不要)。",
      "今まさにしていることは現在進行形(be + -ing)。", { alt: actAlt(a) });
  }
}],

["明日の予定", 3, function* () {
  // デンマーク語の予定は skal + 不定詞が最も自然(daInf はグローバルヘルパ)
  for (const [ai, a] of ACTIONS.entries()) {
    const t = futureOf(ai);
    yield item(`${t.ja}${a.ja_p}。`,
      `${t.ko} ${a.ko_p}.`, `Jeg skal ${daInf(a.da_p)} ${t.da}.`, `I'm going to ${a.en_b} ${t.en}.`, "予定",
      `確定した予定は現在形のままでOK。${t.ko}=${t.ja}。`,
      `予定は skal+動詞の原形で表すのが自然です。${t.da}=${t.ja}。`,
      `be going to ~ で予定を表します。${t.en}=${t.ja}。`,
      { alt: altOr({
          ko: "現在形のままでも予定を表せますが、-(으)ㄹ 거예요(공부할 거예요)にすると「~するつもり」の意味がはっきりします",
          en: "be going to は will とも言えます(will はその場で決めた感じ、be going to は前から決めていた感じ)",
        }, actAlt(a)) });
  }
}],

["物の描写", 2, function* () {
  for (const [oi, o] of OBJECTS.entries()) {
    for (const [ai, a] of ADJS.entries()) {
      if (!a.ok.split(" ").includes(o.tag)) continue;
      if (["写真", "地図"].includes(o.ja) && ["重い", "軽い"].includes(a.ja)) continue;  // 紙物の重さは不自然
      const g = degOf(a, oi + ai);
      yield item(`この${o.ja}は${g.ja}${a[g.jaf]}。`,
        `이 ${topicP(o.ko)} ${koDeg(a, g)}.`, `${cap(daThis(o))} er ${g.da} ${daAdj(a, o)}.`,
        `This ${o.en} is ${g.en} ${a.en}.`, "描写",
        g.nko,
        g.nda + (a.da === a.da_n ? `この形容詞は en/et どちらの名詞でも同じ形(${a.da})です。`
          : `述語の形容詞は性に一致。${o.g}名詞なので「${daAdj(a, o)}」。`),
        g.nen);
    }
  }
}],

["場所の描写", 2, function* () {
  for (const [pi, p] of PLACES.entries()) {
    for (const [ai, a] of ADJS.entries()) {
      if (!a.ok.split(" ").includes(p.tag)) continue;
      const g = degOf(a, pi + ai);
      yield item(`その${p.ja}は${g.ja}${a[g.jaf]}。`,
        `그 ${topicP(p.ko)} ${koDeg(a, g)}.`, `${cap(p.dad)} er ${g.da} ${daAdj(a, p)}.`,
        `The ${p.en} is ${g.en} ${a.en}.`, "描写",
        "그=その。指示語は 이(この)/그(その)/저(あの)。" + g.nko,
        g.nda + (a.da === a.da_n ? `この形容詞は en/et どちらの名詞でも同じ形(${a.da})です。`
          : `${p.g}名詞なので形容詞は「${daAdj(a, p)}」の形になります。`),
        "既知のものには the をつけます。" + g.nen);
    }
  }
}],

["食べ物の描写", 2, function* () {
  // 意味的に自然な組み合わせだけを許可する
  const SWEET_OK = new Set(["ケーキ", "クッキー", "チョコレート", "アイスクリーム", "りんご", "バナナ", "オレンジ", "ぶどう", "いちご", "梨", "スイカ", "ジュース", "ワイン", "ヨーグルト"]);
  const FRESH_OK = new Set(["りんご", "バナナ", "オレンジ", "ぶどう", "いちご", "梨", "スイカ", "トマト", "にんじん", "玉ねぎ", "じゃがいも", "野菜", "魚", "肉", "卵", "牛乳", "パン"]);
  const POPULAR_NG = new Set(["バター", "ヨーグルト", "卵", "玉ねぎ", "にんじん", "野菜", "じゃがいも", "牛乳", "ご飯", "パスタ", "水", "チーズ"]);
  for (const [fi, f] of FOODS.entries()) {
    if (f.ja === "水") continue;                                   // 水の描写は不自然になりやすい
    for (const [ai, a] of ADJS.entries()) {
      if (!a.ok.split(" ").includes("food")) continue;
      if (["大きい", "小さい"].includes(a.ja) && !f.art) continue;  // 不可算に大小は不自然
      if (a.ja === "甘い" && !SWEET_OK.has(f.ja)) continue;
      if (a.ja === "新鮮" && !FRESH_OK.has(f.ja)) continue;
      if (a.ja === "人気" && POPULAR_NG.has(f.ja)) continue;
      const g = degOf(a, fi + ai);
      yield item(`この${f.ja}は${g.ja}${a[g.jaf]}。`,
        `이 ${topicP(f.ko)} ${koDeg(a, g)}.`, `${cap(daThis(f))} er ${g.da} ${daAdj(a, f)}.`,
        `This ${f.en} is ${g.en} ${a.en}.`, "食事",
        "이=この。" + g.nko,
        g.nda + (a.da === a.da_n ? `この形容詞は en/et どちらの名詞でも同じ形(${a.da})です。`
          : `${f.g}名詞なので形容詞は「${daAdj(a, f)}」。`),
        "食べ物の感想は This ~ is ... で伝えられます。" + g.nen);
    }
  }
}],

["言語を学ぶ", 2, function* () {
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

["国へ行きたい", 2, function* () {
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
      "経験は現在完了(have been to ~)で表します。", 3);
  }
}],

["持っていますか", 1, function* () {
  for (const o of OBJECTS) {
    if (["furniture"].includes(o.tag) && ["窓", "ドア"].includes(o.ja)) continue;
    yield item(`${o.ja}を持っていますか?`,
      `${o.ko} 있어요?`, `Har du ${daIndef(o)}?`, `Do you have ${enIndef(o)}?`, "質問",
      "있어요=あります・持っています。없어요=ありません。",
      `have の現在形は har。${o.da}は${o.g}名詞。`,
      "Do you have ~? で所持を尋ねます。",
      { alt: {
          ko: "있어요? は 가지고 있어요? とも言えます(「持っている」ことをはっきり示せます)",
          en: "Do you have ~? は Have you got ~? とも言えます(イギリス英語でよく使います)",
        } });
  }
}],

["必要です", 2, function* () {
  for (const o of OBJECTS) {
    if (["窓", "ドア"].includes(o.ja)) continue;
    yield item(`${o.ja}が必要です。`,
      `${subjP(o.ko)} 필요해요.`, `Jeg har brug for ${daIndef(o)}.`, `I need ${enIndef(o)}.`, "日常",
      "「~이/가 필요해요」=「~が必要です」。助詞は이/가。",
      "har brug for ~ =「~が必要だ」。3語セットで覚えます。",
      "need のあとは目的語がそのまま続きます。",
      { alt: {
          ko: "필요해요 は 있어야 해요 とも言えます(「なければならない」寄りの意味)",
          da: "har brug for は behøver とも言えます(behøve のほうが短く言えます)",
        } });
  }
}],

["私の物はどこ", 2, function* () {
  for (const o of OBJECTS) {
    if (["窓", "ドア", "冷蔵庫", "洗濯機", "ベッド", "ソファ", "机", "テーブル", "鍵"].includes(o.ja)) continue;  // 鍵は複数形(keys)が自然なため除外
    yield item(`私の${o.ja}はどこですか?`,
      `제 ${topicP(o.ko)} 어디에 있어요?`, `Hvor er ${daMy(o)}?`, `Where is my ${o.en}?`, "質問",
      "제=私の(저의の縮約)。「어디에 있어요?」=「どこにありますか」。",
      `所有代名詞も性に一致。${o.g}名詞なので「${o.g === "en" ? "min" : "mit"}」。`,
      "my は性別・数に関係なく1種類だけ。");
  }
}],

["家族・知人の職業", 2, function* () {
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

["家族・知人の居場所", 2, function* () {
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

["会いました", 3, function* () {
  for (const [pi, p] of PEOPLE.entries()) {
    if (!p.human) continue;
    const t = pastOf(pi);
    yield item(`${t.ja}私の${p.ja}に会いました。`,
      `${t.ko} 제 ${objP(p.ko)} 만났어요.`, `Jeg mødte min ${p.da} ${t.da}.`, `I met my ${p.en} ${t.en}.`, "過去",
      "만나다は「~를/을 만나다」。日本語の「に会う」と助詞が違います。",
      `møde の過去形は mødte。${t.da}=${t.ja}。`,
      `meet の過去形は met(不規則動詞)。${t.en}=${t.ja}。`);
  }
}],

["天気", 1, function* () {
  for (const w of WEATHER) {
    yield item(`今日は${w.ja}です。`,
      `오늘은 ${w.ko}.`, w.da_c ? `${cap(w.da_c)} i dag.` : `Det er ${w.da} i dag.`, `It's ${w.en} today.`, "天気",
      w.ja === "風が強い" ? "세다=(風・力が)強い。바람=風。" : "오늘은=今日は。天気は形容詞の해요体をそのまま使えます。",
      w.da_c ? "blæse=風が吹く。動詞で表すのが自然です。" : "天気の文はふつう形式主語 Det で始めます。",
      "天気の主語は it。It's ~ today. が定番。",
      { alt: {
          da: "Det er ~ i dag は Vejret er ~ i dag とも言えます(vejr=天気)",
          en: "It's ~ today. は The weather is ~ today. とも言えます",
        } });
  }
}],

["遠いですか", 2, function* () {
  for (const p of PLACES) {
    yield item(`${p.ja}はここから遠いですか?`,
      `${subjP(p.ko)} 여기서 멀어요?`, `Er ${p.dad} langt herfra?`, `Is the ${p.en} far from here?`, "旅行",
      "여기서=ここから(여기에서の縮約)、멀다=遠い。",
      "herfra=ここから。距離の langt は主語の性に関係なく常にこの形です。",
      "far from here で「ここから遠い」。");
  }
}],

["趣味", 1, function* () {
  for (const h of HOBBIES) {
    yield item(`私の趣味は${h.ja}です。`,
      `제 취미는 ${copula(h.ko)}.`, `Min hobby er ${h.da}.`, `My hobby is ${h.en}.`, "自己紹介",
      "취미=趣味。名詞+이에요/예요で「~です」。",
      "「~すること」は at + 動詞の原形でも表せます(at læse=読むこと)。",
      "「~すること」は動名詞(-ing)。会話では I like ~ing もよく使います。");
  }
}],

["交通手段", 2, function* () {
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
      "Let's + 動詞の原形で提案します。", 3);
  }
}],

/* ----- 応用文型(D3) ----- */

["比較: ~より~が好き", 3, function* () {
  // 同カテゴリ同士で比較しないと不自然(コーヒーとパン等)
  const CATS = [
    ["コーヒー", "お茶", "ビール", "ワイン", "ジュース", "牛乳"],
    ["りんご", "バナナ", "オレンジ", "ぶどう", "いちご", "梨", "スイカ"],
    ["ケーキ", "クッキー", "チョコレート", "アイスクリーム"],
    ["パン", "スープ", "サラダ", "ピザ", "サンドイッチ", "パスタ", "カレー", "キムチ", "ご飯"],
    ["魚", "肉", "卵", "チーズ", "じゃがいも", "野菜"],
  ];
  const byJa = {};
  for (const f of FOODS) byJa[f.ja] = f;
  const pairs = [];
  for (const cat of CATS)
    for (let i = 0; i < cat.length; i++)
      pairs.push([byJa[cat[i]], byJa[cat[(i + 1) % cat.length]]]);
  for (const [a, b] of pairs) {
    if (!a || !b || a.ja === b.ja) continue;
    yield item(`私は${a.ja}より${b.ja}の方が好きです。`,
      `저는 ${a.ko}보다 ${objP(b.ko)} 더 좋아해요.`,
      `Jeg kan bedre lide ${b.dagen} end ${a.dagen}.`,
      `I like ${b.gen} better than ${a.gen}.`, "比較",
      "「A보다 B를 더 좋아해요」=「AよりBの方が好き」。보다=~より、더=もっと。",
      "kan bedre lide A end B =「BよりAが好き」。end=~より。",
      "like A better than B が口語の定番。more than でも可。");
  }
}],

["理由: 天気なので", 3, function* () {
  for (const w of WEATHER) {
    if (!w.ko_seo) continue;
    yield item(`今日は${w.ja}${w.ja === "曇り" ? "な" : ""}ので、家にいます。`,
      `오늘은 ${w.ko_seo} 집에 있어요.`,
      `Jeg bliver hjemme i dag, fordi ${w.da_c || "det er " + w.da}.`,
      `I'm staying home today because it's ${w.en}.`, "理由",
      "「~아/어서」=「~なので」(理由)。집=家。",
      "fordi=~だから。fordi のあとは主語+動詞の語順になります。",
      "because のあとに理由の文を続けます。stay home=家にいる。");
  }
}],

["依頼: 貸してもらえますか", 3, function* () {
  const LENDABLE = new Set(["本", "ペン", "鉛筆", "傘", "辞書", "自転車", "カメラ", "地図", "充電器"]);
  for (const o of OBJECTS) {
    if (!LENDABLE.has(o.ja)) continue;
    yield item(`${o.ja}を貸してもらえますか?`,
      `${o.ko} 좀 빌려주시겠어요?`,
      `Må jeg låne ${o.g === "en" ? "din" : "dit"} ${o.da}?`,
      `Could I borrow your ${o.en}?`, "依頼",
      "빌려주다=貸してくれる(빌리다「借りる」+주다「くれる」)。「~아/어 주시겠어요?」はとても丁寧な依頼。",
      `Må jeg låne ~? =「~を借りてもいい?」。「あなたの」も性に一致(${o.g}名詞→${o.g === "en" ? "din" : "dit"})。`,
      "borrow=借りる(lend=貸す と混同注意)。Could I ~? で丁寧に。",
      { alt: {
          ko: "빌려주시겠어요? は 빌려줄 수 있어요? とも言えます(気軽な言い方)",
          da: "Må jeg låne ~? は Kan jeg låne ~? とも言えます(よりくだけた言い方)",
          en: "Could I borrow ~? は Can I borrow ~? とも言えます(Can のほうがカジュアル)",
        } });
  }
}],

["経験: 食べたことがありますか", 3, function* () {
  const TRYABLE = new Set(["キムチ", "カレー", "スイカ", "梨", "ぶどう"]);  // tried のニュアンスに合う食品のみ
  for (const f of FOODS) {
    if (!TRYABLE.has(f.ja)) continue;
    yield item(`${f.ja}を食べたことがありますか?`,
      `${f.ko} 먹어 봤어요?`,
      `Har du smagt ${f.dagen}?`,
      `Have you ever tried ${f.gen}?`, "経験",
      "「먹어 봤어요?」=「食べてみたことある?」。~아/어 보다=~してみる。",
      "smage の過去分詞 smagt。Har du smagt ~? =「~を食べたことある?」",
      "食の経験は Have you ever tried ~? が自然(eaten より口語的)。",
      { alt: {
          ko: "먹어 봤어요? は 드셔 보셨어요? とも言えます(目上の人に使う尊敬表現)",
          da: "Har du smagt ~? は Har du prøvet ~? とも言えます(prøve=試す)",
          en: "Have you ever tried ~? は Have you ever had ~? とも言えます",
        } });
  }
}],

["頻度: どのくらい~しますか", 3, function* () {
  for (const a of ACTIONS) {
    const parts = a.da_p.split(" ");
    let daQ = `Hvor tit ${parts[0]} du${parts.length > 1 ? " " + parts.slice(1).join(" ") : ""}?`;
    if (a.ja_p === "勉強します") daQ = "Hvor tit læser du lektier?";  // studere は「専攻する」に聞こえるため
    yield item(`どのくらいの頻度で${a.ja_p.replace(/します$|ます$/, m => m === "します" ? "しますか" : "ますか")}?`,
      `얼마나 자주 ${a.ko_p.replace(/\.$/, "")}?`,
      daQ,
      `How often do you ${a.en_b.replace(/\bmy\b/g, "your")}?`, "頻度",
      "얼마나 자주=どのくらい頻繁に。動詞はそのまま해요体でOK。",
      "Hvor tit ~? =「どのくらいの頻度で?」。疑問詞のあとは動詞→主語の語順。",
      "How often do you ~? 答えは every day / twice a week など。", { alt: actAlt(a) });
  }
}],

/* ---------- 取りこぼし補強(否定・助動詞・接続詞・疑問詞) ---------- */

["be動詞の否定", 2, function* () {
  for (const j of JOBS) {
    yield item(`私は${j.ja}ではありません。`,
      `저는 ${subjP(j.ko)} 아니에요.`, `Jeg er ikke ${j.da}.`, `I'm not ${enIndef(j)}.`, "自己紹介",
      "「~가/이 아니에요」=「~ではありません」。이에요/예요 の否定形です。",
      "否定は動詞のあとに ikke。デンマーク語は職業名に冠詞をつけません。",
      `be動詞の否定は am/is/are のあとに not。職業には ${j.art} が必要です。`);
  }
  for (const o of OBJECTS) {
    yield item(`これは私の${o.ja}ではありません。`,
      `이건 제 ${subjP(o.ko)} 아니에요.`, `Det er ikke ${o.g === "en" ? "min" : "mit"} ${o.da}.`,
      `This isn't my ${o.en}.`, "描写",
      "이건=이것은の縮約。「~가/이 아니에요」で否定します。",
      `所有の min/mit も性に一致。${o.g}名詞なので「${o.g === "en" ? "min" : "mit"}」。`,
      "This is not = This isn't。短縮形は会話でよく使います。");
  }
}],

["can: ~できます", 3, function* () {
  for (const c of COUNTRIES) {
    yield item(`私は${c.lang_ja}を話せます。`,
      `저는 ${objP(c.lang_ko)} 할 수 있어요.`, `Jeg kan tale ${c.lang_da}.`, `I can speak ${c.lang_en}.`, "学習",
      "「~(으)ㄹ 수 있어요」=「~できます」。할 수 있어요 は하다の可能形。",
      "kan のあとは動詞の原形(不定詞)。at はつけません。",
      "can のあとは動詞の原形。can speak であって can to speak ではありません。");
  }
  const ABLE = [
    { ja: "泳げます",       ko: "수영할 수 있어요",   da: "svømme",   en: "swim" },
    { ja: "運転できます",   ko: "운전할 수 있어요",   da: "køre bil", en: "drive" },
    { ja: "料理できます",   ko: "요리할 수 있어요",   da: "lave mad", en: "cook" },
    { ja: "ギターを弾けます", ko: "기타를 칠 수 있어요", da: "spille guitar", en: "play the guitar" },
  ];
  for (const a of ABLE) {
    yield item(`私は${a.ja}。`,
      `저는 ${a.ko}.`, `Jeg kan ${a.da}.`, `I can ${a.en}.`, "日常",
      "「~(으)ㄹ 수 있어요」で能力を表します。",
      "kan + 原形で「~できる」。",
      "can + 動詞の原形で能力を表します。");
    yield item(`${a.ja.replace(/ます$/, "ますか")}?`,
      `${a.ko}?`, `Kan du ${a.da}?`, `Can you ${a.en}?`, "質問",
      "疑問文は語尾を上げるだけ。主語 당신은 はふつう省きます。",
      "疑問文は kan を文頭に出します(Kan du ~?)。",
      "Can you ~? で「~できますか」。答えは Yes, I can. / No, I can't.");
  }
}],

["will: ~するつもりです", 3, function* () {
  // デンマーク語は vil を未来に使うと「~したい」の意味になるため、現在形+時間表現で表す。
  // 韓国語の -(으)ㄹ게요 は語幹によって形が変わり機械的に作れないので、動詞ごとに書く。
  const WILL = [
    { ja: "勉強します",       ko: "공부할게요",      da: "studerer",      en: "study" },
    { ja: "働きます",         ko: "일할게요",        da: "arbejder",      en: "work" },
    { ja: "料理します",       ko: "요리할게요",      da: "laver mad",     en: "cook" },
    { ja: "掃除します",       ko: "청소할게요",      da: "gør rent",      en: "clean" },
    { ja: "電話します",       ko: "전화할게요",      da: "ringer",        en: "call you" },
    { ja: "本を読みます",     ko: "책을 읽을게요",   da: "læser en bog",  en: "read a book" },
    { ja: "手紙を書きます",   ko: "편지를 쓸게요",   da: "skriver et brev", en: "write a letter" },
    { ja: "コーヒーを飲みます", ko: "커피를 마실게요", da: "drikker kaffe", en: "drink coffee" },
    { ja: "早く起きます",     ko: "일찍 일어날게요", da: "står tidligt op", en: "get up early" },
    { ja: "運動します",       ko: "운동할게요",      da: "træner",        en: "exercise" },
  ];
  for (const [i, w] of WILL.entries()) {
    const t = futureOf(i);
    yield item(`${t.ja}${w.ja.replace(/ます$/, "ますね")}。`,
      `${t.ko} ${w.ko}.`, `Jeg ${w.da} ${t.da}.`, `I'll ${w.en} ${t.en}.`, "予定",
      `その場で決めたことは -(으)ㄹ게요。「~しますね」に近い言い方です。${t.ko}=${t.ja}。`,
      `デンマーク語は未来にも現在形を使います。vil を使うと「~したい」の意味になるので注意。${t.da}=${t.ja}。`,
      "will はその場で決めたこと、be going to は前から決めていたことに使います。");
  }
  for (const [wi, w] of WEATHER.entries()) {
    const t = futureOf(wi);
    yield item(`${t.ja}は${w.ja}でしょう。`,
      `${topicP(t.ko)} ${w.ko_will}.`,
      w.da_c ? `${cap(w.da_c)} ${t.da}.` : `Det bliver ${w.da} ${t.da}.`,
      `It will be ${w.en} ${t.en}.`, "天気",
      "推量は -(으)ㄹ 거예요。「~でしょう」にあたります。",
      "未来の天気は Det bliver ~(~になる)。bliver が未来を表します。",
      "It will be ~ で天気の予想。It's going to be ~ とも言えます。");
  }
}],

["and / but: 2つの文をつなぐ", 3, function* () {
  for (const [i, f] of FOODS.entries()) {
    const g = FOODS[(i + 5) % FOODS.length];
    if (f.ja === g.ja) continue;
    yield item(`私は${f.ja}が好きですが、${g.ja}は好きではありません。`,
      `저는 ${objP(f.ko)} 좋아하지만 ${topicP(g.ko)} 안 좋아해요.`,
      `Jeg kan godt lide ${f.dagen}, men jeg kan ikke lide ${g.dagen}.`,
      `I like ${f.gen}, but I don't like ${g.gen}.`, "好み",
      "「~지만」=「~だが」。動詞・形容詞の語幹につけます。",
      "men=しかし。2つの文をつなぐときは前にコンマを打ちます。",
      "but の前にはコンマを打ちます。前後は独立した文の形にします。");
    if (i % 3 !== 0) continue;
    yield item(`私は${f.ja}と${g.ja}が好きです。`,
      `저는 ${f.ko}와/과 ${objP(g.ko)} 좋아해요.`.replace(/와\/과/, hasBatchim(f.ko) ? "과" : "와"),
      `Jeg kan godt lide ${f.dagen} og ${g.dagen}.`,
      `I like ${f.gen} and ${g.gen}.`, "好み",
      `名詞をつなぐ「~と」は 와/과。${f.ko}はパッチム${bat(f.ko)}→${hasBatchim(f.ko) ? "과" : "와"}。`,
      "og=~と。名詞どうしをつなぐときはコンマ不要です。",
      "and で名詞をつなぐときはコンマ不要です。");
  }
}],

["疑問詞: だれ・いつ・なぜ", 3, function* () {
  for (const p of PEOPLE) {
    if (!p.human) continue;
    yield item(`あの人はだれですか?`,
      `저 사람은 누구예요?`, `Hvem er den person?`, `Who is that person?`, "質問",
      "누구=だれ。「누구예요?」で「だれですか?」。",
      "hvem=だれ。疑問詞のあとは動詞→主語の語順です。",
      "Who is ~? で人をたずねます。", 3);
    break;
  }
  for (const [pi, p] of PEOPLE.entries()) {
    if (!p.human) continue;
    yield item(`あなたの${p.ja}はどこで働いていますか?`,
      `${topicP(p.ko)} 어디에서 일해요?`, `Hvor arbejder din ${p.da}?`, `Where does your ${p.en} work?`, "質問",
      "어디에서=どこで。場所+에서 で動作の場所を表します。",
      "疑問詞が文頭に来ると、動詞→主語の語順(倒置)になります。",
      "疑問詞 + does + 主語 + 動詞の原形。works ではなく work になります。");
    if (pi % 2) continue;
    yield item(`あなたの${p.ja}の誕生日はいつですか?`,
      `${topicP(p.ko)} 생일이 언제예요?`, `Hvornår har din ${p.da} fødselsdag?`, `When is your ${p.en}'s birthday?`, "質問",
      "언제=いつ。생일=誕生日。",
      "デンマーク語は「誕生日を持つ(har fødselsdag)」と言います。",
      "所有の 's は人につけます(your father's birthday)。");
  }
  for (const [ci, c] of COUNTRIES.entries()) {
    if (ci % 2) continue;
    yield item(`なぜ${c.lang_ja}を勉強しているのですか?`,
      `왜 ${objP(c.lang_ko)} 공부해요?`, `Hvorfor lærer du ${c.lang_da}?`, `Why do you study ${c.lang_en}?`, "質問",
      "왜=なぜ。理由を聞くときに使います。",
      "hvorfor=なぜ。疑問詞のあとは動詞→主語。",
      "Why do you ~? で理由をたずねます。答えは Because ~.");
  }
}],

["頻度副詞: いつも・たいてい・ときどき", 3, function* () {
  const FREQ = [
    { ja: "いつも",   ko: "항상",    da: "altid",         en: "always",    neg: false },
    { ja: "たいてい", ko: "보통",    da: "normalt",       en: "usually",   neg: false },
    { ja: "ときどき", ko: "가끔",    da: "nogle gange",   en: "sometimes", neg: false },
    { ja: "まったく", ko: "전혀 안", da: "aldrig",        en: "never",     neg: true },
  ];
  for (const [ai, a] of ACTIONS.entries()) {
    const f = FREQ[ai % FREQ.length];
    yield item(f.neg ? `私はまったく${a.ja_p.replace(/ます$/, "ません")}。` : `私は${f.ja}${a.ja_p}。`,
      `저는 ${koAdvIn(a.ko_p, f.ko)}.`, `Jeg ${daAdvIn(a.da_p, f.da)}.`, `I ${f.en} ${a.en_b}.`, "日常",
      f.neg ? "전혀 안 ~=まったく~ない。전혀 は否定と一緒に使います。"
            : `${f.ko}=${f.ja}。頻度の副詞は動詞の前に置きます。`,
      `デンマーク語の頻度副詞は動詞のすぐあと(目的語より前)に置きます。${f.da}=${f.ja}。`,
      f.neg ? "never は it自体が否定なので don't は不要です(I never ~)。"
            : "英語の頻度副詞は一般動詞の前、be動詞のあとに置きます。", { alt: actAlt(a) });
  }
}],

/* ---------- 発展文型(D4): 助動詞・比較・完了・SVOO/SVOC ---------- */

["should / have to: ~したほうがいい", 4, function* () {
  // 韓国語の -아/어야 해요 は語幹で形が変わるため動詞ごとに書く
  const DUTY = [
    { ja: "もっと野菜を食べた",   ko: "채소를 더 먹어야",   da: "spise flere grøntsager", en: "eat more vegetables" },
    { ja: "もっと運動した",       ko: "운동을 더 해야",     da: "træne mere",             en: "exercise more" },
    { ja: "早く寝た",             ko: "일찍 자야",          da: "gå tidligt i seng",      en: "go to bed early" },
    { ja: "水をたくさん飲んだ",   ko: "물을 많이 마셔야",   da: "drikke meget vand",      en: "drink a lot of water" },
    { ja: "毎日勉強した",         ko: "매일 공부해야",      da: "studere hver dag",       en: "study every day" },
    { ja: "медленно話した",       ko: "천천히 말해야",      da: "tale langsomt",          en: "speak slowly" },
  ];
  for (const d of DUTY) {
    yield item(`あなたは${d.ja}ほうがいいです。`,
      `${d.ko} 해요.`, `Du bør ${d.da}.`, `You should ${d.en}.`, "助言",
      "「~아/어야 해요」=「~しなければならない・~したほうがいい」。",
      "bør=~したほうがいい。あとは動詞の原形(at なし)。",
      "should + 動詞の原形で助言を表します。to はつけません。");
    yield item(`私は${d.ja}ほうがいいです。`,
      `저는 ${d.ko} 해요.`, `Jeg skal ${d.da}.`, `I have to ${d.en}.`, "助言",
      "主語が私のときも形は同じ。저는 をつけると誰の話かはっきりします。",
      "skal は「~しなければならない」。bør(~したほうがいい)より強い言い方です。",
      "have to は「~しなければならない」。should より義務が強い言い方です。");
  }
}],

["比較級: ~より~です", 4, function* () {
  for (const [oi, o] of OBJECTS.entries()) {
    const q = OBJECTS[(oi + 4) % OBJECTS.length];
    if (o.ja === q.ja || o.tag !== q.tag) continue;
    for (const [ai, a] of ADJS.entries()) {
      if (!a.ok.split(" ").includes(o.tag)) continue;
      if ((oi + ai) % 4) continue;                        // 全組だと多すぎるので間引く
      yield item(`この${o.ja}はあの${q.ja}より${a.jp}。`,
        `이 ${topicP(o.ko)} 저 ${q.ko}보다 더 ${a.ko_p}.`,
        `${cap(daThis(o))} er ${a.da_er} end ${daThat(q)}.`,
        `This ${o.en} is ${a.en_er} than that ${q.en}.`, "比較",
        "「~보다 더 ~」=「~より もっと ~」。보다 が比較の助詞です。",
        `比較級は -ere か mere +形容詞。${a.da}→${a.da_er}。end=~より。`,
        `比較級は -er か more +形容詞。${a.en}→${a.en_er}。than=~より。`);
    }
  }
}],

["最上級: いちばん~です", 4, function* () {
  for (const [pi, p] of PLACES.entries()) {
    for (const [ai, a] of ADJS.entries()) {
      if (!a.ok.split(" ").includes(p.tag)) continue;
      if ((pi + ai) % 5) continue;
      yield item(`これがこの町でいちばん${a.jp_adn}${p.ja}です。`,
        `이게 이 동네에서 제일 ${koAdnom(a)} ${copula(p.ko)}.`,
        `${cap(p.g === "en" ? "det er den" : "det er det")} ${a.da_est}e ${p.da} i byen.`,
        `This is the ${a.en_est} ${p.en} in town.`, "比較",
        "제일=いちばん。「제일 + 形容詞の連体形 + 名詞」の順です。가장 とも言えます。",
        `最上級は -est か mest +形容詞。名詞の前では語尾に -e がつきます(${a.da_est}e)。`,
        `最上級には the をつけます。${a.en}→the ${a.en_est}。`);
    }
  }
}],

["as ... as: ~と同じくらい", 4, function* () {
  for (const [oi, o] of OBJECTS.entries()) {
    const q = OBJECTS[(oi + 7) % OBJECTS.length];
    if (o.ja === q.ja || o.tag !== q.tag) continue;
    for (const [ai, a] of ADJS.entries()) {
      if (!a.ok.split(" ").includes(o.tag)) continue;
      if ((oi + ai) % 6) continue;
      yield item(`この${o.ja}はあの${q.ja}と同じくらい${a.jp}。`,
        `이 ${topicP(o.ko)} 저 ${q.ko}만큼 ${a.ko_p}.`,
        `${cap(daThis(o))} er lige så ${daAdj(a, o)} som ${daThat(q)}.`,
        `This ${o.en} is as ${a.en} as that ${q.en}.`, "比較",
        "「~만큼」=「~と同じくらい」。比較級とちがい形容詞はそのままの形です。",
        "lige så ~ som … =「…と同じくらい~」。形容詞は元の形のまま使います。",
        "as + 形容詞の原級 + as。比較級(-er)にはしません。");
    }
  }
}],

["現在完了: ~したことがあります", 4, function* () {
  for (const [ci, c] of COUNTRIES.entries()) {
    const times = ["一度", "二回", "三回"][ci % 3];
    const koT = { 一度: "한 번", 二回: "두 번", 三回: "세 번" }[times];
    const enT = { 一度: "once", 二回: "twice", 三回: "three times" }[times];
    const daT = { 一度: "én gang", 二回: "to gange", 三回: "tre gange" }[times];
    yield item(`私は${times}${c.ja}に行ったことがあります。`,
      `저는 ${c.ko}에 ${koT} 가 봤어요.`, `Jeg har været i ${c.da} ${daT}.`,
      `I have been to ${c.en} ${enT}.`, "経験",
      "「~아/어 봤어요」=「~してみた・~したことがある」。回数は動詞の前に置きます。",
      "現在完了は har + 過去分詞。være の過去分詞は været。",
      "have been to ~ =「~に行ったことがある」。have gone to だと「行ってしまった」になります。");
  }
  const DONE = [
    { ja: "昼ごはんを食べ",   ko: "점심을 막 먹었어요",   da: "har lige spist frokost",  en: "have just finished lunch" },
    { ja: "宿題を終え",       ko: "숙제를 막 끝냈어요",   da: "har lige lavet lektier",  en: "have just finished my homework" },
    { ja: "その本を読み",     ko: "그 책을 막 읽었어요",  da: "har lige læst den bog",   en: "have just read that book" },
    { ja: "部屋を掃除し",     ko: "방을 막 청소했어요",   da: "har lige gjort rent",     en: "have just cleaned my room" },
  ];
  for (const d of DONE) {
    yield item(`私はちょうど${d.ja}たところです。`,
      `저는 ${d.ko}.`, `Jeg ${d.da}.`, `I ${d.en}.`, "日常",
      "막=ちょうど今。「막 ~했어요」で直前の完了を表します。",
      "lige=ちょうど。har lige + 過去分詞で「~したばかり」。",
      "have just + 過去分詞で「~したばかり」。完了の意味です。");
  }
}],

["if / when: ~なら・~のとき", 4, function* () {
  for (const [wi, w] of WEATHER.entries()) {
    yield item(`${w.ja_ba}、家にいます。`,
      `${w.ko_myeon} 집에 있을 거예요.`,
      `Hvis ${w.da_c ? "det blæser meget" : `det er ${w.da}`}, bliver jeg hjemme.`,
      `If it is ${w.en}, I'll stay home.`, "理由",
      "「~(으)면」=「~なら」。条件を表す語尾です。",
      "hvis=もし。条件節のあとは主節が動詞→主語の語順になります(bliver jeg)。",
      "if の中は未来のことでも現在形で書きます(If it is ~, I'll ~)。");
  }
  for (const [ai, a] of ACTIONS.entries()) {
    if (ai % 4) continue;
    yield item(`時間があるとき、私は${a.ja_p}。`,
      `시간이 있을 때 저는 ${a.ko_p}.`, `Når jeg har tid, ${daInvert(a.da_p)}.`,
      `When I have time, I ${a.en_b}.`, "日常",
      "「~(으)ㄹ 때」=「~のとき」。있을 때=あるとき。",
      "når=~のとき(くり返し)。従属節が先に来ると主節は動詞→主語の語順です。",
      "when 節の中は未来でも現在形。文頭に置いたらコンマで区切ります。");
  }
}],

["SVOO: ~に~をあげます", 4, function* () {
  for (const [pi, p] of PEOPLE.entries()) {
    if (!p.human) continue;
    const o = OBJECTS[(pi * 3) % OBJECTS.length];
    const t = pastOf(pi);
    yield item(`私は${t.ja}${p.ja}に${o.ja}をあげました。`,
      `저는 ${t.ko} ${p.ko}에게 ${objP(o.ko)} 줬어요.`,
      `Jeg gav min ${p.da} ${enIndefDa(o)} ${t.da}.`,
      `I gave my ${p.en} ${enIndef(o)} ${t.en}.`, "日常",
      "「~에게 ~을/를 줬어요」=「~に~をあげた」。에게 は人につく助詞です。",
      "give の過去形は gav。「人+もの」の順に並べます。",
      "give + 人 + もの の語順。give something to someone とも言えます。");
    yield item(`私は${p.ja}に${o.ja}を見せました。`,
      `저는 ${p.ko}에게 ${objP(o.ko)} 보여줬어요.`,
      `Jeg viste min ${p.da} ${enIndefDa(o)}.`,
      `I showed my ${p.en} ${enIndef(o)}.`, "日常",
      "보여주다=見せる。보다(見る)の使役形です。",
      "vise の過去形は viste。give と同じく「人+もの」の順です。",
      "show + 人 + もの。give と同じ形をとる動詞です。");
  }
}],

["SVOC: ~を~と呼びます", 4, function* () {
  const CALL = [
    { ja: "私の友達は私をユウと呼びます。", ko: "제 친구는 저를 유우라고 불러요.", da: "Min ven kalder mig Yu.", en: "My friend calls me Yu." },
    { ja: "みんなは彼をケンと呼びます。",   ko: "다들 그를 켄이라고 불러요.",      da: "Alle kalder ham Ken.",   en: "Everyone calls him Ken." },
    { ja: "私たちはこの犬をモモと呼びます。", ko: "우리는 이 개를 모모라고 불러요.", da: "Vi kalder denne hund Momo.", en: "We call this dog Momo." },
  ];
  for (const c of CALL) {
    yield item(c.ja, c.ko, c.da, c.en, "日常",
      "「~을/를 ~라고 부르다」=「~を~と呼ぶ」。라고 が引用の助詞です。",
      "kalde + 目的語 + 名前。前置詞は入りません。",
      "call + 目的語 + 補語(呼び名)。前置詞は入りません。");
  }
  for (const [hi, h] of HUMAN_ADJS.entries()) {
    if (hi % 2) continue;
    yield item(`その知らせは私を${h.jp_make}。`,
      `그 소식은 저를 ${h.ko_st}게 했어요.`, `Nyheden gjorde mig ${h.da}.`,
      `The news made me ${h.en}.`, "日常",
      "「~게 하다」=「~(の状態)にする」。形容詞の語幹に -게 하다 をつけます。",
      "gøre + 目的語 + 形容詞。gøre の過去形は gjorde。",
      "make + 目的語 + 形容詞で「~を~の状態にする」。");
  }
}],

["become: ~になりました", 4, function* () {
  for (const [pi, p] of PEOPLE.entries()) {
    if (!p.human) continue;
    const j = JOBS[(pi * 2) % JOBS.length];
    yield item(`私の${p.ja}は${j.ja}になりました。`,
      `제 ${topicP(p.ko)} ${subjP(j.ko)} 됐어요.`, `Min ${p.da} blev ${j.da}.`,
      `My ${p.en} became ${enIndef(j)}.`, "自己紹介",
      "「~가/이 되다」=「~になる」。助詞は을/를 ではなく 가/이 です。",
      "blive の過去形は blev。職業には冠詞をつけません。",
      "become の過去形は became。職業には a/an が必要です。");
  }
  for (const [wi, w] of WEATHER.entries()) {
    yield item(`${pastOf(wi).ja}、${w.ja_ku}なりました。`,
      `${pastOf(wi).ko} ${w.ko_became}.`,
      `Det blev ${w.da} ${pastOf(wi).da}.`, `It became ${w.en} ${pastOf(wi).en}.`, "天気",
      "「~아/어졌어요」=「~くなった」。状態の変化を表します。",
      "天気の変化も blive で表します(Det blev ~)。",
      "become の過去形は became。got ~ とも言えます。");
  }
}],

["look: ~に見えます", 4, function* () {
  for (const h of HUMAN_ADJS) {
    yield item(`あなたは${h.jp_look}。`,
      `${koStem(h.ko_p)} 보여요.`, `Du ser ${h.da} ud.`, `You look ${h.en}.`, "描写",
      "「~아/어 보여요」=「~に見える」。해요体の요を取って 보여요 をつけます。",
      "se ~ ud で「~に見える」。ud が文の最後に来るのがポイントです。",
      "look + 形容詞で「~に見える」。look like のあとは名詞です。");
  }
  for (const [fi, f] of FOODS.entries()) {
    if (fi % 3) continue;
    yield item(`この${f.ja}はおいしそうです。`,
      `이 ${topicP(f.ko)} 맛있어 보여요.`, `${cap(daThis(f))} ser lækker ud.`,
      `This ${f.en} looks delicious.`, "食事",
      "맛있어 보여요=おいしそうに見える。",
      "se lækker ud=おいしそうに見える。",
      "look + 形容詞。looks delicious で「おいしそう」。");
  }
}],

["There is: ~があります", 4, function* () {
  for (const [pi, p] of PLACES.entries()) {
    const q = PLACES[(pi + 6) % PLACES.length];
    if (p.ja === q.ja) continue;
    yield item(`${q.ja}の近くに${p.ja}があります。`,
      `${q.ko} 근처에 ${subjP(p.ko)} 있어요.`, `Der er ${enIndefDa(p)} i nærheden af ${q.dad}.`,
      `There is ${enIndef(p)} near the ${q.en}.`, "描写",
      "「~에 ~가/이 있어요」=「~に~があります」。場所には 에 がつきます。",
      "Der er ~ =「~がある」。der は形式主語です。",
      "There is + 単数名詞。複数なら There are になります。");
  }
}],

["過去進行形: ~していました", 4, function* () {
  // 韓国語の -고 있었어요 は辞書形の語幹につくが、해요体からは機械的に作れないので動詞ごとに書く
  const PROG = [
    { ja: "勉強していました",     ko: "공부하고 있었어요",   da: "studere",       en: "studying" },
    { ja: "働いていました",       ko: "일하고 있었어요",     da: "arbejde",       en: "working" },
    { ja: "料理していました",     ko: "요리하고 있었어요",   da: "lave mad",      en: "cooking" },
    { ja: "本を読んでいました",   ko: "책을 읽고 있었어요",  da: "læse en bog",   en: "reading a book" },
    { ja: "音楽を聞いていました", ko: "음악을 듣고 있었어요", da: "høre musik",   en: "listening to music" },
    { ja: "映画を見ていました",   ko: "영화를 보고 있었어요", da: "se en film",   en: "watching a movie" },
    { ja: "手紙を書いていました", ko: "편지를 쓰고 있었어요", da: "skrive et brev", en: "writing a letter" },
    { ja: "走っていました",       ko: "달리고 있었어요",     da: "løbe",          en: "running" },
  ];
  for (const [i, g] of PROG.entries()) {
    const t = PASTS[i % 3];   // 昨日/今朝/昨晩。「先週の8時」は時刻と噛み合わないので使わない
    yield item(`${t.ja}の8時に私は${g.ja}。`,
      `${t.ko} 여덟 시에 저는 ${g.ko}.`,
      `Klokken otte ${t.da} var jeg ved at ${g.da}.`,
      `I was ${g.en} at eight ${t.en}.`, "過去",
      "「~고 있었어요」=「~していました」。動詞の語幹に -고 있다 をつけます。",
      "var ved at + 動詞の原形で「~しているところだった」。デンマーク語に進行形の専用形はありません。",
      "was/were + -ing で、過去のある時点で進行中だったことを表します。");
  }
}],

["that節: ~だと思います", 4, function* () {
  for (const [hi, h] of HUMAN_ADJS.entries()) {
    yield item(`私の友達は${h.jp_that}と思います。`,
      `제 친구는 ${h.ko_that || h.ko_st}다고 생각해요.`, `Jeg tror, at min ven er ${h.da}.`,
      `I think that my friend is ${h.en}.`, "日常",
      "「~다고 생각해요」=「~だと思う」。다고 が引用の語尾です。",
      "tro, at ~ =「~だと思う」。デンマーク語は at の前にコンマを打ちます。",
      "think that ~。この that は省略できます(I think my friend is ~)。");
    if (hi % 2) continue;
    yield item(`彼女は${h.jp_that.replace(/だ$/, "だった").replace(/いる$/, "いた").replace(/しい$/, "しかった").replace(/眠い$/, "眠かった")}と言いました。`,
      `그녀는 ${h.ko_that || h.ko_st}다고 말했어요.`, `Hun sagde, at hun var ${h.da}.`,
      `She told me that she was ${h.en}.`, "日常",
      "「~다고 말했어요」=「~だと言った」。",
      "sige の過去形は sagde。従属節の前にコンマを打ちます。",
      "tell + 人 + that節。主節が過去形なので that節も過去形にします(時制の一致)。");
  }
}],

/* ---------- 上級文型(D5): 後置修飾・関係代名詞・間接疑問・受身・仮定法 ----------
 * 韓国語の連体形とデンマーク語の関係節は語ごとに形が変わり機械的に作れないので、
 * 語彙の総当たりではなく1文ずつ手書きしている(質を量より優先)。
 * デンマーク語の関係節は主格 der / 目的格 som を使い、コンマは文法コンマ方式で統一。 */

["後置修飾: 前置詞句", 4, function* () {
  const P = [
    { ja: "机の上の本は私のです。",        ko: "책상 위의 책은 제 거예요.",       da: "Bogen på bordet er min.",              en: "The book on the desk is mine." },
    { ja: "壁の絵はとても古いです。",      ko: "벽에 있는 그림은 아주 오래됐어요.", da: "Billedet på væggen er meget gammelt.", en: "The picture on the wall is very old." },
    { ja: "窓のそばの椅子は空いています。", ko: "창문 옆의 의자는 비어 있어요.",   da: "Stolen ved vinduet er ledig.",         en: "The chair by the window is free." },
    { ja: "青い服の女性は私の先生です。",  ko: "파란 옷을 입은 여자는 제 선생님이에요.", da: "Kvinden i det blå tøj er min lærer.", en: "The woman in the blue dress is my teacher." },
    { ja: "駅の前のカフェは新しいです。",  ko: "역 앞의 카페는 새로워요.",        da: "Caféen foran stationen er ny.",        en: "The café in front of the station is new." },
    { ja: "テーブルの上の鍵はだれのですか?", ko: "테이블 위의 열쇠는 누구 거예요?", da: "Hvis er nøglen på bordet?",          en: "Whose is the key on the table?" },
  ];
  for (const x of P) {
    yield item(x.ja, x.ko, x.da, x.en, "描写",
      "「~의」「~에 있는」で名詞を後ろから修飾します。韓国語は修飾語が名詞の前に来ます。",
      "デンマーク語は前置詞句を名詞のあとに置きます(bogen på bordet)。",
      "英語も前置詞句は名詞のあと。日本語と語順が逆になります。");
  }
}],

["後置修飾: 分詞", 5, function* () {
  const P = [
    { ja: "あそこに立っている男性は私の先生です。", ko: "저기 서 있는 남자는 제 선생님이에요.", da: "Manden, der står derovre, er min lærer.", en: "The man standing over there is my teacher." },
    { ja: "ピアノを弾いている少女は私の妹です。",   ko: "피아노를 치는 소녀는 제 여동생이에요.", da: "Pigen, der spiller klaver, er min lillesøster.", en: "The girl playing the piano is my sister." },
    { ja: "英語で書かれた本を読んでいます。",       ko: "영어로 쓰인 책을 읽고 있어요.",       da: "Jeg læser en bog skrevet på engelsk.",   en: "I'm reading a book written in English." },
    { ja: "壁にかけられた絵はとても有名です。",     ko: "벽에 걸린 그림은 아주 유명해요.",     da: "Billedet, der hænger på væggen, er meget berømt.", en: "The picture hanging on the wall is very famous." },
    { ja: "向こうで待っている人はだれですか?",     ko: "저기서 기다리는 사람은 누구예요?",    da: "Hvem er personen, der venter derovre?",  en: "Who is the person waiting over there?" },
    { ja: "韓国で作られた車を買いました。",         ko: "한국에서 만든 차를 샀어요.",          da: "Jeg købte en bil lavet i Korea.",        en: "I bought a car made in Korea." },
    { ja: "公園で遊んでいる子どもたちは楽しそうです。", ko: "공원에서 노는 아이들은 즐거워 보여요.", da: "Børnene, der leger i parken, ser glade ud.", en: "The children playing in the park look happy." },
    { ja: "電話で話している男性は私の父です。",     ko: "전화로 통화하는 남자는 제 아버지예요.", da: "Manden, der taler i telefon, er min far.", en: "The man talking on the phone is my father." },
    { ja: "そこに座っている女性を知っていますか?", ko: "거기 앉아 있는 여자를 알아요?",     da: "Kender du kvinden, der sidder der?",     en: "Do you know the woman sitting there?" },
    { ja: "日本で撮られた写真を見せますね。",       ko: "일본에서 찍은 사진을 보여줄게요.",   da: "Jeg viser dig et billede taget i Japan.", en: "I'll show you a photo taken in Japan." },
    { ja: "窓のそばで本を読んでいる人は先生です。", ko: "창가에서 책을 읽는 사람은 선생님이에요.", da: "Personen, der læser en bog ved vinduet, er læreren.", en: "The person reading a book by the window is the teacher." },
    { ja: "韓国語で書かれたメールを受け取りました。", ko: "한국어로 쓰인 이메일을 받았어요.", da: "Jeg modtog en mail skrevet på koreansk.", en: "I received an email written in Korean." },
    { ja: "道で泣いている子どもを見ました。",       ko: "길에서 우는 아이를 봤어요.",         da: "Jeg så et barn, der græd på gaden.",     en: "I saw a child crying on the street." },
    { ja: "木の下で眠っている犬がいます。",         ko: "나무 아래에서 자는 개가 있어요.",    da: "Der er en hund, der sover under træet.", en: "There is a dog sleeping under the tree." },
    { ja: "隣に住んでいる家族はとても親切です。",   ko: "옆집에 사는 가족은 아주 친절해요.",  da: "Familien, der bor ved siden af, er meget venlig.", en: "The family living next door is very kind." },
    { ja: "テーブルに置かれた花はきれいです。",     ko: "테이블에 놓인 꽃은 예뻐요.",         da: "Blomsterne, der står på bordet, er smukke.", en: "The flowers placed on the table are beautiful." },
    { ja: "フランスで作られたチーズを買いました。", ko: "프랑스에서 만든 치즈를 샀어요.",     da: "Jeg købte ost lavet i Frankrig.",        en: "I bought cheese made in France." },
  ];
  for (const x of P) {
    yield item(x.ja, x.ko, x.da, x.en, "描写",
      "現在分詞は -는、過去分詞は -(으)ㄴ/-인 の連体形にあたります。修飾語は名詞の前です。",
      "分詞で修飾するときは名詞のあと。動詞つきの節にする場合は der で受けます。",
      "現在分詞(-ing)は「~している」、過去分詞は「~される」。どちらも名詞のあとに置きます。");
  }
}],

["関係代名詞: 主格(who / that)", 5, function* () {
  const R = [
    { ja: "私にはデンマークに住んでいる友達がいます。", ko: "저는 덴마크에 사는 친구가 있어요.",   da: "Jeg har en ven, der bor i Danmark.",       en: "I have a friend who lives in Denmark." },
    { ja: "病院で働いている姉がいます。",               ko: "저는 병원에서 일하는 누나가 있어요.", da: "Jeg har en søster, der arbejder på et hospital.", en: "I have a sister who works at a hospital." },
    { ja: "韓国語を教えている先生を知っています。",     ko: "저는 한국어를 가르치는 선생님을 알아요.", da: "Jeg kender en lærer, der underviser i koreansk.", en: "I know a teacher who teaches Korean." },
    { ja: "駅の前に立っている建物はとても古いです。",   ko: "역 앞에 서 있는 건물은 아주 오래됐어요.", da: "Bygningen, der står foran stationen, er meget gammel.", en: "The building that stands in front of the station is very old." },
    { ja: "毎日走る人は健康です。",                     ko: "매일 달리는 사람은 건강해요.",        da: "Folk, der løber hver dag, er raske.",      en: "People who run every day are healthy." },
    { ja: "3か国語を話す友達がいます。",                ko: "저는 3개 국어를 하는 친구가 있어요.", da: "Jeg har en ven, der taler tre sprog.",     en: "I have a friend who speaks three languages." },
    { ja: "パンを売っている店を探しています。",       ko: "빵을 파는 가게를 찾고 있어요.",     da: "Jeg leder efter en butik, der sælger brød.", en: "I'm looking for a shop that sells bread." },
    { ja: "海の見えるホテルに泊まりました。",         ko: "바다가 보이는 호텔에 묵었어요.",     da: "Jeg boede på et hotel, der har havudsigt.", en: "I stayed at a hotel that has an ocean view." },
    { ja: "駅の近くに住んでいる友達がいます。",       ko: "저는 역 근처에 사는 친구가 있어요.", da: "Jeg har en ven, der bor tæt på stationen.", en: "I have a friend who lives near the station." },
    { ja: "일요日に開いているカフェを知っていますか?", ko: "일요일에 여는 카페를 알아요?",      da: "Kender du en café, der har åbent om søndagen?", en: "Do you know a café that is open on Sundays?" },
    { ja: "音楽が好きな人はここに集まります。",       ko: "음악을 좋아하는 사람은 여기에 모여요.", da: "Folk, der kan lide musik, mødes her.",   en: "People who like music gather here." },
    { ja: "とてもよく走るバスがあります。",           ko: "아주 잘 달리는 버스가 있어요.",      da: "Der er en bus, der kører meget godt.",   en: "There is a bus that runs very well." },
    { ja: "空港で働いている兄がいます。",             ko: "저는 공항에서 일하는 형이 있어요.",  da: "Jeg har en bror, der arbejder i lufthavnen.", en: "I have a brother who works at the airport." },
    { ja: "毎朝早く起きる人は元気です。",             ko: "매일 아침 일찍 일어나는 사람은 건강해요.", da: "Folk, der står tidligt op hver morgen, er raske.", en: "People who get up early every morning are healthy." },
    { ja: "私を助けてくれた人にお礼を言いました。",   ko: "저를 도와준 사람에게 감사 인사를 했어요.", da: "Jeg takkede personen, der hjalp mig.", en: "I thanked the person who helped me." },
    { ja: "デンマーク語を教えている学校を探しています。", ko: "덴마크어를 가르치는 학교를 찾고 있어요.", da: "Jeg leder efter en skole, der underviser i dansk.", en: "I'm looking for a school that teaches Danish." },
    { ja: "この町には有名な絵がある美術館があります。", ko: "이 동네에는 유명한 그림이 있는 미술관이 있어요.", da: "I denne by er der et museum, der har berømte malerier.", en: "In this town there is a museum that has famous paintings." },
  ];
  for (const x of R) {
    yield item(x.ja, x.ko, x.da, x.en, "描写",
      "韓国語に関係代名詞はありません。動詞を連体形(-는)にして名詞の前に置きます。",
      "主語の働きをする関係代名詞は der。名詞のあとにコンマを打って続けます。",
      "人が先行詞なら who、物なら that/which。関係代名詞が主語なので直後に動詞が来ます。");
  }
}],

["関係代名詞: 目的格(that / which)", 5, function* () {
  const R = [
    { ja: "これは私が昨日買った本です。",           ko: "이건 제가 어제 산 책이에요.",        da: "Det er den bog, jeg købte i går.",          en: "This is the book that I bought yesterday." },
    { ja: "彼女が作った料理はとてもおいしかったです。", ko: "그녀가 만든 요리는 아주 맛있었어요.", da: "Maden, hun lavede, var meget lækker.",     en: "The food she made was really delicious." },
    { ja: "私が先週見た映画は面白かったです。",     ko: "제가 지난주에 본 영화는 재미있었어요.", da: "Filmen, jeg så i sidste uge, var sjov.",   en: "The movie I saw last week was fun." },
    { ja: "これは父がくれた腕時計です。",           ko: "이건 아버지가 주신 시계예요.",        da: "Det er det ur, min far gav mig.",           en: "This is the watch that my father gave me." },
    { ja: "あなたが話している人を知っています。",   ko: "당신이 말하는 사람을 알아요.",        da: "Jeg kender den person, du taler om.",       en: "I know the person you are talking about." },
    { ja: "私が住んでいる町はとても静かです。",     ko: "제가 사는 동네는 아주 조용해요.",     da: "Byen, jeg bor i, er meget stille.",         en: "The town I live in is very quiet." },
    { ja: "これは母がくれた本です。",               ko: "이건 어머니가 주신 책이에요.",      da: "Det er den bog, min mor gav mig.",       en: "This is the book that my mother gave me." },
    { ja: "きのう食べた料理の名前を忘れました。",   ko: "어제 먹은 요리의 이름을 잊어버렸어요.", da: "Jeg har glemt navnet på den mad, jeg spiste i går.", en: "I forgot the name of the food I ate yesterday." },
    { ja: "私が買った服はとても安かったです。",     ko: "제가 산 옷은 아주 쌌어요.",          da: "Det tøj, jeg købte, var meget billigt.", en: "The clothes I bought were very cheap." },
    { ja: "彼が書いた手紙をまだ持っています。",     ko: "그가 쓴 편지를 아직 가지고 있어요.", da: "Jeg har stadig det brev, han skrev.",    en: "I still have the letter he wrote." },
    { ja: "私たちが泊まったホテルは静かでした。",   ko: "우리가 묵은 호텔은 조용했어요.",     da: "Det hotel, vi boede på, var stille.",    en: "The hotel we stayed at was quiet." },
    { ja: "あなたが撮った写真を見たいです。",       ko: "당신이 찍은 사진을 보고 싶어요.",    da: "Jeg vil gerne se de billeder, du tog.",  en: "I want to see the photos you took." },
    { ja: "先生が話した話は面白かったです。",       ko: "선생님이 하신 이야기는 재미있었어요.", da: "Den historie, læreren fortalte, var sjov.", en: "The story the teacher told was fun." },
    { ja: "私が毎日使う辞書はこれです。",           ko: "제가 매일 쓰는 사전은 이거예요.",    da: "Den ordbog, jeg bruger hver dag, er denne.", en: "The dictionary I use every day is this one." },
    { ja: "友達が薦めてくれた映画を見ました。",     ko: "친구가 추천해 준 영화를 봤어요.",    da: "Jeg så den film, min ven anbefalede.",   en: "I watched the movie my friend recommended." },
    { ja: "私が習っている言語は韓国語です。",       ko: "제가 배우는 언어는 한국어예요.",     da: "Det sprog, jeg lærer, er koreansk.",     en: "The language I'm learning is Korean." },
    { ja: "彼女が働いている会社は有名です。",       ko: "그녀가 일하는 회사는 유명해요.",     da: "Det firma, hun arbejder i, er berømt.",  en: "The company she works for is famous." },
  ];
  for (const x of R) {
    yield item(x.ja, x.ko, x.da, x.en, "描写",
      "目的語を修飾するときは過去なら -(으)ㄴ、現在なら -는 の連体形にします。",
      "目的語の関係代名詞は som ですが、ふつう省略します(den bog, jeg købte)。",
      "目的格の関係代名詞(that/which/whom)は省略できます(the book I bought)。");
  }
}],

["間接疑問: ~か知っていますか", 5, function* () {
  const Q = [
    { ja: "駅がどこにあるか知っていますか?",       ko: "역이 어디에 있는지 알아요?",       da: "Ved du, hvor stationen er?",            en: "Do you know where the station is?" },
    { ja: "彼が何時に来るか知っていますか?",       ko: "그가 몇 시에 오는지 알아요?",      da: "Ved du, hvornår han kommer?",           en: "Do you know what time he is coming?" },
    { ja: "これがいくらか知っていますか?",         ko: "이게 얼마인지 알아요?",            da: "Ved du, hvad det koster?",              en: "Do you know how much this costs?" },
    { ja: "彼女がどこで働いているか知りません。",   ko: "그녀가 어디에서 일하는지 몰라요.", da: "Jeg ved ikke, hvor hun arbejder.",      en: "I don't know where she works." },
    { ja: "なぜ彼が来なかったか分かりません。",     ko: "왜 그가 안 왔는지 몰라요.",        da: "Jeg ved ikke, hvorfor han ikke kom.",   en: "I don't know why he didn't come." },
    { ja: "だれがこれを作ったか知っていますか?",   ko: "누가 이걸 만들었는지 알아요?",     da: "Ved du, hvem der har lavet det?",       en: "Do you know who made this?" },
    { ja: "彼が何を勉強しているか知っていますか?",   ko: "그가 뭘 공부하는지 알아요?",        da: "Ved du, hvad han studerer?",             en: "Do you know what he studies?" },
    { ja: "バスがいつ来るか知っていますか?",         ko: "버스가 언제 오는지 알아요?",        da: "Ved du, hvornår bussen kommer?",         en: "Do you know when the bus comes?" },
    { ja: "トイレがどこにあるか教えてください。",     ko: "화장실이 어디에 있는지 알려 주세요.", da: "Fortæl mig, hvor toilettet er.",       en: "Please tell me where the restroom is." },
    { ja: "彼女が何歳か知りません。",                 ko: "그녀가 몇 살인지 몰라요.",          da: "Jeg ved ikke, hvor gammel hun er.",      en: "I don't know how old she is." },
    { ja: "この単語がどういう意味か分かりますか?",   ko: "이 단어가 무슨 뜻인지 알아요?",     da: "Ved du, hvad dette ord betyder?",        en: "Do you know what this word means?" },
    { ja: "彼らがどこに住んでいるか知りません。",     ko: "그들이 어디에 사는지 몰라요.",      da: "Jeg ved ikke, hvor de bor.",             en: "I don't know where they live." },
    { ja: "電車が何時に出るか調べます。",             ko: "기차가 몇 시에 떠나는지 알아볼게요.", da: "Jeg finder ud af, hvornår toget kører.", en: "I'll find out what time the train leaves." },
    { ja: "だれがこの歌を歌っているか知っていますか?", ko: "누가 이 노래를 부르는지 알아요?",  da: "Ved du, hvem der synger denne sang?",    en: "Do you know who sings this song?" },
    { ja: "彼がなぜ怒っているか分かりません。",       ko: "그가 왜 화났는지 몰라요.",          da: "Jeg ved ikke, hvorfor han er vred.",     en: "I don't know why he is angry." },
    { ja: "どこで切符を買えるか教えてください。",     ko: "어디에서 표를 살 수 있는지 알려 주세요.", da: "Fortæl mig, hvor jeg kan købe en billet.", en: "Please tell me where I can buy a ticket." },
    { ja: "彼女が何と言ったか聞こえませんでした。",   ko: "그녀가 뭐라고 했는지 못 들었어요.", da: "Jeg hørte ikke, hvad hun sagde.",        en: "I didn't hear what she said." },
  ];
  for (const x of Q) {
    yield item(x.ja, x.ko, x.da, x.en, "質問",
      "「~는지 알아요?」=「~か知っていますか」。-는지 が間接疑問の語尾です。",
      "従属節の前にコンマを打ちます。間接疑問では ふつうの語順(主語→動詞)に戻ります。",
      "間接疑問は「疑問詞 + 主語 + 動詞」の語順。where is the station ではなく where the station is。");
  }
}],

["受身: ~されます", 5, function* () {
  const P = [
    { ja: "この建物は100年前に建てられました。", ko: "이 건물은 100년 전에 지어졌어요.", da: "Denne bygning blev bygget for 100 år siden.", en: "This building was built 100 years ago." },
    { ja: "韓国では韓国語が話されています。",     ko: "한국에서는 한국어가 사용돼요.",     da: "I Korea tales der koreansk.",                 en: "Korean is spoken in Korea." },
    { ja: "この本は多くの人に読まれています。",   ko: "이 책은 많은 사람에게 읽혀요.",     da: "Denne bog bliver læst af mange mennesker.",   en: "This book is read by many people." },
    { ja: "その手紙は昨日書かれました。",         ko: "그 편지는 어제 쓰였어요.",          da: "Brevet blev skrevet i går.",                  en: "The letter was written yesterday." },
    { ja: "この車は日本で作られました。",         ko: "이 차는 일본에서 만들어졌어요.",    da: "Denne bil blev lavet i Japan.",               en: "This car was made in Japan." },
    { ja: "私はパーティーに招待されました。",     ko: "저는 파티에 초대받았어요.",         da: "Jeg blev inviteret til festen.",              en: "I was invited to the party." },
    { ja: "この歌は世界中で歌われています。",       ko: "이 노래는 전 세계에서 불려요.",      da: "Denne sang bliver sunget i hele verden.", en: "This song is sung all over the world." },
    { ja: "その映画は去年作られました。",           ko: "그 영화는 작년에 만들어졌어요.",     da: "Den film blev lavet sidste år.",          en: "That movie was made last year." },
    { ja: "この教室は毎日掃除されます。",           ko: "이 교실은 매일 청소돼요.",           da: "Dette klasseværelse bliver gjort rent hver dag.", en: "This classroom is cleaned every day." },
    { ja: "私の自転車が盗まれました。",             ko: "제 자전거를 도둑맞았어요.",          da: "Min cykel blev stjålet.",                 en: "My bicycle was stolen." },
    { ja: "デンマークではデンマーク語が話されています。", ko: "덴마크에서는 덴마크어가 사용돼요.", da: "I Danmark tales der dansk.",          en: "Danish is spoken in Denmark." },
    { ja: "この写真は父に撮られました。",           ko: "이 사진은 아버지가 찍었어요.",       da: "Dette billede blev taget af min far.",    en: "This photo was taken by my father." },
    { ja: "その橋は10年前に建てられました。",       ko: "그 다리는 10년 전에 지어졌어요.",    da: "Den bro blev bygget for 10 år siden.",    en: "That bridge was built 10 years ago." },
    { ja: "その本は多くの言語に翻訳されています。", ko: "그 책은 여러 언어로 번역돼요.",      da: "Den bog bliver oversat til mange sprog.", en: "That book is translated into many languages." },
    { ja: "私は先生にほめられました。",             ko: "저는 선생님에게 칭찬받았어요.",      da: "Jeg blev rost af læreren.",               en: "I was praised by my teacher." },
    { ja: "この料理は米から作られます。",           ko: "이 요리는 쌀로 만들어져요.",         da: "Denne ret bliver lavet af ris.",          en: "This dish is made from rice." },
    { ja: "会議は来週開かれます。",                 ko: "회의는 다음 주에 열려요.",           da: "Mødet bliver holdt i næste uge.",         en: "The meeting will be held next week." },
  ];
  for (const x of P) {
    yield item(x.ja, x.ko, x.da, x.en, "描写",
      "韓国語の受身は -이/히/리/기 や -아/어지다、漢字語では -되다/-받다 を使います。",
      "受身は blive + 過去分詞。一般的な事実には -s 受身(tales)も使います。",
      "受身は be + 過去分詞。動作主を示すときは by ~ を添えます。");
  }
}],

["仮定法: もし~なら", 5, function* () {
  const S = [
    { ja: "もしお金があれば、車を買うのに。",       ko: "돈이 있으면 차를 살 텐데요.",        da: "Hvis jeg havde penge, ville jeg købe en bil.",   en: "If I had money, I would buy a car." },
    { ja: "もし時間があれば、旅行に行くのに。",     ko: "시간이 있으면 여행을 갈 텐데요.",    da: "Hvis jeg havde tid, ville jeg rejse.",           en: "If I had time, I would travel." },
    { ja: "もし韓国語が話せたら、韓国で働くのに。", ko: "한국어를 할 수 있으면 한국에서 일할 텐데요.", da: "Hvis jeg kunne tale koreansk, ville jeg arbejde i Korea.", en: "If I could speak Korean, I would work in Korea." },
    { ja: "もし私があなたなら、そうはしないのに。", ko: "제가 당신이라면 그렇게 안 할 텐데요.", da: "Hvis jeg var dig, ville jeg ikke gøre det.",   en: "If I were you, I wouldn't do that." },
    { ja: "もし天気がよければ、散歩するのに。",     ko: "날씨가 좋으면 산책할 텐데요.",       da: "Hvis vejret var godt, ville jeg gå en tur.",     en: "If the weather were nice, I would take a walk." },
    { ja: "もっと早く起きれば、間に合うのに。",     ko: "더 일찍 일어나면 늦지 않을 텐데요.", da: "Hvis jeg stod tidligere op, ville jeg nå det.",  en: "If I got up earlier, I would make it." },
    { ja: "もっとお金があれば、家を買うのに。",     ko: "돈이 더 있으면 집을 살 텐데요.",     da: "Hvis jeg havde flere penge, ville jeg købe et hus.", en: "If I had more money, I would buy a house." },
    { ja: "もし車があれば、海に行くのに。",         ko: "차가 있으면 바다에 갈 텐데요.",      da: "Hvis jeg havde en bil, ville jeg tage til havet.", en: "If I had a car, I would go to the sea." },
    { ja: "もし彼が来れば、うれしいのに。",         ko: "그가 오면 기쁠 텐데요.",             da: "Hvis han kom, ville jeg blive glad.",     en: "If he came, I would be happy." },
    { ja: "もっと若ければ、留学するのに。",         ko: "더 젊으면 유학을 갈 텐데요.",        da: "Hvis jeg var yngre, ville jeg studere i udlandet.", en: "If I were younger, I would study abroad." },
    { ja: "もし雨が降らなければ、出かけるのに。",   ko: "비가 안 오면 나갈 텐데요.",          da: "Hvis det ikke regnede, ville jeg gå ud.", en: "If it weren't raining, I would go out." },
    { ja: "もし休みが取れたら、家族に会いに行くのに。", ko: "휴가를 낼 수 있으면 가족을 만나러 갈 텐데요.", da: "Hvis jeg kunne få fri, ville jeg besøge min familie.", en: "If I could take time off, I would visit my family." },
    { ja: "もし彼女の電話番号を知っていれば、電話するのに。", ko: "그녀의 전화번호를 알면 전화할 텐데요.", da: "Hvis jeg kendte hendes nummer, ville jeg ringe.", en: "If I knew her number, I would call her." },
    { ja: "もっと近くに住んでいれば、毎日会うのに。", ko: "더 가까이 살면 매일 만날 텐데요.",  da: "Hvis jeg boede tættere på, ville vi ses hver dag.", en: "If I lived closer, we would meet every day." },
    { ja: "もし料理が上手なら、レストランを開くのに。", ko: "요리를 잘하면 식당을 열 텐데요.", da: "Hvis jeg var god til at lave mad, ville jeg åbne en restaurant.", en: "If I were good at cooking, I would open a restaurant." },
    { ja: "もし彼が手伝ってくれたら、早く終わるのに。", ko: "그가 도와주면 빨리 끝날 텐데요.", da: "Hvis han hjalp mig, ville jeg blive hurtigt færdig.", en: "If he helped me, I would finish quickly." },
    { ja: "もし飛行機が安ければ、毎年旅行するのに。", ko: "비행기가 싸면 매년 여행할 텐데요.", da: "Hvis flybilletter var billige, ville jeg rejse hvert år.", en: "If plane tickets were cheap, I would travel every year." },
  ];
  for (const x of S) {
    yield item(x.ja, x.ko, x.da, x.en, "仮定",
      "「~(으)면 ~ㄹ 텐데요」で「~なら~するのに」。実現していない想像を表します。",
      "仮定法では条件節を過去形(havde/var/kunne)にし、主節に ville を使います。",
      "仮定法過去は「If + 主語 + 過去形, 主語 + would + 原形」。be は were を使うのが正式です。");
  }
}],

/* 様態副詞。副詞の位置が3言語で違う(韓国語は動詞の直前、英語・デンマーク語は動詞のあと)ので、
 * 語彙の総当たりではなく自然な言い回しを1件ずつ書いている。 */
["様態副詞: どんなふうに", 3, function* () {
  const SUBJ = [
    { ja: "私は",       ko: "저는",        da: "Jeg",     en: "I",         s: false },
    { ja: "私の友達は", ko: "제 친구는",   da: "Min ven", en: "My friend", s: true },
    { ja: "私の父は",   ko: "제 아버지는", da: "Min far", en: "My father", s: true },
    { ja: "私の母は",   ko: "제 어머니는", da: "Min mor", en: "My mother", s: true },
  ];
  const MANNER = [
    { ja: "速く走ります",       ko: "빨리 달려요",      da: "løber hurtigt",   b: "run fast",        t: "runs fast" },
    { ja: "ゆっくり歩きます",   ko: "천천히 걸어요",    da: "går langsomt",    b: "walk slowly",     t: "walks slowly" },
    { ja: "熱心に勉強します",   ko: "열심히 공부해요",  da: "studerer flittigt", b: "study hard",    t: "studies hard" },
    { ja: "熱心に働きます",     ko: "열심히 일해요",    da: "arbejder flittigt", b: "work hard",     t: "works hard" },
    { ja: "上手に歌います",     ko: "노래를 잘 불러요", da: "synger godt",     b: "sing well",       t: "sings well" },
    { ja: "上手に踊ります",     ko: "춤을 잘 춰요",     da: "danser godt",     b: "dance well",      t: "dances well" },
    { ja: "静かに話します",     ko: "조용히 말해요",    da: "taler stille",    b: "speak quietly",   t: "speaks quietly" },
    { ja: "早く起きます",       ko: "일찍 일어나요",    da: "står tidligt op", b: "get up early",    t: "gets up early" },
    { ja: "ゆっくり本を読みます", ko: "책을 천천히 읽어요", da: "læser langsomt", b: "read slowly",  t: "reads slowly" },
    { ja: "上手に料理します",   ko: "요리를 잘해요",    da: "laver god mad",   b: "cook well",       t: "cooks well",
      nda: "「上手に料理する」はデンマーク語では laver god mad(おいしい食事を作る)と言うのが自然です。" },
  ];
  for (const su of SUBJ) {
    for (const m of MANNER) {
      yield item(`${su.ja}${m.ja}。`,
        `${su.ko} ${m.ko}.`, `${su.da} ${m.da}.`, `${su.en} ${su.s ? m.t : m.b}.`, "日常",
        "韓国語の副詞は動詞の直前に置きます。目的語がある文では「目的語+副詞+動詞」の順です。",
        m.nda || "デンマーク語の様態副詞は動詞のあとに置きます。",
        su.s ? "様態副詞は動詞のあと。三人称単数が主語なので動詞に -s がつきます。"
             : "様態副詞(fast/slowly/hard/well)は動詞のあとに置きます。");
    }
  }
}],

];

/* =====================  手書きの定番フレーズ  ===================== */
const CURATED = {
ko: [
  {t:"안녕하세요!", a:"こんにちは!", n:"時間帯を問わず使える基本のあいさつ。", h:"あいさつ", alt:"親しい相手には 안녕! だけでも言えます"},
  {t:"감사합니다.", a:"ありがとうございます。", n:"丁寧なお礼。カジュアルには 고마워(コマウォ)。", h:"お礼", alt:"고맙습니다 / 고마워요 とも言えます(고마워요 のほうがやわらかい響き)"},
  {t:"저는 학생입니다.", a:"私は学生です。", n:"~입니다 は 이에요/예요 より硬い丁寧形。", h:"自己紹介", alt:"저는 학생이에요 とも言えます(이에요 のほうが会話的)"},
  {t:"이름이 뭐예요?", a:"お名前は何ですか?", n:"이름=名前、뭐=何。", h:"質問", alt:"성함이 어떻게 되세요? とも言えます(目上の人への丁寧な聞き方)"},
  {t:"만나서 반가워요.", a:"お会いできてうれしいです。", n:"初対面のあいさつの定番。", h:"あいさつ"},
  {t:"내일 또 봐요!", a:"また明日会いましょう!", n:"내일=明日、또=また、봐요=会いましょう。", h:"別れ"},
  {t:"조금만 기다려 주세요.", a:"少しだけ待ってください。", n:"조금=少し、기다리다=待つ。", h:"お願い", alt:"잠시만요 とも言えます(短く「少々お待ちを」)"},
  {t:"천천히 말해 주세요.", a:"ゆっくり話してください。", n:"천천히=ゆっくり、말하다=話す。", h:"お願い"},
  {t:"정말 맛있어요!", a:"本当においしいです!", n:"정말=本当に。맛있다=「味がある」=おいしい。", h:"食事"},
  {t:"물 좀 주세요.", a:"お水をください。", n:"좀 を入れるとやわらかい頼み方に。", h:"食事", alt:"물 좀 주시겠어요? とも言えます(より丁寧)"},
  {t:"네, 괜찮아요.", a:"はい、大丈夫です。", n:"괜찮아요はOKにも「結構です」にも使える万能表現。", h:"日常"},
  {t:"저는 일본 사람입니다.", a:"私は日本人です。", n:"일본=日本、사람=人。", h:"自己紹介"},
  {t:"한국 음식을 좋아해요.", a:"韓国料理が好きです。", n:"음식=食べ物、料理。", h:"好み"},
  {t:"화장실이 어디예요?", a:"トイレはどこですか?", n:"화장실=トイレ(化粧室)。", h:"旅行"},
  {t:"커피 한 잔 주세요.", a:"コーヒーを一杯ください。", n:"한 잔=一杯。カフェで使えます。", h:"買い物"},
  {t:"주말에 뭐 해요?", a:"週末は何をしますか?", n:"주말=週末。", h:"質問"},
  {t:"오늘 날씨가 좋아요.", a:"今日は天気がいいです。", n:"날씨=天気、좋아요=良いです。", h:"天気"},
  {t:"이거 얼마예요?", a:"これはいくらですか?", n:"이거=これ、얼마=いくら。", h:"買い物", alt:"이거 얼마나 해요? とも言えます"},
  {t:"어디에 가요?", a:"どこに行きますか?", n:"어디=どこ、가다=行く。", h:"質問"},
  {t:"저는 한국어를 공부해요.", a:"私は韓国語を勉強しています。", n:"공부하다=勉強する。", h:"学習"},
],
da: [
  {t:"Hej! Hvordan går det?", a:"やあ!元気?", n:"Hvordan går det? は直訳「調子はどう行ってる?」。", h:"あいさつ", alt:"Hvordan har du det? とも言えます"},
  {t:"Tak for hjælpen.", a:"手伝ってくれてありがとう。", n:"tak=ありがとう、hjælp=助け。", h:"お礼", alt:"Mange tak for hjælpen / Tusind tak とも言えます(感謝を強めた言い方)"},
  {t:"Jeg hedder Yuzu.", a:"私はユズといいます。", n:"jeg hedder ~=私は~という名前です。", h:"自己紹介", alt:"Mit navn er Yuzu とも言えます(少し硬い言い方)"},
  {t:"Hvad hedder du?", a:"あなたの名前は何ですか?", n:"hvad=何、du=あなた。", h:"質問"},
  {t:"Hyggeligt at møde dig.", a:"会えてうれしいです。", n:"hyggelig はデンマーク文化の鍵となる言葉「心地よい」。", h:"あいさつ"},
  {t:"Vi ses i morgen!", a:"また明日!", n:"vi ses=また会いましょう、i morgen=明日。", h:"別れ", alt:"På gensyn とも言えます(改まった別れのあいさつ)"},
  {t:"Et øjeblik, tak.", a:"少々お待ちください。", n:"øjeblik=瞬間。「一瞬お願いします」が定番の待って表現。", h:"お願い"},
  {t:"Vil du tale lidt langsommere?", a:"もう少しゆっくり話してもらえますか?", n:"langsommere=langsom(ゆっくり)の比較級。Vil du ~? で丁寧な依頼。", h:"お願い"},
  {t:"Det smager godt!", a:"おいしいです!", n:"smage=味がする。", h:"食事"},
  {t:"Må jeg bede om vand?", a:"お水をいただけますか?", n:"må jeg bede om ~=~をお願いできますか。", h:"食事"},
  {t:"Det er i orden.", a:"大丈夫です。", n:"i orden=順調・問題ない。", h:"日常", alt:"Det er fint / Det gør ikke noget とも言えます"},
  {t:"Jeg kommer fra Japan.", a:"私は日本から来ました。", n:"komme fra ~=~出身です。", h:"自己紹介"},
  {t:"Jeg kan godt lide dansk mad.", a:"デンマーク料理が好きです。", n:"kan godt lide=好き、mad=食べ物。", h:"好み"},
  {t:"Hvor er toilettet?", a:"トイレはどこですか?", n:"toilet の限定形は toilettet(tが重なる)。", h:"旅行"},
  {t:"En kaffe, tak.", a:"コーヒーを一杯ください。", n:"注文は「品物+tak」でOK。シンプル!", h:"買い物"},
  {t:"Hvad laver du i weekenden?", a:"週末は何をしますか?", n:"lave=する・作る。", h:"質問"},
  {t:"Vejret er godt i dag.", a:"今日は天気がいいです。", n:"vejr=天気、i dag=今日。", h:"天気"},
  {t:"Hvad koster det?", a:"それはいくらですか?", n:"koste=値段がする。買い物の定番。", h:"買い物", alt:"Hvor meget koster det? とも言えます"},
  {t:"Hvor skal du hen?", a:"どこへ行くの?", n:"hvor=どこ、hen=方向を表す語。", h:"質問"},
  {t:"Jeg lærer dansk.", a:"私はデンマーク語を学んでいます。", n:"lære=学ぶ。", h:"学習"},
],
en: [
  {t:"How's it going?", a:"調子はどう?", n:"How are you? よりカジュアルな定番あいさつ。", h:"あいさつ", alt:"How are you doing? / What's up? とも言えます"},
  {t:"Thanks a lot for your help.", a:"手伝ってくれて本当にありがとう。", n:"Thanks a lot は Thank you より少しカジュアル。", h:"お礼"},
  {t:"It's nice to meet you.", a:"はじめまして。", n:"初対面のあいさつの定番。", h:"あいさつ", alt:"Nice to meet you. と It's を省いても言えます(Great to meet you. も自然)"},
  {t:"What do you do for a living?", a:"お仕事は何をされていますか?", n:"直訳「生活のために何をしてる?」=職業を尋ねる表現。", h:"質問"},
  {t:"See you tomorrow!", a:"また明日!", n:"See you later(またあとで)もよく使う。", h:"別れ", alt:"See you later / Catch you tomorrow とも言えます"},
  {t:"Just a moment, please.", a:"少々お待ちください。", n:"Just a second / Hang on も同じ意味。", h:"お願い"},
  {t:"Could you speak more slowly?", a:"もっとゆっくり話していただけますか?", n:"Could you ~? は丁寧な依頼。", h:"お願い", alt:"Could you slow down a bit? とも言えます"},
  {t:"This tastes amazing!", a:"これ、すごくおいしい!", n:"taste=味がする。amazing で強調。", h:"食事", alt:"This is delicious! とも言えます"},
  {t:"Could I get some water, please?", a:"お水をいただけますか?", n:"Could I get ~ は丁寧な注文表現。", h:"食事"},
  {t:"No worries.", a:"大丈夫だよ / 気にしないで。", n:"That's OK のカジュアル版。", h:"日常"},
  {t:"I was born and raised in Japan.", a:"私は日本で生まれ育ちました。", n:"born and raised はセットでよく使う。", h:"自己紹介"},
  {t:"I'm really into Korean food.", a:"韓国料理にすごくハマってます。", n:"be into ~=~にハマっている。", h:"好み"},
  {t:"Excuse me, where's the restroom?", a:"すみません、トイレはどこですか?", n:"アメリカでは restroom、イギリスでは toilet。", h:"旅行"},
  {t:"I'll have a coffee, please.", a:"コーヒーをください。", n:"注文は I'll have ~ が自然。", h:"買い物", alt:"Could I get a coffee, please? とも言えます"},
  {t:"Any plans for the weekend?", a:"週末の予定はある?", n:"Do you have を省略したカジュアルな聞き方。", h:"質問"},
  {t:"It's a beautiful day today.", a:"今日はいい天気ですね。", n:"天気の話は英会話の入り口の定番。", h:"天気"},
  {t:"How much is this?", a:"これはいくらですか?", n:"買い物の基本フレーズ。", h:"買い物", alt:"How much does this cost? / What does this cost? とも言えます"},
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
    out.push({ t: c.t, r: lang === "ko" ? romanize(c.t) : "", a: c.a, n: c.n, h: c.h, d: c.d || 1,
               alt: c.alt || "" });
  }
  for (const [, baseD, gen] of TEMPLATES) {
    for (const it of gen()) {
      const t = it[lang];
      if (seen.has(t)) continue;
      seen.add(t);
      let d = it.d || baseD;
      // 長い文は1段階難しく。D4/D5 は文型そのもので難易度を決めているので昇格させない
      // (Math.min(3, d+1) だと d=4/5 が D3 に「降格」してしまう)
      if (t.split(" ").length >= 7 && d < 3) d += 1;
      out.push({ t, r: lang === "ko" ? romanize(t) : "", a: it.ja, n: it.n[lang], h: it.h, d,
                 alt: it.alt[lang] || "" });
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
