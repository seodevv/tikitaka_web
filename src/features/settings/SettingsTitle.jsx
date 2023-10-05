import Title from "../../components/Title";
import { FlexGrowBox } from "../../components/Styled";

const SettingsTitle = () => {
  return (
    <>
      <div className="settings-box-title flex-row-no flex-justify-start flex-align-center">
        <Title text="Settings" />
        <FlexGrowBox />
      </div>
    </>
  );
};

export default SettingsTitle;
