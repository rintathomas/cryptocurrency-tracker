# Crypto Currency Tracker

This repository contains two AWS Lambda functions for a cryptocurrency email service:
1. `cryptoPriceEmailService`: Sends an email with the current price of a specified cryptocurrency.
2. `cryptoPriceSearchHistory`: Retrieves the search history of cryptocurrency queries.


## Setup

1. **Clone the repository**:

2. **Install dependencies for each Lambda function**:

```bash
cd emailCryptoPrice
npm install
cd ../cryptoPriceSearchHistory
npm install
cd ..
```

3. **Verify your email address in AWS SES (Simple Email Service)**:

Navigate to the AWS SES console.
Verify an email address to use as the sender (EMAIL_ADDRESS).

4. **Update the SAM template with your verified SES email address**:

Edit the template.yaml file to set your SES verified email:

5. **Build and deploy the SAM application**:

```bash
sam build
sam deploy --guided
```

##Endpoints##
**Email Crypto Price**:

Path: /email-crypto-price
Method: POST
Request Body:
{
  "cryptoSymbol": "bitcoin",
  "email": "your_email@example.com"
}

Description: Sends an email with the current price of the specified cryptocurrency.

**Get Search History**:

Path: /search-history
Method: GET
Description: Retrieves the history of cryptocurrency price queries.

##Test Your Endpoints##

Use cURL or any HTTP client to test your endpoints:

```bash
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/crypto-price-email \
-H 'Content-Type: application/json' \
-d '{"cryptoSymbol": "bitcoin", "email": "your_email@example.com"}'
```

```bash
curl https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search-history
```

