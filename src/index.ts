#!/usr/bin/env node
const path = require('path');
require('dotenv').load({ path: path.join(__dirname, '..', '.env') });
require('./jarvis');
