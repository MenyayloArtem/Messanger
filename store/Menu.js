export const state = () =>({
    search : '',
    selected_menu : "chats",
    items : []
})

export const mutations = ({
    SELECT_MENU(state,selected){
        state.selected_menu = selected
    },

    SET_ITEMS(state,items){
        state.items = items
    }
})