import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import DetailsComponent from './detailsComponent';

import {
  getBorehole,
  getStratigraphiesByBorehole
} from '@ist-supsi/bmsjs';

class DetailsContainer extends React.Component {
  componentDidMount() {
    const {
      id
    } = this.props;
    if (!_.isNil(id)) {
      this.props.getBorehole(id);
      // this.props.getStratigraphiesByBorehole(id);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      id, detail
    } = this.props;
    if (
      detail.borehole !== null
      && id !== null
      && detail.borehole.id !== id
    ) {
      this.props.getBorehole(id);
      // this.props.getStratigraphiesByBorehole(id);
    } else if (detail.error !== null){

    }
  }
  componentWillUnmount(){
    this.props.getBorehole();
  }
  render() {
    const {
      detail, domains
    } = this.props;
    if (detail.error !== null){
      return (
        <div>
          Locked
        </div>
      );
    }
    return (
      <DetailsComponent
        detail={detail}
        domains={domains}
      />
    );
  }
}

DetailsContainer.propTypes = {
  detail: PropTypes.object,
  domains: PropTypes.object,
  getBorehole: PropTypes.func,
  getStratigraphiesByBorehole: PropTypes.func,
  id: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
  return {
    detail: state.detail_borehole,
    domains: state.core_domain_list,
    ...ownProps
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
    setTab: (tab) => {
      dispatch({
        type: 'DETCNTTABCHG',
        tab: tab
      });
    },
    getBorehole: (id = null) => {
      dispatch({
        type: 'GETBOREHOLEDETAILS'
      });
      if (id!==null){
        getBorehole(
          id
        ).then(function (response) {
          if (response.data.success) {
            dispatch({
              type: 'GETBOREHOLEDETAILS_OK',
              borehole: response.data.data
            });
            getStratigraphiesByBorehole(
              id
            ).then(function (response) {
              if (response.data.success) {
                dispatch({
                  type: 'GET_BOREHOLE_STRATIGRAPHIES_OK',
                  stratigraphies: response.data.data
                });
              } else {
                dispatch({
                  type: 'GET_BOREHOLE_STRATIGRAPHIES_ERROR',
                  message: response.message
                });
              }
            }).catch(function (error) {
              console.log(error);
            });
          } else {
            dispatch({
              type: 'GETBOREHOLEDETAILS_ERROR',
              error: response.error
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      };
    },
    getStratigraphiesByBorehole: (id) => {
      dispatch({
        type: 'GET_BOREHOLE_STRATIGRAPHIES'
      });
      getStratigraphiesByBorehole(
        id
      ).then(function (response) {
        if (response.data.success) {
          dispatch({
            type: 'GET_BOREHOLE_STRATIGRAPHIES_OK',
            stratigraphies: response.data.data
          });
        } else {
          dispatch({
            type: 'GET_BOREHOLE_STRATIGRAPHIES_ERROR',
            message: response.message
          });
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsContainer);
