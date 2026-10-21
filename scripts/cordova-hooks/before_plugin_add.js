#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const plugins = process.env.CORDOVA_PLUGINS || '';
if (plugins.includes('cordova-plugin-moodleapp')) {
    console.log('Building cordova-plugin-moodleapp');
    try {
        execSync('npm run prod', {
            cwd: path.resolve(__dirname, '..', '..', 'cordova-plugin-moodleapp'),
            stdio: 'inherit',
        });
    } catch (e) {
        console.error('Failed to build cordova-plugin-moodleapp:', e.message);
    }
}
