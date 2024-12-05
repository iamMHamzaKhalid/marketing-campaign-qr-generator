const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const QRCode = require('qrcode');

function createWindow() {
    const win = new BrowserWindow({
        width: 700,  // Set the desired width
        height: 800, // Set the desired height
        icon: path.join(__dirname, 'assets/icons/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    win.loadFile('index.html');
}

function readExcel(filePath) {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        return data.slice(1).map(row => ({
            companyName: row[0],
            campaignId: row[1],
            source: row[2],
            medium: row[3],
            name: row[4]
        })).filter(row => row.companyName && row.campaignId && row.source && row.medium && row.name);
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw new Error(`Error reading Excel file: ${error.message}`);
    }
}

function generateUrl(campaignId, source, medium, name, baseUrl) {
    const params = new URLSearchParams({
        utm_source: source,
        utm_medium: medium,
        utm_campaign: name,
        utm_id: campaignId,
    });
    return `${baseUrl}?${params.toString()}`;
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

const template = [

    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Contact Support',
                click: async () => {
                    await shell.openExternal('mailto:dev.hamzakhalid@gmail.com');
                }
            },
            {
                label: 'Visit Support Page',
                click: async () => {
                    await shell.openExternal('https://cloudmeshsolutions.com/contact');
                }
            }
        ]
    },
    {
        label: 'Exit',
        role: 'quit'
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
    ipcMain.handle('dialog:openDirectory', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        return result.filePaths;
    });

    ipcMain.handle('dialog:openFile', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx'] }]
        });
        console.log(`File selected: ${result.filePaths}`);
        return result.filePaths;
    });

    ipcMain.handle('processCampaigns', async (event, serviceSheetPath, guideSheetPath, serviceBaseUrl, guideBaseUrl, outputDir) => {
        try {
            const serviceData = readExcel(serviceSheetPath);
            const guideData = readExcel(guideSheetPath);

            for (const row of serviceData) {
                const { companyName, campaignId, source, medium, name } = row;
                const companyDir = path.join(outputDir, companyName);
                ensureDirectoryExists(companyDir);

                const serviceUrl = generateUrl(campaignId, source, medium, name, serviceBaseUrl);
                await QRCode.toFile(path.join(companyDir, '1.png'), serviceUrl);

                // Send the generated URL back to the renderer
                event.sender.send('log-url', `Service URL for ${companyName}: ${serviceUrl}`);
            }

            for (const row of guideData) {
                const { companyName, campaignId, source, medium, name } = row;
                const companyDir = path.join(outputDir, companyName);
                ensureDirectoryExists(companyDir);

                const guideUrl = generateUrl(campaignId, source, medium, name, guideBaseUrl);
                await QRCode.toFile(path.join(companyDir, '2.png'), guideUrl);

                // Send the generated URL back to the renderer
                event.sender.send('log-url', `Guide URL for ${companyName}: ${guideUrl}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error processing campaigns:', error);
            throw error;
        }
    });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
