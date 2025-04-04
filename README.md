# ✈️ DigiYatra Agents Controllers

A demo implementation of a Zero-Knowledge Proof (ZKP)-based credential exchange flow using Aries agents for secure and seamless airport immigration.

## 🧩 Problem Statement

Traditional immigration queues can be long and inefficient. This demo showcases a decentralized identity solution where:

- **DigiYatra (Issuer)** — Issues verifiable credentials to travelers.
- **Passenger (Holder)** — Holds the credential securely.
- **Frankfurt Airport Authority (Verifier)** — Verifies the credential using Zero-Knowledge Proofs (ZKPs) to allow seamless entry through e-gates without waiting in immigration queues.

This system ensures **data minimization**, **privacy**, and **fast-track access** to immigration by verifying only the necessary information via verifiable credentials.

---

## 🏗 Architecture Overview

There are **three independent Aries agents** involved:

1. **DigiYatra Agent** (Issuer)
2. **Passenger Agent** (Holder)
3. **Frankfurt Agent** (Verifier)

Each agent is connected to its own controller in this repository and communicates over HTTP + DIDComm.

---

## ⚙️ Prerequisites

- Docker & Docker Compose
- Python 3.9+ (optional, for CLI interactions)
- [digiyatra-agents repo](https://github.com/parth5805/digiyatra-agents) cloned and running

---

## 🚀 Getting Started

### Step 1: Clone the Required Repositories

```bash
git clone https://github.com/parth5805/digiyatra-agents.git
git clone https://github.com/parth5805/digiyatra-agents-controllers.git
```

### Step 2: Run the Three Agents (Issuer, Holder, Verifier)

Navigate to the digiyatra-agents folder and start the agents:
```bash
cd digiyatra-agents
# Follow instructions in that repo to start the agents and their databases
```
Ensure that all 3 agents are running successfully.

### Step 3: Start the Controllers

Open three terminal tabs, and in each run:

```bash
# Terminal 1: DigiYatra Controller (Issuer)
cd DigiYatraDemo/controllers/digiyatra-controller
docker compose up --build -d

# Terminal 2: Passenger Controller (Holder)
cd DigiYatraDemo/controllers/passenger-controller
docker compose up --build -d

# Terminal 3: Frankfurt Controller (Verifier)
cd DigiYatraDemo/controllers/frankfurt-controller
docker compose up --build -d
```
NOTE:- To restart with a clean state later:
```bash
docker compose down --rmi all
```

## 🌐 Access the Demo Interfaces

Once all services are up, visit:
	- DigiYatra (Issuer): http://localhost:8120/
	- Passenger (Holder): http://localhost:8130/
	- Frankfurt Airport (Verifier): http://localhost:8140/

## 🛠 Schema & Credential Setup

### Step 1: Create Schema from DigiYatra Admin API

Open the DigiYatra Admin API docs: http://localhost:8010/api/doc

POST /schemas

Click “Try it out” and paste this schema body:

```json
{
  "schema_name": "DigiYatraVisaCredential",
  "schema_version": "1.1",
  "attributes": [
    "full_name",
    "date_of_birth",
    "nationality",
    "gender",
    "passport_number",
    "passport_issuing_country",
    "passport_issue_date",
    "passport_expiry_date",
    "visa_number",
    "visa_issuing_country",
    "visa_category",
    "visa_valid_from",
    "visa_valid_until",
    "visa_entry_type",
    "visa_sponsor",
    "departure_country",
    "arrival_country",
    "departure_airport",
    "arrival_airport",
    "travel_departure_date",
    "travel_return_date",
    "flight_number",
    "ticket_number",
    "travel_purpose"
  ]
}
```
🔁 If this fails, try changing "schema_name" or "schema_version" to something new.

### Step 2: Create Credential Definition

Use this endpoint:

**GET /schemas/created
**

Copy the latest schema_id.

Then use:

**POST /credential-definition
**
```json
{
  "schema_id": "<PASTE_YOUR_SCHEMA_ID_HERE>"
}
```
Now you’re ready to issue credentials!

## 🔄 Demo Flow
	1. DigiYatra (Issuer) creates a schema and credential definition.
	2. Passenger (Holder) connects to DigiYatra and receives credentials.
	3. Frankfurt Airport (Verifier) sends a ZKP-based proof request to Passenger.
	4. Passenger responds without sharing full details.
	5. Frankfurt Airport Authority verifies the proof and grants e-gate access without queueing.


## 🤝 Contributions

Feel free to open issues or pull requests to improve the demo.
