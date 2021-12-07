import { Card, Button, Page, DataTable } from "@shopify/polaris";
import React, {useState, useEffect} from 'react'

function Index({authAxios}) {
  
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])


  useEffect(() => {
    authAxios.get('/orders')
    .then(result => {
      // console.log('orders',(result.data.body.orders))
      setOrders(result.data.body.orders)
    })
    .catch(error => { console.log(error)})
  }, [])


  const orderList = orders.map(order => {return(order.line_items[0].name)})

  let trackObj = []
  let maxCount = 0, maxElement;

  orderList.forEach(order => {

    (!trackObj[order]) ? trackObj[order] = 1 : trackObj[order]++;

    if(trackObj[order] > maxCount) {
      maxCount = trackObj[order]
      maxElement=order
    }
  });

  let bestSellingOrders = Object.entries(trackObj).slice(0,2)
  let bestSelling = bestSellingOrders.map(a => {return(a[0])})
  console.log(trackObj)
  console.log(bestSelling)
  console.log(maxElement, maxCount)


  useEffect(() => {
    authAxios.get('/customers')
    .then(result => {
      setCustomers(result.data.body.customers)
    })
    .catch(error => { console.log(error)})
  }, [])

  const row = customers.map(customer => {
    return [customer.id, customer.first_name, customer.last_name, customer.email, <Button primary onClick={specificEmailSending}>Send</Button>]
  })

  let emails = customers.map(customer => {return(customer.email)})
  console.log(emails)
  const specificEmailSending = async () => {
    authAxios.post('/spamEmail', {
      email: emails,
      customMessage: bestSelling
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))
  }

  const handleEmailSending = async () => {
    emails.map(e =>
      e != null && authAxios.post('/spamEmail', {
        email: e,
        customMessage: bestSelling
      })
      .then(result => console.log(result))
      .catch(error => console.log(error))
    )
  }

  return (

      <Page
        title='List of all customers'
      >
        <Card>
          <Card.Section> 
            <Button primary onClick={handleEmailSending}>Send to all</Button>
          </Card.Section>
          <Card.Section>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text',]}
              headings={['Customer ID','First Name','Last Name','Email', '']}
              rows={row}
            />
          </Card.Section>
        </Card>
      </Page>
  )
}
export default Index;