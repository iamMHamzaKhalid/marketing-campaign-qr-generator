const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openDirectory: async () => {
        return await ipcRenderer.invoke('dialog:openDirectory');
    },
    processCampaigns: async (serviceSheetPath, guideSheetPath, serviceBaseUrl, guideBaseUrl, outputDir) => {
        return await ipcRenderer.invoke('processCampaigns', serviceSheetPath, guideSheetPath, serviceBaseUrl, guideBaseUrl, outputDir)
    },
    openFile: async () => {
        return await ipcRenderer.invoke('dialog:openFile');
    },
    ipcRenderer: {
        on: (channel, func) => {
            const validChannels = ['log-url'];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
});
