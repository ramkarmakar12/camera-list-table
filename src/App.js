import React , {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CameraTable from './components/CameraTable';
import SearchBar from './components/SearchBar';
import { CiLocationOn } from "react-icons/ci";
import { fetchCameras, updateCameraStatus } from './services/api';


const App = () => {
  const [cameraData, setCameraData] = useState([]);
  const [filterData, setFilterData] = useState(cameraData); // Data to display
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Store search term


  // Unique locations for the dropdown
  const uniqueLocations = [...new Set(cameraData.map((camera) => camera.location))];

 // Apply filters whenever `selectedLocation`, `selectedStatus`, or `cameraData` changes
 useEffect(() => {
  console.log("Applying Filters");
  console.log("Location Filter:", selectedLocation);
  console.log("Status Filter:", selectedStatus);
  console.log("Camera Data:", cameraData);
  let updatedData = [...cameraData]; // Copy the full camera data

   // Filter by camera name
   if (searchTerm) {
    updatedData = updatedData.filter((camera) =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (selectedLocation) {
    updatedData = updatedData.filter((camera) => camera.location === selectedLocation);
  }

  if (selectedStatus) {
    updatedData = updatedData.filter((camera) => camera.status === selectedStatus);
  }
  // console.log("Filtered Data:", updatedData); // Check filtered results
  setFilterData(updatedData); // Update the filtered data
  
}, [searchTerm,selectedLocation, selectedStatus, cameraData]);
  
  useEffect(() => {
    const loadCameras = async () => {
      const { data } = await fetchCameras();
      console.log("Fetched Cameras:", data); // Add this line
      setCameraData(data);
      setFilterData(data); // Initialize filteredData with all cameras
    };
    loadCameras();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-12">
      <div className="text-center">
          <img
            src={require('./images/Wobot_ai_Logo (1).jpg')}
            alt="Logo"
            className="img-fluid mb-4"
            style={{ width: '10%' }} // Ensures the image takes up the full width
          />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          {/* Left-aligned heading */}
          <div>
            <h1 className="text-2xl font-bold">Cameras</h1>
            <p className="text-gray-500">Manage your cameras here.</p>
          </div>

          {/* Right-aligned SearchBar */}
           {/* Search Bar */}
           <input
            type="text"
            className="form-control"
            placeholder="Search by camera name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px', marginLeft: '20px' }}
          />
        </div>
      </header>
    
      <div className="d-flex align-items-center mb-4" style={{ gap: '20px' }}>
  {/* Location Dropdown */}
  <select
    className="form-select"
    onChange={(e) => setSelectedLocation(e.target.value)}
          value={selectedLocation}
    style={{
      width: '220px', // Set fixed width
      padding: '5px', // Increased padding for better appearance
      borderRadius: '8px', // Smooth rounded corners
      
    }}
  >
     <option value="">Location</option>
          {uniqueLocations.map((location, index) => (
            <option key={index} value={location}>
              <CiLocationOn className="me-2" />
              {location}
            </option>
          ))}
    </select>

  {/* Status Dropdown */}
  <select
    className="form-select"
    onChange={(e) => setSelectedStatus(e.target.value)}
    value={selectedStatus}
    style={{
      width: '220px', // Set fixed width
      padding: '5px', // Increased padding for better appearance
      borderRadius: '8px', // Smooth rounded corners
    }}
  >
    <option>Status</option>
    <option>Active</option>
    <option>Inactive</option>
  </select>
</div>


      <CameraTable filterData={filterData}/>
    </div>
  );
};

export default App;
