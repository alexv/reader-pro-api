import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';

// eslint-disable-next-line
export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'feeds',
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'feedId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      feedId: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET feedName = :feedName, feedUrl = :feedUrl',
    ExpressionAttributeValues: {
      ':feedName': data.feedName ? data.feedName : null,
      ':feedUrl': data.feedUrl ? data.feedUrl : null,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDbLib.call('update', params);
    console.log('heyo:', result);
    callback(null, success({ status: true }));
    // callback(null, success({ status: true }));
  } catch (e) {
    console.log('error:', e);
    callback(null, failure({ status: false }));
  }
}
