import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function RECURRING_CREATE(shop) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "BASIC PLAN"
          returnUrl: "${shop}"
          test: true
          lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 5, currencyCode: USD }
                  interval: EVERY_30_DAYS
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionBasic = async (ctx, shop) => {
  const { client } = ctx;
  // console.log(client)
  const confirmationUrl = await client
    .mutate({
      mutation: RECURRING_CREATE(`${process.env.HOST}/auth?shop=${shop}`)
    })
    .then(response => response.data.appSubscriptionCreate.confirmationUrl);

  console.log(confirmationUrl)
  return confirmationUrl;
};
