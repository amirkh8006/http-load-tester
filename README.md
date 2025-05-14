# Hey Load Tester UI

A full-stack web application for running HTTP load tests using the [hey](https://github.com/rakyll/hey) tool. This app provides a user-friendly Angular interface with an Express.js backend to trigger `hey` load tests on demand.

---

## 📦 Project Structure

hey-load-tester-ui/

├── backend/ # Node.js + Express server

└── frontend/ # Angular app with Angular Material


---

## ✨ Features

- Run [Hey](https://github.com/rakyll/hey) HTTP load tests from a web UI
- Customize test parameters:
  - Target URL
  - Duration or number of requests
  - Concurrency level
  - Queries per second (QPS)
  - Optional proxy support
- Parse and view output in readable JSON format
- Responsive UI using Angular Material

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18)


---

## 🛠 Installation (Electron)
This project also includes a cross-platform Electron app built on top of the Angular frontend. The Electron version allows you to run the HTTP Load Tester as a standalone desktop application for Windows and Linux.

✅ Features
 - Seamless integration with the Angular frontend

 - Automatically connects to the backend API for executing load tests

 - Fully functional without needing a web browser

 - Cross-platform support (Windows, Linux)

 - Lightweight and easy to distribute


## 📦 Build Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/amirkh8006/http-load-tester.git
cd hey-load-tester-ui
```

### 2. package the Electron app:

 - Install backend dependencies
```bash
cd backend
npm install
```

 - build frontend application
```bash
cd frontend
npm run build
```
 - package the Electron app:
```bash
# In root of project
npm install
npm run package
```

 - Run .exe file in (/dist-electron/hey-load-tester-win32-x64)

## 🛠 Installation (Local)


###  Backend Setup (Express)
```bash
cd backend
npm install
node index.js
```

###  Frontend Setup (Express)
```bash
cd ../frontend
npm install
ng serve
```

