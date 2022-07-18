<template>
    <div class="auth-form">
        <div class="auth-form__body">

            <div class="auth-form__title">
                Авторизация
            </div>

            <div class="auth-form__inputs">
                <input class="auth-form__input" placeholder="Имя" type="text"
                v-model="nickname"
                >
                <input class="auth-form__input" placeholder="Пароль" type="password"
                v-model="password"
                >
            </div>

            <div class="auth-form__btn"
            @click="auth"
            >
                Войти
            </div>

            <div class="auth-form__bottom">Нет аккаунта?
                <NuxtLink to="/registration">Регистрация</NuxtLink>
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
            password : ''
        })
    },
    methods : {
        async auth(){
            let res = await this.$axios.$post('/auth',{
                nickname : this.nickname,
                password : this.password
            })
            
            if(res.success){
                localStorage.setItem("user_id",res.id)
                document.location = "http://localhost:3000/"
            } else {
                alert(res.log)
            }
        }
    },
    mounted(){
        document.addEventListener("keydown",(e)=>{
            if(e.code == "Enter") {
                this.auth()
            }
        })
    }
}
</script>