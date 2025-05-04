import React, { useEffect, useState } from 'react'
import './Situation.css'
import axios from 'axios';
import { Alert, Button, Form, Modal, Table, Toast } from 'react-bootstrap'

function Situation() {
    const [records, setRecords] = useState([]);
    const [recommendation, setRecommendation] = useState("Öneri burada görüntüleniyor.");
    const [goalId, setGoalId] = useState('');
    const [recordDescription, setRecordDescription] = useState('');
    const [recordDate, setRecordDate] = useState('');
    const [recordTime, setRecordTime] = useState('');
    const [recordDuration, setRecordDuration] = useState('');
    const [isApplied, setIsApplied] = useState(false);
    const [goals, setGoals] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showRecordSuccessMessage, setShowRecordSuccessMessage] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');
    const [noteImage, setNoteImage] = useState(null); 
    const [showNoteListModal, setShowNoteListModal] = useState(false);
    const [notes, setNotes] = useState([]);
    const [showNoteDetailModal, setShowNoteDetailModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState({});

    //get last seven days records
    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('token');
            console.log("Token:", token);
            if(!token) {
              console.error("Token bulunamadı!");
              return;
            }
    
            const response = await axios.get("http://localhost:5023/api/health/last-seven-days", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            console.log("Gelen veri:", response.data);
    
            const data = response.data;
            
            if (data) {
              setRecords(Array.isArray(data.last7DaysHealthRecords) ? data.last7DaysHealthRecords : []);
            } else {
              console.error("Veri formatı hatalı.");
            }
          } catch (error) {
            console.error("Veri çekme hatası: ", error);
          }
        };
    
        fetchData();
    }, []);

    //get random recommendation
    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('token');
            console.log("Token:", token);
            if(!token) {
              console.error("Token bulunamadı!");
              return;
            }
    
            const response = await axios.get("http://localhost:5023/api/health/recommendation", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            console.log("Gelen veri:", response.data);
    
            const data = response.data;
            
            if (data) {
                setRecommendation(data.randomRecommendation || "Öneri bulunmamaktadır.");
            } else {
              console.error("Veri formatı hatalı.");
            }
          } catch (error) {
            console.error("Veri çekme hatası: ", error);
          }
        };
    
        fetchData();
    }, []);

    //get goals (for add new record)
    useEffect(() => {
        const fetchGoals = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5023/api/health/goals", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Kullanıcının hedefleri:", response.data);
                setGoals(response.data);
            } catch (error) {
                console.error("Hedefler alınırken hata oluştu: ", error);
            }
        };

        fetchGoals();
    }, []);

    //add new record
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if(!token) {
            console.error("Token bulunamadı!");
            return;
        }
        const durationUnit = e.target.durationUnit.value;
        const totalRecordDuration = `${recordDuration} ${durationUnit}`;

        const recordDateTime = `${recordDate}T${recordTime}:00.000Z`;

        const healthRecordData = {
            GoalId: goalId,
            RecordDescription: recordDescription,
            RecordDate: recordDateTime,
            RecordTime: recordDateTime,
            RecordDuration: totalRecordDuration.toString(),
            IsApplied: isApplied
        };

        console.log("Giden veri:" , healthRecordData)

        try {
            const response = await axios.post("http://localhost:5023/api/health/add", healthRecordData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Veri başarıyla eklendi: ", response.data);
            if (response.data) {
                setShowRecordSuccessMessage(true);
                setGoalId('');
                setRecordDescription('');
                setRecordDate('');
                setRecordTime('');
                setRecordDuration('');
                setIsApplied(false);
            }
        } catch (error) {
            console.log("Veri eklenirken hata oluştu: ", error.response ? error.response.data : error.message);
        }
    };    

    const handleShowNoteModal = () => setShowNoteModal(true);
    const handleCloseNoteModal = () => setShowNoteModal(false);

    const handleShowNoteListModal = () => setShowNoteListModal(true);
    const handleCloseNoteListModal = () => setShowNoteListModal(false);

    //show note detail
    const handleShowNoteDetailModal = (note) => {
        setSelectedNote(note);
        setShowNoteDetailModal(true);
        setShowNoteListModal(false);
    };    

    //add new note
    const handleNoteSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if(!token) {
            console.error('Token bulunamadı!');
            return;
        }

        const formData = new FormData();
        formData.append("NoteTitle", noteTitle);
        formData.append("NoteDescription", noteDescription);
        if (noteImage) {
            formData.append("file", noteImage);
        }    

        try {
            await axios.post('http://localhost:5023/api/notes/add', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowSuccessMessage(true);
            setNoteTitle('');
            setNoteDescription('');
            setNoteImage(null);
            handleCloseNoteModal();
        } catch(error) {
            console.error('Not ekleme hatası: ',  error.response ? error.response.data : error.message);
        }
    }
    
    //get note list
    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                console.error("Token bulunamadı!");
                return;
            }

            try {
                const response = await axios.get('http://localhost:5023/api/notes', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNotes(response.data);
            } catch (error) {
                console.error("Notlar alınırken bir hata oluştu: ", error);
            }
        }
        if (showNoteListModal) {
            fetchNotes();
        }
    }, [showNoteListModal]);
  return (
    <>
        {showSuccessMessage && (
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible style={{fontSize: '0.8rem'}}>
                Not başarıyla kaydedildi!
            </Alert>
        )}
        <div className="last-seven-days">
            <div className="d-flex justify-content-between align-items-center">
                <h5><i className="bi bi-highlighter"></i> Son 7 gün içindeki verileriniz</h5>
                <div className="d-flex justify-content-between align-items-center gap-3">
                    <Button onClick={handleShowNoteModal}><i className="bi bi-pencil-square me-2"></i>Not Ekle</Button>
                    <Button onClick={handleShowNoteListModal}><i className="bi bi-journal-bookmark-fill me-2"></i>Notlarım</Button>
                </div>
            </div>
            <span>Son 7 gün içinde girmiş olduğunuz verileriniz aşağıdaki tabloda gösterilmektedir.</span>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Açıklama</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Süre</th>
                <th>Uygulandı</th>
                </tr>
                </thead>
                <tbody>
                {records.length > 0 ? (
                    records.map((record, index) => (
                        <tr key={record.recordID}>
                            <td>{index + 1}</td>
                            <td>{record.recordDescription}</td>
                            <td>{new Date(record.recordDate).toLocaleDateString()}</td>
                            <td>{new Date(record.recordTime).getHours()}:{new Date(record.recordTime).getMinutes()}</td>
                            <td>{record.recordDuration}</td>
                            <td>{record.isApplied ? "Evet" : "Hayır"}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="6" className="text-center">Son 7 güne ait kayıt bulunamadı</td>
                    </tr>
                    )}
                </tbody>
            </Table>
        </div>
        <div className="add-record mt-5">
            <h5><i className="bi bi-database-add"></i> Veri Ekleyin</h5>
            <span>Kayıtlı hedeflerinizden birini seçerek verilerinizi kaydedebilirsiniz.</span>
            {showRecordSuccessMessage && (
                <Alert variant="success" onClose={() => setShowRecordSuccessMessage(false)} dismissible style={{fontSize: '0.8rem'}}>
                    Veri başarıyla kaydedildi!
                </Alert>
            )}
            <Form className='d-flex flex-column gap-4' onSubmit={handleSubmit}>
                <Form.Select 
                    id='goalId'
                    name='goalId'
                    size='sm' 
                    value={goalId}
                    onChange={(e) => setGoalId(e.target.value)}
                >
                    <option value="">Kayıtlı hedef seçin</option>
                    {goals.map(goal => (
                        <option key={goal.goalID} value={goal.goalID}>
                            {goal.goalTitle}
                        </option>
                    ))}
                </Form.Select>
                <Form.Group>
                    <Form.Label>Açıklama</Form.Label>
                    <Form.Control
                        id='recordDescription' 
                        name='recordDescription'
                        as="textarea" 
                        rows={4}
                        value={recordDescription}
                        onChange={(e) => setRecordDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className='date-time'>
                    <Form.Group>
                        <Form.Label>Tarih</Form.Label>
                        <Form.Control 
                            id='recordDate'
                            name='recordDate'
                            type='date'
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Saat</Form.Label>
                        <Form.Control
                            id='recordTime'
                            name='recordTime'
                            type='time'
                            value={recordTime}
                            onChange={(e) => setRecordTime(e.target.value)}
                        />
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Uygulama Süresi</Form.Label>
                    <Form.Group className='record-duration'>
                        <Form.Control 
                            id='recordDuration'
                            name='recordDuration'
                            type='number'
                            value={recordDuration}
                            onChange={(e) => setRecordDuration(e.target.value)}
                        />
                        <Form.Select size='sm' name='durationUnit'>
                            <option>Saniye</option>
                            <option>Dakika</option>
                            <option>Saat</option>
                            <option>Gün</option>
                        </Form.Select>
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Uygulandı Mı?</Form.Label>
                    <Form.Check
                        type='radio'
                        label='Evet'
                        name="isApplied"
                        onChange={() => setIsApplied(true)}
                    />
                        <Form.Check
                        type='radio'
                        label='Hayır'
                        name="isApplied"
                        onChange={() => setIsApplied(false)}
                    />
                </Form.Group>
                <Form.Group className='d-flex justify-content-center'>
                    <Button type='submit' id='addRecordButton'>Kaydet</Button>
                </Form.Group>
            </Form>
        </div>
        
        <div className="recommendation mt-5">
            <h5><i className="bi bi-bandaid"></i> Sağlığınızı önemsiyoruz</h5>
            <span>Sayfayı her yeniledikçe ağız ve diş sağlığınız için yaptığımız araştırmalar içerisinden seçtiğimiz öneri bulunmaktadır. Sağlıklı gülüşler dileriz...</span>
            <div className="note">
                <p className="note-content">{recommendation}</p>
            </div>
        </div>

        <Modal show={showNoteModal} onHide={handleCloseNoteModal} className='note-modal'>
            <Modal.Header>
                <Modal.Title>Not Ekle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='d-flex flex-column gap-4' onSubmit={handleNoteSubmit}>
                    <Form.Group>
                        <Form.Label>Not Başlığı</Form.Label>
                        <Form.Control type='text' value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Not Açıklaması</Form.Label>
                        <Form.Control as="textarea" rows={4} value={noteDescription} onChange={(e) => setNoteDescription(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Görsel</Form.Label>
                        <Form.Control type='file' accept="image/*" onChange={(e) => setNoteImage(e.target.files?.[0] || null)} />
                    </Form.Group>
                    <Form.Group className='d-flex justify-content-center'>
                        <Button type='submit'>Kaydet</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>

        <Modal show={showNoteListModal} onHide={handleCloseNoteListModal} className='note-list-modal' centered>
            <Modal.Header>
                <Modal.Title>Notlarım</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {notes.length > 0 ? (
                    <ul className='d-flex flex-column gap-3'>
                        {notes.map((note) => (
                            <li key={note.NoteId} className='border-bottom p-2' onClick={() => handleShowNoteDetailModal(note)}>
                                {note.noteTitle}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Henüz not bulunmamaktadır.</p>
                )}
            </Modal.Body>
        </Modal>

        <Modal show={showNoteDetailModal} onHide={() => setShowNoteDetailModal(false)} className='note-detail-modal' centered>
            <Modal.Header closeButton>
                <Modal.Title>{selectedNote.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Açıklama:</strong></p>
                <p>{selectedNote.noteDescription}</p>
                {selectedNote.noteImage && (
                    <img src={`http://localhost:5023${selectedNote.noteImage}`} alt="Not Görseli" className="img-fluid" />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowNoteDetailModal(false)}>
                    Kapat
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default Situation