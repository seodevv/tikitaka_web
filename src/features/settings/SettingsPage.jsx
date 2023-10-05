import '../../css/settings.css';
import SettingsContent from './SettingsContent';
import SettingsTitle from './SettingsTitle';

const SettingsPage = () => {
  return (
    <>
      <section className="settings-box ani-fade-in">
        <SettingsTitle />
        <SettingsContent />
      </section>
    </>
  );
};

export default SettingsPage;
