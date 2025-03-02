import { useEffect, useRef, useState, useContext } from "react";
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';

const LiveTracking = ({ donationId }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});
  const routeLinesRef = useRef({});
  const userLocationsRef = useRef({});
  const connectionRoutesRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const { socket } = useContext(SocketContext);
  const [user] = useContext(UserDataContext);
  const [routesCalculated, setRoutesCalculated] = useState({});
  
  // Track all connected users with their locations and roles
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [mainUserLocation, setMainUserLocation] = useState(null);
  
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

  // Load the Leaflet library and routing plugin
  useEffect(() => {
    if (window.L && window.L.Routing) {
      setMapLoaded(true);
      return;
    }
    
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Load Leaflet Routing Machine CSS
    const routingLink = document.createElement('link');
    routingLink.rel = 'stylesheet';
    routingLink.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
    document.head.appendChild(routingLink);
    
    // Load Font Awesome for better icons
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
    
    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      
      
      // Load Leaflet Routing Machine after Leaflet loads
      const routingScript = document.createElement('script');
      routingScript.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
      routingScript.onload = () => {
       
        setMapLoaded(true);
      };
      routingScript.onerror = (error) => {
        console.error("Failed to load Leaflet Routing Machine:", error);
      };
      document.head.appendChild(routingScript);
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
  
      
      // Update connected users list if needed
      setConnectedUsers(prev => {
        const existingUserIndex = prev.findIndex(u => u.userId === data.userId);
        
        if (existingUserIndex >= 0) {
          // Update existing user
          const updatedUsers = [...prev];
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            location: data.location,
            role: data.role || updatedUsers[existingUserIndex].role || 'user'
          };
          return updatedUsers;
        } else {
          // Add new user
          return [...prev, {
            userId: data.userId,
            name: data.userName || `User ${prev.length + 1}`,
            color: getRandomColor(data.userId),
            location: data.location,
            role: data.role || 'user' // Default role if not provided
          }];
        }
      });
      
      // Update the user's location on the map
      if (mapRef.current && data.location) {
        const coordinates = [data.location.ltd, data.location.lng];
        
        // If this is the current user, store their location
        if (data.userId === user._id) {
          setMainUserLocation(coordinates);
        }
        
        updateUserLocation(
          data.userId, 
          coordinates,
          data.userName || `User ${data.userId.slice(-4)}`,
          data.role || 'user'
        );
        
        // Calculate route only if it hasn't been calculated yet or if significant time has passed
        const routeKey = `${user._id}-${data.userId}`;
        if (
          data.userId !== user._id && 
          mainUserLocation && 
          (!routesCalculated[routeKey] || 
           Date.now() - routesCalculated[routeKey] > 5 * 60 * 1000) // 5 minutes
        ) {
          calculateRouteBetweenUsers(user._id, data.userId);
        }
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
      
      // Remove any routes involving this user
      Object.keys(connectionRoutesRef.current).forEach(key => {
        if (key.includes(data.userId)) {
          connectionRoutesRef.current[key].remove();
          delete connectionRoutesRef.current[key];
          
          // Remove from routes calculated
          const routeKeys = Object.keys(routesCalculated);
          routeKeys.forEach(routeKey => {
            if (routeKey.includes(data.userId)) {
              setRoutesCalculated(prev => {
                const updated = {...prev};
                delete updated[routeKey];
                return updated;
              });
            }
          });
        }
      });
    });
    
    // Listen for new user connections
    socket.on('user-connected', (data) => {
      console.log("New user connected:", data);
      socket.emit('request-location', { userId: data.userId });
    });
    
    // Listen for role updates
    socket.on('user-role-update', (data) => {
      console.log("User role update:", data);
      setConnectedUsers(prev => {
        return prev.map(u => {
          if (u.userId === data.userId) {
            return { ...u, role: data.role };
          }
          return u;
        });
      });
      
      // Update marker if it exists
      if (markersRef.current[data.userId] && mapRef.current) {
        const user = connectedUsers.find(u => u.userId === data.userId);
        if (user && user.location) {
          updateUserLocation(
            data.userId, 
            [user.location.ltd, user.location.lng],
            user.name || `User ${data.userId.slice(-4)}`,
            data.role
          );
        }
      }
    });
    
    // Request locations of all connected users when we join
    socket.emit('request-all-locations');
    
    return () => {
      socket.off('user-location-update');
      socket.off('user-disconnected');
      socket.off('user-connected');
      socket.off('user-role-update');
    };
  }, [socket, user?._id, mapRef.current, connectedUsers, mainUserLocation, routesCalculated]);

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
        
        // Add recenter control
        addRecenterControl(map);
        
        // Add legend for markers
        addMarkerLegend(map);
        
        mapRef.current = map;
        
        // Give the map a moment to initialize and then update its size
        setTimeout(() => {
          map.invalidateSize();
          
          
          // Center map on user's current location if available
          navigator.geolocation.getCurrentPosition(
            position => {
              const userCoords = [position.coords.latitude, position.coords.longitude];
              map.setView(userCoords, 12);
              setMainUserLocation(userCoords);
              
              // Emit current user's location if available
              if (socket && user?._id) {
                socket.emit('user-location-update', {
                  userId: user._id,
                  userName: user.name || 'You',
                  location: {
                    ltd: position.coords.latitude,
                    lng: position.coords.longitude
                  },
                  role: user.role || 'user'
                });
              }
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
  }, [mapLoaded, socket, user]);

  // Add a custom recenter control to the map
  const addRecenterControl = (map) => {
    // Create a custom control
    const RecenterControl = window.L.Control.extend({
      options: {
        position: 'bottomright'
      },
      
      onAdd: function() {
        const container = window.L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = window.L.DomUtil.create('a', '', container);
        button.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
        button.title = 'Recenter Map';
        button.href = '#';
        button.style.width = '34px';
        button.style.height = '34px';
        button.style.lineHeight = '34px';
        button.style.fontSize = '20px';
        button.style.textAlign = 'center';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'white';
        button.style.color = '#0078FF';
        
        window.L.DomEvent.on(button, 'click', function(e) {
          window.L.DomEvent.stopPropagation(e);
          window.L.DomEvent.preventDefault(e);
          
          // Recenter on main user's location if available
          if (mainUserLocation) {
            map.setView(mainUserLocation, 14);
          } else {
            // Try to get current location
            navigator.geolocation.getCurrentPosition(
              position => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                setMainUserLocation(userCoords);
                map.setView(userCoords, 14);
              },
              () => {
                // If can't get location, center on the first hotspot
                if (hotspots.length > 0) {
                  map.setView(hotspots[0].coordinates, 12);
                }
              }
            );
          }
        });
        
        return container;
      }
    });
    
    // Add the control to the map
    new RecenterControl().addTo(map);
  };
  
  // Add legend to explain different marker types
  const addMarkerLegend = (map) => {
    const LegendControl = window.L.Control.extend({
      options: {
        position: 'bottomleft'
      },
      
      onAdd: function() {
        const container = window.L.DomUtil.create('div', 'info legend');
        
        container.style.backgroundColor = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '4px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        container.style.maxWidth = '200px';
        
        container.innerHTML = `
          <div style="margin-bottom: 5px; font-weight: bold;">Map Legend</div>
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="background-color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.2); margin-right: 5px;">
              <i class="fas fa-hands-helping" style="color: #33A1FF; font-size: 12px;"></i>
            </div>
            <span>Volunteer</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="background-color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.2); margin-right: 5px;">
              <i class="fas fa-gift" style="color: #FF5733; font-size: 12px;"></i>
            </div>
            <span>Donor</span>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="background-color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.2); margin-right: 5px;">
              <i class="fas fa-user" style="color: #33FF57; font-size: 12px;"></i>
            </div>
            <span>User</span>
          </div>
        `;
        
        return container;
      }
    });
    
    new LegendControl().addTo(map);
  };

  // Function to generate consistent colors for users
  const getRandomColor = (userId) => {
    // Define specific colors for each role
    const roleColors = {
      volunteer: "#33A1FF", // Blue
      donor: "#FF5733",     // Orange/Red
      user: "#33FF57"       // Green
    };
    
    // Try to find the user
    const userInfo = connectedUsers.find(u => u.userId === userId);
    if (userInfo && userInfo.role && roleColors[userInfo.role]) {
      return roleColors[userInfo.role];
    }
    
    // If role is unknown or not matched, generate a deterministic color based on userId
    const hash = userId.split('').reduce((acc, char) => 
      acc + char.charCodeAt(0), 0);
    
    const colors = [
      "#FF5733", "#33A1FF", "#33FF57", "#F033FF", "#FFBD33", 
      "#3371FF", "#FF3355", "#33FFC1", "#C133FF", "#FF8333"
    ];
    
    return colors[hash % colors.length];
  };
  
  // Function to update a user's location on the map with better markers
  const updateUserLocation = (userId, coordinates, userName, role) => {
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
      
      // Get the user's color based on role
      const roleColors = {
        volunteer: "#33A1FF", // Blue
        donor: "#FF5733",     // Orange/Red
        user: "#33FF57"       // Green
      };
      
      const userColor = roleColors[role] || getRandomColor(userId);
      
      // Create or update the user's marker with better icons
      if (!markersRef.current[userId]) {
        // Choose icon based on role
        let iconHtml;
        if (role === 'volunteer') {
          // Volunteer icon (hands helping)
          iconHtml = `<div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${userColor};">
            <i class="fas fa-hands-helping" style="color: ${userColor}; font-size: 20px;"></i>
          </div>`;
        } else if (role === 'donor') {
          // Donor icon (gift)
          iconHtml = `<div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${userColor};">
            <i class="fas fa-gift" style="color: ${userColor}; font-size: 20px;"></i>
          </div>`;
        } else {
          // Default user icon
          iconHtml = `<div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${userColor};">
            <i class="fas fa-user" style="color: ${userColor}; font-size: 20px;"></i>
          </div>`;
        }
        
        // Create custom icon
        const userIcon = window.L.divIcon({
          className: 'user-marker',
          html: iconHtml,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
        
        // Create new marker
        markersRef.current[userId] = window.L.marker(coordinates, {icon: userIcon})
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="p-2">
              <div class="font-bold">${userName || userId}</div>
              <div class="text-sm capitalize">${role || 'User'}</div>
              ${userId === user?._id ? '<div class="text-xs italic mt-1">(You)</div>' : ''}
            </div>
          `);
        
        // Make the marker pulse if it's the current user
        if (userId === user?._id) {
          const markerElement = markersRef.current[userId].getElement();
          if (markerElement) {
            markerElement.style.animation = "pulse 1.5s infinite";
          }
        }
        
        // Create new route line for user's own path
        routeLinesRef.current[userId] = window.L.polyline([coordinates], {
          color: userColor,
          weight: 3,
          opacity: 0.7
        }).addTo(mapRef.current);
      } else {
        // Update existing marker position
        markersRef.current[userId].setLatLng(coordinates);
        
        // Update the popup content in case role changed
        markersRef.current[userId].getPopup().setContent(`
          <div class="p-2">
            <div class="font-bold">${userName || userId}</div>
            <div class="text-sm capitalize">${role || 'User'}</div>
            ${userId === user?._id ? '<div class="text-xs italic mt-1">(You)</div>' : ''}
          </div>
        `);
        
        // Update icon if role has changed
        const existingIcon = markersRef.current[userId].getIcon();
        const iconHtml = existingIcon.options.html;
        
        let newIconHtml;
        if (role === 'volunteer') {
          newIconHtml = `<div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${userColor};">
            <i class="fas fa-hands-helping" style="color: ${userColor}; font-size: 20px;"></i>
          </div>`;
        } else if (role === 'donor') {
          newIconHtml = `<div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${userColor};">
            <i class="fas fa-gift" style="color: ${userColor}; font-size: 20px;"></i>
          </div>`;
        } else {
          newIconHtml = `<div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${userColor};">
            <i class="fas fa-user" style="color: ${userColor}; font-size: 20px;"></i>
          </div>`;
        }
        
        // Only update if the icon has changed
        if (iconHtml !== newIconHtml) {
          const newIcon = window.L.divIcon({
            className: 'user-marker',
            html: newIconHtml,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });
          
          markersRef.current[userId].setIcon(newIcon);
        }
        
        // Update existing route line
        routeLinesRef.current[userId].setLatLngs(userLocationsRef.current[userId]);
      }
      
      // If this is the current user, center the map on their location
      if (userId === user?._id && mainUserLocation === null) {
        mapRef.current.setView(coordinates, mapRef.current.getZoom());
      }
    } catch (err) {
      console.error(`Error updating location for ${userId}:`, err);
    }
  };
  
  // Function to calculate route between two users
  const calculateRouteBetweenUsers = (fromUserId, toUserId) => {
    if (!mapRef.current || !window.L.Routing) return;
    
    try {
      const routeKey = `${fromUserId}-${toUserId}`;
      
      // Get user locations
      const fromUser = connectedUsers.find(u => u.userId === fromUserId);
      const toUser = connectedUsers.find(u => u.userId === toUserId);
      
      if (!fromUser?.location || !toUser?.location) return;
      
      const fromCoords = [fromUser.location.ltd, fromUser.location.lng];
      const toCoords = [toUser.location.ltd, toUser.location.lng];
      
      // Remove existing route if any
      if (connectionRoutesRef.current[routeKey]) {
        connectionRoutesRef.current[routeKey].remove();
      }
      
      // Create new route using Leaflet Routing Machine
      const routingControl = window.L.Routing.control({
        waypoints: [
          window.L.latLng(fromCoords[0], fromCoords[1]),
          window.L.latLng(toCoords[0], toCoords[1])
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        show: false, // Don't show the routing control UI
        lineOptions: {
          styles: [
            {color: toUser.color || '#FF0000', opacity: 0.7, weight: 5}
          ],
          addWaypoints: false
        },
        createMarker: function() { return null; } // Don't create markers at waypoints
      });
      
      // Add the route to the map
      routingControl.addTo(mapRef.current);
      
      // Store the routing control
      connectionRoutesRef.current[routeKey] = routingControl;
      
      // Mark this route as calculated with a timestamp
      setRoutesCalculated(prev => ({
        ...prev,
        [routeKey]: Date.now()
      }));
    } catch (err) {
      console.error("Error calculating route between users:", err);
    }
  };
  
  // Add global styles for marker animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Live User Tracking</h2>
        <div className="flex flex-wrap gap-2">
          {connectedUsers.map(user => (
            <div key={user.userId} className="flex items-center bg-white p-2 rounded-lg shadow-sm">
              <div 
                className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"
                style={{
                  backgroundColor: 
                    user.role === 'volunteer' ? '#33A1FF' : 
                    user.role === 'donor' ? '#FF5733' : 
                    '#33FF57'
                }}
              >
                <i className={`fas fa-${
                  user.role === 'volunteer' ? 'hands-helping' : 
                  user.role === 'donor' ? 'gift' : 
                  'user'
                } text-white text-xs`}></i>
              </div>
              <div>
                <div className="font-medium">
                  {user.name || `User ${user.userId.slice(-4)}`}
                  {user.userId === user?._id ? ' (You)' : ''}
                </div>
                <div className="text-xs text-gray-500 capitalize">{user.role || 'User'}</div>
              </div>
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
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md z-10 text-sm">
          <p className="font-medium mb-1">Click recenter button <i className="fas fa-location-crosshairs text-blue-500"></i> to focus on your location</p>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;