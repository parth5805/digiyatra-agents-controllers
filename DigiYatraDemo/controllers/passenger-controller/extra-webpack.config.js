const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            $ENV: {
                RUNMODE: JSON.stringify(process.env.RUNMODE),
                PASSENGER_AGENT_HOST: JSON.stringify(process.env.PASSENGER_AGENT_HOST)
            }
        })
    ]
};