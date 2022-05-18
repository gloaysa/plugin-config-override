const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
	devServer: {
		contentBase: path.resolve(__dirname, './src'),
		historyApiFallback: true,
	},
	entry: {
		['extensions/devtools']: path.resolve(__dirname, './src/extensions/devtools/devtools.ts'),
		['apps/configuration-override/configuration-override']: path.resolve(__dirname, './src/apps/configuration-override/configuration-override.tsx'),
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'plugin'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								'@babel/preset-react',
								{
									plugins: ['@babel/plugin-proposal-class-properties'],
								},
							],
						},
					},
				],
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{test: /\.css$/, use: ['style-loader', 'css-loader'],},
			{test: /\.svg$/, use: ['url-loader']}
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'extensions/devtools.html',
			template: 'src/extensions/devtools/index.html',
			chunks: ['extensions/devtools'],
		}),
		new HtmlWebpackPlugin({
			filename: 'apps/configuration-override/index.html',
			template: 'src/apps/configuration-override/index.html',
			chunks: ['apps/configuration-override/configuration-override'],
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/manifest.json', to: '[name].[ext]' },
				{ from: 'src/assets/images/*.png', to: 'assets/images/[name].[ext]' },
			],
		}),
	],
};
