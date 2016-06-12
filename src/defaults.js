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
  getSuggestLabel: suggest => suggest.name,
  autoActivateFirstSuggest: false,
  style: {
    'input': {},
    'suggests': {},
    'suggestItem': {}
  },
  ignoreTab: false
};
