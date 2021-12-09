import { Card, Button, Page, DataTable, ResourceList } from "@shopify/polaris";
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


  let orderList =[]
  orders.map(order => {
    order.line_items.map((item) => orderList.push(item.name))
  })


    let hash = {}
    let bestSelling = []
    let k = 3

    for (let cur of orderList) {
      if (!hash[cur]) hash[cur] = 0
      hash[cur]++
    }

    const hashToArray = Object.entries(hash)
    const sortedArray = hashToArray.sort((a,b) => b[1] - a[1])
    const sortedElements = sortedArray.map(num =>num[0])
    let final = sortedElements.slice(0, k)
    bestSelling.push(final)
    console.log(bestSelling)


  useEffect(() => {
    authAxios.get('/customers')
    .then(result => {
      setCustomers(result.data.body.customers)
    })
    .catch(error => { console.log(error)})
  }, [])

  const row = customers.map(customer => {
    return [customer.id, customer.first_name, customer.last_name, customer.email,
    <Button primary id={customer.email} onClick={()=> handleSpecificEmail(customer.email)}>Send</Button>]
  })

  const email = row.map(e => {return(e[3])})

  const handleSpecificEmail = async (customerEmail) => {
    alert('Email sent!')
    console.log(customerEmail)
    authAxios.post('/spamEmail', {
      email: customerEmail,
      customMessage: bestSelling
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))
  }

  const handleEmailSending = async () => {
    alert('Email sent to all!')
    authAxios.post('/spamEmail', {
      email: email,
      customMessage: bestSelling
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))
  }

  return (

      <Page
        title='BEST SELLER EMAIL SENDER'
      >
        <Card>
          <Card.Section> 
            <div style={{color: '#008060'}}>
              <Button monochrome outline fullWidth size="large" right onClick={handleEmailSending}>Send to all</Button>
            </div>
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