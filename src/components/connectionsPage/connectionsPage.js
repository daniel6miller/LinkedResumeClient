import React from 'react';
import Layout from '../layout/layout';
import { Link } from 'react-router-dom';
import './connectionsPage.css';

function ConnectionsPage({ children }) {
    return (
        <div className="connectionsPage">
            <Layout>
                <div className="wrapper">
                    <div className='connection-options wrapperItem'>
                        <div className='connections'>
                            <h1>Connections</h1>
                            <Link to="/connections" className='link-nav'><h4>My Connections</h4></Link>
                            <Link to="/connections/requests" className='link-nav'><h4>Connection Requests</h4></Link>
                        </div>
                    </div>
                    {children}
                </div>
            </Layout>
        </div>
    );
}

export default ConnectionsPage;

