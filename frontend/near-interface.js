export class Contract {
    wallet;
    contractId;

    constructor({wallet, contractId}) {
        this.wallet = wallet;
        this.contractId = contractId;
    }

    async get_all_posts() {
        return await this.wallet.viewMethod({
            method: 'get_all_posts',
            contractId: this.contractId
        });
    }

    async delete_post_by_id(postId) {
        return await this.wallet.callMethod({
            method: 'delete_post_by_id',
            args:{
                postId
            },
            contractId: this.contractId
        });
    }

    async add_post(title, description, tags, media) {
        return await this.wallet.callMethod({
            method: 'add_post',
            args:{
                title, description, tags, media
            },
            contractId: this.contractId
        });
    }

    async like_a_post(postId) {
        return await this.wallet.callMethod({
            method: 'like_a_post',
            args:{
                postId
            },
            contractId: this.contractId
        });
    }

    async get_posts_by_tag(tag) {
        return await this.wallet.viewMethod({
            method: 'get_posts_by_tag',
            args:{
                tag
            },
            contractId: this.contractId
        });
    }
}