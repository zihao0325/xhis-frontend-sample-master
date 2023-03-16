import qs, { ParsedQs } from 'qs';

function parse(): ParsedQs {
  return qs.parse(window.location.search, { ignoreQueryPrefix: true });
}

const parsed = parse();

export default parsed;
export { parse };
