export const state = () => ({
    chats : [],
    info : {
        id : 0,
        avatarUrl : '',
        name : '',
        description : ''
    },
    members : [],
})



export const mutations = ({
    SET_MEMBERS(state,members){
        state.members = members
    },

    UPDATE_MEMBERS(state,member){
        state.members.push(member)
    },

    SET_CHAT(state,payload){
        state.info = payload
    },

    ADD_CHAT(state,chat) {
        state.chats.push(chat)
    },

    SET_CHATS(state, chats) {
        state.chats = chats
    },

    UPDATE_CHAT(state,{chat_id,avatarUrl,name,description}) {
        state.chats = state.chats.map((item)=>{
            if(item.id == chat_id){
                let new_data = {
                    ...item,
                    avatarUrl,
                    name,
                    description
                }
                console.log(new_data)
                return new_data
            }
            return item
        })
        console.log(state.chats)
        return state.chats
    },

    REMOVE_CHAT(state,chat_id) {
        state.chats = state.chats.filter(item => item.id != chat_id)
    }
})



export const actions = ({
    async SELECT_CHAT(store,chat){
        store.commit("Messages/RESET_MESSAGES",null,{root : true})

        await store.dispatch("Messages/FETCH_MESSAGES",{
            room : chat.id,
            offset : 0
        },{root : true})
        let info = await this.$axios.$post(`getChat`,{
            id : chat.id
        })
        store.commit("SET_CHAT",info)
        return info
    },

    async FETCH_MEMBERS(store,id){
        let members = await this.$axios.$post("getMembers",{
            chat_id : id
        })
        store.commit("SET_MEMBERS",members)
    },

    async ADD_MEMBER(store,user_id){
        let member = await this.$axios.$post(`addMember`,{
            chat_id : store.state.info.id,
            user_id : user_id
        })
        if(member){
            store.commit("UPDATE_MEMBERS",member)
            return member
        }
    },

    async LEAVE_CHAT({state,dispatch,commit},user_id){
        console.log(state.info.id,user_id)
        let res = await this.$axios.$post(`leaveChat`,{
            chat_id : state.info.id,
            user_id : user_id
        })

        if(res) {
            let chats = state.chats
            let prev_chat = chats[0]
            for (let i = 0; i < chats.length; i++) {
                let next_chat = chats[i + 1]
                if (next_chat?.id == state.info.id) {
                    prev_chat = chats[i]
                    break;
                }
            }

            commit("TOGGLE_MODAL","chat-info",{root : true})
            commit("REMOVE_CHAT",state.info.id)
            commit("Menu/SET_ITEMS",state.chats,{root : true})
            commit("Messages/RESER_MESSAGES",null,{root : true})
            
            dispatch("SELECT_CHAT",prev_chat || {
                id : 0,
                avatarUrl : '',
                name : '',
                description : ''
            })
        }
    },

    async FETCH_CHATS({rootState,commit}){
        let chats = await this.$axios.$post("getChats",{
            id : rootState.User.id
        })
        commit("SET_CHATS",chats)
        return chats
    },
})

