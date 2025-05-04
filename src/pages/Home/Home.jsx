import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../../layouts/Navbar/Navbar'
import { Table } from 'react-bootstrap'
import axios from 'axios';

function Home() { 
  const [userName, setUserName] = useState("Misafir");
  const [records, setRecords] = useState([]);
  const [recommendation, setRecommendation] = useState("Öneri burada görüntüleniyor.");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) {
          console.error("Token bulunamadı!");
          return;
        }

        const response = await axios.get("http://localhost:5023/api/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Gelen veri:", response.data);

        const data = response.data;
        if (data) {
          setUserName(data.fullName || "Misafir");
          
          setRecords(Array.isArray(data.last7DaysHealthRecords) ? data.last7DaysHealthRecords : []);
          
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

  return (
    <>
      <Navbar/>
      <div className="home-page">
        <div className="container mt-5 d-flex flex-column gap-4">
          <div className="user-name">
            <h2 className='fw-bold'>Hoş Geldiniz, {userName}!</h2>
          </div>
          <div className="last-seven-days">
            <h5><i className="bi bi-highlighter"></i> Son 7 gün içindeki verileriniz</h5>
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
          <div className="recommendation">
            <h5><i className="bi bi-bandaid"></i> Sağlığınızı önemsiyoruz</h5>
            <span>Sayfayı her yeniledikçe ağız ve diş sağlığınız için yaptığımız araştırmalar içerisinden seçtiğimiz öneri bulunmaktadır. Sağlıklı gülüşler dileriz...</span>
            <div className="note">
              <p className="note-content">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home