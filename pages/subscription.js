import { Card, Button, Page} from "@shopify/polaris";
import React, {useState, useEffect} from 'react';

const Subscription = ({authAxios}) => {

    
    const [subscription, setSubscription] = useState(null)

    useEffect(() => {
    
        authAxios.post('/subscription-basic')
        .then(result => {console.log(result.data); window.parent.href = `./${result.data}`;}).catch(error => { console.log(error)})
    
        authAxios.post('/subscription-pro')
        .then(result => {console.log(result.data); window.parent.href = `./${result.data}`;}).catch(error => { console.log(error)})
    
        authAxios.get('/getAllSubscription')
        .then(result => {const subscription = result.data.body.recurring_application_charges; const length = result.data.body.recurring_application_charges.length;
            console.log(subscription)
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
    
    const handleBasicPlan = async () => {
        if (subscription === null)
        {
            authAxios.post('/subscription-basic')
            .then(res => {window.location.href = res.data;})
        }  
    }

    const handleProPlan = async () => {
        authAxios.post('/subscription-pro')
        .then(res => {window.parent.location.href = res.data;})
    }

    return(
        <Page
        title="Choose the Right Plan For You"
        subtitle="Find a plan that best matches the scale you need for your application."
        divider
        >
            <Card title="FREE PLAN">
                <Card.Section>
                    <Button primary onClick={handleBasicPlan}>Subscribe</Button>
                </Card.Section>
            </Card>
            <Card title="BASIC PLAN">
                <Card.Section>
                    <Button primary onClick={handleBasicPlan}>Subscribe</Button>
                </Card.Section>
            </Card>
            <Card title="PRO PLAN">
                <Card.Section>
                    <Button primary onClick={handleProPlan}>Subscribe</Button>
                </Card.Section>
            </Card>
        </Page>
    ) 
}

export default Subscription;