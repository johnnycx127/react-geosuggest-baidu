/* global window */

import React from 'react';
import classnames from 'classnames';
import debounce from 'lodash.debounce';

import defaults from './defaults';
import propTypes from './prop-types';
import filterInputAttributes from './filter-input-attributes';

import Input from './input';
import SuggestList from './suggest-list';

// Escapes special characters in user input for regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * Entry point for the Geosuggest component
 */
class Geosuggest extends React.Component {
  /**
   * The constructor. Sets the initial state.
   * @param  {Object} props The properties object.
   */
  constructor(props) {
    super(props);
    this.state = {
      isSuggestsHidden: true,
      userInput: props.initialValue,
      activeSuggest: null,
      suggests: [],
      timer: null
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onAfterInputChange = this.onAfterInputChange.bind(this);

    if (props.queryDelay) {
      this.onAfterInputChange =
        debounce(this.onAfterInputChange, props.queryDelay);
    }
  }

  /**
   * Change inputValue if prop changes
   * @param {Object} props The new props
   */
  componentWillReceiveProps(props) {
    if (this.props.initialValue !== props.initialValue) {
      this.setState({userInput: props.initialValue});
    }
  }

  /**
   * Called on the client side after component is mounted.
   * Google api sdk object will be obtained and cached as a instance property.
   * Necessary objects of google api will also be determined and saved.
   */
  componentWillMount() {

  }

  /**
   * When the component will unmount
   */
  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  /**
   * When the input got changed
   * @param {String} userInput The input value of the user
   */
  onInputChange(userInput) {
    this.setState({userInput}, this.onAfterInputChange);
  }

  onAfterInputChange() {
    this.showSuggests();
    this.props.onChange(this.state.userInput);
  }

  /**
   * When the input gets focused
   */
  onInputFocus() {
    this.props.onFocus();
    this.showSuggests();
  }

  /**
   * When the input gets blurred
   */
  onInputBlur() {
    if (!this.state.ignoreBlur) {
      this.hideSuggests();
    }
  }

  /**
   * Focus the input
   */
  focus() {
    this.refs.input.focus();
  }

  /**
   * Update the value of the user input
   * @param {String} userInput the new value of the user input
   */
  update(userInput) {
    this.setState({userInput});
    this.props.onChange(userInput);
  }

  /*
   * Clear the input and close the suggestion pane
   */
  clear() {
    this.setState({userInput: ''}, () => this.hideSuggests());
  }

  /**
   * Search for new suggests
   */
  searchSuggests() {
    if (!this.state.userInput) {
      this.updateSuggests();
      return;
    }

    const options = {
      query: this.state.userInput,
      output: 'json'
    };

    ['region', 'ak'].forEach(option => {
      if (this.props[option]) {
        options[option] = this.props[option];
      }
    });

    if (this.props.location) {
      options.location = ','.join([this.props.lat, this.props.lon]);
    }

    window.$.ajax({
      type: 'get',
      url: 'http://api.map.baidu.com/place/v2/suggestion',
      data: options,
      dataType: 'jsonp',
      jsonp: 'callback',
      success: data => {
        if (data.status === 0) {
          this.updateSuggests(data.result.map(item => {
            return {
              label: item.name,
              placeId: item.uid,
              location: item.location,
              city: {
                id: item.cityid,
                name: item.city
              },
              business: item.business,
              district: item.district
            };
          }));
        } else {
          this.updateSuggests([]);
        }
        if (this.props.autoActivateFirstSuggest) {
          this.activateSuggest('next');
        }
      },
      error: () => {
        this.updateSuggests([]);
        this.activateSuggest('next');
      }
    });
  }

  /**
   * Update the suggests
   * @param  {Array} suggestsGoogle The new google suggests
   */
  updateSuggests(suggestsBaidu = []) {
    var suggests = [],
      regex = new RegExp(escapeRegExp(this.state.userInput), 'gim'),
      skipSuggest = this.props.skipSuggest,
      maxFixtures = 10,
      fixturesSearched = 0;

    this.props.fixtures.forEach(suggest => {
      if (fixturesSearched >= maxFixtures) {
        return;
      }

      if (!skipSuggest(suggest) && suggest.label.match(regex)) {
        fixturesSearched++;

        suggest.placeId = suggest.label;
        suggest.isFixture = true;
        suggests.push(suggest);
      }
    });

    suggestsBaidu.forEach(suggest => {
      if (!skipSuggest(suggest)) {
        suggests.push({
          label: this.props.getSuggestLabel(suggest),
          placeId: suggest.placeId,
          isFixture: false,
          location: suggest.location,
          city: suggest.city,
          business: suggest.business,
          district: suggest.district
        });
      }
    });

    this.setState({suggests});
  }

  /**
   * Show the suggestions
   */
  showSuggests() {
    this.searchSuggests();
    this.setState({isSuggestsHidden: false});
  }

  /**
   * Hide the suggestions
   */
  hideSuggests() {
    this.props.onBlur(this.state.userInput);
    const timer = setTimeout(() => {
      this.setState({isSuggestsHidden: true});
    }, 100);

    this.setState({timer});
  }

  /**
   * Activate a new suggest
   * @param {String} direction The direction in which to activate new suggest
   */
  activateSuggest(direction) { // eslint-disable-line complexity
    if (this.state.isSuggestsHidden) {
      this.showSuggests();
      return;
    }

    const suggestsCount = this.state.suggests.length - 1,
      next = direction === 'next';
    let newActiveSuggest = null,
      newIndex = 0,
      i = 0;

    for (i; i <= suggestsCount; i++) {
      if (this.state.suggests[i] === this.state.activeSuggest) {
        newIndex = next ? i + 1 : i - 1;
      }
    }

    if (!this.state.activeSuggest) {
      newIndex = next ? 0 : suggestsCount;
    }

    if (newIndex >= 0 && newIndex <= suggestsCount) {
      newActiveSuggest = this.state.suggests[newIndex];
    }

    this.props.onActivateSuggest(newActiveSuggest);

    this.setState({activeSuggest: newActiveSuggest});
  }

  /**
   * When an item got selected
   * @param {GeosuggestItem} suggest The selected suggest item
   */
  selectSuggest(suggest) {
    if (!suggest) {
      suggest = {
        label: this.state.userInput
      };
    }

    this.setState({
      isSuggestsHidden: true,
      userInput: suggest.label
    });

    if (suggest.location) {
      this.setState({ignoreBlur: false});
      this.props.onSuggestSelect(suggest);
      return;
    }

    this.props.onSuggestSelect(suggest);
  }

  /**
   * Render the view
   * @return {Function} The React element to render
   */
  render() {
    const attributes = filterInputAttributes(this.props),
      classes = classnames(
        'geosuggest',
        this.props.className
      ),
      input = <Input className={this.props.inputClassName}
        ref='input'
        value={this.state.userInput}
        ignoreTab={this.props.ignoreTab}
        onChange={this.onInputChange}
        onFocus={this.onInputFocus.bind(this)}
        onBlur={this.onInputBlur.bind(this)}
        style={this.props.style.input}
        onNext={() => this.activateSuggest('next')}
        onPrev={() => this.activateSuggest('prev')}
        onSelect={() => this.selectSuggest(this.state.activeSuggest)}
        onEscape={this.hideSuggests.bind(this)} {...attributes} />,
      suggestionsList = <SuggestList isHidden={this.state.isSuggestsHidden}
        style={this.props.style.suggests}
        suggestItemStyle={this.props.style.suggestItem}
        suggests={this.state.suggests}
        activeSuggest={this.state.activeSuggest}
        onSuggestMouseDown={() => this.setState({ignoreBlur: true})}
        onSuggestMouseOut={() => this.setState({ignoreBlur: false})}
        onSuggestSelect={this.selectSuggest.bind(this)}/>;

    return <div className={classes}>
      <div className="geosuggest__input-wrapper">
        {input}
      </div>
      <div className="geosuggest__suggests-wrapper">
        {suggestionsList}
      </div>
    </div>;
  }
}

/**
 * Types for the properties
 * @type {Object}
 */
Geosuggest.propTypes = propTypes;

/**
 * Default values for the properties
 * @type {Object}
 */
Geosuggest.defaultProps = defaults;

export default Geosuggest;
