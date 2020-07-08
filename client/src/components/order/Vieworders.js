import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

const Vieworders = () => {
  return (
    <Fragment>
      {/* {items === null || loading ? (
        <Spinner />
      ) : ( */}
      {/* <Fragment>
          {' '}
          <Tabledata items={items} />
        </Fragment> */}
      {/* )} */}
      ViewOrders
    </Fragment>
  );
};

Vieworders.propTypes = {};

export default connect(null)(Vieworders);
