const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const gulpBin = path.join(rootDir, 'node_modules', 'gulp', 'bin', 'gulp.js');
const ngBin = path.join(rootDir, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

// Run gulp watch.
console.log('> gulp watch &');
const gulpProc = spawn(process.execPath, [gulpBin, 'watch'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
});

// Remove unknown arguments and prepare angular target.
const rawArgs = process.argv.slice(2);
let angularTarget = 'serve';
const filteredArgs = [];

for (const arg of rawArgs) {
    if (arg.startsWith('--project=')) {
        continue;
    }
    if (arg.startsWith('--platform=')) {
        angularTarget = 'ionic-cordova-serve';
        continue;
    }
    filteredArgs.push(arg);
}

// Serve app.
console.log(`> NODE_OPTIONS=--max-old-space-size=4096 ng run app:${angularTarget} ${filteredArgs.join(' ')}`);

const env = {
    ...process.env,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim(),
};

const ngProc = spawn(process.execPath, [ngBin, 'run', `app:${angularTarget}`, ...filteredArgs], {
    cwd: rootDir,
    stdio: 'inherit',
    env,
});

function cleanup() {
    try {
        gulpProc.kill();
    } catch (e) {}
    try {
        ngProc.kill();
    } catch (e) {}
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

ngProc.on('exit', (code) => {
    try {
        gulpProc.kill();
    } catch (e) {}
    process.exit(code || 0);
});
