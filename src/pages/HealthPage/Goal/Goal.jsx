import React, { useEffect, useState } from 'react'
import './Goal.css'
import axios from 'axios';
import { Alert, Button, Form, Modal, Table, Toast } from 'react-bootstrap';

function Goal() {
    const [getGoals, setGetGoals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showGoalSuccessMessage, setShowGoalSuccessMessage] = useState(false);
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [goalPriority, setGoalPriority] = useState('');
    const [goalPeriod, setGoalPeriod] = useState('');

    //get goals
    const fetchGoals = async () => {
        try {
            const response = await axios.get("http://localhost:5023/api/health/goals", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            setGetGoals(response.data);
        } catch (error) {
            console.error("Hedefler alınırken hata oluştu:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleDeleteClick = async (goalId) => {
        try {
            const response = await axios.delete(`http://localhost:5023/api/health/goal/${goalId}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            if (response.status === 200) {
                setShowSuccessMessage(true);
                fetchGoals();
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setSelectedGoalId(goalId);
                setModalMessage("Bu hedefe bağlı sağlık kayıtları var. Silmek istediğinize emin misiniz?");
                setShowModal(true);
            } else {
                alert(error.response?.data || "Hedef silinirken hata oluştu.");
            }
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5023/api/health/goal/${selectedGoalId}?confirm=true`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            setShowSuccessMessage(true);
            fetchGoals();
        } catch (error) {
            alert("Silme işlemi başarısız oldu.");
        }
        setShowModal(false);
    };
    
    //add new goal
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if(!token) {
            console.error("Token bulunamadı!");
            return;
        }
        const periodUnit = e.target.periodUnit.value;
        const totalGoalPeriod = `${periodUnit} ${goalPeriod} Kere`;

        const healthGoalData = {
            GoalTitle: goalTitle,
            GoalDescription: goalDescription,
            GoalPeriod: totalGoalPeriod,
            GoalPriority: goalPriority
        };

        console.log("Giden veri:" , healthGoalData)

        try {
            const response = await axios.post("http://localhost:5023/api/health/add-goal", healthGoalData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Veri başarıyla eklendi: ", response.data);
            if (response.data) {
                setShowGoalSuccessMessage(true);
                setGoalTitle('');
                setGoalDescription('');
                setGoalPeriod('');
                setGoalPriority('');
                fetchGoals();
            }
        } catch (error) {
            console.log("Veri eklenirken hata oluştu: ", error.response ? error.response.data : error.message);
        }
    };    

  return (
    <>
        <div className="goals">
            <h5><i className="bi bi-trophy"></i> Hedefleriniz</h5>
            <span>Kayıtlı olan hedefleriniz aşağıdaki tabloda gösterilmektedir.</span>
            {showSuccessMessage && (
                <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible style={{fontSize: '0.8rem'}}>
                    Hedef başarıyla silindi!
                </Alert>
            )}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Başlık</th>
                        <th>Açıklama</th>
                        <th>Tarih</th>
                        <th>Periyot</th>
                        <th>Sil</th>
                    </tr>
                </thead>
                <tbody>
                {getGoals.length > 0 ? (
                    getGoals.map((goal, index) => (
                        <tr key={goal.goalID}>
                            <td>{index + 1}</td>
                            <td>{goal.goalTitle}</td>
                            <td>{goal.goalDescription}</td>
                            <td>{new Date(goal.goalCreateDate).toLocaleDateString()}</td>
                            <td>{goal.goalPeriod}</td>
                            <td>
                                <Button onClick={() => handleDeleteClick(goal.goalID)}>Sil</Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">Kayıtlı hedef bulunamadı</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
        <div className="add-goal mt-5">
            <h5><i className="bi bi-database-add"></i> Hedef Ekleyin</h5>
            <span>Gerekli bilgileri doldurarak yeni bir hedef ekleyebilirsiniz!</span>
            {showGoalSuccessMessage && (
                <Alert variant="success" onClose={() => setShowGoalSuccessMessage(false)} dismissible style={{fontSize: '0.8rem'}}>
                    Hedef başarıyla kaydedildi!
                </Alert>
            )}
            <Form className='d-flex flex-column gap-4' onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Başlık</Form.Label>
                    <Form.Control 
                        name='goalTitle'
                        type='text'
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Açıklama</Form.Label>
                    <Form.Control
                        name='goalDescription'
                        as="textarea"
                        rows={4}
                        value={goalDescription}
                        onChange={(e) => setGoalDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Periyot</Form.Label>
                    <Form.Group className='goal-period'>
                        <Form.Select size='sm' name='periodUnit'>
                            <option>Günde</option>
                            <option>Ayda</option>
                            <option>Yılda</option>
                        </Form.Select>
                        <Form.Control 
                            name='goalPeriod'
                            type='number'
                            value={goalPeriod}
                            onChange={(e) => setGoalPeriod(e.target.value)}
                        />
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Önem Derecesi</Form.Label>
                    <Form.Select size='sm' name='goalPriority' value={goalPriority} onChange={(e) => setGoalPriority(e.target.value)}>
                        <option value="Yüksek">Yüksek</option>
                        <option value="Orta">Orta</option>
                        <option value="Düşük">Düşük</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className='d-flex justify-content-center'>
                    <Button type='submit' id='addGoalButton'>Kaydet</Button>
                </Form.Group>
            </Form>
            
        </div>

        {/* Confirm Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Silme İşlemi</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Hayır</Button>
                <Button variant="danger" onClick={confirmDelete}>Evet</Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default Goal