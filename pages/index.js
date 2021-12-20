import EmailSending from "./emailsending";
import React from 'react'
import Subscription from "./subscription";

const Index = ({authAxios}) => {

  return (
        <EmailSending authAxios={authAxios}/>
        // <Subscription authAxios={authAxios}/>
  )
}
export default Index;