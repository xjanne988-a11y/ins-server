const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");
db.exec("DELETE FROM comments");
db.exec("DELETE FROM stories");
db.exec("DELETE FROM posts");
db.exec("DELETE FROM bloggers");

const bloggers = [
  {u:"jaychou",n:"Jay Chou 周杰伦",b:"歌手、作曲人、演员",f:8200000,g:180,m:420,v:1},
  {u:"jjlin",n:"JJ Lin 林俊杰",b:"歌手、音乐制作人",f:5600000,g:210,m:530,v:1},
  {u:"ericchou0622",n:"Eric Chou 周兴哲",b:"创作歌手",f:1250000,g:160,m:340,v:1},
  {u:"leonardodicaprio",n:"Leonardo DiCaprio",b:"Actor & Environmentalist",f:62000000,g:200,m:1500,v:1},
  {u:"daciexchao",n:"Dacie Chao",b:"Travel & Lifestyle",f:880000,g:340,m:560,v:0},
  {u:"justezlike_ac",n:"Just Ezlike",b:"Fitness & Daily Life",f:450000,g:280,m:220,v:0},
  {u:"austinli0105",n:"Austin Li Jiaqi 李佳琦",b:"直播主播 / 美妆达人",f:3800000,g:90,m:1150,v:1},
  {u:"yangmiofficial",n:"Yang Mi 杨幂",b:"演员",f:4500000,g:150,m:680,v:1},
  {u:"dilireba_",n:"Dilraba Dilmurat 迪丽热巴",b:"演员",f:3800000,g:120,m:520,v:1},
  {u:"liuyifei_official",n:"Liu Yifei 刘亦菲",b:"演员",f:2900000,g:100,m:410,v:1},
  {u:"natgeo",n:"National Geographic",b:"Exploring the world",f:285000000,g:275,m:25000,v:1},
  {u:"nasa",n:"NASA",b:"Explore the universe",f:95000000,g:82,m:6500,v:1},
];

const caps = {
  jaychou:["新专辑来了🎵","演唱会现场","哎哟不错哦😄","录音室日常","篮球🏀","午夜钢琴🎹","谢谢大家","新歌MV🎬"],
  jjlin:["练歌日常🎤","谢谢粉丝们❤️","新作品筹备中","音乐会后台","咖啡☕️","创作灵感💡","巡演路上","晚安🌙"],
  ericchou0622:["新歌上线🎵","谢谢大家❤️","创作中...","演唱会彩排","后台自拍🤳","你听见了吗？","今晚演出","Good night🌙"],
  leonardodicaprio:["Climate action🌍","On set🎬","Protect our oceans","New project","Grateful","Nature🌲","Film festival🎥","Stay active"],
  daciexchao:["今日穿搭👗","旅行日记✈️","早餐时光🥐","夕阳下的影子","新咖啡馆☕️","周末愉快🌸","OOTD","Life lately📸"],
  justezlike_ac:["晨练打卡💪","健身日常🏋️","新食谱🥗","周末跑山⛰️","坚持就是胜利","今日训练","Progress📈","Rest day😌"],
  austinli0105:["OMG！买它！🛍️","今日开箱📦","护肤分享✨","直播预告🎥","好物推荐💄","谢谢家人们❤️","新品试用","日常vlog🎬"],
  yangmiofficial:["新剧路透🎬","今日妆容💄","谢谢大家❤️","工作日常","街拍📸","好好生活","剧组日常","自拍福利🤳"],
  dilireba_:["新造型🌸","拍摄ing🎬","今日穿搭👗","美食打卡🍜","谢谢你们❤️","工作日志","晚安~🌙"],
  liuyifei_official:["新作品🎬","读书时光📖","自然🌿","谢谢大家","片场日常","幕后花絮","Peace & Love✨"],
  natgeo:["Beauty of our planet🌍","Wildlife🦁","Ocean wonders🌊","Mountains🏔️","Through the lens📷","Untold stories","Nature🌿","Explore more"],
  nasa:["Look up at the stars🌟","Mission update🚀","Earth from space🌎","New discoveries🔭","Behind the science","Solar system wonders","Artemis progress","The universe awaits"],
};

const comments = [
  {e:"❤️❤️❤️",c:"太棒了！"},{e:"🔥🔥🔥",c:"加油！"},{e:"😍😍😍",c:"好美啊！"},{e:"👏👏👏",c:"支持支持！"},{e:"💪💪💪",c:"太厉害了"},{e:"✨✨✨",c:"永远支持你！"},{e:"🌟",c:"期待更多作品"},{e:"🎉🎉🎉",c:"恭喜！"},{e:"👍👍👍",c:"太赞了"},{e:"💯",c:"完美！"},
];

const usernames = ["music_fan_88","travel_lover","photo_addict","insta_daily","star_gazer","happy_life","dream_chaser","art_lover","nature_boy","city_girl","sunshine_22","moonlight_7","coffee_time","weekend_vibes","fitness_goal"];

const bs = db.prepare("INSERT INTO bloggers (username,full_name,biography,profile_pic_url,followers_count,following_count,media_count,is_verified,last_updated) VALUES (?,?,?,?,?,?,?,?,datetime('now'))");
const ps = db.prepare("INSERT INTO posts (shortcode,blogger_id,caption,media_url,thumbnail_url,display_url,media_type,likes_count,comments_count,taken_at,is_video,last_updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'))");
const ss = db.prepare("INSERT INTO stories (shortcode,blogger_id,media_url,media_type,taken_at,expires_at,is_downloadable,last_updated) VALUES (?,?,?,?,?,?,?,datetime('now'))");
const cs2 = db.prepare("INSERT INTO comments (shortcode,commenter,comment_text,created_at) VALUES (?,?,?,datetime('now'))");

const ins = db.transaction(function() {
  for (var b of bloggers) {
    bs.run(b.u,b.n,b.b,"https://picsum.photos/seed/"+b.u+"_av/200/200",b.f,b.g,b.m,b.v);
    var bg = db.prepare("SELECT id FROM bloggers WHERE username = ?").get(b.u);
    var capList = caps[b.u];

    for (var i=0;i<8;i++) {
      var sc = b.u+"_p"+i;
      var ta = new Date(Date.now()-i*86400000*4-Math.floor(Math.random()*86400000)).toISOString();
      var likes = Math.floor(Math.random()*500000+5000);
      var commentCount = Math.floor(Math.random()*3000+50);
      var imgId = (i+1)*50+Math.floor(Math.random()*49);
      ps.run(sc,bg.id,capList[i%capList.length],"https://picsum.photos/id/"+imgId+"/640/640","","https://picsum.photos/id/"+imgId+"/640/640","GraphImage",likes,commentCount,ta,i%7===0?1:0);

      var nc = Math.floor(Math.random()*4)+2;
      for (var j=0;j<nc;j++) {
        var c = comments[Math.floor(Math.random()*comments.length)];
        cs2.run(sc,usernames[Math.floor(Math.random()*usernames.length)],c.e+" "+c.c);
      }
    }

    for (var i=0;i<3;i++) {
      var sc = b.u+"_s"+i;
      var ta = new Date(Date.now()-i*3600000*5).toISOString();
      var ea = new Date(Date.now()+86400000*(3-i)).toISOString();
      var imgId = (i+1)*30+Math.floor(Math.random()*29);
      ss.run(sc,bg.id,"https://picsum.photos/id/"+imgId+"/480/854","IMAGE",ta,ea,1);
    }
  }
});
ins();

var bc = db.prepare("SELECT COUNT(*) as c FROM bloggers").get();
var pc = db.prepare("SELECT COUNT(*) as c FROM posts").get();
var cc = db.prepare("SELECT COUNT(*) as c FROM comments").get();
console.log("Done:",bc.c,"bloggers,",pc.c,"posts,",cc.c,"comments");
db.close();
