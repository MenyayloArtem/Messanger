export default {
    data(){
        return ({
            socket : null
        })
    },
    mounted() {
        this.socket = this.$nuxtSocket({
            name : 'home',
            channel : '/',
            reconnection : true
        })
    
        this.socket.emit("setSeparateChannel",this.User.nickname)
    }
}