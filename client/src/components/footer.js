// Dependencies
import React, { Component } from 'react';
//import PropTypes from 'prop-types';


class Footer extends Component {

  render() {
  	const copyright = '&copy NEORIS - Supply chain sensor traking - 2018'  ;

    return (
      <div className="Footer #e1f5fe light-blue lighten-5">
        <p dangerouslySetInnerHTML={{ __html: copyright }} />
      </div>
    );
  }
}

export default Footer;