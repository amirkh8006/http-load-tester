# Hey Load Tester UI

A full-stack web application for running HTTP load tests using the [`hey`](https://github.com/rakyll/hey) tool. This app provides a user-friendly Angular interface with an Express.js backend to trigger `hey` load tests on demand.

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
- Angular CLI (v19+)
- `hey` binary (Linux/AMD64) placed in the `backend/` folder:
- ./backend/hey_linux_amd64


---

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amirkh8006/http-load-tester.git
cd hey-load-tester-ui
```

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

