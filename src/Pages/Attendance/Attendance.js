import React, { useState, useEffect } from 'react';
import styles from './Attendance.module.css';
import { saveAttendance, getCompanies, getLocation, updateLocation } from '../../services/api';

const AdminPortal = ({ onLocationUpdate }) => {
  const [newLoc, setNewLoc] = useState('');
  const [status, setStatus] = useState('');

  const handleUpdate = async () => {
    if (!newLoc) return;
    try {
      await updateLocation(newLoc);
      setStatus('Location updated!');
      onLocationUpdate(newLoc);
      setNewLoc('');
    } catch (err) {
      setStatus('Error updating.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h3>Admin: Set Training Location</h3>
      <div className={styles.inputGroup}>
        <input 
          type="text" 
          value={newLoc} 
          onChange={(e) => setNewLoc(e.target.value)} 
          placeholder="Enter new address..."
        />
      </div>
      <button onClick={handleUpdate} className={styles.submitBtn}>Update Location</button>
      {status && <p className={styles.feedback}>{status}</p>}
    </div>
  );
};

const Attendance = () => {
  const [userType, setUserType] = useState('Employee');
  const [companies, setCompanies] = useState([]);
  const [locationName, setLocationName] = useState('Loading...');
  const [formData, setFormData] = useState({
    genId: '',
    name: '',
    company: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [compData, loc] = await Promise.all([
          getCompanies(),
          getLocation()
        ]);
        setCompanies(compData);
        setLocationName(loc);
      } catch (err) {
        console.error("Initialization error:", err);
        setLocationName("Location not set");
      }
    };
    fetchInitialData();
  }, []);

  // Reset relevant fields when switching user types
  useEffect(() => {
    setFormData({ genId: '', name: '', company: '', mobile: '' });
  }, [userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'genId') {
      const val = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, [name]: val });
    } 
    else if (name === 'mobile') {
      const val = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: val });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const submissionData = {
      type: userType,
      name: formData.name,
      company: formData.company,
      location: locationName,
      ...(userType === 'Employee' ? { gen_id: formData.genId } : { mobile: formData.mobile })
    };

    try {
      await saveAttendance(submissionData);
      setMessage('Attendance recorded successfully!');
      setFormData({ genId: '', name: '', company: '', mobile: '' });
    } catch (error) {
      console.error("Error:", error);
      setMessage('Error saving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.formTitle}>Event Registration</h2>
        <div className={styles.locationSubtitle}>📍 {locationName}</div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>User Type</label>
            <select 
              value={userType} 
              onChange={(e) => setUserType(e.target.value)}
              className={styles.select}
            >
              <option value="Employee">Rane Employee</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <hr className={styles.divider} />

          {userType === 'Employee' ? (
            /* EMPLOYEE FORM ORDER: 1. Company, 2. Gen ID, 3. Name */
            <>
              <div className={styles.inputGroup}>
                <label>Company Name</label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select Company</option>
                  {companies.map((c, index) => (
                    <option key={index} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Gen ID</label>
                <input 
                  type="tel" 
                  name="genId" 
                  value={formData.genId} 
                  onChange={handleChange} 
                  required 
                  placeholder="6-digit Numeric ID"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your name"
                />
              </div>
            </>
          ) : (
            /* GUEST FORM ORDER: 1. Company, 2. Name, 3. Mobile No */
            <>
              <div className={styles.inputGroup}>
                <label>Company Name</label>
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleChange} 
                  required 
                  placeholder="Type your company name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Mobile No</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleChange} 
                  required 
                  placeholder="10-digit number"
                />
              </div>
            </>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Submit Attendance'}
          </button>

          {message && <p className={styles.feedback}>{message}</p>}
        </form>
      </div>

      <AdminPortal onLocationUpdate={(val) => setLocationName(val)} />
    </div>
  );
};

export default Attendance;
