// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    mode: "development",
    entry: "./src/app.js",
    output: {
        filename: "main.js",
        path: path.resolve(import.meta.dirname, "dist"),
        clean: true,
    },
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/template.html"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html$/i,
                use: ["html-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
};
