module.exports = {
    // configuration
    entry: {
        login: "./js/src/login",
        chart_menu: "./js/src/chart_menu",
        base: "./js/src/base",
        source: "./js/src/source",
        user: "./js/src/user",
        source_pool: "./js/src/sources_pool",
        records: './js/src/records'
    },
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: "js/[name].bundle.js"
    }
};