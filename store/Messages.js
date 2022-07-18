export const state = () => ({
    messages : [],
    selected_messages : [],
    offset : 0,
    edit_id : null
})

export const mutations = ({
    SET_EDIT(state,value){
        state.edit_id = value
    },

    TOGGLE_MESSAGE(state,message){
        if(!state.selected_messages.find(item => item.id == message.id)){
            state.selected_messages.push(message)
        } else {
            state.selected_messages = state.selected_messages.filter(item => item.id != message.id)
        }
    },

    CLEAR_SELECTED_MESSAGES(state){
        state.selected_messages = []
    },

    RESET_MESSAGES(state){
        state.messages = []
    },

    ADD_MESSAGE(state,message){
        console.log(message)
        state.messages.push(message)
    },
    
    SET_MESSAGES(state,messages){
        state.messages.unshift(...messages)
    },

    UPDATE_MESSAGE(state,payload){
        let index = state.messages.findIndex(item => item.id == payload.id)
        let message = state.messages[index]
        
        message.img = payload.data.img
        message.text = payload.data.text
        state.messages = state.messages.map((item,i)=>{
            if(i == index){
                return Object.assign({},message)
            }
            return item
        })
    },

    DELETE_MESSAGES(state,messages_list){
        state.messages = state.messages.filter(message => {
            return !messages_list.includes(message.id)
        })
    }
})

export const actions = ({
    async FETCH_MESSAGES(store,payload){
        let messages = await this.$axios.$post(`messages`,{
            room : payload.room,
            offset : payload.offset
        })
        setTimeout(()=>{
            store.commit("SET_MESSAGES",messages)
            return messages
        },50)
    },
})