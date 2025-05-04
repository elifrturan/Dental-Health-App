import React, { useState } from 'react'
import './ResetPassword.css'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';


function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setMessage('');

        try {
            const response = await axios.post("http://localhost:5023/api/user/reset-password", {
                email,
                newPassword,
                confirmPassword
            });

            setMessage(response.data);

            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (error) {
            if(error.response && Array.isArray(error.response.data)) {
                setErrors(error.response.data);
            } else {
                setErrors(["Bir hata oluştu, lütfen tekrar deneyin."]);
                console.log("Hata Yanıtı:", error.response);
            }
        }
    }

  return (
    <>
        <div className="reset-password-page">
            <div className="reset-password-container">
                <h3>Şifrenizi Yenileyin</h3>
                <span>
                    Şifrenizi yenilemek için aşağıdaki kutulara yeni şifrenizi ve şifre tekrarınızı girin 
                    <br />
                    Şifreniz en az 8 karakter, en az bir küçük-büyük harf ve en az 1 rakam içermelidir.
                </span>

                {message && (
                    <Alert variant="success" className='mb-0' style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-check-circle-fill me-2"></i>{message}
                    </Alert>
                )}

                {errors.length > 0 && (
                    <div>
                        {errors.map((error, index) => (
                            <Alert key={index} variant="danger" className='mb-1' style={{ fontSize: '0.8rem' }}>
                                {error}
                            </Alert>
                        ))}
                    </div>
                )}

                <Form className='d-flex flex-column gap-4 mt-1' onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Yeni Şifre</Form.Label>
                        <InputGroup>
                            <Form.Control id='newPassword' type={showPassword ? 'text' : 'password'} size='sm' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                            <InputGroupText className='mb-0'>
                                <i 
                                    className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </InputGroupText>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Yeni Şifre Tekrar</Form.Label>
                        <InputGroup>
                            <Form.Control id='confirmPassword' type={showPassword ? 'text' : 'password'} size='sm' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <InputGroupText className='mb-0'>
                                <i 
                                    className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </InputGroupText>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='d-flex justify-content-center'>
                        <Button type='submit' id='resetButton'>Kaydet</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    </>
  )
}

export default ResetPassword