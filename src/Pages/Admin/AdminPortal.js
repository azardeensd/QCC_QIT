import React, { useState } from 'react';
import { updateLocation } from '../../services/api';
import styles from './Attendance.module.css';

const AdminPortal = () => {
  const [loc, setLoc] = useState('');
  const [status, setStatus] = useState('');

  const handleUpdate = async () => {
    try {
      await updateLocation(loc);
      setStatus('Location updated successfully!');
    } catch (err) {
      setStatus('Error updating location.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h3>Set Training Location</h3>
      <input 
        type="text" 
        value={loc} 
        onChange={(e) => setLoc(e.target.value)} 
        placeholder="Enter Address"
        className={styles.inputGroup}
      />
      <button onClick={handleUpdate} className={styles.submitBtn}>Update Location</button>
      <p>{status}</p>
    </div>
  );
};

export default AdminPortal;