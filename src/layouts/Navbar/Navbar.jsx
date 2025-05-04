import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Token bulunamadı, çıkış yapılamaz!');
      return;
    }

    axios.post('http://localhost:5023/api/user/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      console.log("Çıkış başarılı:", response.data);
      localStorage.removeItem('token');
      navigate("/signin");
    })
    .catch(error => {
      console.error("Çıkış yaparken hata oluştu:", error);
    });   
  };

  return (
    <div className='navbar text-muted'>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="navbar-brand d-flex align-items-center gap-2">
          <img src='/images/logo.svg'/>
          <h5 className='mb-0'>Ağız ve Diş Sağlığı</h5>
        </div>
        <div className="links">
          <a href='/home' className='text-muted'>Ana Sayfa</a>
          <a href="/profile" className='text-muted'>Profil</a>
          <a href="/health-page" className='text-muted'>Ağız ve Diş Sağlığı Takibi</a>
        </div>
        <div className="logout">
          <span  onClick={handleLogout}>Çıkış Yap <i className="bi bi-box-arrow-right"></i></span>
        </div>
      </div>
    </div>
  )
}

export default Navbar