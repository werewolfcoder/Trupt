const socketIo = require('socket.io');
const userModel = require('./models/user.model');

let io;
const connectedUsers = new Map(); // Track connected users

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const {userId} = data;
            console.log(`${userId} joined`);
            
            // Get user data for name
            const userData = await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            
            // Track user connection
            connectedUsers.set(userId, {
                socketId: socket.id,
                userId: userId,
                userName: userData.name || `User ${userId.slice(-4)}`
            });
            
            // Notify others that a new user has connected
            socket.broadcast.emit('user-connected', {
                userId: userId,
                userName: userData.name || `User ${userId.slice(-4)}`
            });
        });

        socket.on('update-location', async (data) => {
            const { userId, location, userName } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await userModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
            
            // Broadcast location update to all connected clients
            io.emit('user-location-update', {
                userId,
                userName: userName || connectedUsers.get(userId)?.userName || `User ${userId.slice(-4)}`,
                location
            });
        });
        
        // Handle request for all locations
        socket.on('request-all-locations', async () => {
            try {
                // Get all users with locations
                const users = await userModel.find({ 
                    location: { $exists: true },
                    socketId: { $exists: true }
                });
                
                // Send each user's location to the requestor
                users.forEach(user => {
                    if (user.location && user.location.ltd && user.location.lng) {
                        socket.emit('user-location-update', {
                            userId: user._id,
                            userName: user.name || `User ${user._id.toString().slice(-4)}`,
                            location: user.location
                        });
                    }
                });
            } catch (error) {
                console.error('Error fetching all locations:', error);
            }
        });
        
        // Handle request for a specific user's location
        socket.on('request-location', async (data) => {
            try {
                const { userId } = data;
                const user = await userModel.findById(userId);
                
                if (user && user.location && user.location.ltd && user.location.lng) {
                    socket.emit('user-location-update', {
                        userId: user._id,
                        userName: user.name || `User ${user._id.toString().slice(-4)}`,
                        location: user.location
                    });
                }
            } catch (error) {
                console.error('Error fetching user location:', error);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            // Find which user this socket belonged to
            let disconnectedUserId = null;
            for (const [userId, userData] of connectedUsers.entries()) {
                if (userData.socketId === socket.id) {
                    disconnectedUserId = userId;
                    break;
                }
            }
            
            if (disconnectedUserId) {
                // Remove from our tracking
                connectedUsers.delete(disconnectedUserId);
                
                // Notify other clients that this user disconnected
                socket.broadcast.emit('user-disconnected', {
                    userId: disconnectedUserId
                });
                
                // Update the user model
                await userModel.findByIdAndUpdate(disconnectedUserId, {
                    $unset: { socketId: "" }
                });
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };