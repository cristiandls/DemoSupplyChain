import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const { title } = this.props;
    return (
      <div>
        <nav >
          <div className="nav-wrapper #0d47a1 blue darken-4" align="left">
            <a className="brand-logo" href="http://www.neoris.com">{title}</a>
          </div>
        </nav>
      </div>
    )
  }
}

export default Header;