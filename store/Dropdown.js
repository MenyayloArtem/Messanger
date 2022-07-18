export const state = () => ({
    friends : {
        values : [{
            alias : 'Все',
            value : 'all'
        },
        {
            alias : 'Отправленные',
            value : 'sent'
        },
        {
            alias : 'Входящие',
            value : 'incoming'
        }],
        selected : {
            alias : 'Все',
            value : 'all'
        }
    }
})

export const getters = ({
    friends_list(state){
        return state.friends.selected
    }
})

export const mutations = {
    DROPDOWN_SELECT(state,{field,item}){
        state[field].selected = item
    }
}