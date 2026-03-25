import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    examName: '',
    minAge: '',
    maxAge: '',
    qualificationRequired: '',
    description: '',
    state: 'All India',
    syllabus: '',
    roadmap: '',
    strategies: '',
    estimatedPrepHours: ''
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/exams?pageSize=50');
      const data = await res.json();
      setExams(data.exams || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getToken = () => {
    const userStr = localStorage.getItem('jobmitra_user');
    return userStr ? JSON.parse(userStr).token : '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/exams/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        setExams(exams.filter(e => e._id !== id));
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting exam");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma separated string to array or multiline
      const payload = {
        ...formData,
        minAge: Number(formData.minAge),
        maxAge: Number(formData.maxAge),
        estimatedPrepHours: Number(formData.estimatedPrepHours),
        qualificationRequired: formData.qualificationRequired.split(',').map(q => q.trim()),
        syllabus: formData.syllabus ? formData.syllabus.split(',').map(s => s.trim()) : [],
        roadmap: formData.roadmap ? formData.roadmap.split('\n').map(s => s.trim()).filter(Boolean) : [],
        strategies: formData.strategies ? formData.strategies.split('\n').map(s => s.trim()).filter(Boolean) : []
      };

      const res = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowAddForm(false);
        setFormData({ examName: '', minAge: '', maxAge: '', qualificationRequired: '', description: '', state: 'All India', syllabus: '', roadmap: '', strategies: '', estimatedPrepHours: '' });
        fetchExams();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to create exam");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating exam");
    }
  };

  return (
    <div className="container padding-y admin-dashboard">
      <div className="admin-header text-center">
        <div className="icon-wrapper-large bg-blue-light" style={{ margin: '0 auto', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--light-blue)' }}>
          <Shield size={36} className="text-blue" color="var(--primary-blue)" />
        </div>
        <h1 className="section-title mb-2 mt-4">Admin Command Center</h1>
        <p className="section-desc">Manage the comprehensive database of government exams.</p>
      </div>

      <div className="admin-actions mb-4" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <Button variant={showAddForm ? "outline" : "primary"} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel Creation' : <><Plus size={18} style={{ marginRight: '8px' }} /> Add New Exam</>}
        </Button>
      </div>

      {showAddForm && (
        <div className="card add-exam-form mb-4" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 className="mb-4" style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Create New Exam</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField label="Exam Name" id="examName" value={formData.examName} onChange={handleChange} required />
              <InputField label="State Jurisdiction" id="state" value={formData.state} onChange={handleChange} required />
              <InputField label="Minimum Age" id="minAge" type="number" value={formData.minAge} onChange={handleChange} required />
              <InputField label="Maximum Age" id="maxAge" type="number" value={formData.maxAge} onChange={handleChange} required />
              <InputField label="Required Qualifications (comma separated)" id="qualificationRequired" value={formData.qualificationRequired} onChange={handleChange} placeholder="e.g. Graduate (Any Stream), 12th Pass" required />
              <InputField label="Estimated Prep Hours" id="estimatedPrepHours" type="number" value={formData.estimatedPrepHours} onChange={handleChange} placeholder="e.g. 500" required />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <InputField label="Syllabus Topics (comma separated)" id="syllabus" value={formData.syllabus} onChange={handleChange} placeholder="e.g. Quant, Reasoning, English" required />
            </div>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Roadmap (One step per line)</label>
                <textarea 
                  id="roadmap" 
                  value={formData.roadmap} 
                  onChange={handleChange} 
                  className="modern-input" 
                  rows="4" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Strategies (One strategy per line)</label>
                <textarea 
                  id="strategies" 
                  value={formData.strategies} 
                  onChange={handleChange} 
                  className="modern-input" 
                  rows="4" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
              <textarea 
                id="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="modern-input" 
                rows="4" 
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                required 
              />
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <Button type="submit" variant="primary">Publish Exam</Button>
            </div>
          </form>
        </div>
      )}

      <div className="card admin-table-container">
        <h3 style={{ marginBottom: '1.5rem' }}>Active Exam Database ({exams.length})</h3>
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem' }}>Exam Name</th>
                <th style={{ padding: '1rem' }}>State</th>
                <th style={{ padding: '1rem' }}>Age Limits</th>
                <th style={{ padding: '1rem' }}>Qualifications</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-blue)' }}>{exam.examName}</td>
                  <td style={{ padding: '1rem' }}>{exam.state}</td>
                  <td style={{ padding: '1rem' }}>{exam.minAge} - {exam.maxAge}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{exam.qualificationRequired?.join(', ')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(exam._id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                      title="Delete Exam"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
