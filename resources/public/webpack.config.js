module.exports = {
    // configuration
    entry: {
        login: "./js/src/login",
        base: "./js/src/base"
    },
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: "js/[name].bundle.js"
    }
};