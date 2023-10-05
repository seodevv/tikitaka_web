import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAlarmCountQuery } from '../features/alarm/alarmSlice';
import { useSelector } from 'react-redux';
import { selectCreatorId } from '../features/login/loginReducer';

const Menu = ({ menu, selected }) => {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const creatorId = useSelector(selectCreatorId);

  const { data, isSuccess } = useGetAlarmCountQuery(
    { target: creatorId },
    {
      skip: menu.title !== 'Alarm' || !creatorId ? true : false,
      pollingInterval: 60 * 1000,
    }
  );

  const onClickSelect = () => {
    if (pathname === menu.url) {
      navigator('/');
      return;
    }
    navigator(menu.url);
  };

  let badge;
  if (isSuccess && data.success && data.count !== 0) {
    badge = (
      <div className="badge">
        <span>{data.count}</span>
      </div>
    );
  }

  return (
    <div
      className={`menu-item ${selected && 'selected'}`}
      onClick={(e) => onClickSelect(e)}
    >
      <div>
        <FontAwesomeIcon icon={`${menu.type} ${menu.icon}`} />
      </div>
      <div className="text-start">{menu.title}</div>
      {badge}
    </div>
  );
};

export default Menu;
