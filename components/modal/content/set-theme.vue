<template>
    <div class="modal__content" v-if="modal == 'set-theme'">
        <div class="modal-settings">
            <div class="setting">
                <div class="setting__name">
                    Обычная
                </div>
                <div class="setting__btn"
                :class="theme == 'Dark' ? 'dark' : ''"
                @click="SET_THEME('Default')">
                    {{ theme == "Default" ? 'Установлена' : "Установить"}}
                </div>
            </div>
            <div class="setting">
                <div class="setting__name">
                    Тёмная
                </div>
                <div class="setting__btn"
                :class="theme == 'Dark' ? 'dark' : ''"
                @click="SET_THEME('Dark')">
                    {{ theme == "Dark" ? 'Установлена' : "Установить"}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
    name : 'modal-set-theme',
    computed : {
        ...mapState({
            theme : 'theme',
            modal : "modal"
        })
    },
    methods : {
        ...mapMutations([
            'SET_THEME'
        ])
    }
}
</script>