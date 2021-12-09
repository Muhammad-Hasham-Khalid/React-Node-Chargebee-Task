var chargebee = require('chargebee');

// configure chargebee
const SITE_NAME = 'differentdog-dev-test';
const API_KEY = 'test_1WoLulQA3lMVcuo34awKqcuqObzcd96nB7v';

chargebee.configure({ site: SITE_NAME, api_key: API_KEY });

exports.getAllCustomers = async (request, response) => {
  let data = [];
  const requests = [];

  await new Promise((resolve, reject) => {
    chargebee.customer
      .list()
      .request(function (customersListError, customersListResult) {
        if (customersListError) {
          reject(customersListError.message);
        } else {
          data = customersListResult.list;

          for (let index in customersListResult.list) {
            const record = customersListResult.list[index];
            const { customer } = record;

            // fetch subscription info
            const isSubscriptionFetchingCompleted = new Promise(
              (resolve, reject) => {
                chargebee.subscription
                  .list({
                    'customer_id[is]': customer.id,
                  })
                  .request(function (subscriptionError, subscriptionResult) {
                    if (subscriptionError) {
                      reject(subscriptionError.message);
                    } else {
                      data[index].customer.subscription =
                        subscriptionResult.list[0];
                      resolve();
                    }
                  });
              }
            );
            requests.push(isSubscriptionFetchingCompleted);

            // fetch orders
            const isOrderFetchingCompleted = new Promise((resolve, reject) => {
              chargebee.order
                .list({
                  'customer_id[is]': customer.id,
                })
                .request(function (orderError, orderResult) {
                  if (orderError) {
                    reject(orderError.message);
                  } else {
                    data[index].customer.orders = orderResult.list;
                    resolve();
                  }
                });
            });
            requests.push(isOrderFetchingCompleted);
          }
        }
        resolve();
      });
  });

  try {
    await Promise.all(requests);
    return response.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
