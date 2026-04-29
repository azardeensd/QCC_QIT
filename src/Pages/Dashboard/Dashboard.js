import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { supabase } from '../../services/auth';

const Dashboard = () => {
  const [originalData, setOriginalData] = useState([]); // Master list
  const [filteredData, setFilteredData] = useState([]); // List shown in table
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [plantFilter, setPlantFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const [stats, setStats] = useState([
    { label: 'Total Attendees', value: '0', color: '#0f172a' },
    { label: 'Employees', value: '0', color: '#065f46' },
    { label: 'Plants Involved', value: '0', color: '#1351e1' },
  ]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Run filter logic whenever a filter state or original data changes
  useEffect(() => {
    applyFilters();
  }, [plantFilter, typeFilter, dateFilter, originalData]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setOriginalData(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let updatedList = [...originalData];

    // Filter by Plant
    if (plantFilter !== 'All') {
      updatedList = updatedList.filter(item => item.company === plantFilter);
    }

    // Filter by Type
    if (typeFilter !== 'All') {
      updatedList = updatedList.filter(item => item.type === typeFilter);
    }

    // Filter by Date (Comparing YYYY-MM-DD)
    if (dateFilter) {
      updatedList = updatedList.filter(item => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        return itemDate === dateFilter;
      });
    }

    setFilteredData(updatedList);
  };

  const calculateStats = (data) => {
    const total = data.length;
    const employees = data.filter(item => item.type === 'Employee').length;
    const uniquePlants = [...new Set(data.map(item => item.company))].length;

    setStats([
      { label: 'Total Attendees', value: total.toString(), color: '#0f172a' },
      { label: 'Employees', value: employees.toString(), color: '#065f46' },
      { label: 'Guest', value: uniquePlants.toString(), color: '#1351e1' },
    ]);
  };

  // Get unique plants for the dropdown dynamically
  const uniquePlantsList = ['All', ...new Set(originalData.map(item => item.company))];

  if (loading) {
    return <div className={styles.dashboardContainer}>Loading Dashboard...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Attendance Overview</h1>
        <p className={styles.subtitle}>Live Data with Dynamic Filtering</p>
      </header>

      <section className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard} style={{ borderTopColor: stat.color }}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue} style={{ color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </section>

      {/* --- NEW FILTER BAR --- */}
      <section className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label>Plant / Company</label>
          <select value={plantFilter} onChange={(e) => setPlantFilter(e.target.value)}>
            {uniquePlantsList.map((plant, idx) => (
              <option key={idx} value={plant}>{plant}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>User Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Employee">Employee</option>
            <option value="Guest">Guest</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Date</label>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
          />
        </div>

        <button className={styles.resetBtn} onClick={() => {
          setPlantFilter('All');
          setTypeFilter('All');
          setDateFilter('');
        }}>Reset Filters</button>
      </section>

      <section className={styles.tableCard}>
        <h2 className={styles.tableTitle}>
          Filtered Results ({filteredData.length})
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gen ID / Mobile</th>
                <th>Company/Plant</th>
                <th>Location</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.gen_id || row.mobile || 'N/A'}</td>
                  <td>{row.company}</td>
                  <td>{row.location}</td>
                  <td>
                    <span className={`${styles.badge} ${row.type === 'Employee' ? styles.present : styles.late}`}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
