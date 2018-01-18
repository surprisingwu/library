var SET_CURRENT_ITEM = 'SET_CURRENT_ITEM'
var state = {
    currentLib: {}
}
var mutations = {
    SET_CURRENT_ITEM: function(state, item){
        state.currentLib = item
    }
}
var getters = {
    currentLib: function(state) {
        return state.currentLib
    }
}

var libVuexStore = new Vuex.Store({
    state: state,
    mutations: mutations,
    getters: getters,
})