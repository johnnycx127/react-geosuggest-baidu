import React from 'react';
import ReactDOM from 'react-dom';
import Geosuggest from '../../src/Geosuggest';

var App = React.createClass({ // eslint-disable-line
  /**
   * Render the example app
   * @return {Function} React render function
   */
  render: function() {

    return ( // eslint-disable-line
      <div>
        <Geosuggest
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onSuggestSelect={this.onSuggestSelect}
          region="北京市"
          radius="20" />
      </div>
    );
  },

  /**
   * When the input receives focus
   */
  onFocus: function() {
    console.log('onFocus'); // eslint-disable-line
  },

  /**
   * When the input loses focus
   * @param {String} value The user input
   */
  onBlur: function(value) {
    console.log('onBlur', value); // eslint-disable-line
  },

  /**
   * When the input got changed
   * @param {String} value The new value
   */
  onChange: function(value) {
    console.log('input changes to :' + value); // eslint-disable-line
  },

  /**
   * When a suggest got selected
   * @param  {Object} suggest The suggest
   */
  onSuggestSelect: function(suggest) {
    console.log(suggest); // eslint-disable-line
  }
});

ReactDOM.render(<App />, document.getElementById('app')); // eslint-disable-line
