const { compile } = require('nexe');

compile({
    input: './server.js',
    output: './dist/server',
    target: 'win32-x64-6.11.3',
    build: true, //required to use patches
    patches: [
        async (compiler, next) => {
            await compiler.setFileContentsAsync(
                'lib/new-native-module.js',
                'module.exports = 42'
            );
            return next();
        }
    ]
}).then(() => {
    console.log('success');
});