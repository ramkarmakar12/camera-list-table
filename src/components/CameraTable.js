import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
// import { filterData } from '../App';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import Button from '@mui/material/Button'
import { fetchCameras, updateCameraStatus } from '../services/api';

const CameraTable = ({ filterData }) => {
  const [cameraData, setCameraData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [statusFilter, setStatusFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  // const [loading, setLoading] = useState(false); // To indicate loading during updates
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [selectedCameras, setSelectedCameras] = useState([]);

  console.log('filterData in CameraTable:', filterData); // Check if data is received
  // Toggle checkbox selection
  const handleCheckboxChange = (id) => {
    if (selectedCameras.includes(id)) {
      setSelectedCameras(selectedCameras.filter((cameraId) => cameraId !== id));
    } else {
      setSelectedCameras([...selectedCameras, id]);
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = cameraData.map((camera) => camera.id);
      setSelectedCameras(allIds);
    } else {
      setSelectedCameras([]);
    }
  };
  useEffect(() => {
    const loadCameras = async () => {
      const { data } = await fetchCameras();
      setCameraData(data);
      // setFilteredData(data); // Initially set filtered data to all cameras
    };
    loadCameras();
  }, []);

  /*
  // Update filteredData when search or filter changes
  useEffect(() => {
    let updatedData = cameraData;

    if (searchTerm) {
      updatedData = updatedData.filter((camera) =>
        camera.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      updatedData = updatedData.filter(
        (camera) => camera.status === statusFilter
      );
    }

    setFilteredData(updatedData);
  }, [searchTerm, statusFilter, cameraData]);
  */

  // Filter data based on the filteredData prop or full cameraData
  const dataToDisplay =
    Array.isArray(filterData) && filterData.length > 0
      ? filterData
      : cameraData;

  // console.log("Filtered CameraTable Data:",filterData); // Check the structure of filteredData

  // Toggle status function
  // Optimistically update camera status in local state
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  
    // Optimistically update state with new status and temporary flag
    setCameraData((prevData) =>
      prevData.map((camera) =>
        camera.id === id ? { ...camera, status: newStatus, isUpdating: true } : camera
      )
    );
  
    try {
      // Call API to update the status
      await updateCameraStatus(id, newStatus);
  
      // Update state after successful update (remove temporary flag)
      setCameraData((prevData) =>
        prevData.map((camera) =>
          camera.id === id ? { ...camera, isUpdating: false } : camera
        )
      );
    } catch (error) {
      console.error('Error updating camera status:', error);
      alert('Failed to update camera status. Please try again.');
  
      // Revert the status change and remove temporary flag
      setCameraData((prevData) =>
        prevData.map((camera) =>
          camera.id === id ? { ...camera, status: currentStatus, isUpdating: false } : camera
        )
      );
    }
  };

  useEffect(() => {
    setPaginatedData(
      dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [dataToDisplay, currentPage, itemsPerPage]);
  

  const handleDelete = (id) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this camera?")) {
      // Update `cameraData` to remove the item
      const updatedCameraData = cameraData.filter((camera) => camera.id !== id);
      setCameraData(updatedCameraData);
  
      // Update `filteredData` if filtering is applied
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        const updatedFilteredData = filteredData.filter((camera) => camera.id !== id);
        setFilteredData(updatedFilteredData);
      }
  
      // Handle pagination
      const totalItems = (filteredData.length > 0 ? filteredData : updatedCameraData).length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      } else if (currentPage === totalPages && totalItems % itemsPerPage === 0) {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
      }
  
      console.log("Camera deleted. Updated data:", updatedCameraData);
    }
  };
  
  

  /*
  const paginatedData = Array.isArray(cameraData)
    ? cameraData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
    */

  const paginatedData = Array.isArray(dataToDisplay)
    ? dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="text-left">
            {/* Checkbox Header */}
            <th>
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  selectedCameras.length === dataToDisplay.length &&
                  dataToDisplay.length > 0
                }
              />
            </th>
            <th>Name</th>
            <th>Health</th>
            <th>Location</th>
            <th>Recorder</th>
            <th>Tasks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((camera) => (
            <tr key={camera.id} className="border-b">
              {/* Checkbox for each camera */}
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(camera.id)}
                  checked={selectedCameras.includes(camera.id)}
                />
              </td>
              <td>
                {' '}
                <span
                  style={{
                    height: '10px',
                    width: '10px',
                    backgroundColor:
                      camera.status === 'Active' ? 'green' : 'red',
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: '8px',
                  }}
                ></span>
                {camera.name || 'N/A'}
              </td>
              <td>
                {' '}
                {camera.health
  ? Object.entries(camera.health)
      .filter(([key]) => key !== 'id' && key !== '_id') // Exclude id and _id
      .map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
      ))
  : 'No health data available'}

              </td>
              <td>{camera.location || 'N/A'}</td>
              <td>{camera.recorder || 'N/A'}</td>
              <td>{camera.tasks || 'N/A'} Tasks</td>
              <td>
              <Button variant="text"
                color={camera.status === 'Active' ? 'success' : 'error'}
        onClick={() => handleStatusToggle(camera.id, camera.status)}
        className={`px-2 py-1 rounded `}
      >
        {camera.status}
      </Button>
              </td>
              <td>
                <Button
                  onClick={() => handleDelete(camera.id)}
                  // className="text-danger text-red-500"
                  variant ="container"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        {/* Items Per Page Dropdown */}
        <div className="flex items-center mr-4">
          <label className="mr-2">Items per page:</label>
          <select
            className="border p-1"
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value, 10)); // Set items per page
              setCurrentPage(1); // Reset to first page
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center">
          <button
            className="border p-2 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <IoMdArrowDropleft />
          </button>
          <span className="mx-2">{currentPage}</span>
          <button
            className="border p-2 rounded"
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(dataToDisplay.length / itemsPerPage))
              )
            }
          >
            <IoMdArrowDropright />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraTable;