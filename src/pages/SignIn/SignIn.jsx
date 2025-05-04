import React, { useEffect, useState } from 'react'
import './SignIn.css'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password) {
      setErrors(['E-posta ve şifre alanları boş bırakılamaz!']);
      return;
    }

    const user = {
      userEmail: email,
      password
    }

    try {
      const response = await axios.post('http://localhost:5023/api/user/login', user, {
        headers: { 'Content-Type': 'application/json' },
      });
   
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);

      const token = response.data.token;
      console.log('Token: ', token);
   
      if (token) {
        localStorage.setItem('token', token);
      } else {
          console.error('Token undefined! API response might be incorrect.');
      }

      navigate('/home');
   
   } catch (error) {
    if (error.response) {
        console.warn("Giriş başarısız:", error.response.data.message);
        setErrors([error.response.data.message])
    } else {
        console.error("Sunucuya bağlanırken bir hata oluştu.", error);
    }
}
   
  }
  
  return (
    <>
        <div className="signin-page">
            <div className="signin-container">
                <h3>Giriş Yap</h3>
                <span>Bir hesabın yok mu? <a href="/"><b>Kayıt Ol</b></a></span>

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

                    <Form.Group className='d-flex justify-content-end'>
                      <a href="/forgotpassword">Şifremi Unuttum?</a>
                    </Form.Group>
                    
                    <Button type='submit' id='loginButton'>Giriş Yap</Button>
                    
                </Form>
            </div>
        </div>
    </>
  )
}

export default SignIn