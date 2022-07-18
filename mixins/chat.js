
export default {
    methods : {
        selectChat(chat){
            this.offset = 0
            this.SELECT_CHAT(chat)
            .then(()=>{
                this.scrollToBottom()
            })
          },
    }
}