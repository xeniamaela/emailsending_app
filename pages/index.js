import { List } from "@shopify/polaris";
import React, {useState, useEffect} from 'react'

function Index({authAxios}) {
  
  const [customers, setCustomers] = useState([])

  const fetchCustomers = () => {
    authAxios.get('/customers')
    .then(result => {
      console.log(result.data.body.customers)
      setCustomers(result.data.body.customers)
    })
    .catch(error => { console.log(error)})
  }

  useEffect(() => {
    fetchCustomers();
  }, [])

  return (
    <List>
      {customers.map(customer => {
      <List.Item key={customer.id}>{customer.first_name}</List.Item>
      })}
    </List>

  )
}
export default Index;

{/* 


          <Stack.Item fill>
              <h4>
              <TextStyle variation="strong"></TextStyle>
              </h4>
          </Stack.Item>
          <Stack.Item>
              <p>${p}</p>
          </Stack.Item> */}