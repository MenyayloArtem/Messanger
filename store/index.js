export const state = () => ({
    modal : false,
    theme : localStorage.getItem('theme') || "Default",
    api : "http://localhost:3001/"
})

export const mutations = {
    TOGGLE_MODAL(state,modal){
        console.log(modal)
       if(!modal) {
        state.modal = false
       }
        if(state.modal){
            state.modal = false
        } else {
            state.modal = modal
        }
    },

    SET_THEME(state,theme){
        localStorage.setItem('theme',theme)
        state.theme = theme
    }
}

export const actions = ({
    async UPLOAD_FILE(store,payload){
        let formdata = new FormData()
        formdata.append('photo',payload)
        let res = await this.$axios.$post("upload",formdata)
        return res
    },
})
