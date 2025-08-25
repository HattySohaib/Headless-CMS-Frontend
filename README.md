# Irada: Frontend Dashboard &nbsp; ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) 

The official admin dashboard for the Irada ecosystem, built with React and automatically deployed on Vercel.

> **Live Demo:** **[irada.sohaibaftab.me](https://headless-cms-frontend-f2im4ium6-hattysohaibs-projects.vercel.app)**

---

## 🚀 About This Project

This repository contains the frontend for the **Irada project**, a scalable, distributed system for content management and analytics. This React application serves as the central administrative dashboard for managing content, users, and API keys, and for visualizing analytics data.

This application is designed to communicate with the central [Irada Backend API](https://github.com/HattySohaib/Headless-CMS-Backend). For a complete architectural overview, please see the backend repository's README.

---
>**Dashboard:**
![Dashboard Screenshot](src/assets/dashboard-dark.png)
---

## ✨ Key Features

* **Comprehensive Dashboard:** A full-featured dashboard with **15+ screens** for creating, updating, and managing all site content.
* **API Key Management:** A secure interface to generate and manage scoped API keys for the embeddable widgets.
* **Data Visualization:** An analytics dashboard to visualize key metrics on widget usage and user engagement using **MUI XCharts**.
* **Modern UI/UX:** A fully responsive and modern user interface built with **Tailwind CSS** and **Material-UI**.

---

## 🛠️ Tech Stack

| Layer      | Technologies                                                                                                                                                                                                                                                         |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI** | <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" height="20"> <img src="https://img.shields.io/badge/React%20Router-CA4245?logo=react-router&logoColor=white" height="20"> <img src="https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white" height="20"> |
| **Styling** | <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Emotion-D26AC2?logo=emotion&logoColor=white" height="20">                                                                   |
| **Deployment** | <img src="https://img.shields.io/badge/Vercel-000?logo=vercel" height="20">                                                                                                                                                                                         |

---

## 🚀 Deployment & CI/CD

The frontend is hosted on **Vercel** and connected directly to the GitHub repository.
* **Automated Deployments:** Every `git push` to the `main` branch automatically triggers a new production build and deployment on Vercel.
* **Global CDN:** Vercel automatically distributes the application assets across its global CDN for fast load times worldwide.

---

## 🔧 Local Development Setup

**1. Clone the repository:**
```sh
git clone [https://github.com/HattySohaib/irada-frontend.git](https://github.com/HattySohaib/irada-frontend.git)
cd irada-frontend
```
**2. Install dependencies:**

```Bash

npm install
```
**3. Configure environment variables:**
Create a .env file in the root directory and add the URL for the backend API. Note the REACT_APP_ prefix is required for Create React App.

REACT_APP_API_URL=http://localhost:5000/api

**4. Start the development server:**

```Bash

npm start
```
**Open http://localhost:3000 in your browser.**
---
##📄 License
This project is licensed under the ISC License.
