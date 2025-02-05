// Import required modules using ESM import syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware and utilities
import configMode from './src/middleware/config-mode.js';
import { getNavigationLinks } from './src/models/index.js';
import baseRoute from './src/routes/index.js';
import layouts from './src/middleware/layouts.js';
import staticPaths from './src/middleware/static-paths.js';
import { notFoundHandler, globalErrorHandler } from './src/middleware/error-handler.js';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

// Serve static files from the public directory
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Set EJS as the view engine and specify views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Apply middleware
app.use(configMode);
app.use(layouts);
app.use(staticPaths);


// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set('layout default', 'default');
app.set('layouts', path.join(__dirname, 'src/views/layouts'));

// Load Navigation Links (Ensure function call is meaningful)
getNavigationLinks();

// Use the home route for the root URL
app.use('/', baseRoute);

// Apply error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// When in development mode, start a WebSocket server for live reloading
// if (mode.includes('dev')) {
//     const ws = await import('ws');
 
//     try {
//         const wsPort = parseInt(port) + 1;
//         const wsServer = new ws.WebSocketServer({ port: wsPort });
 
//         wsServer.on('listening', () => {
//             console.log(`WebSocket server is running on port ${wsPort}`);
//         });
 
//         wsServer.on('error', (error) => {
//             console.error('WebSocket server error:', error);
//         });
//     } catch (error) {
//         console.error('Failed to start WebSocket server:', error);
//     }
// }

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
