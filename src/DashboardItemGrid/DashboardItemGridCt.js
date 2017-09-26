import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as fromReducers from '../reducers/index';

import { getDashboardItems } from '../api/index';

import DashboardItemGrid from './DashboardItemGrid';
