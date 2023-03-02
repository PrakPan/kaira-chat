import ContactContainer from '../containers/contact/Index';
import Head from 'next/head';
import Layout from '../components/Layout'

const Contact = () => {
     return <Layout>  <Head>
    <title>Contact Us | The Tarzan Way | Travel India</title>
    <meta name="robots" content="noindex"></meta>

    <meta name="description" content="You can contact us here for travel enquiries, applications, and partnerships, contact us on the numbers provided or mail at info@thetarzanway.com"></meta>
    <meta property="og:title" content="Contact Us | The Tarzan Way | India" /> 
    <meta property="og:description" content="You can contact us here for travel enquiries, applications, and partnerships, contact us on the numbers provided or mail at info@thetarzanway.com" />
    <meta property="og:image" content="/logoblack.svg" />

</Head>  <ContactContainer></ContactContainer></Layout>
 

}

export default Contact