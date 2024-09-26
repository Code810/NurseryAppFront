import PageTitle from '@/components/about/pageTitle'
import ContactAddress from '@/components/sections/contact/contactAddress';
import ContactForm from '@/components/sections/contact/contactForm';
import React from 'react'
import { useOutletContext } from 'react-router-dom';

const Contact = () => {
  const { settings } = useOutletContext();
  return (
    <>
      <main>
      <PageTitle pageName={"Bizimlə Əlaqə"} />
      <ContactAddress settings={settings}/>
      <ContactForm/>
      </main>
    </>
  )
}

export default Contact