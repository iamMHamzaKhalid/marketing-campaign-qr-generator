console.log('renderer.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed in renderer.js');

    const serviceSheetBtn = document.getElementById('serviceSheetBtn');
    const guideSheetBtn = document.getElementById('guideSheetBtn');
    const serviceSheetPathSpan = document.getElementById('serviceSheetPath');
    const guideSheetPathSpan = document.getElementById('guideSheetPath');
    const processBtn = document.getElementById('processBtn');
    const selectDirBtn = document.getElementById('selectDirBtn');
    const selectedDirSpan = document.getElementById('selectedDir');
    const statusDiv = document.getElementById('statusText');
    const serviceBaseUrlInput = document.getElementById('serviceBaseUrlInput');
    const guideBaseUrlInput = document.getElementById('guideBaseUrlInput');
    const consoleQR = document.getElementById('consoleQR');

    let serviceSheetPath = '';
    let guideSheetPath = '';
    let serviceBaseUrl = '';
    let guideBaseUrl = '';
    let outputDir = '';

    function showStatus(message, isError = false) {
        statusDiv.textContent = message;
        statusDiv.className = `text-sm ${isError ? 'text-red-500' : 'text-green-500'}`;
    }

    function logToConsoleQR(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        consoleQR.appendChild(logEntry);
        consoleQR.scrollTop = consoleQR.scrollHeight; // Auto-scroll to the bottom
    }

    if (serviceSheetBtn) {
        serviceSheetBtn.addEventListener('click', async () => {
            const filePaths = await window.electron.openFile();
            if (filePaths && filePaths.length > 0) {
                serviceSheetPath = filePaths[0];
                serviceSheetPathSpan.textContent = serviceSheetPath.split('/').pop();
            } else {
                logToConsoleQR('No file selected');
            }
        });
    }

    if (guideSheetBtn) {
        guideSheetBtn.addEventListener('click', async () => {
            const filePaths = await window.electron.openFile();
            if (filePaths && filePaths.length > 0) {
                guideSheetPath = filePaths[0];
                guideSheetPathSpan.textContent = guideSheetPath.split('/').pop();
            } else {
                logToConsoleQR('No file selected');
            }
        });
    }

    if (selectDirBtn) {
        selectDirBtn.addEventListener('click', async () => {
            try {
                const filePaths = await window.electron.openDirectory();
                if (filePaths && filePaths.length > 0) {
                    outputDir = filePaths[0];
                    selectedDirSpan.textContent = outputDir;
                    showStatus(`Selected output directory: ${outputDir}`);
                } else {
                    logToConsoleQR('No directory selected');
                }
            } catch (error) {
                console.error('Error selecting directory:', error);
                showStatus('Error selecting directory', true);
            }
        });
    }

    if (serviceBaseUrlInput) {
        serviceBaseUrlInput.addEventListener('input', (event) => {
            serviceBaseUrl = event.target.value;
        });
    }

    if (guideBaseUrlInput) {
        guideBaseUrlInput.addEventListener('input', (event) => {
            guideBaseUrl = event.target.value;
        });
    }

    processBtn.addEventListener('click', async () => {
        try {
            const serviceBaseUrl = serviceBaseUrlInput.value.trim();
            const guideBaseUrl = guideBaseUrlInput.value.trim();

            if (!serviceSheetPath || !guideSheetPath || !serviceBaseUrl || !guideBaseUrl || !outputDir) {
                logToConsoleQR('Please provide all required inputs');
                showStatus('Please provide all required inputs', true);
                return;
            }

            showStatus('Generating QR codes...');
            logToConsoleQR('Generating QR codes...');

            await window.electron.processCampaigns(
                serviceSheetPath,
                guideSheetPath,
                serviceBaseUrl,
                guideBaseUrl,
                outputDir
            );

            logToConsoleQR('QR codes generated successfully!');
            showStatus('QR codes generated successfully!');
        } catch (error) {
            console.error('Error generating QR codes:', error);
            logToConsoleQR(`Error generating QR codes: ${error.message}`);
            showStatus(`Error generating QR codes: ${error.message}`, true);
        }
    });

    // Listen for URL logs from the main process
    window.electron.ipcRenderer.on('log-url', (message) => {
        logToConsoleQR(message);
    });
});
