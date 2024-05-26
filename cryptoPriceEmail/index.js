const axios = require('axios');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const ses = new AWS.SES({ region: 'ap-southeast-2' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getCryptoPrice(cryptoSymbol) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSymbol}&vs_currencies=usd`;
  const response = await axios.get(url);
  return response.data[cryptoSymbol].usd;
}

async function logSearch(cryptoSymbol) {
  const params = {
    TableName: 'CryptoSearchHistory',
    Item: {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      cryptoSymbol: cryptoSymbol,
    },
  };
  return dynamoDB.put(params).promise();
}

async function sendEmail(toEmail, subject, body) {
  const params = {
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Html: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: process.env.EMAIL_ADDRESS,
  };

  return ses.sendEmail(params).promise();
}

exports.handler = async (event) => {
  const { cryptoSymbol, email } = JSON.parse(JSON.stringify(event.body));

  if (!cryptoSymbol || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }

  try {
    const price = await getCryptoPrice(cryptoSymbol);
    await logSearch(cryptoSymbol);

    const subject = `Current Price of ${cryptoSymbol.toUpperCase()}`;
    const body = `<html>
                    <body>
                      <h1>Current Price of ${cryptoSymbol.toUpperCase()}</h1>
                      <p>The current price of ${cryptoSymbol.toUpperCase()} is <b>$${price.toFixed(2)}</b>.</p>
                    </body>
                  </html>`;

    await sendEmail(email, subject, body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Email sent successfully ${body}` }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};