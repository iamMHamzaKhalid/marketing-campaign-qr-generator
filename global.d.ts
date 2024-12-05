interface Window {
    electron: {
        openFile: () => Promise<string[]>;
        openDirectory: () => Promise<string[]>;
        processCampaigns: (
            serviceSheetPath: string,
            guideSheetPath: string,
            serviceBaseUrl: string,
            guideBaseUrl: string,
            outputDir: string
        ) => Promise<void>;
    };
}
