import { useEffect, useState } from 'react';
import Calendar from '../../../components/Calendar';

const SettingsBirth = ({ userInfo, status, setStatus }) => {
  const [birth, setBirth] = useState('1900-01-01');

  useEffect(() => {
    if (birth !== userInfo.birth.substring(0, 10)) {
      setStatus(birth);
    }
  }, [birth]);

  useEffect(() => {
    if (status === 'reset') {
      setBirth(userInfo.birth.substring(0, 10));
      setStatus('idle');
    }
  }, [status]);

  useEffect(() => {
    if (userInfo) {
      setBirth(userInfo.birth.substring(0, 10));
      setStatus('idle');
    }
  }, []);

  return (
    <>
      <tr>
        <td>birth</td>
        <td className="birth">
          <Calendar birth={birth} setBirth={setBirth} />
        </td>
      </tr>
    </>
  );
};

export default SettingsBirth;
