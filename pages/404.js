import Head from 'next/head'
import NotFoundContainer from '../containers/notfound/Index';
import Layout from '../components/Layout';

const Error = () => {
    if(typeof window !== 'undefined')
    return (
    <Layout>
    <Head>
        <title>The Tarzan Way - Not Found</title>
    </Head>
    <NotFoundContainer></NotFoundContainer>
    </Layout>
    );
    else return <div></div>
}

export default Error