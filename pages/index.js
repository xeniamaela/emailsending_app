import { Card, Button, Page, DataTable } from "@shopify/polaris";
import React, {useState, useEffect} from 'react'

function Index({authAxios}) {
  
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])

  // console.log(orders)
  let trackObj = {}
  let maxCount = 0, maxElement;


  useEffect(() => {
    authAxios.get('/orders')
    .then(result => {
      // console.log('orders',(result.data.body.orders))
      setOrders(result.data.body.orders)
    })
    .catch(error => { console.log(error)})
  }, [])


  const orderList = orders.map(order => {
    console.log(order.line_items[0].name)
    return(order.line_items[0].name)
  })

  orderList.forEach(cur => {
    (!trackObj[cur]) ? trackObj[cur] = 1 : trackObj[cur]++;

    if(trackObj[cur] > maxCount) {
      maxCount = trackObj[cur]
      maxElement=cur
    }
  });

  console.log(trackObj)
  console.log(maxElement, maxCount)




  useEffect(() => {
    authAxios.get('/customers')
    .then(result => {
      // console.log(result)
      setCustomers(result.data.body.customers)
    })
    .catch(error => { console.log(error)})
  }, [])

  const row = customers.map(customer => {
    return [customer.id, customer.first_name, customer.last_name, customer.email]
  })

  let emails = customers.map(customer => {return(customer.email)})


  const handleEmailSending = async () => {
    emails.map(e =>
      e != null && authAxios.post('/spamEmail', {
        email: e,
        customMessage: maxElement
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
            <Button fill primary onClick={handleEmailSending}>Send Spam Email</Button>
          </Card.Section>
          <Card.Section>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text',]}
              headings={['Customer ID','First Name','Last Name','Email']}
              rows={row}
            />
          </Card.Section>
        </Card>
      </Page>
  )
}
export default Index;