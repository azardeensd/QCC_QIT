import React, { useState, useEffect, useCallback } from 'react';
import styles from './Dashboard.module.css';
import { supabase } from '../../services/auth';

const Dashboard = () => {
  const [originalData, setOriginalData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [plantFilter, setPlantFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const [stats, setStats] = useState([
    { label: 'Total Attendees', value: '0', color: '#e2820d' },
    { label: 'Employees', value: '0', color: '#17a67e' },
    { label: 'Plants Involved', value: '0', color: '#054bef' },
  ]);

  const calculateStats = useCallback((data) => {
    const total = data.length;
    const employees = data.filter(item => item.type === 'Employee').length;
    const uniquePlants = [...new Set(data.map(item => item.company))].length;

    setStats([
      { label: 'Total Attendees', value: total.toString(), color: '#e2820d' },
      { label: 'Employees', value: employees.toString(), color: '#17a67e' },
      { label: 'Unique Plants', value: uniquePlants.toString(), color: '#c90bd0' },
    ]);
  }, []);

  const fetchAttendance = useCallback(async () => {
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
  }, [calculateStats]);

  const applyFilters = useCallback(() => {
    let updatedList = [...originalData];

    if (plantFilter !== 'All') {
      updatedList = updatedList.filter(item => item.company === plantFilter);
    }

    if (typeFilter !== 'All') {
      updatedList = updatedList.filter(item => item.type === typeFilter);
    }

    if (dateFilter) {
      updatedList = updatedList.filter(item => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        return itemDate === dateFilter;
      });
    }

    setFilteredData(updatedList);
  }, [plantFilter, typeFilter, dateFilter, originalData]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // CSV Download Logic
  const downloadReport = () => {
    if (filteredData.length === 0) return alert("No data to download");

    const headers = ["Date", "Name", "ID/Mobile", "Company", "Location", "Type"];
    const csvRows = filteredData.map(row => [
      new Date(row.created_at).toLocaleDateString(),
      `"${row.name}"`,
      row.gen_id || row.mobile || 'N/A',
      `"${row.company}"`,
      `"${row.location}"`,
      row.type
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

        <div className={styles.buttonGroup} style={{ display: 'flex', gap: '10px' }}>
            <button className={styles.resetBtn} onClick={() => {
              setPlantFilter('All');
              setTypeFilter('All');
              setDateFilter('');
            }}>Reset</button>
            
            <button 
              onClick={downloadReport}
              style={{ backgroundColor: '#2b19d3', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            >
              Download Report
            </button>
        </div>
      </section>

      <section className={styles.tableCard}>
        <h2 className={styles.tableTitle}>
          Filtered Results ({filteredData.length})
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th> {/* Moved to front */}
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
                  <td>{new Date(row.created_at).toLocaleDateString()}</td> {/* Date column data */}
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
