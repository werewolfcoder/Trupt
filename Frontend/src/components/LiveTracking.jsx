import { useEffect, useRef, useState, useContext } from "react";
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';

const LiveTracking = ({ donationId }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});
  const routeLinesRef = useRef({});
  const userLocationsRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const { socket } = useContext(SocketContext);
  const [user] = useContext(UserDataContext);
  
  // Track all connected users with their locations
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [actualUserLocation, setActualUserLocation] = useState(null);
  
  // Add dummy user data
  const dummyUserId = "dummy-user-123";
  const dummyUserName = "Volunteer Driver";
  const [dummyUserLocation, setDummyUserLocation] = useState([23.2196, 72.6419]); // Initial position
  const connectionLineRef = useRef(null);
  
  const hotspots = [
    {
      name: "Hotspot 1",
      description: "Location where helpless people who starve for food are there.",
      coordinates: [23.2156, 72.6369]
    },
    {
      name: "Hotspot 2",
      description: "Another location in Gandhinagar.",
      coordinates: [23.2237, 72.6493]
    }
  ];

  // Load the Leaflet library
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }
    
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      console.log("Leaflet loaded successfully");
      setMapLoaded(true);
    };
    script.onerror = (error) => {
      console.error("Failed to load Leaflet:", error);
    };
    document.head.appendChild(script);
  }, []);

  // Set up socket listeners for user locations
  useEffect(() => {
    if (!socket || !user?._id) return;
    
    // Listen for user location updates
    socket.on('user-location-update', (data) => {
      console.log("Received location update:", data);
      
      // Update connected users list if needed
      setConnectedUsers(prev => {
        const existingUserIndex = prev.findIndex(u => u.userId === data.userId);
        
        if (existingUserIndex >= 0) {
          // Update existing user
          const updatedUsers = [...prev];
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            location: data.location
          };
          return updatedUsers;
        } else {
          // Add new user
          return [...prev, {
            userId: data.userId,
            name: data.userName || `User ${prev.length + 1}`,
            color: getRandomColor(data.userId),
            location: data.location
          }];
        }
      });
      
      // Update the user's location on the map
      if (mapRef.current && data.location) {
        const coordinates = [data.location.ltd, data.location.lng];
        
        // If this is the current user, store their location
        if (data.userId === user._id) {
          setActualUserLocation(coordinates);
        }
        
        updateUserLocation(
          data.userId, 
          coordinates,
          data.userName || `User ${data.userId.slice(-4)}`
        );
      }
    });
    
    // Listen for user disconnection
    socket.on('user-disconnected', (data) => {
      console.log("User disconnected:", data);
      setConnectedUsers(prev => prev.filter(u => u.userId !== data.userId));
      
      // Remove the user's marker and route line if they exist
      if (markersRef.current[data.userId] && mapRef.current) {
        markersRef.current[data.userId].remove();
        delete markersRef.current[data.userId];
      }
      
      if (routeLinesRef.current[data.userId] && mapRef.current) {
        routeLinesRef.current[data.userId].remove();
        delete routeLinesRef.current[data.userId];
      }
    });
    
    // Listen for new user connections
    socket.on('user-connected', (data) => {
      console.log("New user connected:", data);
      socket.emit('request-location', { userId: data.userId });
    });
    
    // Request locations of all connected users when we join
    socket.emit('request-all-locations');
    
    return () => {
      socket.off('user-location-update');
      socket.off('user-disconnected');
      socket.off('user-connected');
    };
  }, [socket, user?._id, mapRef.current]);

  useEffect(() => {
    if (!socket || !donationId) return;

    // Request specific donation tracking details
    socket.emit('join-donation-tracking', { donationId });

    return () => {
        socket.emit('leave-donation-tracking', { donationId });
    };
  }, [socket, donationId]);

  // Initialize map after Leaflet is loaded
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;
    
    try {
      console.log("Initializing map");
      
      // Make sure the map container has a defined height
      if (getComputedStyle(mapContainerRef.current).height === '0px') {
        console.error("Map container has zero height");
        mapContainerRef.current.style.height = '500px'; // Force a minimum height
      }
      
      // Create map only if it doesn't already exist
      if (!mapRef.current) {
        const map = window.L.map(mapContainerRef.current, {
          center: [23.2156, 72.6369], // Default center
          zoom: 12,
          zoomControl: true
        });
        
        window.L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        ).addTo(map);
        
        // Add markers for hotspots
        hotspots.forEach(hotspot => {
          const marker = window.L.marker(hotspot.coordinates).addTo(map);
          marker.bindPopup(`
            <div>
              <h3 class="font-bold">${hotspot.name}</h3>
              <p>${hotspot.description}</p>
            </div>
          `);
        });
        
        mapRef.current = map;
        
        // Give the map a moment to initialize and then update its size
        setTimeout(() => {
          map.invalidateSize();
          console.log("Map size refreshed");
          
          // Center map on user's current location if available
          navigator.geolocation.getCurrentPosition(
            position => {
              const userCoords = [position.coords.latitude, position.coords.longitude];
              map.setView(userCoords, 12);
              setActualUserLocation(userCoords);
            },
            error => {
              console.log("Could not get user's location:", error);
            }
          );
        }, 500);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [mapLoaded]);

  // Effect to add dummy user and create connection line
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    // Add dummy user to connected users list
    setConnectedUsers(prev => {
      // Check if dummy user already exists
      if (prev.some(u => u.userId === dummyUserId)) return prev;
      
      return [...prev, {
        userId: dummyUserId,
        name: dummyUserName,
        color: getRandomColor(dummyUserId),
        location: { ltd: dummyUserLocation[0], lng: dummyUserLocation[1] }
      }];
    });
    
    // Initial position
    updateUserLocation(dummyUserId, dummyUserLocation, dummyUserName);
    
    // Create connection line with dashed style
    if (!connectionLineRef.current && mapRef.current) {
      connectionLineRef.current = window.L.polyline([], {
        color: '#FF0000',
        weight: 3,
        dashArray: '10, 10',
        opacity: 0.7
      }).addTo(mapRef.current);
    }
    
    // Clean up function
    return () => {
      if (connectionLineRef.current) {
        connectionLineRef.current.remove();
        connectionLineRef.current = null;
      }
    };
  }, [mapLoaded, mapRef.current]);

  // Update dummy user movement toward actual user
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !actualUserLocation) return;
    
    const moveInterval = setInterval(() => {
      setDummyUserLocation(currentPosition => {
        if (!actualUserLocation) return currentPosition;
        
        // Calculate direction vector from dummy to actual user
        const dx = actualUserLocation[0] - currentPosition[0];
        const dy = actualUserLocation[1] - currentPosition[1];
        
        // Calculate distance
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If very close to actual user, don't move further
        if (distance < 0.0005) return currentPosition;
        
        // Normalize direction vector and scale by step size
        const stepSize = 0.0003; // Adjust for speed
        const stepX = (dx / distance) * stepSize;
        const stepY = (dy / distance) * stepSize;
        
        // Calculate new position
        const newPosition = [
          currentPosition[0] + stepX,
          currentPosition[1] + stepY
        ];
        
        // Update dummy user marker on map
        updateUserLocation(dummyUserId, newPosition, dummyUserName);
        
        // Update connection line
        if (connectionLineRef.current) {
          connectionLineRef.current.setLatLngs([newPosition, actualUserLocation]);
        }
        
        return newPosition;
      });
    }, 1000); // Update every second
    
    return () => {
      clearInterval(moveInterval);
    };
  }, [mapLoaded, mapRef.current, actualUserLocation]);

  // Function to generate consistent colors for users
  const getRandomColor = (userId) => {
    // Generate a deterministic color based on userId
    // This ensures the same user always gets the same color
    const hash = userId.split('').reduce((acc, char) => 
      acc + char.charCodeAt(0), 0);
    
    const colors = [
      "#FF5733", "#33A1FF", "#33FF57", "#F033FF", "#FFBD33", 
      "#3371FF", "#FF3355", "#33FFC1", "#C133FF", "#FF8333"
    ];
    
    return colors[hash % colors.length];
  };
  
  // Function to update a user's location on the map
  const updateUserLocation = (userId, coordinates, userName) => {
    if (!mapRef.current) return;
    
    try {
      // Initialize user's location history if not exists
      if (!userLocationsRef.current[userId]) {
        userLocationsRef.current[userId] = [];
      }
      
      // Store the new location
      userLocationsRef.current[userId].push(coordinates);
      
      // Limit the route history length
      const maxRoutePoints = 100;
      if (userLocationsRef.current[userId].length > maxRoutePoints) {
        userLocationsRef.current[userId] = userLocationsRef.current[userId].slice(-maxRoutePoints);
      }
      
      // Create or update the user's marker
      if (!markersRef.current[userId]) {
        // Get the user's color
        const userColor = getRandomColor(userId);
        
        // Create custom icon with user's color
        const userIcon = window.L.divIcon({
          className: 'user-marker',
          html: `<div style="background-color: ${userColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        
        // Create new marker
        markersRef.current[userId] = window.L.marker(coordinates, {icon: userIcon})
          .addTo(mapRef.current)
          .bindPopup(`<div class="font-semibold">${userName || userId}</div>`);
        
        // Create new route line
        routeLinesRef.current[userId] = window.L.polyline([coordinates], {
          color: userColor,
          weight: 3,
          opacity: 0.7
        }).addTo(mapRef.current);
      } else {
        // Update existing marker
        markersRef.current[userId].setLatLng(coordinates);
        
        // Update existing route line
        routeLinesRef.current[userId].setLatLngs(userLocationsRef.current[userId]);
      }
      
      // If this is the current user, center the map on their location
      if (userId === user?._id) {
        mapRef.current.setView(coordinates, mapRef.current.getZoom());
      }
    } catch (err) {
      console.error(`Error updating location for ${userId}:`, err);
    }
  };
  
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Live User Tracking</h2>
        <div className="flex flex-wrap gap-4">
          {connectedUsers.map(user => (
            <div key={user.userId} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{backgroundColor: user.color}}
              ></div>
              <span>{user.name || `User ${user.userId.slice(-4)}`}</span>
            </div>
          ))}
          {connectedUsers.length === 0 && (
            <div className="text-gray-500 italic">No users currently connected</div>
          )}
        </div>
      </div>
      <div className="flex-grow relative w-full" style={{ minHeight: "500px" }}>
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
        ></div>
      </div>
    </div>
  );
};

export default LiveTracking;