import React, { useState } from 'react'
import './CheckEmail.css'
import { Alert, Button, Form } from 'react-bootstrap'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CheckEmail() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5023/api/user/check-email", { email });
            navigate(`/reset-password?email=${email}`);
        } catch (error) {
            if(error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Bir hata oluştu, lütfen tekrar deneyin.");
            }
        }
    }
   
  return (
    <>
        <div className="check-email-page">
            <div className="check-email-container">
                <h3>E-postanı Doğrula</h3>
                <span>
                    Şifrenizi değiştirmenize yardımcı olabilmek için ilk olarak e-posta adresinizin kayıtlı olup olmadığını kontrol etmek zorundayız. 
                    Bu sizin güvenliğinizi sağlamak için yaptığımız bir işlemdir. 
                </span>

                {errorMessage && <Alert variant="danger" className='mb-0' style={{fontSize: '0.8rem'}}><i className="bi bi-x-circle-fill me-2"></i>{errorMessage}</Alert>}

                <Form className='d-flex flex-column gap-4 mt-1' onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>E-posta</Form.Label>
                        <Form.Control
                            id='email'
                            size='sm'
                            placeholder='example@gmail.com'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='d-flex justify-content-center'>
                        <Button type='submit'>Gönder</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    </>
  )
}

export default CheckEmail