import Vue from 'vue';
import { fetchDevices, removeDevice, renameDevice, getDevice } from '../api/devices';

export default {
  namespaced: true,

  state: {
    devices: [],
    device: [],
    numberDevices: 0,
  },

  getters: {
    list: (state) => state.devices,
    get: (state) => state.device,
    getNumberDevices: (state) => state.numberDevices,
    getStatusCode: (state) => state.statusCode,
  },

  mutations: {
    setDevices: (state, res) => {
      Vue.set(state, 'devices', res.data);
      Vue.set(state, 'numberDevices', parseInt(res.headers['x-total-count'], 10));
    },

    removeDevice: (state, uid) => {
      state.devices.splice(state.devices.findIndex((d) => d.uid === uid), 1);
    },

    renameDevice: (state, data) => {
      state.devices = state.devices.map((i) => i.uid === data.uid ? { ...i, name: data.name } : i);
    },

    setDevice: (state, data) => {
      if (data) {
        Vue.set(state, 'device', data);
      }
    },
  },

  actions: {
    fetch: async (context, data) => {
      const res = await fetchDevices(data.perPage, data.page);
      context.commit('setDevices', res);
    },

    remove: async (context, uid) => {
      await removeDevice(uid);
      context.commit('removeDevice', uid);
    },

    rename: async (context, data) => {
      await renameDevice(data);
      context.commit('renameDevice', data);
    },

    get: async (context, uid) => {
      const res = await getDevice(uid);
      context.commit('setDevice', res.data);
    },
  },
};
