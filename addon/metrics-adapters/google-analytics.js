import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import BaseAdapter from './base';

const get = Ember.get;
const {
  String: emberString,
  assert,
  merge
} = Ember;
const {
  capitalize
} = emberString;

export default BaseAdapter.extend({
  toStringExtension() {
    return 'GoogleAnalytics';
  },

  init() {
    const config = get(this, 'config');
    const {
      id
    } = config;

    assert('You must pass a valid `id` to the Google Analytics adapter', id);

    if (canUseDOM) {
      /* jshint ignore:start */
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      window.ga('create', id, 'auto');
      /* jshint ignore:end */
    }
  },

  trackEvent(options = {}) {
    const sendEvent = {
      hitType: 'event'
    };
    let gaEvent = {};

    for (let key in options) {
      const capitalizedKey = capitalize(key);
      gaEvent[`event${capitalizedKey}`] = options[key];
    }

    const event = merge(sendEvent, gaEvent);

    if (canUseDOM) {
      return window.ga('send', event);
    }
  },

  trackPage(options = {}) {
    const sendEvent = {
      hitType: 'pageview'
    };

    const event = merge(sendEvent, options);

    if (canUseDOM) {
      return window.ga('send', event);
    }
  }
});
