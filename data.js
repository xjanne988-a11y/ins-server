const bloggers = [];
const posts = [];
const stories = [];
const comments = [];
let bloggerId = 0;

const data = {
  getAllBloggers() {
    return bloggers.map(b => ({
      id: b.id, username: b.username, full_name: b.full_name,
      biography: b.biography, profile_pic_url: b.profile_pic_url,
      followers_count: b.followers_count, following_count: b.following_count,
      media_count: b.media_count, is_verified: b.is_verified,
      last_updated: b.last_updated
    })).sort((a, b) => (b.last_updated || "").localeCompare(a.last_updated || ""));
  },
  getBlogger(username) { return bloggers.find(b => b.username === username); },
  getBloggerById(id) { return bloggers.find(b => b.id === id); },
  upsertBlogger(d) {
    let b = bloggers.find(x => x.username === d.username);
    if (b) { Object.assign(b, d); b.last_updated = new Date().toISOString(); return b; }
    bloggerId++; b = { id: bloggerId, ...d, last_updated: new Date().toISOString(), created_at: new Date().toISOString() };
    bloggers.push(b); return b;
  },
  addPost(p) { if (!posts.find(x => x.shortcode === p.shortcode)) posts.push({ ...p, last_updated: new Date().toISOString(), created_at: new Date().toISOString() }); },
  getPostsByBlogger(bid) { return posts.filter(p => p.blogger_id === bid).sort((a, b) => (b.taken_at || "").localeCompare(a.taken_at || "")).slice(0, 50).map(p => ({ shortcode: p.shortcode, caption: p.caption, media_url: p.media_url, thumbnail_url: p.thumbnail_url, display_url: p.display_url, media_type: p.media_type, likes_count: p.likes_count, comments_count: p.comments_count, taken_at: p.taken_at, is_video: p.is_video })); },
  getPost(sc) {
    const p = posts.find(x => x.shortcode === sc); if (!p) return null;
    const b = bloggers.find(x => x.id === p.blogger_id); return { ...p, username: b?.username, full_name: b?.full_name, blogger_pic: b?.profile_pic_url };
  },
  addStory(s) { if (!stories.find(x => x.shortcode === s.shortcode)) stories.push({ ...s, last_updated: new Date().toISOString(), created_at: new Date().toISOString() }); },
  getStoriesByBlogger(bid) { return stories.filter(s => s.blogger_id === bid && (!s.expires_at || new Date(s.expires_at) > new Date())).sort((a, b) => (b.taken_at || "").localeCompare(a.taken_at || "")).map(s => ({ shortcode: s.shortcode, media_url: s.media_url, media_type: s.media_type, taken_at: s.taken_at, expires_at: s.expires_at, is_downloadable: s.is_downloadable })); },
  addComment(c) { comments.push({ ...c, created_at: new Date().toISOString() }); },
  getComments(sc) { return comments.filter(c => c.shortcode === sc).sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")).slice(0, 50); },
  clearAll() { bloggers.length = 0; posts.length = 0; stories.length = 0; comments.length = 0; bloggerId = 0; },
  getBloggerCount() { return bloggers.length; },
  getPostCount() { return posts.length; },
  getCommentCount() { return comments.length; },
};
module.exports = data;
