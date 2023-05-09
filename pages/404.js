import Head from 'next/head'
import NotFoundContainer from '../containers/notfound/Index';
import Layout from '../components/Layout';
import usePageLoaded from '../components/custom hooks/usePageLoaded';

const Error = () => {
  const isPageLoaded = usePageLoaded();

    if(isPageLoaded)
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