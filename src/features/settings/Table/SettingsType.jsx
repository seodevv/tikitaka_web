import Brand from "../../../components/Brand";

const SettingsType = ({ userInfo }) => {
  return (
    <>
      <tr>
        <td>Type</td>
        <td>
          <Brand className="brand" type={userInfo.type} />
        </td>
      </tr>
    </>
  );
};

export default SettingsType;
