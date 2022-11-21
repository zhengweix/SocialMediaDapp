import {NearBindgen, near, call, view, UnorderedMap, Vector} from 'near-sdk-js';

class Post {
  id: string;
  title: string;
  description: string;
  tags: Vector<any>;
  media: string;
  users_who_likes: string[];
  owner_id: string

  constructor(id: string, title: string, description: string, tags: Vector<any>, media: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.media = media;
    this.users_who_likes = [];
    this.owner_id = near.predecessorAccountId();
  }
}

@NearBindgen({})
class SocialMedia {
  posts: UnorderedMap<any>;
  number_of_posts: number;
  likes_by_user_id: UnorderedMap<any>;
  posts_by_tag: UnorderedMap<any>;

  constructor() {
    this.posts = new UnorderedMap("p");
    this.number_of_posts = 0;
    this.likes_by_user_id = new UnorderedMap("l");
    this.posts_by_tag = new UnorderedMap("t");
  }

  //Create
  @call({})
  add_post({title, description, tags, media}): Post {
    var id = this.number_of_posts.toString();
    tags = tags.split(",");
    var post = new Post(id, title, description, tags, media);
    this.posts.set(id, post);
    this.number_of_posts++;
    this.add_posts_by_tag(post, tags);
    return post;
  }

  @call({})
  add_posts_by_tag(post: Post, tags: string[]){
    var posts_for_tag;
    for (let i = 0; i < tags.length; i++) {
      var tag = tags[i];
      if (this.posts_by_tag.get(tag) == null) {
        posts_for_tag = [];
      } else {
        posts_for_tag = this.posts_by_tag.get(tag);
      }
      posts_for_tag.push(post);
      this.posts_by_tag.set(tag, posts_for_tag)
    }
  }

  @call({})
  like_a_post({postId}) : Post {
    postId = postId.toString();
    if (this.posts.get(postId) == null) {
      return null;
    }
    var post = this.posts.get(postId) as Post;
    var userId = near.predecessorAccountId();
    post.users_who_likes.push(userId);
    this.add_post_to_my_liked(userId, post);
    return post;
  }

  @call({})
  add_post_to_my_liked(userId, post) {
    var likes;
    if(this.likes_by_user_id.get(userId) != null) {
      likes = this.likes_by_user_id.get(userId);
    } else {
      likes = []
    }
    likes.push(post);
    this.likes_by_user_id.set(userId, likes);
  }

  // Reterive
  @view({})
  get_all_posts({}) {
    return this.posts.toArray();
  }

  @call({})
  get_my_liked_posts({}): Post[] {
    var my_like_posts;
    var userId = near.predecessorAccountId();
    if (this.likes_by_user_id.get(userId) != null) {
      my_like_posts = this.likes_by_user_id.get(userId);
    } else {
      return []
    }
    return my_like_posts;
  }

  @view({})
  get_posts_by_tag({tag}) {
    return this.posts_by_tag.get(tag);
  }

  // Update

  // Delete
  @call({})
  delete_all_posts() {
    this.posts = new UnorderedMap("p");
  }

  @call({})
  delete_post_by_id(postId) {
    this.posts.remove(postId)
  }
}