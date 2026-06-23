const data = require("./data");
const b = [
  ["jaychou","Jay Chou",8200000,1],
  ["jjlin","JJ Lin",5600000,1],
  ["ericchou0622","Eric Chou",1250000,1],
  ["leonardodicaprio","Leonardo DiCaprio",62000000,1],
  ["daciexchao","Dacie Chao",880000,0],
  ["justezlike_ac","Just Ezlike",450000,0],
  ["austinli0105","Austin Li Jiaqi",3800000,1],
  ["yangmiofficial","Yang Mi",4500000,1],
  ["dilireba_","Dilraba",3800000,1],
  ["liuyifei_official","Liu Yifei",2900000,1],
  ["natgeo","National Geographic",285000000,1],
  ["nasa","NASA",95000000,1],
];
const caps = ["Post1","Post2","Post3","Post4","Post5","Post6","Post7","Post8"];
const us = ["u1","u2","u3"];
const ct = ["Nice!","Great!","Cool!"];
data.clearAll();
for(let i=0;i<b.length;i++){
  const bg = data.upsertBlogger({username:b[i][0],full_name:b[i][1],biography:"",profile_pic_url:"https://picsum.photos/seed/"+b[i][0]+"/200/200",followers_count:b[i][2],following_count:Math.floor(Math.random()*500),media_count:8,is_verified:b[i][3]});
  for(let j=0;j<8;j++){
    data.addPost({shortcode:b[i][0]+"_p"+j,blogger_id:bg.id,caption:caps[j],media_url:"https://picsum.photos/id/"+((j+1)*50)+"/640/640",thumbnail_url:"",display_url:"https://picsum.photos/id/"+((j+1)*50)+"/640/640",media_type:"GraphImage",likes_count:Math.floor(Math.random()*500000+5000),comments_count:Math.floor(Math.random()*3000+50),taken_at:new Date(Date.now()-j*86400000*4).toISOString(),is_video:j%7===0?1:0});
    for(let k=0;k<3;k++) data.addComment({shortcode:b[i][0]+"_p"+j,commenter:us[k],comment_text:ct[k]});
  }
  for(let j=0;j<3;j++) data.addStory({shortcode:b[i][0]+"_s"+j,blogger_id:bg.id,media_url:"https://picsum.photos/id/"+((j+1)*30)+"/480/854",media_type:"IMAGE",taken_at:new Date().toISOString(),expires_at:new Date(Date.now()+86400000*3).toISOString(),is_downloadable:1});
}
console.log("OK: "+data.getBloggerCount()+" bloggers");
