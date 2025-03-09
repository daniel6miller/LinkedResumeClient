import React, { useEffect, useState } from 'react';
import Layout from '../layout/layout';
import NavLeft from './navLeft/navLeft';
import Feed from './feed/feed';
import NavRight from './navRight/navRight';
import Post from './post/post';
import './homepage.css';

function HomePage() {
    const [showPostModal, setShowPostModal] = useState(false);

    return (
        <div className="homepage">
            <Layout>
                <div className='wrapper'>
                    <div className='wrapperItem'>
                        <NavLeft />
                    </div>
                    <div className='wrapperItem'>
                            <Feed 
                                onPostClick={() => setShowPostModal(true)}
                            /> 
                    </div>
                    <div className='wrapperItem'>
                        <NavRight />
                    </div>
                </div>
            </Layout>
            {showPostModal && (
                <div className="post-modal-backdrop">
                    <Post onClose={() => setShowPostModal(false)}/>
                </div>
            )}
        </div>
    );
}

export default HomePage;
