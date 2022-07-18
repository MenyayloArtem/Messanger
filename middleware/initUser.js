// this.FETCH_USER()
//     .then(()=>{
//         return this.FETCH_CHATS()
//     })
//     .then((chats)=>{
//         this.SET_ITEMS(chats)
//         return this.FETCH_FRIENDS()
//     })
//     .then(()=>{
//         if(this.Chat.chats.length) {
//             this.SET_CHAT(this.Chat.chats[0])
//             this.selectChat(this.Chat.chats[0])
//             this.scrollToBottom()
//         }
//     })

export default async function ({store, redirect}) {
    await store.dispatch('User/FETCH_USER')
    let chats = await store.dispatch("Chat/FETCH_CHATS")

    store.commit("Menu/SET_ITEMS",chats)
    await store.dispatch("User/FETCH_FRIENDS")
    chats = store.state.Chat.chats

    if(chats.length) {
        store.dispatch("Chat/SELECT_CHAT",chats[0])
    }
}