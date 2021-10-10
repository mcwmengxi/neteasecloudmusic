import Vue from 'vue';
import Vuex from 'vuex';
import {GET_TOPLISTID,GET_NEXTID} from '@/store/mutations_type.js';
Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		topListId:[],
		nextId:''
	},
	mutations:{
		[GET_TOPLISTID](state,payload){
			state.topListId=payload;
		},
		[GET_NEXTID](state,curr){
			for(var i=0;i<state.topListId.length;i++){
				if(state.topListId[i].id == curr){
					state.nextId = state.topListId[i+1].id;
				}
			}
			
		}
	},	
	actions:{
		getTopListId({commit},payload){
			commit(GET_NEXTID,payload);
		},
		getNextId({commit},songId){
			commit(GET_NEXTID,songId);
		}
	}
	
});