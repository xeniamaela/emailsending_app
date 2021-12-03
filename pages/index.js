import { Card, Button, Page, DataTable, List, Layout } from "@shopify/polaris";
import React, {useState, useEffect} from 'react'

function Index({authAxios}) {
  
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    authAxios.get('/customers')
    .then(result => {
      console.log(result)
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
        email: e
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