import { Card, Button, Page, DataTable} from "@shopify/polaris";
import React, {useState, useEffect} from 'react';

const emailsending = ({authAxios}) => {
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [disable, setDisable] = useState(initialState)

  useEffect(() => {
    authAxios.get('/customers')
    .then(result => {setCustomers(result.data)}).catch(error => { console.log(error)})

    authAxios.get('/orders')
    .then(result => {setOrders(result.data.body.orders)}).catch(error => { console.log(error)})

    authAxios.post('/subscription-basic')
    .then(result => {console.log(result.data); window.parent.href = `./${result.data}`;}).catch(error => { console.log(error)})

    authAxios.post('/subscription-pro')
    .then(result => {console.log(result.data); window.parent.href = `./${result.data}`;}).catch(error => { console.log(error)})

    authAxios.get('/getAllSubscription')
    .then(result => {const subscription = result.data.body.recurring_application_charges; const length = result.data.body.recurring_application_charges.length;

      for(let i = 0; i < length; i++) {
        if (subscription[i].status !== 'active') {
          continue;
        } else {
          setSubscription(subscription[i].name)
          break;
        }
      } 
    })
  }, [authAxios])


  let orderList =[]
  orders.map(order => { order.line_items.map((item) => orderList.push(item.name))})


  let hash = {}
  let bestSelling = []
  let k = 3 //no, of top best selling products

  for (let cur of orderList) {
    if (!hash[cur]) hash[cur] = 0
    hash[cur]++
  }

  const hashToArray = Object.entries(hash)
  const sortedArray = hashToArray.sort((a,b) => b[1] - a[1])
  const sortedElements = sortedArray.map(num =>num[0])
  let final = sortedElements.slice(0, k)
  bestSelling.push(final)

  const row = customers.map(customer => {
    return [customer.id, customer.first_name, customer.last_name, customer.email,
    <Button primary id={customer.email} onClick={()=> handleSpecificEmail(customer.email, disable)}>Send</Button>]
  })

  const email = row.map(e => {return(e[3])})

  const handleSpecificEmail = async (customerEmail) => {
    // alert('Email sent!')
    // console.log(customerEmail)

    subscription[0].name === 'BASIC PLAN' ? authAxios.post('/subscription-pro')
    .then(res => {
      window.parent.location.href = res.data;
      setDisable(true);
    }) :
    authAxios.post('/spamEmail', {
      email: customerEmail,
      customMessage: bestSelling
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))

    alert('Email sent to customer!')
  }

  const handleEmailSending = async () => {
    subscription === null ? authAxios.post('/subscription-basic')
    .then(res => {
      window.parent.location.href = res.data;
    }) :
    authAxios.post('/spamEmail', {
      email: email,
      customMessage: bestSelling
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))

    alert('Email sent to all!')
  }

    return (
        <Page
        title='BEST SELLER EMAIL SENDER'
        subtitle={subscription}
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

export default emailsending;