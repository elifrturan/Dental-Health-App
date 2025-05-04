import React, { useState } from 'react'
import './SignUp.css'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap'
import axios from 'axios';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrors(['Şifreler eşleşmiyor!']);
            return;
        }

        const user = {
            userEmail: email,
            userFullName: fullName,
            userBirthDate: birthDate,
            password,
            confirmPassword
        };

        try {
            const response = await axios.post('http://localhost:5023/api/user/register', user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setMessage('Kayıt başarılı! Hoş geldiniz!');
            setErrors([]);
        } catch (error) {
            if(error.response) {
                setErrors(error.response.data);
            } else {
                setErrors(['Bir hata oluştu. Lütfen tekrar deneyin.']);
            }
            setMessage('');
        }
    }

  return (
    <>
        <div className="signup-page">
            <div className="signup-container">
                <h3>Kayıt Ol</h3>
                <span>Bir hesabın var mı? <a href="/signin"><b>Giriş Yap</b></a></span>

                {message && <Alert variant="success" className='mb-0' style={{fontSize: '0.8rem'}}><i className="bi bi-check-circle-fill me-2"></i>{message}</Alert>}

                {errors.length > 0 && (
                    <div>
                        {errors.map((error, index) => (
                            <Alert key={index} variant="danger" className='mb-1' style={{fontSize: '0.8rem'}}>
                                {error}
                            </Alert>
                        ))}
                    </div>
                )}
                
                <Form className='d-flex flex-column gap-3 mt-3' onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>E-posta</Form.Label>
                        <Form.Control id='email' type='email' size='sm' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ad Soyad</Form.Label>
                        <Form.Control id='fullName' type='text' size='sm' value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Doğum Tarihi</Form.Label>
                        <Form.Control id='birthDate' type='date' size='sm' value={birthDate} onChange={(e) => setBirthDate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Şifre</Form.Label>
                        <InputGroup>
                            <Form.Control id='password' type={showPassword ? 'text' : 'password'} size='sm' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <InputGroup.Text>
                                <i 
                                    className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Şifre Tekrar</Form.Label>
                        <InputGroup>
                            <Form.Control id='confirmPassword' type={showPassword ? 'text' : 'password'} size='sm' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <InputGroup.Text>
                                <i 
                                    className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`} 
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Button type='submit' id='registerButton'>Kayıt Ol</Button>
                </Form>
            </div>
        </div>
    </>
  )
}

export default SignUp