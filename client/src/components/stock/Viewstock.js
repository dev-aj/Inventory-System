import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { viewItems } from '../../actions/stocks';
import Spinner from '../layout/Spinner';
import Tabledata from './Tabledata';

const Viewstock = ({ viewItems, stock: { items, loading } }) => {
  useEffect(() => {
    viewItems();
  }, [viewItems]);
  return (
    <Fragment>
      {items === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {' '}
          <Tabledata items={items} />
        </Fragment>
      )}
    </Fragment>
  );
};

Viewstock.propTypes = {
  stock: PropTypes.object,
  viewItems: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  stock: state.stock,
});

export default connect(mapStateToProps, { viewItems })(Viewstock);
