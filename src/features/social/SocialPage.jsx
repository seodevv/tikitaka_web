import { useSelector } from 'react-redux';
import '../../css/social.css';
import SocialContent from './SocialContent';
import SocialTitle from './SocialTitle';
import { selectViewPort } from './socialReducer';
import MobileFeatures from './Mobile/MobileFeatures';

const SocialPage = () => {
  const viewport = useSelector(selectViewPort);

  return (
    <>
      <section className="social-box ani-fade-in">
        {viewport.width > 540 ? <SocialTitle /> : <MobileFeatures />}
        <SocialContent />
      </section>
    </>
  );
};

export default SocialPage;
