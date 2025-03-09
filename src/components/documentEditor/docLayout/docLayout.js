import React from 'react';
import DocHeader from './docHeader/docHeader';
import DocFooter from './docFooter/docFooter';

function DocLayout({ author, title, children }) {
    return (
      <>
        <DocHeader author={author} title = {title}/>
        {children}
        <DocFooter />
      </>
    );
}

export default DocLayout;
