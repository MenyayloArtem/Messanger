<template>
    <div class="auth-form">
        <div class="auth-form__body">

            <div class="auth-form__title">
                Регистрация
            </div>

            <div class="auth-form__inputs">
                <input class="auth-form__input" placeholder="Имя" type="text"
                v-model="nickname"
                >
                <input class="auth-form__input" placeholder="Пароль" type="password"
                v-model="password"
                >

                <input class="auth-form__input" placeholder="Повторите пароль" type="password"
                v-model="reply_password"
                >
            </div>

            <div class="auth-form__btn"
            @click="reg"
            >
                Войти
            </div>

            <div class="auth-form__bottom">Есть аккаунт?
                <NuxtLink to="/auth">Войти</NuxtLink>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "~/assets/scss/main/auth.scss";
</style>

<script>
export default {
    data(){
        return ({
            nickname : '',
            reply_password : '',
            password : ''
        })
    },
    methods : {
        async reg(){
            if(this.password == this.reply_password) {
                let res = await this.$axios.$post('/reg',{
                    nickname : this.nickname,
                    password : this.password
                })

                if(res.success){
                    localStorage.setItem("user_id",res.id)
                    document.location = "http://localhost:3000/auth"
                } else {
                    alert(res.log)
                }
                } else {
                    alert("Пароли не совпадают")
                }
        }
    },
    mounted(){
        this.socket = this.$nuxtSocket({
            name : 'home',
            channel: '/',
            reconnection: true
        })

        this.socket.on('regBack',res => {
            console.log(res)
            
        })
    }
}
</script>