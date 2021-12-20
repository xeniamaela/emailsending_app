import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function RECURRING_CREATE(url) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "PRO PLAN"
          trialDays: 7
          returnUrl: "${url}"
          test: true
          lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
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

export const getSubscriptionPro = async (ctx, shop) => {
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
