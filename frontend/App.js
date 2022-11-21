import 'regenerator-runtime/runtime';
import React from 'react';
import './assets/global.css';
import {AddPost, AllPosts, PostsByTag, SignInPrompt, SignOutButton} from './ui-components';

export default function App({ isSignedIn, contractId, wallet, contract }) {
    const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
    const [uiPleaseWait, setUiPleaseWait] = React.useState(true);
    const [allPosts, setAllPosts] = React.useState([]);
    React.useEffect(() => {
        contract.get_all_posts()
            .then(setAllPosts)
            .catch(alert)
            .finally(() => {
                setUiPleaseWait(false);
            })
    }, []);

    /// If user not signed-in with wallet - show prompt
    if (!isSignedIn) {
        // Sign-in flow will reload the page later
        return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
    }
    return (
        <>
            <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
            <main className={uiPleaseWait ? 'please-wait' : ''}>
                <h1>Social Media NEAR Dapp</h1>
                <PostsByTag contract={contract} setAllPosts={setAllPosts} setUiPleaseWait={setUiPleaseWait} />
                <h2>All Posts</h2>
                <AllPosts contract={contract} allPosts={allPosts} setAllPosts={setAllPosts} setUiPleaseWait={setUiPleaseWait} />
                <AddPost contract={contract} setAllPosts={setAllPosts} setUiPleaseWait={setUiPleaseWait}/>
                <br /><br />
            </main>
        </>
    );
}