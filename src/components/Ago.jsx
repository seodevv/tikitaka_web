import { formatDistance, parseISO } from 'date-fns';
import { getKoreaDate } from '../app/common';

const Ago = ({ className, date = new Date().toISOString() }) => {
  const parse = parseISO(date);
  const ago = formatDistance(parse, getKoreaDate(new Date())) + ' ago';

  const convertAgo = (ago) => {
    let convert = ago;
    if (convert.search(/^about/) !== -1) {
      convert = convert.replace('about ', '');
    }
    if (convert.search(/^less/) !== -1) {
      convert = convert.replace('less than ', '');
    }
    return convert;
  };

  return <span className={className}>{convertAgo(ago)}</span>;
};

export default Ago;
