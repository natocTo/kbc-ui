const defaultComponentId = 'keboola.ex-facebook';

function getFbAdsText(originalText) {
  const isCapitalized = /[A-Z]/.test(originalText[0]);
  let lastLetter = '';
  if (originalText.slice(-1) === 's') lastLetter = 's';
  const stem = isCapitalized ? 'Ad Account' : 'ad account';
  return stem + lastLetter;
}

function getInstagramText(originalText) {
  const isCapitalized = /[A-Z]/.test(originalText[0]);
  let lastLetter = '';
  if (originalText.slice(-1) === 's') lastLetter = 's';
  const stem = isCapitalized ? 'Instagram Business Account' : ' Instagram Business account';
  return stem + lastLetter;
}

export default function(componentId) {
  return function(text) {
    if (componentId === defaultComponentId) return text;
    if (componentId === 'keboola.ex-facebook-ads') return getFbAdsText(text);
    if (componentId === 'keboola.ex-instagram') return getInstagramText(text);
    return 'Missing account description';
  };
}
