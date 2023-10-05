const SettingsRegist = ({ userInfo }) => {
  const regist = userInfo?.regist
    ? userInfo.regist.substring(0, 10)
    : '1900-01-01';
  return (
    <tr>
      <td>regist</td>
      <td>{regist}</td>
    </tr>
  );
};

export default SettingsRegist;
