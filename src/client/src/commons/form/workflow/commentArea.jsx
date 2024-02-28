import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import CommentComponent from "./commentComponent";

const CommentArea = props => {
  const { readOnly, height, onChange, value, border } = props;
  return <CommentComponent height={height} onChange={onChange} readOnly={readOnly} value={value} border={border} />;
};

CommentArea.propTypes = {
  domains: PropTypes.object,
  height: PropTypes.number,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }),
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
};

CommentArea.defaultProps = {
  height: 187,
  readOnly: false,
  value: "",
};

const mapStateToProps = state => {
  return {
    domains: state.core_domain_list,
  };
};

export default connect(mapStateToProps, null)(withTranslation()(CommentArea));
