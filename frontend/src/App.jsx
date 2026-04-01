import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SeatMatrix from './pages/SeatMatrix';
import Institutions from './pages/masters/Institutions';
import Campuses from './pages/masters/Campuses';
import Departments from './pages/masters/Departments';
import Programs from './pages/masters/Programs';
import AcademicYears from './pages/masters/AcademicYears';
import Applicants from './pages/applicants/Applicants';
import Admissions from './pages/admissions/Admissions';

const P = ({ children, roles }) => <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<P><Dashboard /></P>} />
          <Route path="/seat-matrix" element={<P><SeatMatrix /></P>} />
          <Route path="/masters/institutions" element={<P roles={['admin']}><Institutions /></P>} />
          <Route path="/masters/campuses" element={<P roles={['admin']}><Campuses /></P>} />
          <Route path="/masters/departments" element={<P roles={['admin']}><Departments /></P>} />
          <Route path="/masters/programs" element={<P roles={['admin']}><Programs /></P>} />
          <Route path="/masters/academic-years" element={<P roles={['admin']}><AcademicYears /></P>} />
          <Route path="/applicants" element={<P roles={['admin', 'admission_officer']}><Applicants /></P>} />
          <Route path="/admissions" element={<P><Admissions /></P>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
