/**
 * Default values
 */
export default {
  fixtures: [],
  initialValue: '',
  placeholder: '搜索地名',
  disabled: false,
  className: '',
  inputClassName: '',
  region: '全国',
  location: null,
  radius: null,
  bounds: null,
  country: null,
  types: null,
  queryDelay: 250,
  googleMaps: null,
  onActivateSuggest: () => {},
  onSuggestSelect: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  skipSuggest: () => {},
  getSuggestLabel: suggest => suggest.label,
  autoActivateFirstSuggest: false,
  style: {
    'input': {},
    'suggests': {},
    'suggestItem': {}
  },
  ignoreTab: false
};
