# URL shortner

## Overview

This project does something amazing! Describe the purpose and key features of your project here.

## Table of Contents
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository:**

git clone https://github.com/Abhi5453Abhi/url-shortner.git
cd url-shortner
2. **Install dependencies:**

npm install

3. **Set up MongoDB:**
Ensure MongoDB is running locally or update the database connection string in the configuration.

### Usage
1. **Start the application:**

npm start
The application should now be running at http://localhost:8000.

2. **Open your web browser:**

Navigate to the provided URL and use the web interface to shorten and manage URLs.

### Configuration
Configure the application using environment variables. Create a .env file in the project root and add the following:

**MONGODB_URI**=mongodb://localhost:27017/url-shortner
PORT=8000

Adjust the values based on your setup.

### License
This project is licensed under the MIT License.