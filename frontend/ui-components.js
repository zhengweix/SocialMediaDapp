import React from 'react';
import {Wallet} from "./near-wallet";

export function SignInPrompt({greeting, onClick}) {
  return (
    <main>
      <h1>
        Social Meida NEAR Dapp
      </h1>
      <br/>
      <p style={{ textAlign: 'center' }}>
        <button onClick={onClick}>Sign in with NEAR Wallet</button>
      </p>
    </main>
  );
}

export function SignOutButton({accountId, onClick}) {
  return (
    <button style={{ float: 'right' }} onClick={onClick}>
      Sign out {accountId}
    </button>
  );
}

export function Post ({post, contract, setAllPosts, setUiPleaseWait}) {
    function handleLikePost(e, postId) {
        e.preventDefault();
        setUiPleaseWait(true);
        contract.like_a_post(postId)
            .then(async() => {return contract.get_all_posts();})
            .then(setAllPosts)
            .finally(() => {
                setUiPleaseWait(false);
            });
    }

    function handleDeletePost(e, postId) {
        e.preventDefault();
        setUiPleaseWait(true);
        contract.delete_post_by_id(postId)
            .then(async() => {return contract.get_all_posts();})
            .then(setAllPosts)
            .finally(() => {
                setUiPleaseWait(false);
            });
    }
    return (
        <>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <img src={post.media} style={{width: '100%'}} />
            {post.tags.map((tag, tagIndex) => {
                return (
                    <i key={tagIndex}> #{tag} </i>
                )
            })}
            <p>Likes: {post.users_who_likes.length}</p>
            <button onClick={event => handleLikePost(event, post.id)}>❤ Like this post</button>&nbsp;<button onClick={event => handleDeletePost(event, post.id)}>Delete</button>
        </>
    )
}

export function AddPost({contract, setAllPosts, setUiPleaseWait}) {
    function handlePostSubmission(e) {
        e.preventDefault();
        setUiPleaseWait(true);
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var tags = document.getElementById('tags').value;
        var media = document.getElementById('media').value;
        contract.add_post(title, description, tags, media)
            .then(async() => {return contract.get_all_posts();})
            .then(setAllPosts)
            .finally(() => {
                setUiPleaseWait(false);
            });
    }

    return (
        <>
            <h2>Add Post</h2>
            <form onSubmit={handlePostSubmission}>
                <label>Title</label><br />
                <input placeholder='title' id='title' /><br /><br />
                <label>Description</label><br />
                <textarea placeholder='description' id='description' ></textarea><br /><br />
                <label>Tags</label><br />
                <input placeholder='tag1, tag2' id='tags' /><br /><br />
                <label>Media</label><br />
                <input placeholder='media' id='media' /><br /><br />
                <button>Submit Post</button>
            </form>
        </>
    )
}

export function PostsByTag({setUiPleaseWait, contract, setAllPosts}) {
    const [postsByTag, setPostsByTag] = React.useState([]);
    function handleGetPostsByTag(e) {
        e.preventDefault();
        setUiPleaseWait(true);
        var tag = document.getElementById('tag').value;
        contract.get_posts_by_tag(tag)
            .then(setPostsByTag)
            .finally(() => {
                setUiPleaseWait(false);
            });
    }
    return (
        <>
            <h2>Posts By Tag</h2>
            <form onSubmit={handleGetPostsByTag}>
                <label>Tag</label>&nbsp;
                <input placeholder='Tag' id='tag' /> &nbsp;
                <button>Get posts</button>
                <br /><br />
                <AllPosts contract={contract} allPosts={postsByTag} setAllPosts={setAllPosts} setUiPleaseWait={setUiPleaseWait} />
            </form>
        </>
    )
}

export function AllPosts({contract, allPosts, setAllPosts, setUiPleaseWait}) {
    return (
        <>
            {
                allPosts && allPosts.length > 0 ? allPosts.map((post, index) => {
                    if (post[1]) {
                        post = post[1];
                    }
                    return (
                        <>
                            <Post key={index} post={post} contract={contract} setAllPosts={setAllPosts} setUiPleaseWait={setUiPleaseWait} />
                        </>
                    )
                }) : <center>No Post</center>
            }
        </>
    )
}
