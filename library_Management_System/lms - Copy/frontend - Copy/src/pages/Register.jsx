import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: 'MEMBER',
        firstName: '', lastName: '', email: '', phone: '',
        gender: 'Male', maritalStatus: 'Single',
        street: '', city: '', state: '', pincode: '',
        govtIdType: 'Aadhaar Card', govtIdNumber: '',
        academicInfo: [], workExperience: [],
        idProofFile: null
    });

    const [newAcademic, setNewAcademic] = useState({ institution: '', degree: '', year: '', grade: '' });
    const [newWork, setNewWork] = useState({ company: '', designation: '', ctc: '', start: '', end: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        setFormData({ ...formData, idProofFile: e.target.files[0] });
    };

    const addAcademic = () => {
        if (!newAcademic.institution || !newAcademic.degree) return;
        setFormData({ ...formData, academicInfo: [...formData.academicInfo, newAcademic] });
        setNewAcademic({ institution: '', degree: '', year: '', grade: '' });
    };

    const addWork = () => {
        if (!newWork.company || !newWork.designation) return;
        setFormData({ ...formData, workExperience: [...formData.workExperience, newWork] });
        setNewWork({ company: '', designation: '', ctc: '', start: '', end: '' });
    };

    const validateStep = (currentStep) => {
        if (currentStep === 1) { // Personal
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                addToast("Please fill in all Personal details.", "error");
                return false;
            }
        }
        if (currentStep === 2) { // Address
            if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
                addToast("Please complete your Address details.", "error");
                return false;
            }
        }
        // Steps 3 (Education) and 4 (Work) are optional or have internal validation for adding records
        if (currentStep === 5) { // ID Proof
            if (!formData.govtIdNumber) {
                addToast("Please provide ID Number.", "error");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.idProofFile) {
            addToast("Please upload an ID Proof document", "error");
            return;
        }

        const userJson = JSON.stringify({
            role: formData.role,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            maritalStatus: formData.maritalStatus,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            govtIdType: formData.govtIdType,
            govtIdNumber: formData.govtIdNumber,
            academicInfoJson: JSON.stringify(formData.academicInfo),
            workExperienceJson: JSON.stringify(formData.workExperience)
        });

        const data = new FormData();
        data.append("user", userJson);
        data.append("file", formData.idProofFile);

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                body: data
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Registration failed');
            }
            addToast('Registration successful! Please wait for Admin approval.', 'success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) { addToast(err.message, 'error'); }
    };

    const steps = [
        { id: 1, title: 'Personal', icon: '👤' },
        { id: 2, title: 'Address', icon: '🏠' },
        { id: 3, title: 'Education', icon: '🎓' },
        { id: 4, title: 'Work', icon: '💼' },
        { id: 5, title: 'ID Proof', icon: '🆔' },
    ];

    const roundedInputStyle = {
        padding: '0.8rem 1.2rem',
        borderRadius: '50px',
        border: '1px solid #e2e8f0',
        outline: 'none',
        transition: 'all 0.3s ease',
        background: '#f8fafc',
        width: '100%'
    };

    const labelStyle = {
        fontWeight: '600',
        marginBottom: '0.5rem',
        display: 'block',
        color: '#475569'
    };

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
            <div className="card" style={{
                width: '100%', maxWidth: '900px',
                height: '85vh',
                maxHeight: '900px',
                display: 'flex', flexDirection: 'column',
                padding: '0',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                background: 'white'
            }}>
                {/* Header */}
                <div style={{ padding: '2rem 2rem 0 2rem', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontWeight: '800' }}>Join Our Library</h2>

                    {/* Stepper UI */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '3px', background: '#e2e8f0', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', top: '20px', left: '0', height: '3px', background: 'var(--primary-color)', width: `${(step - 1) / (steps.length - 1) * 100}%`, transition: 'width 0.3s ease', zIndex: 0 }}></div>

                        {steps.map((s) => (
                            <div key={s.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: step >= s.id ? 'var(--primary-color)' : 'white',
                                    border: `2px solid ${step >= s.id ? 'var(--primary-color)' : '#e2e8f0'}`,
                                    color: step >= s.id ? 'white' : '#94a3b8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '1.1rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: step >= s.id ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
                                }}>
                                    {step > s.id ? '✓' : s.id}
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: step >= s.id ? 'var(--primary-color)' : '#94a3b8' }}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 3rem 2rem 3rem' }}>
                    <form onSubmit={handleSubmit}>

                        {/* Step 1: Personal Details */}
                        {step === 1 && (
                            <div className="step-content" style={{ animation: 'fadeIn 0.4s ease', maxWidth: '600px', margin: '0 auto' }}>
                                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Personal Details</h3>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>I am a:</label>
                                    <select name="role" value={formData.role} onChange={handleChange} style={roundedInputStyle}>
                                        <option value="MEMBER">Student Member</option>
                                        <option value="LIBRARIAN">Librarian</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>First Name*</label>
                                        <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" style={roundedInputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Last Name*</label>
                                        <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" style={roundedInputStyle} />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>Email Address*</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@university.edu" style={roundedInputStyle} />
                                </div>

                                {/* Password field removed as per new flow */}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Phone*</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" style={roundedInputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} style={roundedInputStyle}>
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Marital Status</label>
                                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={roundedInputStyle}>
                                            <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                                    <button type="button" onClick={nextStep} className="btn btn-primary">Next Step →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address Details */}
                        {step === 2 && (
                            <div className="step-content" style={{ animation: 'fadeIn 0.4s ease', maxWidth: '600px', margin: '0 auto' }}>
                                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Address Details</h3>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>Street Address*</label>
                                    <input name="street" value={formData.street} onChange={handleChange} required placeholder="123 Campus Avenue" style={roundedInputStyle} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group"><label style={labelStyle}>City*</label><input name="city" value={formData.city} onChange={handleChange} required style={roundedInputStyle} /></div>
                                    <div className="form-group"><label style={labelStyle}>State*</label><input name="state" value={formData.state} onChange={handleChange} required style={roundedInputStyle} /></div>
                                    <div className="form-group"><label style={labelStyle}>Zip Code*</label><input name="pincode" value={formData.pincode} onChange={handleChange} required style={roundedInputStyle} /></div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button type="button" onClick={prevStep} className="btn" style={{ color: 'var(--text-muted)' }}>← Back</button>
                                    <button type="button" onClick={nextStep} className="btn btn-primary">Next Step →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Education */}
                        {step === 3 && (
                            <div className="step-content" style={{ animation: 'fadeIn 0.4s ease', maxWidth: '600px', margin: '0 auto' }}>
                                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Academic Details</h3>

                                {/* Existing Records */}
                                {formData.academicInfo.length > 0 && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        {formData.academicInfo.map((i, idx) => (
                                            <div key={idx} style={{
                                                background: '#f8fafc', padding: '1rem', borderRadius: '1rem',
                                                marginBottom: '0.8rem', border: '1px solid #e2e8f0',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{i.degree}</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{i.institution}, {i.year}</div>
                                                </div>
                                                <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', background: '#e0e7ff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                                                    {i.grade}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Record Form */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Institution</label>
                                        <input value={newAcademic.institution} onChange={(e) => setNewAcademic({ ...newAcademic, institution: e.target.value })} placeholder="University Name" style={roundedInputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Degree</label>
                                        <input value={newAcademic.degree} onChange={(e) => setNewAcademic({ ...newAcademic, degree: e.target.value })} placeholder="B.Tech, MBA..." style={roundedInputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Year</label>
                                        <input value={newAcademic.year} onChange={(e) => setNewAcademic({ ...newAcademic, year: e.target.value })} placeholder="2024" style={roundedInputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Grade/CGPA</label>
                                        <input value={newAcademic.grade} onChange={(e) => setNewAcademic({ ...newAcademic, grade: e.target.value })} placeholder="9.5" style={roundedInputStyle} />
                                    </div>
                                </div>

                                <button type="button" onClick={addAcademic} className="btn btn-secondary" style={{ width: '100%', borderRadius: '50px', padding: '0.8rem', marginBottom: '1rem' }}>+ Add Another Record</button>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button type="button" onClick={prevStep} className="btn" style={{ color: 'var(--text-muted)' }}>← Back</button>
                                    <button type="button" onClick={nextStep} className="btn btn-primary">Next Step →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Work Experience */}
                        {step === 4 && (
                            <div className="step-content" style={{ animation: 'fadeIn 0.4s ease', maxWidth: '600px', margin: '0 auto' }}>
                                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Professional Experience</h3>

                                {/* Existing Records */}
                                {formData.workExperience.length > 0 && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        {formData.workExperience.map((i, idx) => (
                                            <div key={idx} style={{
                                                background: '#f8fafc', padding: '1rem', borderRadius: '1rem',
                                                marginBottom: '0.8rem', border: '1px solid #e2e8f0',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{i.designation}</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{i.company}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Work Form */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Company</label>
                                        <input value={newWork.company} onChange={(e) => setNewWork({ ...newWork, company: e.target.value })} placeholder="Company Name" style={roundedInputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Designation</label>
                                        <input value={newWork.designation} onChange={(e) => setNewWork({ ...newWork, designation: e.target.value })} placeholder="Software Engineer" style={roundedInputStyle} />
                                    </div>
                                </div>

                                <button type="button" onClick={addWork} className="btn btn-secondary" style={{ width: '100%', borderRadius: '50px', padding: '0.8rem', marginBottom: '1rem' }}>+ Add Another Experience</button>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button type="button" onClick={prevStep} className="btn" style={{ color: 'var(--text-muted)' }}>← Back</button>
                                    <button type="button" onClick={nextStep} className="btn btn-primary">Next Step →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 5: ID Proof & Submit */}
                        {step === 5 && (
                            <div className="step-content" style={{ animation: 'fadeIn 0.4s ease', maxWidth: '600px', margin: '0 auto' }}>
                                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Government Identity</h3>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>Select ID Document*</label>
                                    <select name="govtIdType" value={formData.govtIdType} onChange={handleChange} style={roundedInputStyle}>
                                        <option>Aadhaar Card</option>
                                        <option>PAN Card</option>
                                        <option>Voter ID Card</option>
                                        <option>Driving License</option>
                                        <option>Passport</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>ID Number*</label>
                                    <input name="govtIdNumber" value={formData.govtIdNumber} onChange={handleChange} required placeholder="XXXX XXXX XXXX" style={roundedInputStyle} />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>Upload ID Proof*</label>
                                    <input type="file" onChange={handleFileChange} required accept="image/*,.pdf" style={{
                                        padding: '0.8rem',
                                        width: '100%',
                                        borderRadius: '50px',
                                        border: '1px solid #e2e8f0',
                                        background: '#f8fafc'
                                    }} />
                                    <small style={{ color: 'var(--text-muted)' }}>Upload Image or PDF</small>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button type="button" onClick={prevStep} className="btn" style={{ color: 'var(--text-muted)' }}>← Back</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, marginLeft: '1rem', fontWeight: 'bold', borderRadius: '50px' }}>Complete Registration 🚀</button>
                                </div>
                            </div>
                        )}

                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Already have an account? <Link to="/login" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
