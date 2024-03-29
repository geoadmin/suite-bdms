import { useRef, useState, useCallback, useEffect, useContext } from "react";
import * as Styled from "./styles";
import InfoList from "./components/infoList";
import InfoCheckBox from "./components/infoCheckBox";
import { useTranslation } from "react-i18next";
import { sendProfile } from "./api";
import { fetchStratigraphy } from "../../../../../api/fetchApiV2";
import _ from "lodash";
import { AlertContext } from "../../../../../components/alert/alertContext";

const ProfileInfo = props => {
  const { selectedStratigraphyID: id, isEditable, onUpdated, attribute } = props.data;

  const mounted = useRef(false);
  const { t } = useTranslation();
  const alertContext = useContext(AlertContext);
  const [state, setState] = useState({
    isPatching: false,
    updateAttributeDelay: {},
    profileInfo: {
      id: null,
      name: null,
      isPrimary: false,
      date: null,
      date_abd: null,
      notes: null,
      quality: null,
    },
  });
  const setData = useCallback(id => {
    fetchStratigraphy(id).then(data => {
      if (mounted.current) setState({ profileInfo: data });
    });
  }, []);

  useEffect(() => {
    //using useRef for memory leak error
    mounted.current = true;
    if (id && mounted.current) setData(id);
    else setState({});

    return () => {
      mounted.current = false;
    };
  }, [id, setData]);

  const updateChange = (attribute, value, isNumber = false) => {
    if (!isEditable) {
      alertContext.error(t("common:errorStartEditing"));
      return;
    }
    setState(prevState => ({ ...prevState, isPatching: true }));
    _.set(state.profileInfo, attribute, value);

    if (isNumber && value !== null) {
      if (/^-?\d*[.,]?\d*$/.test(value)) {
        patch(attribute, _.toNumber(value));
      }
    } else {
      patch(attribute, value);
    }
  };

  const patch = (attribute, value) => {
    clearTimeout(state.updateAttributeDelay?.[attribute]);

    let setDelay = setTimeout(() => {
      sendProfile(id, attribute, value).then(res => {
        if (res) {
          setState(prevState => ({ ...prevState, isPatching: false }));
          if (_.isFunction(onUpdated)) {
            onUpdated(attribute);
          }
        }
      });
    }, 500);

    Promise.resolve().then(() => {
      setState(prevState => ({
        ...prevState,
        updateAttributeDelay: { [attribute]: setDelay },
      }));
    });
  };
  return (
    <Styled.Container>
      {attribute && (
        <InfoList
          data={{
            attribute,
            updateChange,
            profileInfo: state.profileInfo,
          }}
        />
      )}

      <InfoCheckBox
        data={{
          profileInfo: state.profileInfo,
          updateChange,
          isEditable,
          onUpdated,
        }}
      />
    </Styled.Container>
  );
};

export default ProfileInfo;
