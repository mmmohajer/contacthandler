import React, { useRef, useContext } from 'react';
import { useParams } from 'react-router-dom'
import ReactToPrint from 'react-to-print';

import { SingleContactToPrint } from './SingleContactToPrint';
import StateContext from '../StateContext'
import Page from './Page'

const ViewSingleContact = () => {
  const componentRef = useRef();
  const { headers } = useContext(StateContext)
  const { id } = useParams()

const printButton = () => {
  return (
    <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
      Print Information
    </button>
  )
}

  return (
    <Page title = "Detailed Info">
      <SingleContactToPrint ref={componentRef} headers = { headers } id = { id }/>
      <ReactToPrint
        trigger={() => printButton()}
        content={() => componentRef.current}
      />
    </Page>
  );
};

export default ViewSingleContact