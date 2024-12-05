# Marketing Campaign QR Generator

## Overview

The Marketing Campaign QR Generator is a desktop application built with Electron. It allows users to generate QR codes for marketing campaigns based on data from Excel sheets. The app processes campaign data to create URLs with UTM parameters and generates corresponding QR codes, which are saved in a specified output directory.

## Features

- **Excel Integration**: Import campaign data from Excel files.
- **URL Generation**: Create URLs with UTM parameters for tracking.
- **QR Code Generation**: Generate QR codes for each campaign.
- **Directory Management**: Save QR codes in organized directories.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/iamMHamzaKhalid/marketing-campaign-qr-generator.git
   cd marketing-campaign-qr-generator
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Application**

   ```bash
   npm start
   ```

4. **Build the Application**
   - **For Windows**:
     ```bash
     npm run build -- --win
     ```
   - **For macOS**:
     ```bash
     npm run build -- --mac
     ```
   - **For Linux**:
     ```bash
     npm run build -- --linux
     ```

## Usage

1. **Select Service and Guide Excel Sheets**: Click the buttons to choose Excel files containing campaign data. Sample sheets are available in the `/input_sheets` directory:
   - [Service Sheet](input_sheets/service_sample.xlsx)
   - [Guide Sheet](input_sheets/guide_sample.xlsx)
2. **Enter Base URLs**: Provide the base URLs for service and guide QR codes.
3. **Select Output Directory**: Choose where to save the generated QR codes.
4. **Generate QR Codes**: Click the "Generate QR Codes" button to start the process.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
