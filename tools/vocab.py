# -*- coding: utf-8 -*-
"""
LingoPop! 語彙データ
--------------------
各語には文法上必要な情報を明示的に持たせる(機械生成でも文法が崩れないように)。

名詞:
  ja  : 日本語
  ko  : 韓国語
  da  : デンマーク語(非限定形)
  g   : デンマーク語の性 "en" / "et"
  dad : デンマーク語の限定形(hotel->hotellet のような不規則も明示)
  en  : 英語
  art : 英語の不定冠詞 "a" / "an" / "" (不可算)
"""

# ---------------- 食べ物・飲み物 ----------------
# gen  : 英語の総称形(I like ~ で使う形)
# dagen: デンマーク語の総称形(Jeg kan godt lide ~ で使う形)
FOODS = [
    dict(ja="コーヒー", ko="커피", da="kaffe", g="en", dad="kaffen", en="coffee", art="a", gen="coffee", dagen="kaffe"),
    dict(ja="お茶", ko="차", da="te", g="en", dad="teen", en="tea", art="a", gen="tea", dagen="te"),
    dict(ja="ビール", ko="맥주", da="øl", g="en", dad="øllen", en="beer", art="a", gen="beer", dagen="øl"),
    dict(ja="ワイン", ko="와인", da="vin", g="en", dad="vinen", en="wine", art="a", gen="wine", dagen="vin"),
    dict(ja="ジュース", ko="주스", da="juice", g="en", dad="juicen", en="juice", art="a", gen="juice", dagen="juice"),
    dict(ja="牛乳", ko="우유", da="mælk", g="en", dad="mælken", en="milk", art="", gen="milk", dagen="mælk"),
    dict(ja="パン", ko="빵", da="brød", g="et", dad="brødet", en="bread", art="", gen="bread", dagen="brød"),
    dict(ja="ケーキ", ko="케이크", da="kage", g="en", dad="kagen", en="cake", art="a", gen="cake", dagen="kage"),
    dict(ja="りんご", ko="사과", da="æble", g="et", dad="æblet", en="apple", art="an", gen="apples", dagen="æbler"),
    dict(ja="バナナ", ko="바나나", da="banan", g="en", dad="bananen", en="banana", art="a", gen="bananas", dagen="bananer"),
    dict(ja="オレンジ", ko="오렌지", da="appelsin", g="en", dad="appelsinen", en="orange", art="an", gen="oranges", dagen="appelsiner"),
    dict(ja="いちご", ko="딸기", da="jordbær", g="et", dad="jordbærret", en="strawberry", art="a", gen="strawberries", dagen="jordbær"),
    dict(ja="卵", ko="계란", da="æg", g="et", dad="ægget", en="egg", art="an", gen="eggs", dagen="æg"),
    dict(ja="チーズ", ko="치즈", da="ost", g="en", dad="osten", en="cheese", art="", gen="cheese", dagen="ost"),
    dict(ja="スープ", ko="수프", da="suppe", g="en", dad="suppen", en="soup", art="a", gen="soup", dagen="suppe"),
    dict(ja="サラダ", ko="샐러드", da="salat", g="en", dad="salaten", en="salad", art="a", gen="salad", dagen="salat"),
    dict(ja="ピザ", ko="피자", da="pizza", g="en", dad="pizzaen", en="pizza", art="a", gen="pizza", dagen="pizza"),
    dict(ja="サンドイッチ", ko="샌드위치", da="sandwich", g="en", dad="sandwichen", en="sandwich", art="a", gen="sandwiches", dagen="sandwicher"),
    dict(ja="魚", ko="생선", da="fisk", g="en", dad="fisken", en="fish", art="a", gen="fish", dagen="fisk"),
    dict(ja="肉", ko="고기", da="kød", g="et", dad="kødet", en="meat", art="", gen="meat", dagen="kød"),
    dict(ja="ご飯", ko="밥", da="ris", g="en", dad="risen", en="rice", art="", gen="rice", dagen="ris"),
    dict(ja="パスタ", ko="파스타", da="pasta", g="en", dad="pastaen", en="pasta", art="", gen="pasta", dagen="pasta"),
    dict(ja="チョコレート", ko="초콜릿", da="chokolade", g="en", dad="chokoladen", en="chocolate", art="", gen="chocolate", dagen="chokolade"),
    dict(ja="アイスクリーム", ko="아이스크림", da="is", g="en", dad="isen", en="ice cream", art="an", gen="ice cream", dagen="is"),
    dict(ja="スイカ", ko="수박", da="vandmelon", g="en", dad="vandmelonen", en="watermelon", art="a", gen="watermelon", dagen="vandmelon"),
    dict(ja="キムチ", ko="김치", da="kimchi", g="en", dad="kimchien", en="kimchi", art="", gen="kimchi", dagen="kimchi"),
    dict(ja="カレー", ko="카레", da="karry", g="en", dad="karryen", en="curry", art="a", gen="curry", dagen="karry"),
    dict(ja="トマト", ko="토마토", da="tomat", g="en", dad="tomaten", en="tomato", art="a", gen="tomatoes", dagen="tomater"),
    dict(ja="じゃがいも", ko="감자", da="kartoffel", g="en", dad="kartoflen", en="potato", art="a", gen="potatoes", dagen="kartofler"),
    dict(ja="野菜", ko="채소", da="grøntsag", g="en", dad="grøntsagen", en="vegetable", art="a", gen="vegetables", dagen="grøntsager"),
]
# ---------------- 場所 ----------------
# dapre: デンマーク語で「~へ/~で」に使う前置詞句(限定形込み)
PLACES = [
    dict(ja="駅", ko="역", da="station", g="en", dad="stationen", en="station", art="a", dapre="på stationen", tag="service"),
    dict(ja="空港", ko="공항", da="lufthavn", g="en", dad="lufthavnen", en="airport", art="an", dapre="i lufthavnen", tag="service"),
    dict(ja="病院", ko="병원", da="hospital", g="et", dad="hospitalet", en="hospital", art="a", dapre="på hospitalet", tag="service"),
    dict(ja="学校", ko="학교", da="skole", g="en", dad="skolen", en="school", art="a", dapre="på skolen", tag="service"),
    dict(ja="大学", ko="대학교", da="universitet", g="et", dad="universitetet", en="university", art="a", dapre="på universitetet", tag="culture"),
    dict(ja="図書館", ko="도서관", da="bibliotek", g="et", dad="biblioteket", en="library", art="a", dapre="på biblioteket", tag="culture"),
    dict(ja="銀行", ko="은행", da="bank", g="en", dad="banken", en="bank", art="a", dapre="i banken", tag="service"),
    dict(ja="郵便局", ko="우체국", da="posthus", g="et", dad="posthuset", en="post office", art="a", dapre="på posthuset", tag="service"),
    dict(ja="スーパー", ko="슈퍼마켓", da="supermarked", g="et", dad="supermarkedet", en="supermarket", art="a", dapre="i supermarkedet", tag="commerce"),
    dict(ja="レストラン", ko="레스토랑", da="restaurant", g="en", dad="restauranten", en="restaurant", art="a", dapre="på restauranten", tag="commerce"),
    dict(ja="カフェ", ko="카페", da="café", g="en", dad="caféen", en="café", art="a", dapre="på caféen", tag="commerce"),
    dict(ja="ホテル", ko="호텔", da="hotel", g="et", dad="hotellet", en="hotel", art="a", dapre="på hotellet", tag="commerce"),
    dict(ja="公園", ko="공원", da="park", g="en", dad="parken", en="park", art="a", dapre="i parken", tag="nature"),
    dict(ja="美術館", ko="미술관", da="kunstmuseum", g="et", dad="kunstmuseet", en="art museum", art="an", dapre="på kunstmuseet", tag="culture"),
    dict(ja="博物館", ko="박물관", da="museum", g="et", dad="museet", en="museum", art="a", dapre="på museet", tag="culture"),
    dict(ja="映画館", ko="영화관", da="biograf", g="en", dad="biografen", en="movie theater", art="a", dapre="i biografen", tag="culture"),
    dict(ja="教会", ko="교회", da="kirke", g="en", dad="kirken", en="church", art="a", dapre="i kirken", tag="culture"),
    dict(ja="市場", ko="시장", da="marked", g="et", dad="markedet", en="market", art="a", dapre="på markedet", tag="commerce"),
    dict(ja="お店", ko="가게", da="butik", g="en", dad="butikken", en="shop", art="a", dapre="i butikken", tag="commerce"),
    dict(ja="海辺", ko="해변", da="strand", g="en", dad="stranden", en="beach", art="a", dapre="på stranden", tag="nature"),
    dict(ja="山", ko="산", da="bjerg", g="et", dad="bjerget", en="mountain", art="a", dapre="på bjerget", tag="nature"),
    dict(ja="港", ko="항구", da="havn", g="en", dad="havnen", en="harbor", art="a", dapre="i havnen", tag="nature"),
    dict(ja="橋", ko="다리", da="bro", g="en", dad="broen", en="bridge", art="a", dapre="på broen", tag="service"),
    dict(ja="広場", ko="광장", da="torv", g="et", dad="torvet", en="square", art="a", dapre="på torvet", tag="nature"),
    dict(ja="トイレ", ko="화장실", da="toilet", g="et", dad="toilettet", en="restroom", art="a", dapre="på toilettet", tag="service"),
    dict(ja="動物園", ko="동물원", da="zoo", g="en", dad="zooen", en="zoo", art="a", dapre="i zoo", tag="culture"),
    dict(ja="バス停", ko="정류장", da="busstoppested", g="et", dad="busstoppestedet", en="bus stop", art="a", dapre="ved busstoppestedet", tag="service"),
    dict(ja="薬局", ko="약국", da="apotek", g="et", dad="apoteket", en="pharmacy", art="a", dapre="på apoteket", tag="commerce"),
    dict(ja="本屋", ko="서점", da="boghandel", g="en", dad="boghandlen", en="bookstore", art="a", dapre="i boghandlen", tag="commerce"),
    dict(ja="ジム", ko="헬스장", da="fitnesscenter", g="et", dad="fitnesscentret", en="gym", art="a", dapre="i fitnesscentret", tag="service"),
]

# ---------------- 物 ----------------
OBJECTS = [
    dict(ja="本", ko="책", da="bog", g="en", dad="bogen", en="book", art="a", tag="read"),
    dict(ja="かばん", ko="가방", da="taske", g="en", dad="tasken", en="bag", art="a", tag="thing"),
    dict(ja="時計", ko="시계", da="ur", g="et", dad="uret", en="watch", art="a", tag="device"),
    dict(ja="電話", ko="전화", da="telefon", g="en", dad="telefonen", en="phone", art="a", tag="device"),
    dict(ja="コンピューター", ko="컴퓨터", da="computer", g="en", dad="computeren", en="computer", art="a", tag="device"),
    dict(ja="車", ko="자동차", da="bil", g="en", dad="bilen", en="car", art="a", tag="vehicle"),
    dict(ja="自転車", ko="자전거", da="cykel", g="en", dad="cyklen", en="bicycle", art="a", tag="vehicle"),
    dict(ja="鍵", ko="열쇠", da="nøgle", g="en", dad="nøglen", en="key", art="a", tag="thing"),
    dict(ja="傘", ko="우산", da="paraply", g="en", dad="paraplyen", en="umbrella", art="an", tag="thing"),
    dict(ja="帽子", ko="모자", da="hat", g="en", dad="hatten", en="hat", art="a", tag="thing"),
    dict(ja="ペン", ko="펜", da="pen", g="en", dad="pennen", en="pen", art="a", tag="thing"),
    dict(ja="手紙", ko="편지", da="brev", g="et", dad="brevet", en="letter", art="a", tag="read"),
    dict(ja="写真", ko="사진", da="billede", g="et", dad="billedet", en="photo", art="a", tag="thing"),
    dict(ja="地図", ko="지도", da="kort", g="et", dad="kortet", en="map", art="a", tag="read"),
    dict(ja="切符", ko="표", da="billet", g="en", dad="billetten", en="ticket", art="a", tag="thing"),
    dict(ja="新聞", ko="신문", da="avis", g="en", dad="avisen", en="newspaper", art="a", tag="read"),
    dict(ja="花", ko="꽃", da="blomst", g="en", dad="blomsten", en="flower", art="a", tag="thing"),
    dict(ja="椅子", ko="의자", da="stol", g="en", dad="stolen", en="chair", art="a", tag="thing"),
    dict(ja="机", ko="책상", da="skrivebord", g="et", dad="skrivebordet", en="desk", art="a", tag="thing"),
    dict(ja="窓", ko="창문", da="vindue", g="et", dad="vinduet", en="window", art="a", tag="thing"),
    dict(ja="ドア", ko="문", da="dør", g="en", dad="døren", en="door", art="a", tag="thing"),
    dict(ja="テレビ", ko="텔레비전", da="fjernsyn", g="et", dad="fjernsynet", en="TV", art="a", tag="device"),
    dict(ja="カメラ", ko="카메라", da="kamera", g="et", dad="kameraet", en="camera", art="a", tag="device"),
    dict(ja="財布", ko="지갑", da="pung", g="en", dad="pungen", en="wallet", art="a", tag="thing"),
    dict(ja="靴", ko="구두", da="sko", g="en", dad="skoen", en="shoe", art="a", tag="thing"),
    dict(ja="ノート", ko="공책", da="notesbog", g="en", dad="notesbogen", en="notebook", art="a", tag="read"),
    dict(ja="辞書", ko="사전", da="ordbog", g="en", dad="ordbogen", en="dictionary", art="a", tag="read"),
    dict(ja="コップ", ko="컵", da="kop", g="en", dad="koppen", en="cup", art="a", tag="thing"),
    dict(ja="鉛筆", ko="연필", da="blyant", g="en", dad="blyanten", en="pencil", art="a", tag="thing"),
    dict(ja="ベッド", ko="침대", da="seng", g="en", dad="sengen", en="bed", art="a", tag="thing"),
]

# ---------------- 職業 ----------------
# デンマーク語は職業名に冠詞をつけない(Jeg er læge.)
JOBS = [
    dict(ja="学生", ko="학생", da="studerende", en="student", art="a"),
    dict(ja="先生", ko="선생님", da="lærer", en="teacher", art="a"),
    dict(ja="医者", ko="의사", da="læge", en="doctor", art="a"),
    dict(ja="看護師", ko="간호사", da="sygeplejerske", en="nurse", art="a"),
    dict(ja="エンジニア", ko="엔지니어", da="ingeniør", en="engineer", art="an"),
    dict(ja="デザイナー", ko="디자이너", da="designer", en="designer", art="a"),
    dict(ja="警察官", ko="경찰관", da="politibetjent", en="police officer", art="a"),
    dict(ja="料理人", ko="요리사", da="kok", en="chef", art="a"),
    dict(ja="記者", ko="기자", da="journalist", en="journalist", art="a"),
    dict(ja="弁護士", ko="변호사", da="advokat", en="lawyer", art="a"),
    dict(ja="音楽家", ko="음악가", da="musiker", en="musician", art="a"),
    dict(ja="画家", ko="화가", da="maler", en="painter", art="a"),
    dict(ja="作家", ko="작가", da="forfatter", en="writer", art="a"),
    dict(ja="農家", ko="농부", da="landmand", en="farmer", art="a"),
    dict(ja="運転手", ko="운전사", da="chauffør", en="driver", art="a"),
    dict(ja="歌手", ko="가수", da="sanger", en="singer", art="a"),
    dict(ja="俳優", ko="배우", da="skuespiller", en="actor", art="an"),
    dict(ja="建築家", ko="건축가", da="arkitekt", en="architect", art="an"),
    dict(ja="研究者", ko="연구원", da="forsker", en="researcher", art="a"),
    dict(ja="美容師", ko="미용사", da="frisør", en="hairdresser", art="a"),
]

# ---------------- 人・家族 ----------------
PEOPLE = [
    dict(ja="友達", ko="친구", da="ven", g="en", dad="vennen", en="friend", art="a"),
    dict(ja="母", ko="어머니", da="mor", g="en", dad="moren", en="mother", art="a"),
    dict(ja="父", ko="아버지", da="far", g="en", dad="faren", en="father", art="a"),
    dict(ja="息子", ko="아들", da="søn", g="en", dad="sønnen", en="son", art="a"),
    dict(ja="娘", ko="딸", da="datter", g="en", dad="datteren", en="daughter", art="a"),
    dict(ja="祖母", ko="할머니", da="bedstemor", g="en", dad="bedstemoren", en="grandmother", art="a"),
    dict(ja="祖父", ko="할아버지", da="bedstefar", g="en", dad="bedstefaren", en="grandfather", art="a"),
    dict(ja="妻", ko="아내", da="kone", g="en", dad="konen", en="wife", art="a"),
    dict(ja="夫", ko="남편", da="mand", g="en", dad="manden", en="husband", art="a"),
    dict(ja="同僚", ko="동료", da="kollega", g="en", dad="kollegaen", en="colleague", art="a"),
    dict(ja="隣人", ko="이웃", da="nabo", g="en", dad="naboen", en="neighbor", art="a"),
    dict(ja="犬", ko="개", da="hund", g="en", dad="hunden", en="dog", art="a"),
    dict(ja="猫", ko="고양이", da="kat", g="en", dad="katten", en="cat", art="a"),
    dict(ja="赤ちゃん", ko="아기", da="baby", g="en", dad="babyen", en="baby", art="a"),
    dict(ja="ルームメイト", ko="룸메이트", da="bofælle", g="en", dad="bofællen", en="roommate", art="a"),
]

# ---------------- 動作 ----------------
# ko_p: 韓国語 해요体現在 / ko_pa: 過去
# da_p: デンマーク語 現在 / da_pa: 過去
# en_b: 英語 原形 / en_pa: 過去 / en_ing: 進行形
# ja_p: 日本語 ます形 / ja_pa: ました形
ACTIONS = [
    dict(ja_p="勉強します", ja_pa="勉強しました", ko_p="공부해요", ko_pa="공부했어요",
         da_p="studerer", da_pa="studerede", en_b="study", en_pa="studied", en_ing="studying"),
    dict(ja_p="働きます", ja_pa="働きました", ko_p="일해요", ko_pa="일했어요",
         da_p="arbejder", da_pa="arbejdede", en_b="work", en_pa="worked", en_ing="working"),
    dict(ja_p="運動します", ja_pa="運動しました", ko_p="운동해요", ko_pa="운동했어요",
         da_p="træner", da_pa="trænede", en_b="exercise", en_pa="exercised", en_ing="exercising"),
    dict(ja_p="料理します", ja_pa="料理しました", ko_p="요리해요", ko_pa="요리했어요",
         da_p="laver mad", da_pa="lavede mad", en_b="cook", en_pa="cooked", en_ing="cooking"),
    dict(ja_p="掃除します", ja_pa="掃除しました", ko_p="청소해요", ko_pa="청소했어요",
         da_p="gør rent", da_pa="gjorde rent", en_b="clean", en_pa="cleaned", en_ing="cleaning"),
    dict(ja_p="散歩します", ja_pa="散歩しました", ko_p="산책해요", ko_pa="산책했어요",
         da_p="går en tur", da_pa="gik en tur", en_b="take a walk", en_pa="took a walk", en_ing="taking a walk"),
    dict(ja_p="買い物します", ja_pa="買い物しました", ko_p="쇼핑해요", ko_pa="쇼핑했어요",
         da_p="shopper", da_pa="shoppede", en_b="go shopping", en_pa="went shopping", en_ing="going shopping"),
    dict(ja_p="本を読みます", ja_pa="本を読みました", ko_p="책을 읽어요", ko_pa="책을 읽었어요",
         da_p="læser en bog", da_pa="læste en bog", en_b="read a book", en_pa="read a book", en_ing="reading a book"),
    dict(ja_p="音楽を聞きます", ja_pa="音楽を聞きました", ko_p="음악을 들어요", ko_pa="음악을 들었어요",
         da_p="hører musik", da_pa="hørte musik", en_b="listen to music", en_pa="listened to music", en_ing="listening to music"),
    dict(ja_p="映画を見ます", ja_pa="映画を見ました", ko_p="영화를 봐요", ko_pa="영화를 봤어요",
         da_p="ser en film", da_pa="så en film", en_b="watch a movie", en_pa="watched a movie", en_ing="watching a movie"),
    dict(ja_p="コーヒーを飲みます", ja_pa="コーヒーを飲みました", ko_p="커피를 마셔요", ko_pa="커피를 마셨어요",
         da_p="drikker kaffe", da_pa="drak kaffe", en_b="drink coffee", en_pa="drank coffee", en_ing="drinking coffee"),
    dict(ja_p="友達に会います", ja_pa="友達に会いました", ko_p="친구를 만나요", ko_pa="친구를 만났어요",
         da_p="mødes med en ven", da_pa="mødtes med en ven", en_b="meet a friend", en_pa="met a friend", en_ing="meeting a friend"),
    dict(ja_p="自転車に乗ります", ja_pa="自転車に乗りました", ko_p="자전거를 타요", ko_pa="자전거를 탔어요",
         da_p="cykler", da_pa="cyklede", en_b="ride a bike", en_pa="rode a bike", en_ing="riding a bike"),
    dict(ja_p="歌を歌います", ja_pa="歌を歌いました", ko_p="노래를 불러요", ko_pa="노래를 불렀어요",
         da_p="synger", da_pa="sang", en_b="sing", en_pa="sang", en_ing="singing"),
    dict(ja_p="写真を撮ります", ja_pa="写真を撮りました", ko_p="사진을 찍어요", ko_pa="사진을 찍었어요",
         da_p="tager billeder", da_pa="tog billeder", en_b="take photos", en_pa="took photos", en_ing="taking photos"),
    dict(ja_p="手紙を書きます", ja_pa="手紙を書きました", ko_p="편지를 써요", ko_pa="편지를 썼어요",
         da_p="skriver et brev", da_pa="skrev et brev", en_b="write a letter", en_pa="wrote a letter", en_ing="writing a letter"),
    dict(ja_p="早く起きます", ja_pa="早く起きました", ko_p="일찍 일어나요", ko_pa="일찍 일어났어요",
         da_p="står tidligt op", da_pa="stod tidligt op", en_b="get up early", en_pa="got up early", en_ing="getting up early"),
    dict(ja_p="遅く寝ます", ja_pa="遅く寝ました", ko_p="늦게 자요", ko_pa="늦게 잤어요",
         da_p="går sent i seng", da_pa="gik sent i seng", en_b="go to bed late", en_pa="went to bed late", en_ing="going to bed late"),
    dict(ja_p="走ります", ja_pa="走りました", ko_p="달려요", ko_pa="달렸어요",
         da_p="løber", da_pa="løb", en_b="run", en_pa="ran", en_ing="running"),
    dict(ja_p="泳ぎます", ja_pa="泳ぎました", ko_p="수영해요", ko_pa="수영했어요",
         da_p="svømmer", da_pa="svømmede", en_b="swim", en_pa="swam", en_ing="swimming"),
    dict(ja_p="踊ります", ja_pa="踊りました", ko_p="춤춰요", ko_pa="춤췄어요",
         da_p="danser", da_pa="dansede", en_b="dance", en_pa="danced", en_ing="dancing"),
    dict(ja_p="ゲームをします", ja_pa="ゲームをしました", ko_p="게임해요", ko_pa="게임했어요",
         da_p="spiller computerspil", da_pa="spillede computerspil", en_b="play video games", en_pa="played video games", en_ing="playing video games"),
    dict(ja_p="ピアノを弾きます", ja_pa="ピアノを弾きました", ko_p="피아노를 쳐요", ko_pa="피아노를 쳤어요",
         da_p="spiller klaver", da_pa="spillede klaver", en_b="play the piano", en_pa="played the piano", en_ing="playing the piano"),
    dict(ja_p="日記を書きます", ja_pa="日記を書きました", ko_p="일기를 써요", ko_pa="일기를 썼어요",
         da_p="skriver dagbog", da_pa="skrev dagbog", en_b="write in my diary", en_pa="wrote in my diary", en_ing="writing in my diary"),
    dict(ja_p="ニュースを見ます", ja_pa="ニュースを見ました", ko_p="뉴스를 봐요", ko_pa="뉴스를 봤어요",
         da_p="ser nyhederne", da_pa="så nyhederne", en_b="watch the news", en_pa="watched the news", en_ing="watching the news"),
]

# ---------------- 形容詞 ----------------
# ko_p : 韓国語の述語形(해요体)
# da   : デンマーク語 共性形 / da_n: 中性形(et語のとき)
ADJS = [
    dict(ja="大きい", jp="大きいです", ko_p="커요", da="stor", da_n="stort", en="big", ok="read vehicle device thing culture commerce nature service"),
    dict(ja="小さい", jp="小さいです", ko_p="작아요", da="lille", da_n="lille", en="small", ok="read vehicle device thing culture commerce nature service"),
    dict(ja="古い", jp="古いです", ko_p="오래됐어요", da="gammel", da_n="gammelt", en="old", ok="read vehicle device thing culture commerce nature service"),
    dict(ja="高い", jp="高いです", ko_p="비싸요", da="dyr", da_n="dyrt", en="expensive", ok="read vehicle device thing commerce"),
    dict(ja="安い", jp="安いです", ko_p="싸요", da="billig", da_n="billigt", en="cheap", ok="read vehicle device thing commerce"),
    dict(ja="美しい", jp="美しいです", ko_p="아름다워요", da="smuk", da_n="smukt", en="beautiful", ok="read vehicle device thing culture commerce nature service"),
    dict(ja="面白い", jp="面白いです", ko_p="재미있어요", da="sjov", da_n="sjovt", en="fun", ok="read culture"),
    dict(ja="難しい", jp="難しいです", ko_p="어려워요", da="svær", da_n="svært", en="difficult", ok="read"),
    dict(ja="簡単", jp="簡単です", ko_p="쉬워요", da="nem", da_n="nemt", en="easy", ok="read"),
    dict(ja="暖かい", jp="暖かいです", ko_p="따뜻해요", da="varm", da_n="varmt", en="warm", ok="nature"),
    dict(ja="冷たい", jp="冷たいです", ko_p="차가워요", da="kold", da_n="koldt", en="cold", ok="nature"),
    dict(ja="速い", jp="速いです", ko_p="빨라요", da="hurtig", da_n="hurtigt", en="fast", ok="vehicle device"),
    dict(ja="遅い", jp="遅いです", ko_p="느려요", da="langsom", da_n="langsomt", en="slow", ok="vehicle device"),
    dict(ja="きれい", jp="きれいです", ko_p="깨끗해요", da="ren", da_n="rent", en="clean", ok="read vehicle device thing culture commerce nature service"),
    dict(ja="静か", jp="静かです", ko_p="조용해요", da="stille", da_n="stille", en="quiet", ok="culture nature service commerce"),
    dict(ja="有名", jp="有名です", ko_p="유명해요", da="berømt", da_n="berømt", en="famous", ok="read culture nature commerce"),
    dict(ja="重い", jp="重いです", ko_p="무거워요", da="tung", da_n="tungt", en="heavy", ok="read vehicle device thing"),
    dict(ja="軽い", jp="軽いです", ko_p="가벼워요", da="let", da_n="let", en="light", ok="read vehicle device thing"),
    dict(ja="便利", jp="便利です", ko_p="편리해요", da="praktisk", da_n="praktisk", en="convenient", ok="read vehicle device thing commerce service"),
    dict(ja="人気", jp="人気があります", ko_p="인기가 많아요", da="populær", da_n="populært", en="popular", ok="read culture commerce nature"),
]

# ---------------- 時間表現 ----------------
# ko_e: 韓国語で「에」を付けるか(오늘/내일/어제 は付けない)
TIMES = [
    dict(ja="今日", ko="오늘", ko_e=False, da="i dag", en="today"),
    dict(ja="明日", ko="내일", ko_e=False, da="i morgen", en="tomorrow"),
    dict(ja="昨日", ko="어제", ko_e=False, da="i går", en="yesterday"),
    dict(ja="今週", ko="이번 주", ko_e=True, da="i denne uge", en="this week"),
    dict(ja="来週", ko="다음 주", ko_e=True, da="i næste uge", en="next week"),
    dict(ja="週末", ko="주말", ko_e=True, da="i weekenden", en="this weekend"),
    dict(ja="今晩", ko="오늘 저녁", ko_e=True, da="i aften", en="tonight"),
    dict(ja="月曜日", ko="월요일", ko_e=True, da="på mandag", en="on Monday"),
    dict(ja="火曜日", ko="화요일", ko_e=True, da="på tirsdag", en="on Tuesday"),
    dict(ja="水曜日", ko="수요일", ko_e=True, da="på onsdag", en="on Wednesday"),
    dict(ja="木曜日", ko="목요일", ko_e=True, da="på torsdag", en="on Thursday"),
    dict(ja="金曜日", ko="금요일", ko_e=True, da="på fredag", en="on Friday"),
    dict(ja="土曜日", ko="토요일", ko_e=True, da="på lørdag", en="on Saturday"),
    dict(ja="日曜日", ko="일요일", ko_e=True, da="på søndag", en="on Sunday"),
    dict(ja="来月", ko="다음 달", ko_e=True, da="i næste måned", en="next month"),
    dict(ja="夏休み", ko="여름 방학", ko_e=True, da="i sommerferien", en="during the summer break"),
]

# ---------------- 国・言語 ----------------
COUNTRIES = [
    dict(ja="韓国", ko="한국", da="Korea", en="Korea", lang_ja="韓国語", lang_ko="한국어", lang_da="koreansk", lang_en="Korean"),
    dict(ja="デンマーク", ko="덴마크", da="Danmark", en="Denmark", lang_ja="デンマーク語", lang_ko="덴마크어", lang_da="dansk", lang_en="Danish"),
    dict(ja="日本", ko="일본", da="Japan", en="Japan", lang_ja="日本語", lang_ko="일본어", lang_da="japansk", lang_en="Japanese"),
    dict(ja="イギリス", ko="영국", da="England", en="England", lang_ja="英語", lang_ko="영어", lang_da="engelsk", lang_en="English"),
    dict(ja="フランス", ko="프랑스", da="Frankrig", en="France", lang_ja="フランス語", lang_ko="프랑스어", lang_da="fransk", lang_en="French"),
    dict(ja="ドイツ", ko="독일", da="Tyskland", en="Germany", lang_ja="ドイツ語", lang_ko="독일어", lang_da="tysk", lang_en="German"),
    dict(ja="スペイン", ko="스페인", da="Spanien", en="Spain", lang_ja="スペイン語", lang_ko="스페인어", lang_da="spansk", lang_en="Spanish"),
    dict(ja="イタリア", ko="이탈리아", da="Italien", en="Italy", lang_ja="イタリア語", lang_ko="이탈리아어", lang_da="italiensk", lang_en="Italian"),
    dict(ja="中国", ko="중국", da="Kina", en="China", lang_ja="中国語", lang_ko="중국어", lang_da="kinesisk", lang_en="Chinese"),
    dict(ja="スウェーデン", ko="스웨덴", da="Sverige", en="Sweden", lang_ja="スウェーデン語", lang_ko="스웨덴어", lang_da="svensk", lang_en="Swedish"),
    dict(ja="ノルウェー", ko="노르웨이", da="Norge", en="Norway", lang_ja="ノルウェー語", lang_ko="노르웨이어", lang_da="norsk", lang_en="Norwegian"),
    dict(ja="オランダ", ko="네덜란드", da="Holland", en="the Netherlands", lang_ja="オランダ語", lang_ko="네덜란드어", lang_da="hollandsk", lang_en="Dutch"),
]

# ---------------- 天気 ----------------
WEATHER = [
    dict(ja="暑い", ko="더워요", da="varmt", en="hot"),
    dict(ja="寒い", ko="추워요", da="koldt", en="cold"),
    dict(ja="暖かい", ko="따뜻해요", da="lunt", en="warm"),
    dict(ja="涼しい", ko="시원해요", da="køligt", en="cool"),
    dict(ja="天気がいい", ko="날씨가 좋아요", da="godt vejr", en="nice out"),
    dict(ja="曇り", ko="흐려요", da="overskyet", en="cloudy"),
    dict(ja="風が強い", ko="바람이 불어요", da="blæsende", en="windy"),
    dict(ja="蒸し暑い", ko="습해요", da="fugtigt", en="humid"),
]
