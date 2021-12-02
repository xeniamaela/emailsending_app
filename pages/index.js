import { Card, Button, Page, DataTable, List } from "@shopify/polaris";
import React, {useState, useEffect} from 'react'

function Index({authAxios}) {
  
  const [customers, setCustomers] = useState([])
  // const [customerEmail, setCustomerEmail] = useState([])

  useEffect(() => {
    authAxios.get('/customers')
    .then(result => {
      // console.log(result.data.body.customers)
      setCustomers(result.data.body.customers)
    })
    .catch(error => { console.log(error)})
  }, [])

  let id =customers.map(customer => {
    return(customer.id)
  })
  let firstName =customers.map(customer => {return(customer.first_name)})
  let lastName =customers.map(customer => {return(customer.last_name)})
  // let lastName = lastNames.map(lm => {return lm})
  let emails = customers.map(customer => {return(customer.email)})
  // let email = emails.map(e => {return e})


  const handleEmailSending = async () => {
    emails.map(e =>
      e.length != 0 && authAxios.post('/spamEmail', {
        email: e
      })
      .then(result => {return result})
    )
  }

  return (

      <Page
        title='List of all customers'
      >
        <Button
        primary
        onClick={handleEmailSending}
        >Send Spam Email</Button>
        <Card>
        <DataTable
          columnContentTypes={[
            'numeric',
            'text',
            'text',
            'text',
          ]}
          headings={[

          ]}
          rows={[
            id,
            firstName,
            lastName,
            emails
          ]}
        />
        </Card>
      </Page>
  )
}
export default Index;


    // <div>
      // <Button>Button</Button>
      // <div>
      // {customers.map(customer => {
      // <h1 key={customer.id}>{customer.first_name}</h1>
      // })}
      // </div>
    // </div>