exports.handler = async () => {
  const params = {
    TableName: 'CryptoSearchHistory',
    ProjectionExpression: 'cryptoSymbol, timestamp',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve search history' }),
    };
  }
};