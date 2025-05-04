import React, { useEffect, useState } from 'react'
import './Profile.css'
import Navbar from '../../layouts/Navbar/Navbar'
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap'
import axios from 'axios';

function Profile() {
    const [passwordModal, setPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const openPasswordModal = () => setPasswordModal(true);
    const closePasswordModal = () => setPasswordModal(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    useEffect(() => {
        console.log("token: ", localStorage.getItem('token'));
        axios.get('http://localhost:5023/api/UserProfile/getProfile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setProfileData(response.data);
            setEmail(response.data.userEmail || '');
            setFullName(response.data.userFullName || '');
            const birthDateFormatted = new Date(response.data.userBirthDate).toISOString().split('T')[0];
            setBirthDate(birthDateFormatted);
        })
        .catch(error => {
            console.error("Error fetching profile data", error);
            setMessage({ type: 'danger', text: 'Profil verileri alınırken bir hata oluştu.' });
        });
    }, []);

    const handleSaveProfile = (e) => {
        e.preventDefault();
    
        const userData = {  
            UserEmail: email,
            UserFullName: fullName,
            UserBirthDate: birthDate,
        };
    
        if (password && newPassword) {
            userData.CurrentPassword = password;
            userData.NewPassword = newPassword;
        }
    
        console.log("Gönderilen veri:", userData);
    
        axios.put('http://localhost:5023/api/UserProfile/updateProfile', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log("Güncelleme başarılı:", response.data);
            setMessage({ type: 'success', text: response.data });
            setPasswordModal(false);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                let errorText = "Bilinmeyen bir hata oluştu.";
                if (typeof error.response.data === 'string') {
                    errorText = error.response.data;
                } else if (Array.isArray(error.response.data)) {
                    errorText = error.response.data.join("\n");
                }
                setMessage({ type: 'danger', text: errorText });
            } else {
                console.error("Error updating profile", error);
                setMessage({ type: 'danger', text: "Profil güncellenirken bir hata oluştu." });
            }
        });
    };
    

    console.log("Profile data: ", profileData);

  return (
    <>
        <Navbar/>
        <div className="profile-page">
            <div className="container mt-5 d-flex flex-column gap-4">
                {message.text && (
                    <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                        {message.text}
                    </Alert>
                )}
                <h2 className='text-center'>Kullanıcı Bilgileri</h2>
                <Form className='d-flex flex-column gap-4 p-4'>
                    <Form.Group>
                        <Form.Label>E-posta</Form.Label>
                        <Form.Control
                            size='m'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ad Soyad</Form.Label>
                        <Form.Control
                            size='m'
                            type='text'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <div className='d-flex justify-content-between'>
                            <Form.Label>Parola</Form.Label>
                            <span onClick={openPasswordModal}>Şifre değiştir</span>
                        </div>
                        <Form.Control
                            size='m'
                            type='password'
                            placeholder='*************'
                            disabled
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Doğum Tarihi</Form.Label>
                        <Form.Control
                            size='m'
                            type='date'
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className='d-flex justify-content-center'>
                        <Button type='button' onClick={handleSaveProfile}>Kaydet</Button>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={passwordModal} onHide={closePasswordModal} centered className='change-password-modal'>
                <Modal.Header>
                    <Modal.Title>Şifre Değiştir</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='d-flex flex-column gap-4'>
                        <Form.Group>
                            <Form.Label>Mevcut Şifre</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type={showPassword ? 'text' : 'password'} 
                                    size='sm' 
                                    placeholder='Şu anda kullanmış olduğunuz şifrenizi buraya giriniz...'  
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} />
                                <InputGroup.Text>
                                    <i 
                                        className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
                                        onClick={togglePasswordVisibility}
                                    ></i>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Yeni Şifre</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type={showPassword ? 'text' : 'password'} 
                                    size='sm' 
                                    placeholder='Yeni şifreniz...'  
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} />
                                <InputGroup.Text>
                                    <i 
                                        className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
                                        onClick={togglePasswordVisibility}
                                    ></i>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className='d-flex justify-content-center'>
                            <Button type='submit' onClick={handleSaveProfile}>Kaydet</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    </>
  )
}

export default Profile