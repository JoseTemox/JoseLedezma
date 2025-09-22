# ![Logo](https://www.ceupe.com/images/easyblog_articles/1761/b2ap3_thumbnail_shutterstock_234568837-p8162-m34502-800x533_w100.jpg)

# Financial Products-SOFTWARE

![Angular](https://img.shields.io/badge/Angular-20+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Testing](https://img.shields.io/badge/Testing-Jasmine/Karma-green?style=for-the-badge&logo=jasmine&logoColor=white)
![Coverage](https://img.shields.io/badge/Coverage-Code%20coverage-orange?style=for-the-badge)

![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4-blue?style=for-the-badge&logo=typescript&logoColor=white)

A modern application built with Angular 20+, designed with best development practices and automated testing.

## ✨ Features

- **🔄 Angular 20+** - Modern and performant framework
- **📘 TypeScript** - Static typing for greater robustness
- **🧪 Complete Testing** - Test suite with Jasmine and Karma
- **📊 Code Coverage** - Integrated code coverage reports
- **🎨 Prettier** - Consistent code formatting
- **🚀 Optimized** - Optimized production builds

## 🛠️ Technologies Used

### Frontend

- **Framework:** Angular 20.1.0
- **Language:** TypeScript 5.8.2
- **Testing:** Jasmine 5.8.0 + Karma 6.4.0
- **Package Manager:** npm
- **Code Formatter:** Prettier

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Build Tool:** TypeScript 4
- **Development:** ts-node-dev
- **Package Manager:** npm

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/JoseTemox/JoseLedezma.git

# Navigate to directory
cd JoseLedezma

# Install dependencies
npm install


```

### Back-End Setup

```bash
# Clone the repository
git clone https://github.com/JoseTemox/JoseLedezma.git

# Navigate to directory
cd devsu-software/repo-interview-main

# Install dependencies
npm install

# Build the backend
npm run build

# Start development server
npm run start:dev


```

## 🚀 Available Commands

### Frontend Commands

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm start`             | Start development server            |
| `npm run build`         | Build application for production    |
| `npm run watch`         | Build in watch mode for development |
| `npm run test`          | Run tests without watch             |
| `npm run test:coverage` | Run tests with coverage report      |

## 🧪 Testing

The application includes a complete test suite:

```bash
# Run tests once
npm run test

# Run tests with coverage report
npm run test:coverage

# Coverage reports are generated in /coverage
```

### Backend Commands

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run build`     | Compile TypeScript to JavaScript                 |
| `npm run start:dev` | Start backend development server with hot reload |

## 🌐 API Server Setup

The frontend requires a local backend server to function properly:

1. **Start the Backend Server:**

   ```bash

   npm run start:dev
   ```

   The backend will typically run on `http://localhost:3002`

2. **Configure API Endpoint in your Front-End:**

   - Update the API base URL in `src/environments/environment.ts`
   - Example configuration:

   ```typescript
   export const environment = {
     apiUrl: 'http://localhost:3002/bp',
   };
   ```

3. **Start the Frontend:**
   ```bash
   ng serve
   ```
   The frontend will run on `http://localhost:4200`

<br>

---

<br>

### 🚀 Automated Test Report

<br>

---

<br>

#### ✅ **Overall Results**

<br>

- **Environment:** Google Chrome (Version 140.0.0.0) on Windows 10
- **Tests Executed:** 76
- **Status:** **76 out of 76 tests passed** 🎉
- **Total Time:** 0.592 seconds

<br>

All tests ran successfully\! No errors were found, which indicates an excellent code status.

<br>

---

<br>

### 📊 **Code Coverage**

<br>

Code coverage shows the percentage of your source code that has been covered by the tests. Here are the detailed results:

<br>

- **Statements:** 92.51% (272 of 294)
- **Branches:** 81.41% (92 of 113)
- **Functions:** 88.37% (76 of 86)
- **Lines:** 92.22% (261 of 283)

<br>

---

<br>

### 💡 **Next Steps**

<br>

The coverage results are very solid. To achieve even higher coverage, you could consider:

- Reviewing the lines, branches, and functions that were not reached by the tests.
- Creating additional unit or integration tests for those specific areas.

<br>

---

<br>

## 🎨 Code Configuration

The project uses Prettier to maintain code consistency:

```json
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "useTabs": false,
  "vueIndentScriptAndStyle": false,
  "embeddedLanguageFormatting": "auto",
  "tabWidth": 2,
  "printWidth": 80,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular",
        "tabWidth": 2,
        "singleQuote": true,
        "bracketSameLine": false
      }
    }
  ]
}
```

## 📁 Project Structure

```
src/
├── app/
│    ├── core/
│    ├── products/
│    │    ├── components/     # Application components
│    │    ├── interfaces/     # TypesScript Interfaces Properties
│    │    ├── pages/          # Application main pages
│    │    ├── service/        # Application webRequest
│    │    ├── shared/         # Shared Components
│    ├── core/                # Fixed Properties
│    │
├── assets/                   # Static resources
│    ├── fonts
│    ├── images
├── environments/             # Environment configurations
repo-interview-main/          # Backend Node
coverage/                     # Unit test resume
```

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/somethingCool`)
3. Commit your changes (`git commit -m 'Add some somethingCool`)
4. Push to the branch (`git push origin feature/somethingCool`)
5. Open a Pull Request

## 👨‍💻 Author

**José Temístocles Ledezma Reyes**

- 📧 Email: [temistoclesledezma@gmail.com](mailto:temistoclesledezma@gmail.com)
- 💼 LinkedIn: [https://www.linkedin.com/in/josetemox/](https://www.linkedin.com/in/josetemox/)
- 🌐 Portfolio: [Coming Soon]()

## 📄 License

This project is private and under proprietary license. All rights reserved.

---

⭐ **If you like this project, don't forget to give it a star on GitHub!**
