
# ☕ HappyKopi POS System

HappyKopi POS System is a modern, lightweight Point-of-Sale (POS) application specifically designed for a specific coffee shop — HappyKopi, Langit Rd. Branch. It is built to run on Android-based Sunmi POS terminals, taking full advantage of their built-in thermal receipt printers.

This system uses Angular and Capacitor for the frontend, enabling a high-performance native experience on Android, while the backend is powered by ASP.NET Web API with an SQL database.

## ✨ Key Features
 The system delivers essential functions required for the daily operations of a coffee shop.

#### For the Barista (User Role)
- 🔒 Secure Login: Every barista requires an account to access the system.

- 🛒 Order Management: Easily add items (coffee, pastries, etc.) to a customer's order.

- 💳 Payment Processing: Accept payments via Cash or Cashless methods (e.g., GCash, Maya, cards).

- 📉 Stock Alerts: Receive real-time notifications when an ingredient is running low.

#### For the Admin (Owner Role)
- 📊 Inventory Tracking: Monitor the quantity of every ingredient (e.g., coffee beans, milk, syrups) in stock.

- 📦 Add Stocks: Easily input newly arrived supplies to update inventory counts.

- 📈 Sales Viewing:

    - Transaction History: Review all past transactions.
    - Daily Sales Report: Filter sales by date (day, week, month) to track shop performance.

#### 🤖 Automations
- Automatic Alerts: The system will automatically send alerts to Admins and Baristas when an inventory item reaches its low-stock threshold.

## 💻 Tech Stack

This project is divided into two main components:
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend (App)** | **Angular** | The primary framework for building the user interface. |
| | **Capacitor** | Used to bundle the Angular app into a native Android (.apk) file. |
| | **TypeScript** | The language used for Angular development. |
| **Backend (API)** | **ASP.NET Core Web API** | The server that handles all business logic and data requests. |
| | **C#** | The language used for backend development. |
| **Database** | **Microsoft SQL Server** | The database storing all data (products, inventory, transactions, users). |
| **Data Access** | **Dapper** | A high-performance, minimal ORM for .NET used for querying the SQL database. |

## 🎯 Target Device and Environment
This application is specifically built for a Sunmi POS Terminal with the following specifications:

- Target Output: .apk file

- Device OS: Android 6.0

- Sunmi OS Version: 1.5.0

- Sunmi SDK Version: 1.2.0 (Will be used for direct access to the receipt printer)

## 🚀 Getting Started

Follow these steps to run the entire system on your local development machine.

### 1. Database Setup (SQL Server)

1.  **Set up SQL Server:** Ensure you have a running instance of SQL Server (either a local instance or on a server).
2.  **Create the Database:** Create a new, empty database (e.g., `HappyKopiDB_Dev`).
3.  **Run Migrations:** Your `happykopiAPI` project is configured with Entity Framework Core Migrations. Run the following command from your API's project directory (`happykopiAPI/happykopiAPI`):

    ```bash
    dotnet ef database update
    ```
    This will apply all migrations (like `20250920144854_InitialMigration`, `20250924120608_AddUserStoredProcedures`, etc.) and set up your database schema and stored procedures.

4.  **Update Connection String:** Open `happykopiAPI/happykopiAPI/appsettings.Development.json` and replace the value of `DefaultConnection` with your database connection string.

---

### 2. Backend Setup (ASP.NET Web API)

1.  **Navigate to the directory:**
    ```bash
    cd happykopiAPI/happykopiAPI
    ```
2.  **Restore dependencies:**
    ```bash
    dotnet restore
    ```
3.  **Run the API:**
    ```bash
    dotnet run
    ```
4.  The API should now be running on the port specified in `Properties/launchSettings.json` (e.g., `http://localhost:5123`).

---

### 3. Frontend Setup (Angular App)

1.  **Navigate to the directory:**
    ```bash
    cd happykopiApp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure the API URL:** Open `src/environments/environment.ts` (you may need to create this file if it's missing) and set the URL of your backend API:

    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:5123/api' // Your backend URL here
    };
    ```
4.  **Run for Web Development (Browser):**
    ```bash
    ng serve
    ```
5.  Open `http://localhost:4200` in your browser to see the app.

---

## 📦 Building the .apk for Sunmi POS Terminal

When you are ready to deploy the app to the actual device, follow these steps:

1.  **Build the Angular App:**
    Inside the `happykopiApp` directory, run the build command:
    ```bash
    ng build --configuration production
    ```

2.  **Sync Web Assets to Capacitor:**
    ```bash
    npx cap sync android
    ```
    *This will copy all the built files from the `www` folder (or `dist`) into the native `android` project.*

3.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```

4.  **Configure Sunmi SDK (Important):**
    * Since the target is a Sunmi device with Android 6.0, we must ensure the **Sunmi SDK (v1.2.0)** is included in the project. This typically involves adding an `.aar` file to the Android project's `libs` folder and updating the `build.gradle` file.
    * **Note:** We will use the `capacitor-sunmi-printer` plugin (which you have in your files) to bridge communication between your Angular code and the native Sunmi printer SDK. You will need to install this plugin:
        ```bash
        npm install capacitor-sunmi-printer
        npx cap sync
        ```

5.  **Build the APK:**
    * In Android Studio, ensure the `minSdkVersion` in `build.gradle` matches the device (e.g., `23` for Android 6.0).
    * Go to **Build** > **Generate Signed Bundle / APK...**.
    * Select **APK** and follow the steps to create a signed APK file.

6.  **Deploy to Device:**
    * Transfer the generated `.apk` file (e.g., `app-release.apk`) to the Sunmi terminal.
    * Install the APK on the device.
