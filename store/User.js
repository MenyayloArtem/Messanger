export const state = () => ({
    id : localStorage.getItem("user_id") || 0,

    nickname : '',
    status : '',
    avatarUrl : '',

    friends : {
        all : [],
        incoming : [],
        sent : []
    },
    searched_users : []
})

export const mutations = ({
    
    SET_FRIENDS(state, {all,sent,incoming}) {
        state.friends.all = all
        state.friends.sent = sent
        state.friends.incoming = incoming
    },

    SET_USER(state, user) {
        state.nickname = user.nickname
        state.status = user.status
        state.avatarUrl = user.avatarUrl
    },

    SET_SEARCHED_USERS(state, users) {
        state.searched_users = users
    },

    UPDATE_USER(state,user) {
        state.nickname = user.nickname
        state.status = user.status
        state.avatarUrl = user.avatarUrl
    },

    UPDATE_FRIENDS(state, {type, user}) {
        console.log(type,user)
        let res_types = {
            'sent' : 'sent',
            'accept' : 'all',
            'incoming' : 'incoming'
        }

        if(res_types[type]){
            if(type != 'accept') {
                state.friends[res_types[type]].push(user)
            } else {
                let incoming = state.friends.incoming
                console.log(incoming)
                state.friends.incoming = incoming.filter(item => item.id != user.id)
                state.friends.all.push(user)
                console.log(incoming)
            }
        }
    },

    ACCEPT_FRIEND(state,user_id) {
        
    }
})

export const actions = ({

    async FETCH_FRIENDS({state,commit},category = 'all'){
        let all = await this.$axios.$get("user_friends:" + state.id)

        let sent = await this.$axios.$post("getRequests",{
                id : state.id,
                out : 1
        })

        let incoming = await this.$axios.$post("getRequests",{
                id : state.id,
                out : 0
        })
        
        commit("SET_FRIENDS",{all,sent,incoming})
        return {all,sent,incoming}
    },

    async FETCH_USER({state, commit}){
        if(state.id){
            let user = await this.$axios.$get("user:" + state.id)
            commit("SET_USER",user)
        } else {
            document.location = "/auth"
        }
        
    },

    async SEARCH_USER(store,nickname){
        let users = await this.$axios.$post("searchUser",{nickname})
        store.commit('SET_SEARCHED_USERS',users)
        return users
    },

    async ADD_FRIEND(store,user_id){
        let id = store.state.id
        let res = await this.$axios.$post("addFriend",{
            from_id : id,
            peer_id : user_id
        })
        store.commit("UPDATE_FRIENDS",res)
    }
})