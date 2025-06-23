# NTUA ECE SAAS 2025 PROJECT - ClearSKY APP

## TEAM 25

Repository, used for team saas25-25

### Contributors

- Anastasia Askouni el20046@mail.ntua.gr
- Nikolaos Verras el21440@mail.ntua.gr
- Angeliki Zerva el21101@mail.ntua.gr
- Dimitrios Kampanakis el21012@mail.ntua.gr

## Description

The clearSKY application is designed to assist instructors of all educational levels in publishing preliminary course grades and to facilitate student-initiated review request cycles prior to finalization.

It addresses the traditionally time-consuming process of instructors managing this workflow individually by streamlining it through the use of clearSKY, assuming reasonable preprocessing adjustments — primarily related to the grade format. For the purposes of this project, the grade format will adhere to the Excel template used by the new student information system of NTUA.

The application accepts grade data in the standardized formatand transforms it into structured data usable by instructors, students, and institutional representatives. Instructors can upload grade spreadsheets, which are then distributed asynchronously to relevant backend services (e.g., user management, grade storage, statistical analysis) using an event-driven, microservice-based architecture (RabbitMQ).

Key features include:

📤 Uploading of initial and final grades in Excel format

🔁 Student review request cycle before grade finalization

📊 Real-time statistics and grade distribution analysis

👤 User data extraction and management from uploaded files

☁️ Scalable, microservice-based design using Docker and RabbitMQ

clearSKY runs on containerized infrastructure and is built for deployment in cloud environments. 

## Table of contents

- [Installation](#installation)
  - [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Cloning the Repository](#cloning-the-repository)
  - [Running the App](#running-the-app)
  - [Open frontend](#open-frontend)
 
## Installation
### Prerequisites
Before running the application, ensure you have the met the following software requirements:

| **Tool**            | **Version** |    **Installation Link** | **Purpose**|
|------------------------|-------------------|-----------------|------------|
| Docker | 28.0.4 or higher | [Download Docker](https://docs.docker.com/engine/install/) | Required to run the containers for the microservices |
| Docker Desktop | 28.0.4 or higher | [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)| Optional but very helpful|
|Kubernetes | 1.32.2 or higher | [Download kubectl](https://kubernetes.io/docs/tasks/tools/)| Required to run the cluster |
| Node.js | 20.9 or higher | [Download Node.js](https://nodejs.org/) | Required to run the app |
| npm (included with Node.js) | Latest | Included with [Node.js](https://nodejs.org/) | Manages frontend dependencies |
| Git| Latest | [Download Git](https://git-scm.com/downloads) | Required for cloning and managing the repository |

maybe: https://kind.sigs.k8s.io/docs/user/quick-start/#installation

It is advised that all software requirements are downloaded and installed by the latest version.


## Usage

### Cloning the Repository

#### Clone the repository to your local machine:
```sh
git clone https://github.com/ntua/saas25-25.git
```

### Running the App

#### Build the images from the source code

* For Windows

```sh
./build.ps1
```

* For Linux/MacOS

```sh
./build.sh
```

#### Run the containers and the microservices inside them

* For Windows

```sh
./apply_all_microservices.ps1
```

* For Linux/MacOS

```sh
./apply_all_microservices.sh
```

#### Open Frontend

Frontend is available on

```sh
http://localhost:30000
```


